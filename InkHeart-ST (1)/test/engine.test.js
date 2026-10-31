import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, STRENGTH } from '../src/defaults.js';
import {
    applyInkHeart, buildMatchers, buildStaticBlock, estimateInjectionCost, findRepeatedNgrams, injectBlocks, scanSlop,
} from '../src/engine.js';
import { SLOP } from '../src/library.js';

const S = (over = {}) => ({ ...DEFAULTS, ...over });
const rng = () => 0.3;
const hist = (...assist) => {
    const out = [{ role: 'system', content: 'Você é um narrador.' }];
    assist.forEach((a, i) => { out.push({ role: 'user', content: `u${i}` }, { role: 'assistant', content: a }); });
    out.push({ role: 'user', content: 'agora' });
    return out;
};

test('todas as regexes da biblioteca compilam', () => {
    for (const [p] of SLOP) assert.doesNotThrow(() => new RegExp(p, 'i'));
});

test('scanSlop pega clichês em EN e PT', () => {
    const m = buildMatchers('both', '');
    assert.ok(scanSlop('A shiver ran down her spine, a testament to fear.', m).length >= 2);
    assert.ok(scanSlop('Um arrepio percorreu sua espinha e o coração disparou.', m).length >= 2);
    assert.equal(scanSlop('A chuva batia na janela da cozinha.', m).length, 0);
});

test('filtro de idioma funciona', () => {
    assert.equal(scanSlop('Um arrepio na espinha', buildMatchers('en', '')).length, 0);
    assert.equal(scanSlop('shivers down her spine', buildMatchers('pt', '')).length, 0);
});

test('banidos personalizados entram no radar e na lista base', () => {
    const s = S({ customBan: 'lábios entreabertos' });
    assert.ok(scanSlop('Ela de lábios entreabertos.', buildMatchers('both', s.customBan)).includes('lábios entreabertos'));
    assert.ok(buildStaticBlock(s).includes('lábios entreabertos'));
});

test('findRepeatedNgrams acha repetição entre respostas', () => {
    const r = findRepeatedNgrams(['Ela olhou pela janela distante e suspirou.', 'Depois olhou pela janela distante de novo.'], 4, 3);
    assert.ok(r.some((g) => g.includes('pela janela distante')));
});

test('injeta bloco estável antes do histórico e bloco final no fim', () => {
    const chat = hist('a', 'b');
    const { messages } = applyInkHeart(chat, S(), { charName: 'Ana', userName: 'Eu' }, { rng });
    const iStatic = messages.findIndex((m) => String(m.content).startsWith('[Prose Direction]'));
    const iTail = messages.findIndex((m) => String(m.content).startsWith('[Turn Focus]'));
    assert.equal(iStatic, 1);
    assert.equal(iTail, messages.length - 1);
    assert.equal(messages.at(-2).content, 'agora');
});

test('é idempotente: rodar duas vezes não duplica', () => {
    const once = applyInkHeart(hist('a', 'b'), S(), {}, { rng }).messages;
    const twice = applyInkHeart(once, S(), {}, { rng }).messages;
    assert.equal(twice.length, once.length);
});

test('respeita prefill de assistant no fim', () => {
    const chat = [...hist('a'), { role: 'assistant', content: 'Prefill:' }];
    const { messages } = applyInkHeart(chat, S(), {}, { rng });
    assert.equal(messages.at(-1).content, 'Prefill:');
    assert.ok(String(messages.at(-2).content).startsWith('[Turn Focus]'));
});

test('radar cita só o que o modelo repetiu', () => {
    const chat = hist('Um arrepio percorreu sua espinha.', 'O coração disparou.');
    const { tailText, analysis } = applyInkHeart(chat, S(), {}, { rng });
    assert.ok(analysis.slop.length >= 2);
    assert.ok(tailText.includes('Fresh-prose alert'));
    const clean = applyInkHeart(hist('Chovia.', 'Ele abriu a porta.'), S(), {}, { rng }).tailText;
    assert.ok(!clean.includes('Fresh-prose alert'));
});

test('radar detecta abertura repetida e finais em pergunta', () => {
    const chat = hist('Ela sorriu e disse algo. O que você quer?', 'Ela sorriu de novo. E agora?');
    const { analysis } = applyInkHeart(chat, S(), {}, { rng });
    assert.equal(analysis.opening?.toLowerCase(), 'ela sorriu');
    assert.equal(analysis.noQuestion, true);
});

test('macros {{char}}/{{user}} são substituídas', () => {
    const { staticText, tailText } = applyInkHeart(hist('a'), S({ anchorText: '{{char}} desconfia de {{user}}.' }), { charName: 'Ana', userName: 'Leo' }, { rng });
    assert.ok(!/\{\{/.test(staticText + tailText));
    assert.ok(tailText.includes('Ana desconfia de Leo'));
});

test('Diretor respeita focusCount e não repete foco recente', () => {
    const r = applyInkHeart(hist('a'), S({ ...STRENGTH.intenso }), {}, { rng, recent: ['sensory', 'body'] });
    assert.equal(r.focusKeys.length, 3);
    assert.ok(!r.focusKeys.includes('sensory') && !r.focusKeys.includes('body'));
});

test('orçamento: equilibrado fica abaixo de ~580 tokens por turno (pior caso)', () => {
    const cost = estimateInjectionCost(S({ anchorText: 'Orgulhosa, irônica, desconfia de gentilezas fáceis.' }), { anchorAuto: 'x '.repeat(100) });
    assert.ok(cost < 580, `custo ${cost}`);
});

test('módulos desligados não injetam nada', () => {
    const s = S({ proseBible: false, antiSlop: false, director: false, radarEnabled: false, anchor: false, checklist: false, initiative: false, hooks: false, hookEnding: false, rhythm: false, callbackEvery: 0 });
    const chat = hist('a');
    const { messages } = applyInkHeart(chat, { ...s, outputLang: '' }, {}, { rng });
    assert.ok(messages.length <= chat.length + 1);
    assert.ok(!messages.some((m) => String(m.content).startsWith('[Turn Focus]')));
});

test('tailRole user e tailDepth 1', () => {
    const out = injectBlocks(hist('a'), '', 'TAIL', S({ tailRole: 'user', tailDepth: 1 }));
    const i = out.findIndex((m) => m.content === 'TAIL');
    assert.equal(out[i].role, 'user');
    assert.equal(out[i + 1].content, 'agora');
});

// ───────── Ganchos & iniciativa ─────────
test('iniciativa entra na parte estável', () => {
    assert.ok(buildStaticBlock(S()).includes('Initiative:'));
    assert.ok(!buildStaticBlock(S({ initiative: false })).includes('Initiative:'));
});

test('plano traz gancho, final e ritmo; sem repetir recentes', () => {
    const r = applyInkHeart(hist('a'), S(), {}, { rng, recentHooks: ['secret', 'thread'], recentEnds: ['action'] });
    assert.equal(r.plan.hookKeys.length, 1);
    assert.ok(!['secret', 'thread'].includes(r.plan.hookKeys[0]));
    assert.notEqual(r.plan.endingKey, 'action');
    assert.ok(r.tailText.includes('Hook:') && r.tailText.includes('Ending:') && r.tailText.includes('Rhythm:'));
});

test('hookCount 2 planta dois ganchos distintos', () => {
    const r = applyInkHeart(hist('a'), S({ hookCount: 2 }), {}, { rng });
    assert.equal(new Set(r.plan.hookKeys).size, 2);
});

test('ritmo cicla em 5 turnos', () => {
    const beats = [0, 1, 2, 3, 4, 5].map((turn) => applyInkHeart(hist('a'), S(), { turn }, { rng }).plan.beat);
    assert.deepEqual(beats.slice(0, 5), ['simmer', 'simmer', 'turn', 'peak', 'breather']);
    assert.equal(beats[5], beats[0]);
});

test('retomada de fio a cada N turnos', () => {
    const at = (turn) => applyInkHeart(hist('a'), S({ callbackEvery: 4 }), { turn }, { rng }).tailText.includes('Callback:');
    assert.equal(at(8), true);
    assert.equal(at(9), false);
    assert.equal(applyInkHeart(hist('a'), S({ callbackEvery: 0 }), { turn: 8 }, { rng }).tailText.includes('Callback:'), false);
});

test('fios soltos manuais entram (máx. 5)', () => {
    const threads = ['a carta', 'o incêndio', 'o favor', 'a chave', 'o retrato', 'LINHA6'].join('\n');
    const { tailText } = applyInkHeart(hist('a'), S({ threads }), {}, { rng });
    assert.ok(tailText.includes('Open threads') && tailText.includes('o retrato') && !tailText.includes('LINHA6'));
});

test('radar detecta turno devolvido passivamente e respostas finas', () => {
    const chat = hist('Ele acena. O que você vai fazer?', 'Ela espera. O que você vai fazer?');
    const { analysis, tailText } = applyInkHeart(chat, S(), {}, { rng });
    assert.equal(analysis.passive, true);
    assert.equal(analysis.thin, true);
    assert.ok(tailText.includes('handed the turn back passively') && tailText.includes('thin'));
    const long = 'palavra '.repeat(80);
    assert.equal(applyInkHeart(hist(long, long), S(), {}, { rng }).analysis.thin, false);
});

test('ganchos desligados não aparecem', () => {
    const { tailText } = applyInkHeart(hist('a'), S({ hooks: false, hookEnding: false, rhythm: false, callbackEvery: 0 }), { turn: 8 }, { rng });
    assert.ok(!/Hook:|Ending:|Rhythm:|Callback:/.test(tailText));
});
