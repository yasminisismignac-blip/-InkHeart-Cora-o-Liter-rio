// Perfis de prosa: enxutos, sem adjetivos gratuitos.
export const PROFILES = {
    natural: {
        name: 'Natural / Direto',
        text: '[Estilo]\nEscreva com precisão e contenção. Priorize ação concreta, subtexto e diálogos com intenção. Evite adjetivos genéricos, metáforas batidas e descrições enfeitadas. Se não agregar à cena, corte.'
    },
    literario: {
        name: 'Literário (Contido)',
        text: '[Estilo Literário]\nProsa limpa e observadora. Use detalhes sensíveis apenas quando revelarem personagem ou clima. Nada de lirismo gratuito. O não-dito vale mais que o descrito.'
    },
    minimalista: {
        name: 'Minimalista',
        text: '[Estilo Minimalista]\nFrases curtas. Espaço no diálogo. Apenas o essencial na cena. Nada de exposição desnecessária.'
    },
    noir: {
        name: 'Noir',
        text: '[Estilo Noir]\nTom seco, cinismo contido, frases diretas. Atmosfera pelo contraste, não por adjetivos.'
    }
};

// Focos de cena: cada um é uma única diretiva comportamental.
export const FOCUS = {
    subtexto: 'O que os personagens não dizem deve ficar claro pelo que fazem.',
    corpo: 'Linguagem corporal e pequenos gestos em vez de nomear emoções.',
    dialogo: 'Diálogos curtos, com intenção. Cada fala deve revelar algo ou mudar algo.',
    ritmo: 'Varie o comprimento das frases. Acelere na tensão, desacelere no repouso.',
    ambiente: 'Um detalhe concreto do lugar, nunca uma lista de impressões.',
    iniciativa: 'O personagem age por vontade própria; não devolva a vez ao usuário passivamente.'
};

// Ganchos: apenas um por turno, comportamento-driven.
export const HOOKS = {
    segredo: 'O personagem esconde algo relevante desta cena.',
    tensao: 'Uma tensão não resolvida entre os personagens sobe um degrau.',
    objeto: 'Um objeto físico ganha importância inesperada.',
    confissao: 'Uma meia-confissão ou quase-dizer.',
    relogio: 'O tempo está acabando para algo nesta cena.'
};

// Finais: ponto aberto, nunca pergunta genérica.
export const ENDINGS = {
    gesto: 'Termine com um gesto físico carregado, sem explicar.',
    fala: 'Termine com uma fala solta que deixe algo no ar.',
    escolha: 'Ofereça ao usuário uma escolha tentadora ou perigosa.',
    pausa: 'Termine no silêncio ou na interrupção brusca.'
};

export const RHYTHM_CYCLE = ['ferve', 'ferve', 'vira', 'pico', 'respiro'];

export const RHYTHM = {
    ferve: 'Tensão baixa, construindo.',
    vira: 'A situação muda de direção.',
    pico: 'Momento de maior tensão da cena.',
    respiro: 'Atenção plena, sem ação forçada.'
};

// Clichês alvo (muito curto, só o que realmente estraga imersão).
export const SLOP = [
    ['a testament to', 'flor de IA', 'en'],
    ['um arrepio na espinha', 'clichê físico', 'pt'],
    ['não podia deixar de', 'exposição forçada', 'pt'],
    ['lágrimas rolaram', 'clichê emocional', 'pt'],
    ['coração batia forte', 'clichê físico', 'pt'],
    ['minha alma', 'dramatização barata', 'pt'],
    ['sussurrou docemente', 'adjetivo desnecessário', 'pt'],
    ['olhos brilhavam', 'clichê visual', 'pt']
];
