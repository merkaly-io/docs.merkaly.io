import type { EntitiesCollectionItem, FlowsCollectionItem, GlossaryCollectionItem, LifecyclesCollectionItem, MapsCollectionItem } from '@nuxt/content';

export const renderTermMarkdown = (term: GlossaryCollectionItem) => [
  `## ${term.name} (${term.type})`,
  '',
  term.summary,
  term.details ? `\n${term.details}` : '',
  `\nDominio: ${term.domain}`,
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

  return [`## Flujo: ${flow.title}`, '', `Dominio: ${flow.domain}`, '', flow.summary, '', ...steps].join('\n');
};

export const renderLifecycleMarkdown = (lifecycle: LifecyclesCollectionItem) => [
  `## Ciclo de vida: ${lifecycle.title}`,
  '',
  `Dominio: ${lifecycle.domain}`,
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

export const renderEntityMapMarkdown = (map: EntitiesCollectionItem) => {
  const labels = Object.fromEntries(map.entities.map(entity => [entity.id, entity.label]));

  return [
    `## Entidades: ${map.stem}`,
    '',
    ...map.entities.map(entity => [
      `- ${entity.label}${entity.caption ? ` (${entity.caption})` : ''}${entity.outside ? ' [de otro dominio]' : ''}: ${entity.summary}`,
      ...(entity.fields ?? []).map(field => `  - ${field.name}${field.note ? `: ${field.note}` : ''}`),
    ].join('\n')),
    '',
    '### Relaciones',
    ...map.relations.map(relation => `- ${labels[relation.from] ?? relation.from} ${relation.label} ${labels[relation.to] ?? relation.to} (${relation.many ? 'uno a muchos' : 'uno a uno'})`),
  ].join('\n');
};
