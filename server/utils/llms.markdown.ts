import type { FlowsCollectionItem, GlossaryCollectionItem, LifecyclesCollectionItem, MapsCollectionItem } from '@nuxt/content';

export const renderTermMarkdown = (term: GlossaryCollectionItem) => [
  `## ${term.name} (${term.type})`,
  '',
  term.summary,
  term.details ? `\n${term.details}` : '',
  term.owner ? `\nDueño: ${term.owner}` : '',
  term.relations?.length ? `Relacionado con: ${term.relations.join(', ')}` : '',
  term.source ? `En el código: ${term.source}` : '',
].filter(Boolean).join('\n');

export const renderFlowMarkdown = (flow: FlowsCollectionItem, map?: MapsCollectionItem) => {
  const labels = Object.fromEntries((map?.nodes ?? []).map(node => [node.id, node.label]));
  const steps = flow.steps.map((step, index) => {
    const where = step.node ? labels[step.node] ?? step.node : `${labels[step.from!] ?? step.from} -> ${labels[step.to!] ?? step.to}`;

    return `${index + 1}. [${step.kind}] ${where}${step.label ? ` (${step.label})` : ''}: ${step.title}. ${step.description ?? ''}`.trim();
  });

  return [`## Flujo: ${flow.title}`, '', flow.summary, '', ...steps].join('\n');
};

export const renderLifecycleMarkdown = (lifecycle: LifecyclesCollectionItem) => [
  `## Ciclo de vida: ${lifecycle.title}`,
  '',
  lifecycle.summary,
  '',
  '### Estados',
  ...lifecycle.states.map(state => `- ${state.id}${state.flags?.length ? ` [${state.flags.join(', ')}]` : ''}: ${state.summary}`),
  '',
  '### Transiciones',
  ...lifecycle.transitions.map(transition => `- ${transition.from} -> ${transition.to}${transition.by ? ` (por ${transition.by})` : ''}: ${transition.trigger}`),
  ...(lifecycle.flags ?? []).map(flag => `\nGrupo "${flag.label}": ${flag.description}`),
  ...(lifecycle.mappings ?? []).flatMap(mapping => [`\n### ${mapping.title}`, ...mapping.rows.map(row => `- ${row.from} -> ${row.to}${row.note ? ` (${row.note})` : ''}`)]),
].join('\n');
