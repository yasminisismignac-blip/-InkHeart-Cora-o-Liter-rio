export const MODULE = 'inkheart';

/** Chaves controladas pelos níveis de intensidade. */
export const STRENGTH_KEYS = ['focusCount', 'coreBanCount', 'radarEnabled', 'checklist', 'hookCount'];

export const STRENGTH = {
    sutil: { focusCount: 1, coreBanCount: 4, radarEnabled: true, checklist: false, hookCount: 1 },
    equilibrado: { focusCount: 1, coreBanCount: 6, radarEnabled: true, checklist: false, hookCount: 1 },
    intenso: { focusCount: 2, coreBanCount: 10, radarEnabled: true, checklist: false, hookCount: 1 },
};

export const DEFAULTS = {
    enabled: true,
    onlyOpenRouter: true,
    onlyFreeModels: false,

    strength: 'sutil',
    ...STRENGTH.sutil,

    profile: 'natural',          // padrão mudou: natural, contido e direto
    langs: 'both',
    outputLang: '',
    targetWords: 0,              // desligado por padrão (não enche linguiça)
    customStyle: '',

    proseBible: true,
    antiSlop: true,
    director: true,
    anchor: true,
    anchorAuto: true,
    anchorText: '',
    customBan: '',

    initiative: true,
    hooks: true,
    hookEnding: true,
    rhythm: false,               // desligado por padrão para não forçar batidas
    callbackEvery: 0,            // desligado por padrão
    threads: '',

    tailRole: 'system',
    tailDepth: 0,

    samplerNudge: false,         // desligado por padrão (sem penalidades forçadas)
    freqPenalty: 0,
    presPenalty: 0,

    charsPerToken: 3.6,

    stats: { runs: 0, injTokens: 0, slopFlagged: 0, last: null },
};
