import { estimateInjectionCost } from './engine.js';

export function recordRun(s, r) {
    const st = s.stats;
    st.runs += 1;
    st.injTokens += r.tokens;
    st.slopFlagged += r.analysis?.slop?.length ?? 0;
    st.last = { tokens: r.tokens, focus: r.focusKeys, slop: r.analysis?.slop ?? [], at: Date.now() };
}

export const resetStats = (s) => { s.stats = { runs: 0, injTokens: 0, slopFlagged: 0, last: null }; };

export const summarize = (s, info) => ({ ...s.stats, cost: estimateInjectionCost(s, info) });
