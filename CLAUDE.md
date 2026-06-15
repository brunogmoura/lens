# Lens — Projeto

Produto de inteligência de mercado que transforma digest individual em inteligência coletiva de equipe.

## O que é

- **PF free/curator**: digest pessoal com scoring de IA, itens salvos, histórico, painel de progresso, modo curador com banco de referências e página pública
- **PJ (B2B)**: loop de inteligência coletiva — sinal individual → overlap de equipe → painel do gestor sem identificação individual

## Diferencial central

A **conexão latente**: a IA não só agrega conteúdo, ela explicita conexões não-óbvias entre o que foi lido e o contexto de trabalho do usuário. Com o tempo, o overlap entre o que pessoas diferentes marcam como acionável vira inteligência coletiva — esse é o moat (memória de equipe acumulada que não se exporta para um concorrente).

## Estado atual

POC em `index.html` — arquivo HTML único, dark mode, vanilla JS, sem dependências externas.

### Fluxo de auth

Landing → seleção de perfil (4 opções em grid 2×2) → formulário de cadastro (adapta campos para PJ) → onboarding de fontes → app

### 4 perfis de usuário

```javascript
const profileMeta = {
  pf_basic:   { label: 'Pessoa física',    icon: 'ic-user',     isPJ: false },
  pf_curator: { label: 'PF Curador',        icon: 'ic-note',     isPJ: false },
  pj_admin:   { label: 'Empresa — Admin',   icon: 'ic-building', isPJ: true  },
  pj_member:  { label: 'Empresa — Membro',  icon: 'ic-people',   isPJ: true  },
};
```

### navConfig por perfil

```javascript
pf_basic:   [individual, history(locked), progress(locked), fontes, plans(accent)]
pf_curator: [individual, curadoria, history, progress, curator, public, fontes]
pj_admin:   [individual, team, manager(locked), history(locked), progress(locked), fontes, plans(accent)]
pj_member:  [individual, team, history, fontes]
```

### Views implementadas (12)

| View | Perfis | Descrição |
|------|--------|-----------|
| view-individual | todos | Feed principal com cards, score dual, botão salvar, sidebar de salvos |
| view-history | pf_curator, pj_admin(locked), pj_member | Histórico de edições anteriores |
| view-progress | pf_curator, pj_admin(locked) | Painel de progresso: tempo de leitura, temas, evolução |
| view-team | pj_admin, pj_member | Overlaps de sinais sinalizados por 2+ pessoas |
| view-manager | pj_admin(locked) | Métricas agregadas, sinal da semana, temas por convergência |
| view-curadoria | pf_curator | Banco de referências acumulado (Option B — moat do curador) |
| view-curator | pf_curator | Config: toggle modo curador, nota do editor por card |
| view-public | pf_curator | Prévia da página pública do curador |
| view-fontes | todos | Seleção de newsletters/sites por categoria |
| view-plans | pf_basic, pj_admin | Página de planos: toggle mensal/anual, segmentos PF/PJ, FAQ |
| view-locked | pf_basic, pj_admin | Overlay de lock conectado a view-plans |

### Modelo freemium

**PF:**
- Free (pf_basic): só Meu Digest + Fontes. Histórico e Progresso locked.
- Pro (R$29/mês): Histórico + Progresso desbloqueados
- Curador (R$59/mês): tudo do Pro + Minha Curadoria + modo curador + página pública

**PJ:**
- Free (pj_member): Meu Digest + Equipe + Histórico + Fontes
- Pro/Admin (R$49/mês por usuário): Gestor + Histórico de equipe + Progresso

### Score e persistência

```javascript
const SCORES_KEY = 'lens_scores_v1';
// Score picker: 5 pips clicáveis, salva no localStorage
// Score dual: Claude (fixo por card) + usuário (persistido)
```

### Feed como array de dados (base para API futura)

```javascript
const cards = [
  { id, source, title, summary, latent, tags, claude, signal },
  ...
];
```

### Planos — lógica de preços

```javascript
const prices = {
  pf: { pro: { m: 29, y: 23 }, curator: { m: 59, y: 47 } },
  pj: { pro: { m: 49, y: 39 } },
};
```

## Stack

HTML + CSS + JS vanilla. Tudo em `index.html`. Sem framework, sem build step, sem servidor.
Abre direto no browser. Para evoluir para stack real: Vercel + Next.js quando houver validação.

## Paleta

```
--bg:     #0c0c10
--s1:     #13131a  (surface principal)
--s2:     #1a1a24  (surface secundária)
--border: #22222e
--border2: #2c2c3a
--text:   #e4e6f0
--sub:    #9a9db5  (texto secundário)
--muted:  #565870  (texto terciário)
--purple: #6d28d9  (acento único)
--plum:   #8b5cf6  (roxo mais claro)
--plum-dim: rgba(139,92,246,0.10)
--plum-br:  rgba(139,92,246,0.22)
```

Roxo é o único acento real. Escala de cinza faz o trabalho de hierarquia. Sem âmbar, verde, azul.

## Ícones

SVG symbols inline. Sem emojis. Ícones: ic-user, ic-note, ic-building, ic-people, ic-digest, ic-team, ic-chart, ic-book, ic-settings, ic-globe, ic-source, ic-star, ic-lock, ic-check, ic-arrow-right, etc.

## Pendente / próximas evoluções

- [ ] Responsividade mobile
- [ ] Publicar em Vercel/Netlify para ter URL pública (validação com pessoas reais)
- [ ] Conectar digest real (substituir cards hardcoded por chamada de API)
- [ ] Tela de memória de equipe — evolução intelectual ao longo do tempo (moat visual)
- [ ] Deletar `/Users/brunogentil/Downloads/LinkedIn/digest-product-poc.html` (obsoleto)

## Contexto de negócio

- Criador: Bruno Gentil, Senior Business Advisor, Platform Builders
- Fase: POC para validação — mostrar para pessoas reais e observar reação
- Go-to-market pensado: PJ paga (B2B team intelligence), PF cresce organicamente (curator marketplace)
- Hipótese central ainda não validada: se alguém além do Bruno vai usar o digest consistentemente por mais de 3 semanas
- Nota do editor: só para PF Curator — em PJ seria "forçação de trabalho" que mataria engajamento orgânico
