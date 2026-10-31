# 🫀 InkHeart — o Coração Literário do SillyTavern

Parceira do **[TokenSaver](https://github.com/yasminisismignac-blip/TokenSaver---ST)**.
O TokenSaver (🧠 Cérebro) deixa o prompt leve; o InkHeart (🫀 Coração) usa uma fatia pequena desse espaço para **melhorar a escrita** — especialmente de modelos free do OpenRouter, que tendem a ser genéricos, repetitivos e sensíveis a contexto entupido.

Tudo é injetado só na **cópia do prompt que sai para a API**. Seus cards, presets, lorebooks e histórico salvos não são alterados.

## O que faz

| Módulo | Onde entra no prompt | O que faz |
|---|---|---|
| 📖 **Bíblia de Prosa** | antes do histórico (bloco estável → bom para prompt cache) | Perfil de estilo (Literário, Slow-burn, Noir, Cinematográfico, Lírico, Minimalista, Gótico, Leve) + regras de ofício: mostrar em vez de nomear emoções, detalhes concretos, nunca escrever pelo `{{user}}`, sem finais moralizantes. |
| 🚫 **Anti-clichê base** | na Bíblia | Lista curta de frases-clichê em PT-BR e EN ("a testament to", "um arrepio na espinha", "ministrations", "minx"…) + as suas próprias. |
| 📡 **Radar adaptativo** | fim do prompt | Lê as suas últimas respostas e cita **só o que o modelo realmente repetiu**: clichês, trechos de 4 palavras repetidos, mesma abertura, final em pergunta toda vez. Mais barato e mais eficaz que uma lista gigante fixa. |
| 🎬 **Diretor de cena** | fim do prompt | Sorteia 1–3 focos por turno (sensorial, subtexto, linguagem corporal, ritmo, voz nos diálogos, iniciativa, ambiente…), sem repetir os recentes. |
| 🫀 **Âncora de personagem** | fim do prompt | Reforça a essência do `{{char}}` (campo *Personality* do card + texto seu) e pede para não virar genérico/bonzinho. |
| 🪝 **Iniciativa** | na Bíblia (estável) | Personagens têm vontades próprias e agem: o modelo não fica só reagindo nem devolve o turno com "o que você faz?". |
| 🪝 **Ganchos** | fim do prompt | Sorteia 1 gancho por turno (segredo, fio solto, complicação, tentação, meia-confissão, escalada, revelação, relógio correndo), sem repetir os recentes. |
| 🎯 **Finais que pedem resposta** | fim do prompt | Varia o final a cada turno: ação no ar, fala solta, escolha tentadora, virada sensorial ou gesto carregado. |
| 📈 **Ritmo viciante** | fim do prompt | Ciclo de 5 turnos: ferve → ferve → vira → pico → respiro. A tensão sobe e estoura de verdade em vez de ficar num platô. |
| 🧵 **Fios soltos** | fim do prompt | A cada N turnos pede para retomar um detalhe antigo sem avisar; você também pode listar até 5 fios da história atual. |
| 📡 **Radar de passividade** | fim do prompt | Se as últimas respostas foram curtas ou terminaram em "o que você faz?", pede mais substância e uma jogada própria. |
| 🎛️ **Sampler** (opcional) | parâmetros da requisição | Sobe `frequency_penalty` / `presence_penalty` mínimos. Desligado por padrão. |

## Harmonia com o TokenSaver

- O InkHeart carrega **depois** (`loading_order` 200 vs 100), então roda depois da compactação e o TokenSaver não mescla nem apaga o que foi injetado.
- O painel mostra o **saldo**: tokens economizados pelo TokenSaver − tokens investidos pelo InkHeart.
- O Radar lê as últimas respostas, que o TokenSaver mantém intactas (opção "Mensagens recentes intocadas").
- Combo sugerido: TokenSaver **Equilibrado** + InkHeart **Equilibrado**.

## Instalação

> ⚠️ Os arquivos precisam estar com **estes nomes exatos** e `manifest.json` precisa estar na **raiz** do repositório.

1. Crie um repositório público no GitHub (ex.: `InkHeart-ST`).
2. Suba o **conteúdo** do ZIP (não a pasta de fora): `manifest.json`, `index.js`, `style.css`, `README.md`… e a pasta `src/` com 6 arquivos.
3. No SillyTavern: **Extensions → Install extension** → cole a URL do repositório.
4. Recarregue a página e procure **🫀 InkHeart** em *Extensions*.
5. Em *API Connections*, use **Chat Completion → OpenRouter** com um modelo `:free`.

## Configuração rápida

1. **Intensidade**: comece em *Equilibrado*.
2. **Perfil de prosa**: escolha o que combina com sua história.
3. **Idioma da resposta**: ex.: `Brazilian Portuguese`.
4. **Banidos personalizados**: cole as frases que mais te irritam (uma por linha).
5. **Âncora manual**: 1–2 frases sobre como o personagem *não* deve amolecer.
6. Opcional: **Tamanho alvo** de ~250 palavras (menos tokens de saída).
7. Clique em **👁️ Ver última injeção** para ver exatamente o que foi enviado.

## Expectativas realistas

- Instruções melhoram bastante a escrita, mas **não transformam** um modelo fraco em um mestre. Reduzem clichês, repetição e personagens genéricos; o teto continua sendo o do modelo.
- Custo da injeção: **≈ 400–550 tokens por turno** (estimativa conservadora; o painel mostra o número) (mostrado no painel). Se o modelo se confundir, use *Sutil* ou desligue o Diretor/Checklist: contexto curto é melhor para modelos free.
- Alguns modelos free ignoram `system` no fim do prompt: troque o papel para `user` em *Posição da injeção final*.
- Os penalties do sampler podem ser recusados por alguns provedores: desligue se aparecer erro.

## Desenvolvimento

```bash
npm test     # 23 testes da lógica pura (Node 18+)
```

```
index.js          eventos do SillyTavern
src/engine.js     motor puro: blocos, radar, injeção
src/library.js    perfis, focos e padrões de clichê
src/defaults.js   padrões e níveis de intensidade
src/schema.js     descrição da UI
src/ui.js         painel
src/stats.js      estatísticas
test/             testes (node:test)
```

MIT
