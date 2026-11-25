import type { H3Event } from 'h3';

const loadData = (event: H3Event) => Promise.all([
  queryCollection(event, 'glossary').order('name', 'ASC').all(),
  queryCollection(event, 'flows').order('order', 'ASC').all(),
  queryCollection(event, 'lifecycles').order('order', 'ASC').all(),
  queryCollection(event, 'maps').all(),
  queryCollection(event, 'entities').all(),
]);

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('llms:generate', async (event, options) => { // the data pages are not in the docs collection: list them here
    const [terms, flows, lifecycles] = await loadData(event);

    options.sections.push(
      { description: 'Una ficha por término.', links: terms.map(term => ({ description: term.summary, href: `${options.domain}/glosario/${term.stem}`, title: term.name })), title: 'Glosario' },
      { description: 'Recorridos paso a paso.', links: flows.map(flow => ({ description: flow.summary, href: `${options.domain}/flujos/${flow.stem}`, title: flow.title })), title: 'Flujos' },
      { description: 'Máquinas de estado.', links: lifecycles.map(item => ({ description: item.summary, href: `${options.domain}/ciclos/${item.stem}`, title: item.title })), title: 'Ciclos de vida' },
    );
  });

  nitroApp.hooks.hook('llms:generate:full', async (event, _options, contents) => {
    const [terms, flows, lifecycles, maps, entities] = await loadData(event);

    contents.push(
      ['# Glosario', ...terms.map(renderTermMarkdown)].join('\n\n'),
      ['# Flujos', ...flows.map(flow => renderFlowMarkdown(flow, maps.find(map => map.stem === flow.map)))].join('\n\n'),
      ['# Ciclos de vida', ...lifecycles.map(renderLifecycleMarkdown)].join('\n\n'),
      ['# Entidades por dominio', ...entities.map(renderEntityMapMarkdown)].join('\n\n'),
    );
  });
});
