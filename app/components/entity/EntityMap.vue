<script setup lang="ts">
import { computed, ref, watch } from '#imports';
import type { PropType } from 'vue';
import type { EntityMapView, MapEntity } from '~/utils/entity.layout';

const map = defineModel({ required: true, type: Object as PropType<EntityMapView> });

const { localePath } = useDocusI18n();

const getFirstEntityId = () => (map.value.entities.find(entity => !entity.outside) ?? map.value.entities[0])?.id;

const selectedId = ref(getFirstEntityId());

const size = computed(() => getEntityMapSize(map.value.entities));

const entitiesById = computed(() => Object.fromEntries(map.value.entities.map(entity => [entity.id, entity])));

const selectedEntity = computed<MapEntity | undefined>(() => entitiesById.value[selectedId.value ?? '']);

const relations = computed(() => map.value.relations.flatMap((relation, index) => {
  const from = entitiesById.value[relation.from];
  const to = entitiesById.value[relation.to];

  if (!from || !to) return [];

  const hot = relation.from === selectedId.value || relation.to === selectedId.value;

  return [{ ...getRelationShape(from, to), hot, index, relation }];
}));

const outgoing = computed(() => map.value.relations.filter(relation => relation.from === selectedId.value));

const incoming = computed(() => map.value.relations.filter(relation => relation.to === selectedId.value));

const isConnected = (entity: MapEntity) => [...outgoing.value, ...incoming.value].some(relation => relation.from === entity.id || relation.to === entity.id);

const getLabel = (id: string) => entitiesById.value[id]?.label ?? id;

function selectEntity(id: string) {
  selectedId.value = id;
}

watch(() => map.value.entities, () => selectEntity(getFirstEntityId() ?? ''));
</script>

<template>
  <div class="entity-map">
    <div class="entity-map__canvas">
      <svg :viewBox="`0 0 ${size.width} ${size.height}`" class="entity-map__svg">
        <template v-for="item in relations" :key="item.index">
          <g :class="{ 'entity-map__relation--hot': item.hot }" :style="{ '--delay': `${item.index * 90}ms` }" class="entity-map__relation">
            <title v-text="`${getLabel(item.relation.from)} ${item.relation.label} ${getLabel(item.relation.to)}`" />

            <path :d="item.path" path-length="100" class="entity-map__line" />

            <circle v-if="item.hot" r="4" class="entity-map__packet">
              <animateMotion :path="item.path" dur="1.8s" repeatCount="indefinite" />
            </circle>

            <text :x="item.fromMark[0]" :y="item.fromMark[1] + 4" text-anchor="middle" class="entity-map__mark" v-text="'1'" />

            <text :x="item.toMark[0]" :y="item.toMark[1] + 4" text-anchor="middle" class="entity-map__mark" v-text="item.relation.many ? 'N' : '1'" />

            <rect
              :x="item.middle[0] - getLabelWidth(item.relation.label) / 2"
              :y="item.middle[1] - 10"
              :width="getLabelWidth(item.relation.label)"
              height="19"
              rx="9"
              class="entity-map__tag"
            />

            <text :x="item.middle[0]" :y="item.middle[1] + 3.5" text-anchor="middle" class="entity-map__verb" v-text="item.relation.label" />
          </g>
        </template>

        <template v-for="entity in map.entities" :key="entity.id">
          <g
            :class="{
              'entity-map__entity--selected': entity.id === selectedId,
              'entity-map__entity--connected': isConnected(entity),
              'entity-map__entity--outside': entity.outside,
            }"
            class="entity-map__entity"
            @click="selectEntity(entity.id)"
          >
            <title v-text="entity.summary" />

            <rect v-bind="getEntityBox(entity)" rx="10" />

            <text
              :x="getEntityBox(entity).x + ENTITY_LAYOUT.width / 2"
              :y="getEntityBox(entity).y + (entity.caption ? 25 : 34)"
              text-anchor="middle"
              class="entity-map__name"
              v-text="entity.label"
            />

            <text
              v-if="entity.caption"
              :x="getEntityBox(entity).x + ENTITY_LAYOUT.width / 2"
              :y="getEntityBox(entity).y + 43"
              text-anchor="middle"
              class="entity-map__caption"
              v-text="entity.caption"
            />
          </g>
        </template>
      </svg>
    </div>

    <div v-if="selectedEntity" class="entity-map__panel">
      <div class="entity-map__heading">
        <strong v-text="selectedEntity.label" />

        <UBadge v-if="selectedEntity.caption" color="neutral" variant="subtle" size="sm">
          <span v-text="selectedEntity.caption" />
        </UBadge>

        <UBadge v-if="selectedEntity.outside" color="warning" variant="subtle" size="sm">
          <span v-text="'de otro dominio'" />
        </UBadge>
      </div>

      <p v-text="selectedEntity.summary" />

      <UButton
        v-if="selectedEntity.term"
        :to="localePath(getTermPath(selectedEntity.term))"
        icon="i-lucide-book-open"
        color="neutral"
        variant="outline"
        size="xs"
      >
        <span v-text="'Ver en el glosario'" />
      </UButton>

      <div v-if="selectedEntity.fields?.length" class="entity-map__group">
        <small v-text="'Campos clave'" />

        <dl class="entity-map__fields">
          <template v-for="field in selectedEntity.fields" :key="field.name">
            <div>
              <dt v-text="field.name" />

              <dd v-if="field.note" v-text="field.note" />
            </div>
          </template>
        </dl>
      </div>

      <div v-if="outgoing.length || incoming.length" class="entity-map__group">
        <small v-text="'Relaciones'" />

        <template v-for="(relation, index) in outgoing" :key="`out-${index}`">
          <button type="button" class="entity-map__link" @click="selectEntity(relation.to)">
            <span v-text="`${relation.label} ${getLabel(relation.to)}`" />

            <em v-text="relation.many ? 'uno a muchos' : 'uno a uno'" />
          </button>
        </template>

        <template v-for="(relation, index) in incoming" :key="`in-${index}`">
          <button type="button" class="entity-map__link entity-map__link--in" @click="selectEntity(relation.from)">
            <span v-text="`${getLabel(relation.from)} ${relation.label} esta entidad`" />

            <em v-text="relation.many ? 'uno a muchos' : 'uno a uno'" />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entity-map { display: flex; flex-direction: column; gap: 14px; margin: 1.5rem 0; }

.entity-map__canvas { min-width: 0; overflow-x: auto; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 14px; }

.entity-map__svg { display: block; width: 100%; min-width: 640px; height: auto; }

.entity-map__line { fill: none; stroke: var(--mk-edge); stroke-width: 1.6; stroke-dasharray: 100; stroke-dashoffset: 100; animation: entity-map-draw .7s ease-out var(--delay) forwards; }

.entity-map__relation { transition: opacity .2s; }

.entity-map__relation--hot .entity-map__line { stroke: var(--ui-primary); stroke-width: 2.4; }

.entity-map__packet { fill: var(--ui-primary); }

.entity-map__mark { font-size: 11px; font-weight: 700; fill: var(--ui-text-muted); }

.entity-map__relation--hot .entity-map__mark { fill: var(--ui-primary); }

.entity-map__tag { fill: var(--ui-bg); stroke: var(--mk-edge); }

.entity-map__relation--hot .entity-map__tag { stroke: var(--ui-primary); }

.entity-map__verb { font-size: 11px; fill: var(--ui-text-muted); }

.entity-map__relation--hot .entity-map__verb { font-weight: 600; fill: var(--ui-text-highlighted); }

.entity-map__entity { cursor: pointer; }

.entity-map__entity rect { fill: var(--mk-node-service-bg); stroke: var(--mk-node-service); stroke-width: 1.5; transition: filter .2s, stroke .2s; }

.entity-map__entity--outside rect { fill: var(--ui-bg-elevated); stroke: var(--ui-border-accented); stroke-dasharray: 4 3; }

.entity-map__entity--connected rect { stroke-width: 2.2; }

.entity-map__entity--selected rect { stroke: var(--ui-primary); stroke-width: 2.6; filter: drop-shadow(0 0 8px var(--ui-primary)); }

.entity-map__name { font-size: 13.5px; font-weight: 600; fill: var(--ui-text-highlighted); }

.entity-map__caption { font-size: 10.5px; fill: var(--ui-text-muted); }

.entity-map__panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px 16px; min-width: 0; padding: 14px 16px; font-size: 14px; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 14px; }

.entity-map__panel p { margin: 0; }

.entity-map__heading, .entity-map__panel p, .entity-map__panel > a { grid-column: 1 / -1; }

.entity-map__panel > a { justify-self: start; }

@media (max-width: 700px) { .entity-map__panel { grid-template-columns: 1fr; } }

.entity-map__heading { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

.entity-map__heading strong { font-size: 15px; }

.entity-map__group { align-content: start; display: flex; flex-direction: column; gap: 6px; }

.entity-map__group small { color: var(--ui-text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }

.entity-map__fields { display: flex; flex-direction: column; gap: 4px; margin: 0; }

.entity-map__fields dt { font-family: var(--font-mono); font-size: 12.5px; font-weight: 600; }

.entity-map__fields dd { margin: 0 0 2px; color: var(--ui-text-muted); font-size: 13px; }

.entity-map__link { display: flex; flex-direction: column; gap: 1px; padding: 6px 10px; text-align: left; background: var(--ui-bg-muted); border-left: 3px solid var(--ui-primary); border-radius: 6px; cursor: pointer; }

.entity-map__link--in { border-left-color: var(--mk-kind-invoke); }

.entity-map__link span { font-size: 13px; }

.entity-map__link em { color: var(--ui-text-muted); font-size: 12px; }

@keyframes entity-map-draw { to { stroke-dashoffset: 0; } }

@media (prefers-reduced-motion: reduce) {
  .entity-map__line { stroke-dashoffset: 0; animation: none; }

  .entity-map__packet { display: none; }
}
</style>
