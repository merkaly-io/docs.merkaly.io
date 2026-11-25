import { fileURLToPath } from 'node:url';
import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import { NODE_KINDS, STEP_KINDS, TERM_TYPES } from './shared/utils/docs';

// Docus keeps its own `docs` and `landing` collections (markdown in content/); these are the data ones
// optional fields are read with a fallback: Content does not apply zod defaults to nested data

const getDataDir = (folder: string) => fileURLToPath(new URL(`./data/${folder}`, import.meta.url)); // absolute: Content resolves ~~ without a separator

const glossarySchema = z.object({
  details: z.string().optional(), // longer explanation, plain text
  name: z.string(), // as written in code: payment.confirmed, merkaly.api-payments
  owner: z.string().optional(), // stem of the service term that owns it
  relations: z.array(z.string()).optional(), // stems of related terms
  source: z.string().optional(), // where it lives in code: repo and path
  summary: z.string(), // one or two lines
  type: z.enum(TERM_TYPES),
});

const mapSchema = z.object({
  columns: z.array(z.object({ label: z.string(), x: z.number() })).optional(),
  height: z.number(),
  nodes: z.array(z.object({
    caption: z.string().optional(),
    h: z.number(),
    id: z.string(),
    kind: z.enum(NODE_KINDS),
    label: z.string(),
    term: z.string().optional(), // glossary stem
    w: z.number(),
    x: z.number(),
    y: z.number(),
  })),
  title: z.string(),
  width: z.number(),
});

const flowStepSchema = z.object({
  description: z.string().optional(),
  from: z.string().optional(), // node id: a message travels from -> to
  kind: z.enum(STEP_KINDS),
  label: z.string().optional(), // text on the packet
  node: z.string().optional(), // node id: work inside one node
  term: z.string().optional(), // glossary stem of the message
  title: z.string(),
  to: z.string().optional(),
}).refine(step => Boolean(step.node) || Boolean(step.from && step.to), 'a step needs node, or from and to');

const flowSchema = z.object({
  map: z.string(), // stem of the map with the nodes
  order: z.number().optional(),
  steps: z.array(flowStepSchema),
  summary: z.string(),
  title: z.string(),
});

const lifecycleSchema = z.object({
  flags: z.array(z.object({ description: z.string(), id: z.string(), label: z.string() })).optional(),
  mappings: z.array(z.object({
    columns: z.tuple([z.string(), z.string()]),
    rows: z.array(z.object({ from: z.string(), note: z.string().optional(), to: z.string() })),
    title: z.string(),
  })).optional(),
  order: z.number().optional(),
  states: z.array(z.object({
    col: z.number(), // grid position, 0 based
    flags: z.array(z.string()).optional(),
    id: z.string(),
    initial: z.boolean().optional(),
    row: z.number(),
    summary: z.string(),
    term: z.string().optional(), // glossary stem
  })),
  summary: z.string(),
  term: z.string().optional(), // glossary stem of the entity
  title: z.string(),
  transitions: z.array(z.object({
    by: z.string().optional(), // glossary stem of who triggers it
    from: z.string(),
    to: z.string(),
    trigger: z.string(),
  })),
});

export default defineContentConfig({
  collections: {
    flows: defineCollection({ schema: flowSchema, source: { cwd: getDataDir('flows'), include: '*.yml' }, type: 'data' }),
    glossary: defineCollection({ schema: glossarySchema, source: { cwd: getDataDir('glossary'), include: '*.yml' }, type: 'data' }),
    lifecycles: defineCollection({ schema: lifecycleSchema, source: { cwd: getDataDir('lifecycles'), include: '*.yml' }, type: 'data' }),
    maps: defineCollection({ schema: mapSchema, source: { cwd: getDataDir('maps'), include: '*.yml' }, type: 'data' }),
  },
});
