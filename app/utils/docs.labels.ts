import type { NodeKind, StepKind, TermType } from '#shared/utils/docs';

// Spanish UI copy in one place: the future i18n selector swaps this file for locale messages

export const TERM_TYPE_LABELS: Record<TermType, string> = {
  command: 'comando',
  concept: 'concepto',
  entity: 'entidad',
  event: 'evento',
  exchange: 'exchange',
  invoke: 'invoke',
  provider: 'proveedor externo',
  queue: 'cola',
  service: 'servicio',
  status: 'estado',
};

export const TERM_TYPE_COLORS: Record<TermType, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
  command: 'error',
  concept: 'neutral',
  entity: 'primary',
  event: 'warning',
  exchange: 'secondary',
  invoke: 'info',
  provider: 'neutral',
  queue: 'success',
  service: 'info',
  status: 'primary',
};

export const STEP_KIND_LABELS: Record<StepKind, string> = {
  command: 'comando',
  error: 'error',
  event: 'evento',
  http: 'HTTP',
  invoke: 'invoke (pregunta)',
  reply: 'respuesta',
};

export const NODE_KIND_LABELS: Record<NodeKind, string> = {
  exchange: 'exchange',
  gate: 'puerta',
  provider: 'externo',
  queue: 'cola',
  service: 'servicio',
};

export const FLOW_SPEEDS = [
  { label: 'lenta', value: 0.6 },
  { label: 'normal', value: 1 },
  { label: 'rápida', value: 1.8 },
];
