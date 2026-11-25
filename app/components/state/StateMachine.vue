<script setup lang="ts">
import { computed, ref, watch } from '#imports';
import type { PropType } from 'vue';
import type { MachineState, StateMachineView } from '~/utils/state.layout';

const lifecycle = defineModel({ required: true, type: Object as PropType<StateMachineView> });

const { localePath } = useDocusI18n();

const getInitialStateId = () => (lifecycle.value.states.find(state => state.initial) ?? lifecycle.value.states[0])?.id;

const selectedId = ref(getInitialStateId());

const size = computed(() => getMachineSize(lifecycle.value.states));

const statesById = computed(() => Object.fromEntries(lifecycle.value.states.map(state => [state.id, state])));

const flagsById = computed(() => Object.fromEntries((lifecycle.value.flags ?? []).map(flag => [flag.id, flag])));

const selectedState = computed<MachineState | undefined>(() => statesById.value[selectedId.value ?? '']);

const transitions = computed(() => lifecycle.value.transitions.flatMap((transition, index) => {
  const from = statesById.value[transition.from];
  const to = statesById.value[transition.to];

  if (!from || !to) return [];

  const direction = transition.from === selectedId.value ? 'out' : transition.to === selectedId.value ? 'in' : 'idle';

  return [{ ...getTransitionShape(from, to), direction, index, transition }];
}));

const outgoing = computed(() => lifecycle.value.transitions.filter(transition => transition.from === selectedId.value));

const incoming = computed(() => lifecycle.value.transitions.filter(transition => transition.to === selectedId.value));

const getFlags = (state: MachineState) => state.flags ?? [];

const getFlagLabels = (state: MachineState) => getFlags(state).map(flag => flagsById.value[flag]?.label ?? flag).join(' · ');

const isConnected = (state: MachineState) => [...outgoing.value, ...incoming.value].some(transition => transition.from === state.id || transition.to === state.id);

function selectState(id: string) {
  selectedId.value = id;
}

watch(() => lifecycle.value.states, () => selectState(getInitialStateId() ?? ''));
</script>

<template>
  <div class="state-machine">
    <div class="state-machine__canvas">
      <svg :viewBox="`0 0 ${size.width} ${size.height}`" class="state-machine__svg">
        <template v-for="item in transitions" :key="item.index">
          <g :class="`state-machine__edge--${item.direction}`" class="state-machine__edge">
            <title v-text="`${item.transition.from} → ${item.transition.to}: ${item.transition.trigger}`" />

            <path :d="item.path" />

            <polygon :points="item.arrow" />
          </g>
        </template>

        <template v-for="state in lifecycle.states" :key="state.id">
          <g
            :class="{
              'state-machine__state--selected': state.id === selectedId,
              'state-machine__state--connected': isConnected(state),
              'state-machine__state--initial': state.initial,
            }"
            class="state-machine__state"
            @click="selectState(state.id)"
          >
            <title v-text="state.summary" />

            <rect v-bind="getStateBox(state)" rx="10" />

            <text :x="getStateBox(state).x + STATE_LAYOUT.width / 2" :y="getStateBox(state).y + (getFlags(state).length ? 21 : 29)" text-anchor="middle" class="state-machine__name" v-text="state.id" />

            <text
              v-if="getFlags(state).length"
              :x="getStateBox(state).x + STATE_LAYOUT.width / 2"
              :y="getStateBox(state).y + 37"
              text-anchor="middle"
              class="state-machine__flags"
              v-text="getFlagLabels(state)"
            />
          </g>
        </template>
      </svg>
    </div>

    <div v-if="selectedState" class="state-machine__panel">
      <div class="state-machine__heading">
        <code v-text="selectedState.id" />

        <template v-for="flag in getFlags(selectedState)" :key="flag">
          <UBadge color="success" variant="subtle" size="sm">
            <span v-text="flagsById[flag]?.label ?? flag" />
          </UBadge>
        </template>
      </div>

      <p v-text="selectedState.summary" />

      <UButton
        v-if="selectedState.term"
        :to="localePath(getTermPath(selectedState.term))"
        icon="i-lucide-book-open"
        color="neutral"
        variant="outline"
        size="xs"
      >
        <span v-text="'Ver en el glosario'" />
      </UButton>

      <div class="state-machine__group">
        <small v-text="outgoing.length ? 'Sale hacia' : 'Estado final: no sale hacia ningún otro'" />

        <template v-for="(transition, index) in outgoing" :key="`out-${index}`">
          <button type="button" class="state-machine__transition state-machine__transition--out" @click="selectState(transition.to)">
            <code v-text="`→ ${transition.to}`" />

            <span v-text="transition.trigger" />

            <em v-if="transition.by" v-text="`por ${transition.by}`" />
          </button>
        </template>
      </div>

      <div v-if="incoming.length" class="state-machine__group">
        <small v-text="'Llega desde'" />

        <template v-for="(transition, index) in incoming" :key="`in-${index}`">
          <button type="button" class="state-machine__transition state-machine__transition--in" @click="selectState(transition.from)">
            <code v-text="`${transition.from} →`" />

            <span v-text="transition.trigger" />

            <em v-if="transition.by" v-text="`por ${transition.by}`" />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.state-machine { display: flex; flex-direction: column; gap: 14px; margin: 1.5rem 0; }

.state-machine__canvas { min-width: 0; overflow-x: auto; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 14px; }

.state-machine__svg { display: block; width: 100%; min-width: 640px; height: auto; }

.state-machine__edge path { fill: none; stroke: var(--mk-edge); stroke-width: 1.4; transition: stroke .2s, opacity .2s; }

.state-machine__edge polygon { fill: var(--mk-edge); transition: fill .2s; }

.state-machine__edge--out path { stroke: var(--ui-primary); stroke-width: 2.4; stroke-dasharray: 7 4; animation: state-machine-flow 0.9s linear infinite; }

.state-machine__edge--out polygon { fill: var(--ui-primary); }

.state-machine__edge--in path { stroke: var(--mk-kind-invoke); stroke-width: 2; }

.state-machine__edge--in polygon { fill: var(--mk-kind-invoke); }

.state-machine__edge--idle { opacity: .45; }

.state-machine__state { cursor: pointer; }

.state-machine__state rect { fill: var(--ui-bg-elevated); stroke: var(--ui-border-accented); stroke-width: 1.5; transition: filter .2s, stroke .2s; }

.state-machine__state--initial rect { stroke-width: 2.5; }

.state-machine__state--connected rect { stroke: var(--mk-kind-invoke); }

.state-machine__state--selected rect { stroke: var(--ui-primary); stroke-width: 2.5; filter: drop-shadow(0 0 8px var(--ui-primary)); }

.state-machine__name { font-family: var(--font-mono); font-size: 12px; font-weight: 600; fill: var(--ui-text-highlighted); }

.state-machine__flags { font-size: 10.5px; fill: var(--mk-state-flag); }

.state-machine__panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px 16px; min-width: 0; padding: 14px 16px; font-size: 14px; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 14px; }

.state-machine__panel p { margin: 0; }

.state-machine__heading, .state-machine__panel p, .state-machine__panel > a { grid-column: 1 / -1; }

.state-machine__panel > a { justify-self: start; }

@media (max-width: 700px) { .state-machine__panel { grid-template-columns: 1fr; } }

.state-machine__heading { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

.state-machine__heading code { font-size: 15px; font-weight: 700; }

.state-machine__group { align-content: start; display: flex; flex-direction: column; gap: 6px; }

.state-machine__group small { color: var(--ui-text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }

.state-machine__transition { display: flex; flex-direction: column; gap: 1px; padding: 6px 10px; text-align: left; background: var(--ui-bg-muted); border-left: 3px solid var(--ui-border-accented); border-radius: 6px; cursor: pointer; }

.state-machine__transition--out { border-left-color: var(--ui-primary); }

.state-machine__transition--in { border-left-color: var(--mk-kind-invoke); }

.state-machine__transition span { font-size: 13px; }

.state-machine__transition em { color: var(--ui-text-muted); font-size: 12px; }

@keyframes state-machine-flow { to { stroke-dashoffset: -11; } }

@media (prefers-reduced-motion: reduce) { .state-machine__edge--out path { animation: none; } }
</style>
