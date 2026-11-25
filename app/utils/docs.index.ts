import type { EntitiesCollectionItem, FlowsCollectionItem, GlossaryCollectionItem, LifecyclesCollectionItem, MapsCollectionItem } from '@nuxt/content';

export interface DocsIndex {
  entities: EntitiesCollectionItem[];
  flows: FlowsCollectionItem[];
  lifecycles: LifecyclesCollectionItem[];
  maps: MapsCollectionItem[];
  terms: GlossaryCollectionItem[];
}

export const loadDocsIndex = async (): Promise<DocsIndex> => {
  const [entities, flows, lifecycles, maps, terms] = await Promise.all([
    queryCollection('entities').all(),
    queryCollection('flows').order('order', 'ASC').all(),
    queryCollection('lifecycles').order('order', 'ASC').all(),
    queryCollection('maps').all(),
    queryCollection('glossary').order('name', 'ASC').all(),
  ]);

  return { entities, flows, lifecycles, maps, terms };
};

export const getFlowTermStems = (flow: FlowsCollectionItem, index: DocsIndex) => { // the messages and the nodes the flow touches
  const nodes = index.maps.find(map => map.stem === flow.map)?.nodes ?? [];
  const nodeIds = new Set(flow.steps.flatMap(step => [step.from, step.to, step.node]));
  const nodeTerms = nodes.filter(node => nodeIds.has(node.id)).map(node => node.term);

  return new Set([...nodeTerms, ...flow.steps.map(step => step.term)].filter(Boolean));
};

export const getTermAppearances = (stem: string, index: DocsIndex) => ({
  flows: index.flows.filter(flow => getFlowTermStems(flow, index).has(stem)),
  lifecycles: index.lifecycles.filter(lifecycle => lifecycle.term === stem
    || lifecycle.states.some(state => state.term === stem)
    || lifecycle.transitions.some(transition => transition.by === stem)),
});

export const getRelatedTerms = (term: GlossaryCollectionItem, index: DocsIndex) => { // both ways: what it names and what names it
  const stems = new Set([...term.relations ?? [], ...index.terms.filter(item => item.relations?.includes(term.stem)).map(item => item.stem)]);

  return index.terms.filter(item => stems.has(item.stem) && item.stem !== term.stem);
};

export const getOwnedTerms = (stem: string, index: DocsIndex) => index.terms.filter(term => term.owner === stem);

export const findTerm = (stem: string | undefined, index: DocsIndex) => index.terms.find(term => term.stem === stem);
