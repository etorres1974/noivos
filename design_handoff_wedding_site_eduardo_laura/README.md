# Handoff: Site de Casamento — Eduardo & Laura

## Overview

Site institucional de casamento para Eduardo & Laura (15 de agosto de 2026,
Campo Grande/MS). Single-page com cinco blocos verticais em sequência: capa,
contagem regressiva, detalhes do evento, confirmação de presença (RSVP) e
presentes via Pix.

Objetivo do site:
1. **Informar** os convidados (data, horário, local, dress code).
2. **Coletar confirmações** de presença com nome, sim/não, número de
   acompanhantes e contato.
3. **Receber presentes** via chave Pix com QR code.

---

## About the Design Files

O arquivo HTML neste bundle é uma **referência de design** — um wireframe
navegável que demonstra **estrutura, hierarquia e fluxo** do site. **Não é
código de produção para copiar e colar.**

A tarefa do desenvolvedor é **recriar este design no ambiente do codebase
alvo** (Next.js, Astro, React + Vite, ou o que já estiver em uso), seguindo
os padrões, bibliotecas de UI e convenções já estabelecidas. Se ainda não
existe codebase, recomendamos **Next.js (App Router) + Tailwind** como
escolha equilibrada entre simplicidade, SSR (bom para SEO de página única
compartilhada via WhatsApp) e velocidade de implementação para um site de
escopo pequeno.

O wireframe usa caixas cinzas, placeholders listrados e barras de texto
genéricas. O desenvolvedor deve substituir esses elementos pelo visual
final definido na seção **Visual Direction** abaixo.

---

## Fidelity

**Low-fidelity (wireframe).**

O design entregue é um wireframe focado em validar **estrutura e fluxo**.
Cores, tipografia exata, espaçamentos finais e tratamento visual de imagens
**não estão definidos no wireframe** — o desenvolvedor deve aplicá-los com
base na direção visual abaixo, idealmente após uma rodada de hi-fi com o
designer ou usando o sistema de design do projeto.

### Visual Direction (acordada com o cliente)

- **Estilo**: clássico e elegante
- **Paleta**: verde + branco + madeira (tons neutros, marfim/dourado opcional como acento)
- **Tipografia**: serifada para títulos (sugestões: Cormorant Garamond, Playfair Display, EB Garamond), sans-serif neutra para corpo (sugestões: Inter, Söhne, Lato)
- **Tom da copy**: descontraído e divertido (textos abaixo refletem isso)

---

## Screens / Views

Página única com 5 blocos verticais + nav fixa no topo + footer.

### Componente persistente: Nav fixa

- **Posição**: `position: sticky; top: 0;` no topo do viewport. Altura ~64px.
- **Conteúdo**:
  - Logo "E & L" (serif, à esquerda)
  - 4 âncoras à direita: **Início**, **Evento**, **Confirmar**, **Presentear**
- **Comportamento**:
  - Cada âncora faz scroll suave (`scroll-behavior: smooth`) para a seção correspondente
  - Item ativo destacado conforme `IntersectionObserver` na seção visível
  - Fundo translúcido com leve `backdrop-filter: blur(8px)` para legibilidade ao rolar sobre imagens
- **Mobile**: collapse em menu hambúrguer abaixo de 768px; ao abrir, links empilhados verticalmente em overlay full-screen.

---

### Bloco 1 — Hero (`#inicio`)

- **Purpose**: dar boas-vindas, mostrar nomes, data e oferecer dois caminhos imediatos.
- **Layout**: full-viewport (`min-height: 100vh`), conteúdo centralizado vertical e horizontalmente.
- **Componentes**:
  - **Imagem/ilustração de capa** acima do título. Pode ser foto do casal ou ilustração botânica (folhas verdes) — placeholder no wireframe.
  - **Título**: "Eduardo & Laura" — fonte serif, peso 400, ~88px no desktop / ~56px no mobile. O "&" pode ser itálico em peso 300 para variação tipográfica.
  - **Subtítulo**: "15 de agosto de 2026 · 16h" — sans-serif, ~18px, cor neutra média.
  - **Local resumido**: "Campo Grande · MS" — sans-serif, ~14px, letter-spacing aumentado.
  - **2 CTAs lado a lado**:
    - Primário: "Confirmar presença" → âncora `#rsvp`
    - Secundário (outline): "Ver detalhes" → âncora `#evento`
- **Conteúdo final (copy)**:
  - Título: `Eduardo & Laura`
  - Linha 1: `15 de agosto de 2026 · 16h`
  - Linha 2: `Campo Grande, MS`
  - CTA 1: `Confirmar presença`
  - CTA 2: `Ver detalhes`

---

### Bloco 2 — Countdown (`#contagem`)

- **Purpose**: criar antecipação e dar ritmo entre hero e detalhes.
- **Layout**: seção horizontal com 4 caixas iguais lado a lado, padding generoso (~80px vertical).
- **Componentes**:
  - **Eyebrow**: "Faltam..." ou "Pra cerimônia" — sans-serif pequeno acima das caixas.
  - **4 caixas idênticas**: cada uma com um número grande (fonte tabular/mono ou serif tabular) e label embaixo:
    - Caixa 1: número de **dias** restantes
    - Caixa 2: **horas**
    - Caixa 3: **minutos**
    - Caixa 4: **segundos**
- **Comportamento**:
  - Atualiza a cada 1 segundo via `setInterval` calculando diff entre `Date.now()` e `new Date('2026-08-15T16:00:00-04:00')` (fuso de Campo Grande = UTC−4).
  - Quando a data passar, mostrar mensagem alternativa (ex.: "Hoje é o dia!" ou "Já aconteceu — obrigado por celebrar conosco").
- **Mobile**: 4 caixas em grid 2×2 ou stack vertical.

---

### Bloco 3 — Detalhes do evento (`#evento`)

- **Purpose**: dar todas as informações práticas do dia.
- **Layout**: grid 2 colunas (texto à esquerda, mapa à direita) no desktop; stack vertical no mobile.
- **Componentes**:
  - **Título da seção**: "O grande dia" ou "O evento" — serif grande.
  - **Lista de info** (coluna esquerda), cada item com label pequeno em caps + valor:
    - **Data**: "Sábado, 15 de agosto de 2026"
    - **Horário**: "Cerimônia às 16h · Recepção logo após"
    - **Endereço**: "R. Fox, S/N — Vila Base Aérea, Campo Grande/MS — CEP 79090-350"
    - **Dress code**: (placeholder — confirmar com o casal; sugerido: "Esporte fino. Evitar branco 🤍")
  - **Mapa embed** (coluna direita): iframe do Google Maps centrado no endereço, altura ~360px, bordas arredondadas suaves.
  - **Botão abaixo do mapa**: "Abrir no Google Maps" → link externo para `https://maps.google.com/?q=...`
- **Comportamento**:
  - Embed do mapa deve usar `loading="lazy"` para não atrasar o carregamento.
  - Botão abre em nova aba (`target="_blank" rel="noopener"`).

---

### Bloco 4 — RSVP (`#rsvp`)

- **Purpose**: coletar confirmações de presença.
- **Layout**: seção com fundo levemente diferente (offwhite ou verde-pálido) para destacar do resto. Container central com largura máxima ~560px.
- **Componentes**:
  - **Título**: "Bora confirmar?" ou "Você vem com a gente?" — serif grande.
  - **Subtítulo curto**: "Por favor, confirme até 30 de junho de 2026 pra gente acertar tudo direitinho 💚"
  - **Formulário** com os seguintes campos:
    1. **Nome completo** — input text, obrigatório
    2. **Você vai comparecer?** — radio button ou par de botões grandes:
       - "Sim, vou estar lá!"
       - "Infelizmente não vou poder"
    3. **Acompanhantes** — number input (0 a 4) ou select, obrigatório
       - Hint: "Quantas pessoas vêm com você?"
       - Mostrar apenas se "Sim" foi selecionado
    4. **Contato** — input text com dois sub-campos ou um campo único:
       - Email (formato validado)
       - Telefone (máscara `(99) 99999-9999`)
       - Hint: "Email ou WhatsApp, pra gente avisar qualquer coisa"
    5. **Botão submit**: "Enviar confirmação"
- **Comportamento**:
  - Validação client-side: nome obrigatório, escolha sim/não obrigatória, contato obrigatório (pelo menos um — email OU telefone).
  - Ao enviar: enviar para um endpoint (Formspree, Google Forms, Supabase, ou backend próprio — **a definir com o cliente; o site é wireframe e ainda não tem backend**).
  - Estado de sucesso: substituir formulário por mensagem "Recebido! Obrigado por confirmar 💚" com opção de "enviar outra confirmação" (para famílias enviando múltiplas pessoas separadamente).
  - Estado de erro: banner vermelho acima do form com mensagem específica.
  - Loading: botão desabilitado com spinner durante submit.

---

### Bloco 5 — Presentes / Pix (`#presentes`)

- **Purpose**: receber presentes em dinheiro via Pix.
- **Layout**: grid 2 colunas — QR code à esquerda, instruções/chave à direita. Centralizado, largura máxima ~720px.
- **Componentes**:
  - **Título**: "Se quiser nos presentear" — serif grande.
  - **Texto introdutório curto** (1-2 linhas, tom afetuoso):
    > "Se você quer fazer parte do nosso começo de vida juntos com um Pix, vai ser muito bem-vindo. Sua presença já é o maior presente, viu?"
  - **QR code do Pix** (imagem PNG, ~240×240px) — gerar com chave real do casal (a fornecer).
  - **Chave Pix** em texto monoespaçado dentro de um campo com botão "Copiar":
    - Placeholder: `eduardo.laura@pix.com` (chave real a ser fornecida pelo casal)
  - **Botão**: "Copiar chave Pix" — copia para clipboard e mostra confirmação "Copiado!" por 2s.
- **Comportamento**:
  - Botão "Copiar" usa `navigator.clipboard.writeText(chave)`.
  - Feedback visual após copiar (mudança de label do botão por 2s, ou toast).

---

### Footer

- **Layout**: linha horizontal centralizada, altura ~80px, fundo neutro (off-white ou madeira muito clara).
- **Conteúdo**:
  - Logo "E & L" pequeno
  - Frase italicizada: "Feito com amor, em Campo Grande"
  - Data formatada: `15 · 08 · 2026`

---

## Interactions & Behavior

### Scroll behavior
- `scroll-behavior: smooth` no `html` para ancoragem suave.
- Nav fixa destaca o item ativo via `IntersectionObserver` observando cada `<section>`.

### Animações sugeridas (não obrigatórias)
- **Fade-in nas seções** ao entrar no viewport (`IntersectionObserver` + classe `.in-view`). Duração ~600ms, easing `ease-out`.
- **Contagem regressiva** com transição sutil quando os números mudam (opcional — pode ser sem animação).
- **Nenhuma animação no hero ao carregar** — entrada limpa e direta.

### Estados do formulário RSVP
- **Idle**: form visível e habilitado.
- **Loading**: botão desabilitado, label muda para "Enviando..." com spinner.
- **Success**: form substituído por card de sucesso.
- **Error**: banner vermelho acima do form com `role="alert"` para acessibilidade.

### Responsividade
- **Desktop** (≥1024px): layouts em grid como descrito.
- **Tablet** (768px–1023px): grids viram 1 coluna em alguns blocos (detalhes e presentes); hero mantém centralização.
- **Mobile** (<768px): tudo em stack vertical. Nav vira hambúrguer. Tamanhos de fonte reduzidos proporcionalmente.

---

## State Management

Estado mínimo necessário:

- `countdown` — objeto `{ days, hours, minutes, seconds }`, atualizado a cada segundo via interval.
- `rsvp.formData` — objeto com `{ name, attending, plusOnes, email, phone }`.
- `rsvp.status` — enum: `'idle' | 'loading' | 'success' | 'error'`.
- `rsvp.errorMessage` — string, apenas em estado de erro.
- `nav.activeSection` — string com o ID da seção atualmente visível (para destacar item da nav).
- `pix.copied` — boolean temporário (2s) para feedback do botão de copiar.

Para um site dessa escala, não há necessidade de estado global complexo —
`useState` (React) ou stores leves (Pinia/Zustand) são suficientes. Não há
roteamento — tudo é uma página única.

---

## Backend / Data

**A definir com o cliente.** Opções, da mais simples à mais customizável:

1. **Formspree** — apontar `action` do form pra um endpoint do Formspree. Confirmações chegam por email.
2. **Google Forms (embed nativo)** — substituir form custom por iframe do Google Forms. Menos visual, mais simples.
3. **Supabase** — tabela `rsvps` com colunas (`name`, `attending`, `plus_ones`, `contact`, `created_at`). Auth não necessária se a tabela for write-only via RLS policy.
4. **Backend próprio** — endpoint REST em Node/Python que grava em DB e envia notificação ao casal.

O wireframe não tem integração — o desenvolvedor deve combinar com o cliente
qual opção usar antes de implementar.

---

## Design Tokens

Como o wireframe é lofi, **os valores abaixo são sugestões** a serem
confirmadas em hi-fi ou ajustadas conforme o sistema do projeto.

### Cores (sugeridas, paleta verde + branco + madeira)
```
--paper:       #fafaf7   /* off-white, fundo principal */
--paper-warm:  #f4efe6   /* madeira muito clara, seções alternadas */
--ink:         #1f2a22   /* verde-escuro quase preto, texto principal */
--ink-2:       #4a554c   /* verde-acinzentado, texto secundário */
--ink-3:       #8b8f88   /* cinza-esverdeado, labels e hints */
--accent:      #4a6b4f   /* verde-sálvia médio, links e CTAs */
--accent-dark: #2f4a35   /* verde mais escuro para hover */
--wood:        #b89968   /* madeira clara, acentos sutis */
--line:        #d8d6d0   /* divisores */
--error:       #a64545   /* vermelho contido para erros */
```

### Tipografia
```
font-family-serif:  'Cormorant Garamond', 'EB Garamond', Georgia, serif
font-family-sans:   'Inter', system-ui, -apple-system, sans-serif

Escala (mobile / desktop):
  display:  56px / 88px   — nome do casal no hero
  h1:       40px / 56px   — títulos de seção
  h2:       28px / 36px   — subtítulos
  body:     16px / 18px   — corpo
  small:    13px / 14px   — labels, footer
  micro:    11px / 12px   — letter-spacing 0.1em, caps, eyebrows

Pesos: serif 400 e 500; sans 400, 500 e 600.
Line-height: 1 nos displays, 1.2 em h1/h2, 1.6 em corpo.
```

### Espaçamento (escala 4px)
```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128
```

### Border radius
```
--radius-sm: 2px   /* inputs, botões, cards pequenos */
--radius-md: 4px   /* containers maiores */
--radius-lg: 8px   /* imagens, mapa */
```

### Sombras
Sutis. Site clássico não pede sombras pesadas.
```
--shadow-sm: 0 1px 2px rgba(31, 42, 34, 0.06)
--shadow-md: 0 4px 12px rgba(31, 42, 34, 0.08)
```

### Container widths
```
--container-sm:  560px  /* RSVP, blocos centrados estreitos */
--container-md:  720px  /* presentes, conteúdo médio */
--container-lg:  1080px /* hero, detalhes com mapa */
```

---

## Assets

A serem fornecidos pelo casal:

- **Foto/ilustração de capa do hero** — orientação preferencialmente vertical ou quadrada, mínimo 1200px no menor lado.
- **QR code do Pix** — gerar a partir da chave real (o app do banco do casal gera isso).
- **Chave Pix em texto** — string a ser copiada.
- **Confirmação do dress code** — texto exato (placeholder: "Esporte fino").
- **Data limite para RSVP** — placeholder usado: "30 de junho de 2026".
- *(opcional)* Pequeno conjunto de ilustrações botânicas/folhagens em SVG para acentos visuais — pode ser obtido em bancos como [SVGRepo](https://www.svgrepo.com) ou ilustração custom.

Nada disso está no wireframe — todos são placeholders listrados.

---

## Files

- `Wireframes Eduardo e Laura.html` — wireframe original com **todas as 3 direções** (capa + direção A + B + C). A **Direção A é o slide 02** (`data-screen-label="02 Direção A — Single Page"`). É o único slide relevante para esta implementação.
- `deck_stage.js` — runtime do deck (apenas para visualização do wireframe; **não é necessário no site final**).

O desenvolvedor deve abrir o HTML, navegar até o slide 02 e usar a estrutura
do mini-mockup como referência de layout e ordem dos blocos.

---

## Acessibilidade (mínimos)

- Todos os inputs com `<label>` associado.
- Botões com texto descritivo (não apenas ícones).
- Contraste WCAG AA em todos os textos.
- `aria-current="page"` no link ativo da nav.
- Form de RSVP com `role="alert"` no banner de erro.
- Mapa embed com `title="Mapa do local da cerimônia"`.
- Skip link "Pular para o conteúdo" no topo (opcional mas recomendado).

---

## Resumo executivo para o dev

> Single-page com 5 blocos verticais (hero, countdown, detalhes, RSVP, Pix) +
> nav sticky no topo. Tom descontraído, visual clássico (serif + verde +
> madeira), fidelidade do wireframe é lofi — aplique seu próprio polish
> visual. Backend do RSVP a combinar (Formspree / Supabase / Google Forms).
> Sem roteamento, sem auth, sem CMS. Deve carregar rápido e funcionar
> impecavelmente no mobile — a maioria dos convidados vai abrir pelo WhatsApp.
