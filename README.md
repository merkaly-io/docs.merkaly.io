# docs.merkaly.io

Merkaly's documentation site: glossary, flows, lifecycles, architecture and decisions, explained visually and
structured like a dictionary. Public, no login, Spanish only for now (an i18n selector comes later).

Built with [Docus](https://docus.dev) (Nuxt 4 + Nuxt Content v3 + Nuxt UI). Business and technical knowledge both
live here; the code repos link to it.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:6505 (PORT overrides it)
pnpm lint       # eslint + nuxt typecheck
pnpm build      # production server in .output, prerenders every crawlable page
pnpm start      # serves .output (PORT, default 3000)
```

Node 24 (`engines`), pnpm from `packageManager`. Content uses the native `node:sqlite` connector, so there is no
native module to build.

## Layout

```
content/                 # markdown pages (Docus "docs" collection): home, one folder per domain, reference indexes
  <n>.<domain>/index.md  # the entry page of a domain layer, its decisions in <domain>/decisiones/
  8.tecnico/<repo>/       # technical docs of each repo (architecture, conventions, setup, runbooks, contracts), English
data/
  entities/<domain>.yml  # entity map of a domain: entities on a grid and their relations
  glossary/<stem>.yml    # one file per term
  maps/<stem>.yml        # node layouts shared by flows (messaging.yml: providers, gate, exchanges, queues, services)
  flows/<stem>.yml       # one file per flow, steps over a map
  lifecycles/<stem>.yml  # one file per state machine
content.config.ts        # zod schemas of the data collections
app/
  components/entity/     # EntityMap (interactive entity map with animated relations)
  components/flow/       # FlowPlayer (animated SVG player), FlowLegend
  components/state/      # StateMachine (interactive state machine)
  components/glossary/   # GlossaryTermList (search and filter), GlossaryTermBadge
  components/content/    # MDC components usable from markdown, plus the ProsePre override for mermaid
  components/app|docs/   # Docus overrides: header links (AppHeaderCTA), grouped sidebar (DocsAsideLeftBody, AppHeaderBody)
  composables/useSidebarGroups.ts  # sidebar groups (Empezar, Dominios, Referencia) from `group` in the navigation
  pages/glosario|flujos|ciclos/[stem].vue  # one generated page per data file
  utils/                 # labels (all UI copy), paths, flow and state geometry, backlinks
  app.config.ts          # logo, header links and sidebar groups (`merkaly` key)
  app.css                # theme tokens: brand palette, Manrope headings and --mk-* diagram colors (light and dark)
server/plugins/llms.ts   # adds the data collections to /llms.txt and /llms-full.txt
```

The file name (stem) is the id and the URL: `data/glossary/payment-confirmed.yml` is `/glosario/payment-confirmed`,
and other files reference it as `payment-confirmed`. Nested fields are optional in the schemas (Content does not
apply zod defaults to nested data), components read them with a fallback.

## Domains

Every term, flow and lifecycle has a `domain` (zod enum `DOMAINS` in `shared/utils/docs.ts`): `identidad`, `tienda`,
`catalogo`, `pedidos`, `pagos`, `proveedores`, `plataforma`. Each domain is a layer with the same shape, an entry page
in `content/<n>.<domain>/index.md`:

1. Qué es: what it is, in one screen.
2. Entidades: `::content-entity-map{domain="pagos"}` over `data/entities/<domain>.yml`.
3. Ciclos de vida and Flujos: `::content-lifecycle-list{domain="pagos"}`, `::content-flow-list{domain="pagos"}`.
4. Decisiones: links to `content/<n>.<domain>/<n>.decisiones/*.md` (also listed in `content/94.decisiones.md`).
5. En el código: a table of repo paths linked on GitHub.
6. Glosario: `::content-glossary{domain="pagos"}`.

Labels and icons of the domains live in `app/utils/docs.labels.ts`. Moved pages keep a 301 in `routeRules`.

## Add an entity map

`data/entities/<domain>.yml`:

```yaml
entities:
  - id: payment
    label: Pago
    caption: finance.payments    # where it lives, optional
    col: 1                       # grid position, 0 based
    row: 1
    term: payment-charge         # optional glossary stem
    summary: One or two lines.
    fields:                      # optional, shown when the entity is selected
      - { name: gateway, note: el cobro vigente }
  - { id: sale, label: Venta, caption: pedidos, outside: true, col: 0, row: 1, summary: From another domain, drawn dashed. }
relations:
  - { from: sale, to: payment, label: se paga con }     # read from -> to
  - { from: payment, to: refund, label: devuelve, many: true }  # one to many
```

## Add a term

`data/glossary/<stem>.yml`:

```yaml
name: payment.confirmed          # as written in code
type: event                      # entity, status, event, command, invoke, exchange, queue, service, provider, concept
domain: pagos                    # one of DOMAINS
summary: One or two lines.
owner: payments                  # optional, stem of the owning service
relations: [merkaly-api-payments] # optional, stems; the term page also shows the reverse links
details: Optional longer text.
source: repo path/to/file.ts     # optional
```

"Aparece en" (flows and lifecycles that use the term) is computed, never written by hand.

## Add a flow

`data/flows/<stem>.yml`, over the nodes of a map:

```yaml
title: Pago confirmado (Asaas)
domain: pagos
summary: One or two lines.
order: 1
map: messaging
steps:
  - from: asaas                  # a message travels between two nodes
    to: webhooks
    kind: http                   # event, invoke, reply, http, error, command (sets the color)
    label: POST /asaas           # text on the moving packet
    title: Asaas avisa por HTTP  # step list and panel
    description: What happens and why.
    term: payment-confirmed      # optional, glossary stem of the message
  - node: webhooks               # work inside one node: the node pulses with a bubble
    kind: event
    label: quita datos personales
    title: webhooks prepara el mensaje
```

A new node goes in the map (`data/maps/<stem>.yml`) with its position (`x`, `y`, `w`, `h` in a `width` x
`height` viewBox), `kind` (actor, app, provider, gate, exchange, queue, service) and its glossary `term`. Embed a flow in any
markdown page with `::content-flow{flow="pago-confirmado-asaas"}` (`autoplay` optional).

## Add a state machine

`data/lifecycles/<stem>.yml`:

```yaml
title: Estado del cobro
domain: pagos
summary: One or two lines.
term: payment-charge             # glossary stem of the entity
flags:                           # optional groups of states, shown on the state and explained below
  - { id: paid, label: pagado, description: APPROVED o SETTLED. }
states:
  - { id: PENDING, col: 0, row: 1, initial: true, flags: [paid], term: charge-status-pending, summary: Sin pagar. }
transitions:
  - { from: PENDING, to: SETTLED, by: asaas, trigger: 'RECEIVED: el Pix entra pagado' }
mappings:                        # optional translation tables (provider status to ours)
  - title: Estado de Asaas a estado del cobro
    columns: [Asaas, Merkaly]
    rows:
      - { from: RECEIVED, to: SETTLED, note: optional }
```

`col` and `row` place the state on a grid. Quote any flow style value that has a comma or a colon.
Embed it in markdown with `::content-state-machine{lifecycle="charge-status"}`.

## Markdown pages

Docus pages in `content/` (numeric prefixes order the sidebar). Mermaid works in fenced blocks (` ```mermaid `),
rendered on the client and redrawn on theme change. Lists of the data collections: `::content-glossary`,
`::content-flow-list`, `::content-lifecycle-list`.

## Conventions

Same frontend rules as the Nuxt repos: `props.*` in templates, no HTML comments, PascalCase components, runtime
`defineProps`/`defineEmits`, rendered data through `defineModel`, VueUse over hand rolled helpers, no `aria-*`,
colors only through theme variables (`--ui-*` from Nuxt UI, `--mk-*` in `app/app.css`), short end of line
comments. UI copy lives in `app/utils/docs.labels.ts` so the future i18n selector can replace it.

## AI export

`/llms.txt` (index) and `/llms-full.txt` (everything, including every term, flow step and transition) are generated
by `nuxt-llms` (bundled with Docus) plus `server/plugins/llms.ts`.

## Production

Releases are by tag only (`v*`), with no version commit: `.github/workflows/release.yml` deploys to Railway through
`merkaly-io/actions/deploy`. Railway service:

- Build: `pnpm build`. Start: `pnpm start` (`node .output/server/index.mjs`, listens on `PORT`).
- Variables: `PORT` (set by Railway), `NUXT_SITE_URL` (optional, defaults to `https://docs.merkaly.io`).
- GitHub: repo variable `RAILWAY_SERVICE_ID` with the docs service id; secret `RAILWAY_FRONTEND_TOKEN` as in the
  other frontends.
