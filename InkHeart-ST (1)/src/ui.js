import { SCHEMA } from './schema.js';
import { STRENGTH_KEYS } from './defaults.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
const FIELD = Object.fromEntries(SCHEMA.flatMap((s) => s.fields).map((f) => [f.key, f]));

function fieldHtml(f) {
    const hint = f.hint ? `<small class="ih-hint">${esc(f.hint)}</small>` : '';
    const k = `data-key="${f.key}"`;
    let body;
    switch (f.type) {
        case 'bool':
            body = `<label class="checkbox_label"><input type="checkbox" ${k}><span>${esc(f.label)}</span></label>`; break;
        case 'num':
            body = `<label class="ih-row"><span>${esc(f.label)}</span><input type="number" class="text_pole ih-num" ${k} min="${f.min}" max="${f.max}" step="${f.step ?? 1}"></label>`; break;
        case 'select':
            body = `<label class="ih-row"><span>${esc(f.label)}</span><select class="text_pole ih-sel" ${k}>${f.options.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select></label>`; break;
        case 'line':
            body = `<label class="ih-col"><span>${esc(f.label)}</span><input type="text" class="text_pole" ${k} placeholder="${esc(f.placeholder ?? '')}"></label>`; break;
        default:
            body = `<label class="ih-col"><span>${esc(f.label)}</span><textarea class="text_pole" rows="${f.rows ?? 3}" ${k} placeholder="${esc(f.placeholder ?? '')}" spellcheck="false"></textarea></label>`;
    }
    return `<div class="ih-field">${body}${hint}</div>`;
}

const template = () => `
<div class="inline-drawer">
    <div class="inline-drawer-toggle inline-drawer-header">
        <b>🫀 InkHeart — Coração Literário</b>
        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
    </div>
    <div class="inline-drawer-content">
        <div class="ih-stats" data-role="stats"></div>
        <div class="ih-row ih-presetbar">
            <span>Intensidade</span>
            <select class="text_pole" data-role="strength">
                <option value="sutil">🌿 Sutil</option>
                <option value="equilibrado">⚖️ Equilibrado</option>
                <option value="intenso">🔥 Intenso</option>
                <option value="custom">🛠️ Personalizado</option>
            </select>
        </div>
        ${SCHEMA.map((sec) => `<details class="ih-section"><summary>${esc(sec.title)}</summary>${sec.fields.map(fieldHtml).join('')}</details>`).join('')}
        <div class="ih-buttons">
            <div class="menu_button" data-role="preview">👁️ Ver última injeção</div>
            <div class="menu_button" data-role="reset">♻️ Zerar estatísticas</div>
        </div>
    </div>
</div>`;

export function mountUI(api) {
    const host = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (!host) return null;
    const root = document.createElement('div');
    root.className = 'ih-root';
    root.innerHTML = template();
    host.appendChild(root);

    const strengthSel = root.querySelector('[data-role="strength"]');

    function sync() {
        const s = api.getSettings();
        root.querySelectorAll('[data-key]').forEach((el) => {
            const v = s[el.dataset.key];
            if (el.type === 'checkbox') el.checked = !!v; else el.value = v ?? '';
        });
        strengthSel.value = s.strength;
    }

    function refresh() {
        const sum = api.summarize();
        const ts = api.tokenSaver();
        const el = root.querySelector('[data-role="stats"]');
        const lines = [];
        lines.push(`<div><b>Custo da injeção:</b> ≈ ${fmt(sum.cost)} tokens por turno</div>`);
        if (sum.runs) {
            lines.push(`<div><b>Acumulado:</b> ${fmt(sum.runs)} gerações · ≈ ${fmt(sum.injTokens)} tokens investidos em qualidade · ${fmt(sum.slopFlagged)} clichês caçados</div>`);
            const l = sum.last;
            if (l) lines.push(`<div class="ih-last"><b>Última:</b> foco [${esc(l.focus.join(', ') || '—')}]${l.hooks?.length ? ` · gancho [${esc(l.hooks.join(', '))}]` : ''}${l.beat ? ` · ritmo: ${esc(l.beat)}` : ''}${l.slop.length ? ` · radar pegou: ${esc(l.slop.join(', '))}` : ''}</div>`);
        } else lines.push('<div><i>Nenhuma geração ainda. Mande uma mensagem pelo OpenRouter!</i></div>');
        lines.push(ts
            ? `<div class="ih-combo">🧠 TokenSaver detectado: economizou ≈ ${fmt(ts.saved)} tokens · 🫀 InkHeart investiu ≈ ${fmt(sum.injTokens)} · <b>saldo ≈ ${fmt(ts.saved - sum.injTokens)}</b></div>`
            : '<div class="ih-combo">🧠 TokenSaver não detectado. Funciona sozinho, mas rende mais com os dois.</div>');
        el.innerHTML = lines.join('');
    }

    const onEdit = (e) => {
        const el = e.target.closest('[data-key]');
        if (!el) return;
        const key = el.dataset.key, f = FIELD[key], s = api.getSettings();
        if (f.type === 'bool') s[key] = el.checked;
        else if (f.type === 'num') {
            let v = Number(el.value);
            if (!Number.isFinite(v)) return;
            s[key] = Math.min(f.max, Math.max(f.min, v));
        } else s[key] = el.value;
        if (STRENGTH_KEYS.includes(key) && s.strength !== 'custom') { s.strength = 'custom'; strengthSel.value = 'custom'; }
        api.save(); refresh();
    };
    root.addEventListener('input', onEdit);
    root.addEventListener('change', onEdit);

    strengthSel.addEventListener('change', () => {
        if (strengthSel.value !== 'custom') api.applyStrength(strengthSel.value); else api.getSettings().strength = 'custom';
        sync(); api.save(); refresh();
    });
    root.querySelector('[data-role="reset"]').addEventListener('click', () => { api.resetStats(); api.save(); refresh(); });
    root.querySelector('[data-role="preview"]').addEventListener('click', () => api.showPreview());

    sync(); refresh();
    return { refresh, sync };
}
