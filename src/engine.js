// Motor PURO do InkHeart (sem DOM / SillyTavern): monta blocos, detecta clichês e injeta no prompt.

import { FOCUS, PROFILES, SLOP } from './library.js';

export const textOf = (content) => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.map((p) => (p && typeof p.text === 'string' ? p.text : '')).join('\n');
    return '';
};

export const estimateTokens = (text, cpt = 3.6) => Math.ceil(String(text || '').length / (cpt || 3.6));

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ───────── Anti-clichê ─────────
const matcherCache = new Map();
export function buildMatchers(langs = 'both', customPhrases = '') {
    const key = `${langs}|${customPhrases}`;
    if (matcherCache.has(key)) return matcherCache.get(key);
    const out = [];
    for (const [pat, label, lang] of SLOP) {
        if (lang === 'any' || langs === 'both' || lang === langs) out.push({ re: new RegExp(pat, 'i'), label });
    }
    for (const raw of String(customPhrases || '').split('\n')) {
        const p = raw.trim();
        if (p) out.push({ re: new RegExp(escRe(p), 'i'), label: p, custom: true });
    }
    matcherCache.set(key, out);
    return out;
}

export function scanSlop(text, matchers) {
    const hits = [];
    for (const m of matchers) if (m.re.test(text)) hits.push(m.label);
    return hits;
}

const words = (t) => t.toLowerCase().match(/[\p{L}\p{N}']+/gu) || [];

/** Sequências de n palavras que se repetem em 2+ mensagens. */
export function findRepeatedNgrams(texts, n = 4, max = 3) {
    const counts = new Map();
    for (const t of texts) {
        const w = words(t);
        const seen = new Set();
        for (let i = 0; i + n <= w.length; i++) {
            const g = w.slice(i, i + n);
            if (!g.some((x) => x.length >= 4)) continue;
            const s = g.join(' ');
            if (!seen.has(s)) { seen.add(s); counts.set(s, (counts.get(s) || 0) + 1); }
        }
    }
    const rep = [...counts].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).map(([g]) => g);
    const chosen = [];
    for (const g of rep) {
        const head = g.split(' ').slice(0, 3).join(' ');
        const tail = g.split(' ').slice(-3).join(' ');
        if (chosen.some((c) => c.includes(head) || c.includes(tail) || g.includes(c.split(' ').slice(0, 3).join(' ')))) continue;
        chosen.push(g);
        if (chosen.length >= max) break;
    }
    return chosen;
}

const opening = (t) => t.replace(/^[\s*_"'“”«»—–-]+/, '').split(/\s+/).slice(0, 2).join(' ');
const endsWithQuestion = (t) => /\?[\s*_"'”»)]*$/.test(t.trim());

export function analyzeHistory(assistantTexts, matchers) {
    const last = assistantTexts.slice(-3);
    const out = { slop: [], repeated: [], opening: null, noQuestion: false };
    if (!last.length) return out;
    const hit = new Set();
    for (const t of last) scanSlop(t, matchers).forEach((l) => hit.add(l));
    out.slop = [...hit].slice(0, 8);
    if (last.length >= 2) {
        out.repeated = findRepeatedNgrams(last, 4, 3);
        const [a, b] = [opening(last.at(-2)), opening(last.at(-1))];
        if (a && a.toLowerCase() === b.toLowerCase()) out.opening = b;
        if (endsWithQuestion(last.at(-2)) && endsWithQuestion(last.at(-1))) out.noQuestion = true;
    }
    return out;
}

// ───────── Diretor ─────────
export function pickFocus(rng, count, recent = []) {
    const keys = Object.keys(FOCUS);
    let pool = keys.filter((k) => !recent.includes(k));
    if (pool.length < count) pool = keys;
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, count);
}

// ───────── Blocos ─────────
export const STATIC_HEADER = '[Prose Direction]';
export const TAIL_HEADER = '[Turn Focus]';

export function buildStaticBlock(s) {
    const lines = [STATIC_HEADER];
    if (s.proseBible) {
        lines.push((PROFILES[s.profile] ?? PROFILES.literario).text);
        lines.push(
            'Craft rules:',
            '- Show emotion through specific behavior, perception and subtext; do not name emotions outright.',
            '- Prefer concrete, specific details over generic adjectives. One fresh image beats three stock ones.',
            "- Never write {{user}}'s dialogue, actions, thoughts or feelings. End on an open beat that invites {{user}} to respond.",
            '- No summaries, morals or reflective wrap-up lines at the end. Stay in character and in scene; no meta commentary.',
        );
    }
    if (s.antiSlop && s.coreBanCount > 0) {
        const custom = buildMatchers(s.langs, s.customBan).filter((x) => x.custom).map((x) => x.label);
        const pool = (lang) => SLOP.filter(([, label, l]) => l === lang && !/AI names/.test(label)).map(([, label]) => label);
        let base;
        if (s.langs === 'both') {
            const en = pool('en'), pt = pool('pt');
            base = [];
            for (let i = 0; i < Math.max(en.length, pt.length); i++) { if (pt[i]) base.push(pt[i]); if (en[i]) base.push(en[i]); }
        } else base = pool(s.langs);
        const labels = [...custom, ...base.slice(0, s.coreBanCount)];
        if (labels.length) lines.push(`Avoid stock phrasing and its variants, e.g.: ${labels.map((l) => `"${l}"`).join(', ')}. Find fresh, specific wording instead.`);
    }
    const lang = String(s.outputLang || '').trim();
    lines.push(lang ? `Write in ${lang}.` : 'Write in the same language as the ongoing conversation.');
    if (s.targetWords > 0) lines.push(`Aim for roughly ${s.targetWords} words per reply.`);
    if (String(s.customStyle || '').trim()) lines.push(String(s.customStyle).trim());
    return lines.length > 2 || s.proseBible ? lines.join('\n') : '';
}

export function buildTailBlock(s, info, analysis, focusKeys) {
    const lines = [TAIL_HEADER];
    if (s.director && focusKeys.length) {
        lines.push('For this reply:');
        focusKeys.forEach((k) => lines.push(`- ${FOCUS[k]}`));
    }
    if (s.radarEnabled && analysis) {
        if (analysis.slop.length) lines.push(`Fresh-prose alert: your recent replies used ${analysis.slop.map((x) => `"${x}"`).join(', ')}. Do not use these again; say it a new way.`);
        if (analysis.repeated.length) lines.push(`You keep repeating: ${analysis.repeated.map((x) => `"${x}"`).join(', ')}. Avoid these exact phrasings.`);
        if (analysis.opening) lines.push(`Do not begin this reply with "${analysis.opening}…"; open differently.`);
        if (analysis.noQuestion) lines.push('Do not end this reply with a question.');
    }
    if (s.checklist) lines.push('Before writing, silently check: Is each detail specific? Is any emotion stated instead of shown? Does the ending leave {{user}} room to act?');
    if (s.anchor) {
        const parts = [];
        const clean = (x) => String(x).trim().replace(/[.\s]+$/, '');
        if (s.anchorAuto && info?.anchorAuto) parts.push(clean(info.anchorAuto));
        if (String(s.anchorText || '').trim()) parts.push(clean(s.anchorText));
        lines.push(`[Character Anchor]\nStay true to {{char}}${parts.length ? `: ${parts.filter(Boolean).join('. ')}` : ''}. Keep their flaws, edges and emotional depth; do not turn generic, agreeable or overly nice unless that is who they are.`);
    }
    return lines.length > 1 ? lines.join('\n') : '';
}

// ───────── Injeção ─────────
const isInk = (m) => typeof m.content === 'string' && (m.content.startsWith(STATIC_HEADER) || m.content.startsWith(TAIL_HEADER));
const isHistoryStart = (m) =>
    m.role !== 'system' || (m.name && m.name.startsWith('example_')) ||
    (typeof m.content === 'string' && /^\[(start a new chat|example chat)\]$/i.test(m.content.trim()));

export function injectBlocks(chat, staticText, tailText, o) {
    const out = chat.filter((m) => !isInk(m)).map((m) => ({ ...m }));
    if (staticText) {
        let idx = out.findIndex(isHistoryStart);
        if (idx < 0) idx = Math.max(0, out.length - 1);
        out.splice(idx, 0, { role: 'system', content: staticText });
    }
    if (tailText) {
        const depth = Math.max(0, o.tailDepth | 0);
        let idx = out.length - depth;
        if (depth === 0 && out.length && out.at(-1).role === 'assistant') idx = out.length - 1; // respeita prefill
        out.splice(Math.max(0, idx), 0, { role: o.tailRole === 'user' ? 'user' : 'system', content: tailText });
    }
    return out;
}

const defaultSubst = (text, info) =>
    text.replace(/\{\{char\}\}/gi, info?.charName || 'the character').replace(/\{\{user\}\}/gi, info?.userName || 'the user');

export function applyInkHeart(chat, s, info = {}, deps = {}) {
    const rng = deps.rng ?? Math.random;
    const recent = deps.recent ?? [];
    const subst = info.subst ?? ((t) => defaultSubst(t, info));

    const assistants = chat.filter((m) => m.role === 'assistant' && !m.tool_calls && !isInk(m)).map((m) => textOf(m.content)).filter(Boolean);
    const matchers = buildMatchers(s.langs, s.customBan);
    const analysis = s.antiSlop || s.radarEnabled ? analyzeHistory(assistants, matchers) : null;
    const focusKeys = s.director ? pickFocus(rng, s.focusCount, recent) : [];

    const staticText = subst(buildStaticBlock(s));
    const tailText = subst(buildTailBlock(s, info, analysis, focusKeys));

    return {
        messages: injectBlocks(chat, staticText, tailText, s),
        staticText,
        tailText,
        focusKeys,
        analysis,
        tokens: estimateTokens(staticText + tailText, s.charsPerToken),
    };
}

/** Custo estimado (tokens/turno) sem radar — para mostrar na interface. */
export function estimateInjectionCost(s, info = {}) {
    const focus = s.director ? Object.keys(FOCUS).slice(0, s.focusCount) : [];
    const st = buildStaticBlock(s);
    const tl = buildTailBlock(s, info, null, focus);
    return estimateTokens(st + tl, s.charsPerToken);
}
