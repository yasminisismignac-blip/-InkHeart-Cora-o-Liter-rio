// Biblioteca de conteúdo: perfis de estilo, focos do "Diretor" e padrões de clichê.
// As instruções vão em INGLÊS de propósito: modelos (principalmente os free) obedecem melhor.
// O idioma da resposta é controlado separadamente (campo "Idioma da resposta").

export const PROFILES = {
    literario: {
        label: '📖 Literário (padrão)',
        text: 'Style: polished literary fiction. Specific nouns and active verbs over adjectives; earned, restrained imagery; vary sentence length and rhythm.',
    },
    slowburn: {
        label: '🕯️ Slow-burn (tensão lenta)',
        text: 'Style: slow-burn drama/romance. Tension lives in restraint: lingering glances, interrupted gestures, charged silences. Let moments breathe; never resolve tension quickly.',
    },
    noir: {
        label: '🌫️ Noir',
        text: 'Style: noir. Terse, wry, world-weary narration; hard light and long shadows; understatement, rare dry similes, a bruised heart under the cynicism.',
    },
    cinematic: {
        label: '🎬 Cinematográfico',
        text: 'Style: cinematic. Think in shots: set the frame, move the camera, cut on a telling detail. Visual action, minimal interior monologue.',
    },
    lirico: {
        label: '🌙 Lírico',
        text: "Style: lyrical. Musical, image-rich prose with deliberate cadence; metaphors drawn from the setting's own textures; never ornate for its own sake.",
    },
    minimalista: {
        label: '🪨 Minimalista',
        text: "Style: minimalist. Short, plain sentences; concrete objects and actions; emotion implied by what is left unsaid. Cut every word that doesn't earn its place.",
    },
    gotico: {
        label: '🦇 Gótico',
        text: 'Style: gothic. Atmosphere first: decay, weather, architecture that feels alive; dread built by slow accumulation of unsettling detail.',
    },
    leve: {
        label: '☀️ Leve e espirituoso',
        text: 'Style: light and witty. Quick banter, playful timing, warm humor grounded in character; keep stakes human and the tone buoyant.',
    },
};

// Pool do Diretor (sorteado a cada turno; "agency" fica fixo na Bíblia de Prosa).
export const FOCUS = {
    sensory: 'Add two concrete, unexpected sensory details (sound, smell, texture, temperature; not just sight).',
    subtext: 'Let characters say less than they mean; show motive through what they avoid or notice.',
    body: 'Show emotion through specific physical behavior, not by naming it.',
    pacing: 'Slow down: linger on one beat instead of rushing to the next event.',
    dialogue: 'Give each speaker a distinct voice; allow interruptions and trailing off.',
    metaphor: 'Use at most one fresh, specific image from this setting; no stock similes.',
    environment: 'Let the setting react to the emotional tone (light, weather, objects).',
    variety: 'Vary sentence length; do not open consecutive sentences with the same word.',
};

// ───────── Ganchos, finais e ritmo ─────────
export const HOOKS = {
    secret: 'Plant a secret: let a character withhold or slip something that hints at more beneath the surface, unexplained.',
    thread: 'Leave a thread open: an unresolved question, promise, object or name that can matter later.',
    complication: 'Add a small, concrete complication or interruption that forces a choice.',
    temptation: "Have {{char}} offer {{user}} a tempting proposal or dare where yes and no both cost something. Don't decide {{user}}'s answer.",
    confession: 'Bring a charged truth to the edge of being said: a half-confession, a slip, a too-direct question.',
    escalation: 'Raise the stakes one notch through something {{char}} does.',
    reveal: 'Reveal one small, surprising fact that recontextualizes something earlier.',
    clock: 'Add a gentle ticking clock: a deadline, someone returning, fading light.',
};

export const ENDINGS = {
    action: 'End mid-motion, on something that demands an immediate response.',
    line: 'End on a loaded line or unfinished sentence that begs a reply.',
    choice: 'End with a concrete, tempting choice within reach of {{user}}.',
    shift: 'End on a sudden shift (a sound, light, a door) that changes the mood.',
    gesture: 'End on a quiet, charged gesture whose meaning stays open.',
};

export const RHYTHM = {
    simmer: 'Rhythm: simmer. Build tension slowly through detail and restraint.',
    turn: 'Rhythm: turn. Shift the dynamic with new information or an unexpected reaction.',
    peak: 'Rhythm: peak. A charged, high-intensity moment; commit fully.',
    breather: 'Rhythm: breather. Soften with warmth, humor or vulnerability.',
};

// Ciclo de 5 turnos: tensão sobe, vira, estoura e respira.
export const RHYTHM_CYCLE = ['simmer', 'simmer', 'turn', 'peak', 'breather'];

// [regex, rótulo (a frase como o modelo a escreve), idioma: 'en' | 'pt' | 'any']
export const SLOP = [
    // ── EN ──
    ['\\bshivers?\\b.{0,25}\\bspine\\b', 'shivers down the spine', 'en'],
    ['\\ba testament to\\b', 'a testament to', 'en'],
    ['\\bpangs? of\\b', 'a pang of (emotion)', 'en'],
    ['\\bministrations?\\b', 'ministrations', 'en'],
    ['\\bminx\\b', 'minx', 'en'],
    ['\\borbs\\b', 'orbs (for eyes)', 'en'],
    ['barely (?:above )?a whisper', 'barely above a whisper', 'en'],
    ["breath (?:\\w+ ){1,2}(?:didn'?t|hadn'?t|did not|had not) (?:know|realize)", "a breath you didn't know you were holding", 'en'],
    ['\\bozone\\b', 'ozone', 'en'],
    ['\\btapestry\\b', 'tapestry', 'en'],
    ['symphony of', 'a symphony of', 'en'],
    ['\\bdance of\\b', 'a dance of', 'en'],
    ['eyes? (?:glinting|glittering|sparkling|twinkling|dancing) with', 'eyes glinting with mischief', 'en'],
    ["couldn'?t help but", "couldn't help but", 'en'],
    ['heart (?:hammered|pounded|skipped a beat|raced|fluttered)', 'heart hammered / skipped a beat', 'en'],
    ['air (?:was|grew|became|felt) (?:thick|heavy|charged|electric)', 'the air was thick/charged', 'en'],
    ['time (?:seemed to|itself) (?:slow|stop|stand)', 'time seemed to slow/stop', 'en'],
    ['maybe, just maybe', 'maybe, just maybe', 'en'],
    ['\\bsmirk(?:s|ed|ing)?\\b', 'smirk', 'en'],
    ['a mix(?:ture)? of \\w+ and \\w+', 'a mix of X and Y', 'en'],
    ['world (?:around|outside) (?:them|her|him) (?:faded|melted|fell away|disappeared)', 'the world faded away', 'en'],
    ['unreadable expression', 'unreadable expression', 'en'],
    ['something (?:dark|unreadable|primal|unspoken) (?:in|flickered|passed)', 'something dark/unreadable flickered', 'en'],
    ['(?:bit|bites|biting) (?:her|his|their) lip', 'bit her/his lip', 'en'],
    ['knuckles (?:white|whitened)', 'knuckles white', 'en'],
    ['(?:let|released) out a (?:breath|sigh)', 'let out a breath', 'en'],
    // ── PT-BR ──
    ['\\bum misto de\\b', 'um misto de', 'pt'],
    ['\\buma mistura de .{0,20} e\\b', 'uma mistura de X e Y', 'pt'],
    ['\\barrepio\\b.{0,30}\\bespinha\\b', 'um arrepio na espinha', 'pt'],
    ['cora[cç][aã]o (?:disparou|acelerou|palpitou|martelou|falhou uma batida|bateu mais forte)', 'o coração disparou', 'pt'],
    ['respira[cç][aã]o que (?:n[aã]o sabia|nem sabia)', 'a respiração que não sabia estar prendendo', 'pt'],
    ['\\bolhos? (?:brilh|faisc|cintil)\\w*', 'olhos brilhando/faiscando', 'pt'],
    ['sorriso (?:brincou|dan[cç]ou|se formou|malicioso|enigm[aá]tico)', 'um sorriso brincou nos lábios', 'pt'],
    ['\\bo ar (?:ficou|estava|se tornou) (?:pesado|denso|carregado|el[eé]trico)', 'o ar ficou pesado/denso', 'pt'],
    ['o tempo (?:pareceu|parecia) (?:parar|congelar|desacelerar)', 'o tempo pareceu parar', 'pt'],
    ['o mundo (?:ao redor|ao seu redor|l[aá] fora) (?:desapareceu|sumiu|desvaneceu)', 'o mundo ao redor desapareceu', 'pt'],
    ['\\bum (?:verdadeiro )?testemunho de\\b', 'um testemunho de', 'pt'],
    ['\\bsinfonia de\\b', 'uma sinfonia de', 'pt'],
    ['\\bdan[cç]a de\\b', 'uma dança de', 'pt'],
    ['\\btape[cç]aria\\b', 'tapeçaria', 'pt'],
    ['(?:em um|quase um) sussurro', 'em um sussurro', 'pt'],
    ['n[aã]o conseguiu (?:deixar de|evitar)', 'não conseguiu deixar de', 'pt'],
    ['talvez, apenas talvez', 'talvez, apenas talvez', 'pt'],
    ['express[aã]o ileg[ií]vel', 'expressão ilegível', 'pt'],
    ['mordeu (?:o|seu|a) l[aá]bio', 'mordeu o lábio', 'pt'],
    ['n[oó]s dos dedos (?:brancos|esbranqui[cç]ados)', 'nós dos dedos brancos', 'pt'],
    ['soltou um suspiro', 'soltou um suspiro', 'pt'],
    ['algo (?:escuro|indecifr[aá]vel|primal|n[aã]o dito) (?:em|cintilou|passou)', 'algo escuro/indecifrável passou', 'pt'],
    ['\\bsorrisinho\\b', 'sorrisinho', 'pt'],
    ['\\bministra[cç][oõ]es\\b', 'ministrações', 'pt'],
    // ── Nomes genéricos de IA ──
    ['\\b(?:elara|kael|lyra|seraphina|thorne)\\b', 'overused AI names (Elara, Kael, Lyra…)', 'any'],
];
