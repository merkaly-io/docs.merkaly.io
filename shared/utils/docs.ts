export const TERM_TYPES = ['entity', 'status', 'event', 'command', 'invoke', 'exchange', 'queue', 'service', 'provider', 'concept'] as const;

export const NODE_KINDS = ['provider', 'gate', 'exchange', 'queue', 'service'] as const;

export const STEP_KINDS = ['event', 'invoke', 'reply', 'http', 'error', 'command'] as const;

export type TermType = typeof TERM_TYPES[number];

export type NodeKind = typeof NODE_KINDS[number];

export type StepKind = typeof STEP_KINDS[number];
