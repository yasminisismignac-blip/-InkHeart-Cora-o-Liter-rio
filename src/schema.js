import { PROFILES } from './library.js';

const profileOptions = Object.entries(PROFILES).map(([value, p]) => ({ value, label: p.label }));

export const SCHEMA = [
    {
        title: '⚙️ Geral',
        fields: [
            { key: 'enabled', type: 'bool', label: 'Ativar InkHeart' },
            { key: 'onlyOpenRouter', type: 'bool', label: 'Só agir quando a fonte for OpenRouter' },
            {
                key: 'onlyFreeModels', type: 'bool', label: 'Só agir em modelos :free',
                hint: 'Quando ligado, modelos pagos ficam sem injeção (e sem custo extra de tokens).',
            },
        ],
    },
    {
        title: '🎨 Estilo',
        fields: [
            { key: 'profile', type: 'select', label: 'Perfil de prosa', options: profileOptions },
            {
                key: 'langs', type: 'select', label: 'Clichês a combater em', options: [
                    { value: 'both', label: 'Português + Inglês' },
                    { value: 'pt', label: 'Só Português' },
                    { value: 'en', label: 'Só Inglês' },
                ],
            },
            {
                key: 'outputLang', type: 'line', label: 'Idioma da resposta', placeholder: 'ex.: Brazilian Portuguese (vazio = mesmo da conversa)',
                hint: 'As instruções vão em inglês (modelos free obedecem melhor), mas a resposta sai neste idioma.',
            },
            {
                key: 'targetWords', type: 'num', label: 'Tamanho alvo da resposta, em palavras (0 = off)', min: 0, max: 1500, step: 10,
                hint: 'Respostas mais curtas = menos tokens de saída (a parte mais cara).',
            },
            { key: 'customStyle', type: 'text', rows: 3, label: 'Notas de estilo extras (opcional)', placeholder: 'ex.: Narração em 3ª pessoa, passado. Humor seco.' },
        ],
    },
    {
        title: '🧩 Módulos',
        fields: [
            { key: 'proseBible', type: 'bool', label: 'Bíblia de Prosa (estilo + regras de ofício)', hint: 'Bloco estável: vai antes do histórico e é amigável ao prompt cache.' },
            { key: 'antiSlop', type: 'bool', label: 'Lista anti-clichê base' },
            { key: 'radarEnabled', type: 'bool', label: 'Radar de clichês e repetição (adaptativo)', hint: 'Lê suas últimas respostas e só cita o que o modelo realmente repetiu: barato e preciso.' },
            { key: 'director', type: 'bool', label: 'Diretor de cena (foco sorteado a cada turno)' },
            { key: 'anchor', type: 'bool', label: 'Âncora de personagem (no fim do contexto)' },
        ],
    },
    {
        title: '🧭 Intensidade (ajuste fino)',
        fields: [
            { key: 'focusCount', type: 'num', label: 'Focos do Diretor por turno', min: 1, max: 5, step: 1 },
            { key: 'coreBanCount', type: 'num', label: 'Itens da lista anti-clichê base', min: 0, max: 30, step: 1 },
            { key: 'checklist', type: 'bool', label: 'Checklist silencioso de qualidade antes de responder' },
        ],
    },
    {
        title: '🫀 Âncora de personagem',
        fields: [
            { key: 'anchorAuto', type: 'bool', label: 'Puxar o campo "Personality" do card automaticamente' },
            {
                key: 'anchorText', type: 'text', rows: 4, label: 'Âncora manual (opcional)',
                placeholder: 'ex.: Orgulhosa, desconfia de gentilezas fáceis, esconde afeto atrás de ironia. Nunca pede desculpas à toa.',
                hint: 'Aceita {{char}} e {{user}}.',
            },
        ],
    },
    {
        title: '🚫 Banidos personalizados',
        fields: [
            { key: 'customBan', type: 'text', rows: 4, label: 'Suas frases proibidas (uma por linha)', placeholder: 'sorriso malicioso\nlábios entreabertos' },
        ],
    },
    {
        title: '📍 Posição da injeção final',
        fields: [
            {
                key: 'tailRole', type: 'select', label: 'Papel da mensagem', options: [
                    { value: 'system', label: 'system (padrão)' },
                    { value: 'user', label: 'user (se o modelo ignorar system no fim)' },
                ],
            },
            { key: 'tailDepth', type: 'num', label: 'Profundidade (0 = fim do prompt)', min: 0, max: 10, step: 1 },
        ],
    },
    {
        title: '🎛️ Ajuste de sampler (opcional)',
        fields: [
            {
                key: 'samplerNudge', type: 'bool', label: 'Aplicar penalidades anti-repetição',
                hint: 'Só sobe os valores (nunca reduz os seus). Nem todo modelo free aceita; se der erro, desligue.',
            },
            { key: 'freqPenalty', type: 'num', label: 'Frequency penalty mínima', min: 0, max: 1, step: 0.05 },
            { key: 'presPenalty', type: 'num', label: 'Presence penalty mínima', min: 0, max: 1, step: 0.05 },
        ],
    },
    {
        title: '💰 Estimativas',
        fields: [{ key: 'charsPerToken', type: 'num', label: 'Caracteres por token (estimativa)', min: 1.5, max: 6, step: 0.1 }],
    },
];
