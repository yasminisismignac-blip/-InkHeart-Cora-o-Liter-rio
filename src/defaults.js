export const MODULE = 'inkheart';

/** Chaves controladas pelos níveis de intensidade. */
export const STRENGTH_KEYS = ['focusCount', 'coreBanCount', 'radarEnabled', 'checklist'];

export const STRENGTH = {
    sutil: { focusCount: 1, coreBanCount: 6, radarEnabled: true, checklist: false },
    equilibrado: { focusCount: 2, coreBanCount: 10, radarEnabled: true, checklist: false },
    intenso: { focusCount: 3, coreBanCount: 16, radarEnabled: true, checklist: true },
};

export const DEFAULTS = {
    enabled: true,
    onlyOpenRouter: true,
    onlyFreeModels: false,

    strength: 'equilibrado',
    ...STRENGTH.equilibrado,

    profile: 'literario',
    langs: 'both',
    outputLang: '',
    targetWords: 0,
    customStyle: '',

    proseBible: true,
    antiSlop: true,
    director: true,
    anchor: true,
    anchorAuto: true,
    anchorText: '',
    customBan: '',

    tailRole: 'system',
    tailDepth: 0,

    samplerNudge: false,
    freqPenalty: 0.2,
    presPenalty: 0.1,

    charsPerToken: 3.6,

    stats: { runs: 0, injTokens: 0, slopFlagged: 0, last: null },
};
