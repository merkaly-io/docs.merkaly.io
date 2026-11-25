<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRef, usePreferredReducedMotion, watch } from '#imports';
import { promiseTimeout, transition, TransitionPresets } from '@vueuse/core';
import type { PropType } from 'vue';
import type { StepKind } from '#shared/utils/docs';
import type { FlowNode, FlowSegment, FlowStep, FlowView } from '~/utils/flow.view';

const flow = defineModel({ required: true, type: Object as PropType<FlowView> });

const props = defineProps({
  autoplay: { default: false, type: Boolean },
});

interface Burst { id: number; kind: StepKind; node: FlowNode; progress: number }

const reducedMotion = usePreferredReducedMotion();
const { localePath } = useDocusI18n();

const nextIndex = ref(0); // next step to run
const currentIndex = ref(-1); // step on screen
const playing = ref(false);
const speed = ref(1);
const progress = ref(0); // packet position along its segment, 0 to 1
const litNode = ref<{ id: string; kind: StepKind } | null>(null);
const hotEdge = ref<{ key: string; kind: StepKind } | null>(null);
const packet = ref<{ kind: StepKind; label: string; segment: FlowSegment } | null>(null);
const bubble = ref<{ kind: StepKind; label: string; node: FlowNode } | null>(null);
const bursts = ref<Burst[]>([]);

let run = 0; // bumping it cancels whatever is animating
let burstId = 0;

const nodesById = computed(() => Object.fromEntries(flow.value.nodes.map(node => [node.id, node])));

const edges = computed(() => {
  const unique = new Map<string, FlowSegment>();

  flow.value.steps.forEach((step) => {
    const from = step.from ? nodesById.value[step.from] : undefined;
    const to = step.to ? nodesById.value[step.to] : undefined;
    const key = from && to ? getEdgeKey(from.id, to.id) : '';

    if (from && to && !unique.has(key)) {
      const [first, second] = [from, to].sort((a, b) => a.id.localeCompare(b.id));
      unique.set(key, getSegment(first!, second!));
    }
  });

  return [...unique.entries()].map(([key, segment]) => ({ key, segment }));
});

const packetPosition = computed(() => {
  const [x1, y1, x2, y2] = packet.value?.segment ?? [0, 0, 0, 0];

  return `translate(${x1 + (x2 - x1) * progress.value},${y1 + (y2 - y1) * progress.value})`;
});

const currentStep = computed<FlowStep | undefined>(() => flow.value.steps[currentIndex.value]);

const finished = computed(() => currentIndex.value >= flow.value.steps.length);

const getKindColor = (kind: StepKind) => `var(--mk-kind-${kind})`;

const isCancelled = (token: number) => token !== run;

const waitFor = (ms: number, token: number) => promiseTimeout(ms / speed.value).then(() => !isCancelled(token));

function lightNode(id: string | undefined, kind: StepKind) {
  litNode.value = id ? { id, kind } : null;
}

async function burstNode(node: FlowNode, kind: StepKind) {
  const burst = reactive<Burst>({ id: ++burstId, kind, node, progress: 0 });
  bursts.value.push(burst);

  await transition(toRef(burst, 'progress'), 0, 1, { duration: 650 / speed.value });
  bursts.value = bursts.value.filter(item => item.id !== burst.id);
}

async function moveMessage(step: FlowStep, token: number) {
  const from = nodesById.value[step.from!];
  const to = nodesById.value[step.to!];

  if (!from || !to) return true; // unknown node: the step list still shows it

  const segment = getSegment(from, to);
  const duration = (500 + Math.hypot(segment[2] - segment[0], segment[3] - segment[1]) * 1.6) / speed.value;

  lightNode(from.id, step.kind);
  hotEdge.value = { key: getEdgeKey(from.id, to.id), kind: step.kind };
  packet.value = { kind: step.kind, label: step.label ?? '', segment };

  await transition(progress, 0, 1, { abort: () => isCancelled(token), duration, easing: TransitionPresets.easeInOutQuad });

  if (isCancelled(token)) return false;

  lightNode(to.id, step.kind);
  burstNode(to, step.kind);
  packet.value = null;

  return true;
}

async function pulseNode(step: FlowStep, token: number) {
  const node = nodesById.value[step.node!];

  if (!node) return true;

  lightNode(node.id, step.kind);
  hotEdge.value = null;
  bubble.value = { kind: step.kind, label: step.label ?? '', node };

  for (let pulse = 0; pulse < 3 && !isCancelled(token); pulse++) {
    burstNode(node, step.kind);
    await waitFor(380, token);
  }

  bubble.value = null;

  return !isCancelled(token);
}

function runStep(index: number, token: number) {
  const step = flow.value.steps[index]!;
  currentIndex.value = index;

  return step.node ? pulseNode(step, token) : moveMessage(step, token);
}

function clearStage() {
  packet.value = null;
  bubble.value = null;
  bursts.value = [];
}

function pauseFlow() {
  run++;
  playing.value = false;
  clearStage();
}

async function playFlow() {
  if (nextIndex.value >= flow.value.steps.length) nextIndex.value = 0;

  pauseFlow();
  playing.value = true;
  const token = run;

  while (nextIndex.value < flow.value.steps.length) {
    const step = flow.value.steps[nextIndex.value]!;

    if (!await runStep(nextIndex.value, token)) return;

    nextIndex.value++;

    if (!await waitFor(step.description ? 900 : 350, token)) return;
  }

  playing.value = false;
  currentIndex.value = flow.value.steps.length;
  lightNode(undefined, 'event');
  hotEdge.value = null;
}

async function showNextStep() {
  if (nextIndex.value >= flow.value.steps.length) return;

  pauseFlow();
  const token = run;

  if (await runStep(nextIndex.value, token)) nextIndex.value++;
}

function showPreviousStep() {
  nextIndex.value = Math.max(0, nextIndex.value - 2);
  showNextStep();
}

function jumpToStep(index: number) {
  nextIndex.value = index;
  showNextStep();
}

function restartFlow() {
  pauseFlow();
  nextIndex.value = 0;
  currentIndex.value = -1;
  lightNode(undefined, 'event');
  hotEdge.value = null;
}

function togglePlay() {
  if (playing.value) return pauseFlow();

  playFlow();
}

function openNodeTerm(node: FlowNode) {
  if (node.term) navigateTo(localePath(getTermPath(node.term)));
}

watch(() => flow.value.steps, restartFlow);

onMounted(() => {
  if (props.autoplay && reducedMotion.value !== 'reduce') playFlow();
});

onBeforeUnmount(pauseFlow);
</script>

<template>
  <div class="flow-player">
    <div class="flow-player__canvas">
      <svg :viewBox="`0 0 ${flow.width} ${flow.height}`" class="flow-player__svg">
        <template v-for="column in flow.columns" :key="column.label">
          <text :x="column.x" y="16" text-anchor="middle" class="flow-player__column" v-text="column.label" />
        </template>

        <template v-for="edge in edges" :key="edge.key">
          <line
            :x1="edge.segment[0]"
            :y1="edge.segment[1]"
            :x2="edge.segment[2]"
            :y2="edge.segment[3]"
            :class="{ 'flow-player__edge--hot': hotEdge?.key === edge.key }"
            :style="hotEdge?.key === edge.key ? { stroke: getKindColor(hotEdge.kind) } : undefined"
            class="flow-player__edge"
          />
        </template>

        <template v-for="node in flow.nodes" :key="node.id">
          <g
            :class="[`flow-player__node--${node.kind}`, { 'flow-player__node--lit': litNode?.id === node.id, 'flow-player__node--link': node.term }]"
            :style="litNode?.id === node.id ? { '--glow': getKindColor(litNode.kind) } : undefined"
            class="flow-player__node"
            @click="openNodeTerm(node)"
          >
            <title v-text="node.caption ? `${node.label}: ${node.caption}` : node.label" />

            <polygon
              v-if="node.kind === 'exchange'"
              :points="`${node.x + 14},${node.y} ${node.x + node.w - 14},${node.y} ${node.x + node.w},${node.y + node.h / 2} ${node.x + node.w - 14},${node.y + node.h} ${node.x + 14},${node.y + node.h} ${node.x},${node.y + node.h / 2}`"
            />

            <rect v-else :x="node.x" :y="node.y" :width="node.w" :height="node.h" :rx="node.kind === 'queue' ? 8 : 12" />

            <text
              :x="node.x + node.w / 2"
              :y="['gate', 'service'].includes(node.kind) ? node.y + 24 : node.y + node.h / 2 - (node.h > 40 ? 3 : 1)"
              text-anchor="middle"
              class="flow-player__label"
              v-text="node.label"
            />

            <text
              :x="node.x + node.w / 2"
              :y="(['gate', 'service'].includes(node.kind) ? node.y + 24 : node.y + node.h / 2 - (node.h > 40 ? 3 : 1)) + 15"
              text-anchor="middle"
              class="flow-player__caption"
              v-text="node.caption"
            />
          </g>
        </template>

        <template v-for="burst in bursts" :key="burst.id">
          <rect
            :x="burst.node.x - burst.progress * 10"
            :y="burst.node.y - burst.progress * 10"
            :width="burst.node.w + burst.progress * 20"
            :height="burst.node.h + burst.progress * 20"
            :opacity="1 - burst.progress"
            :stroke="getKindColor(burst.kind)"
            rx="12"
            class="flow-player__ring"
          />
        </template>

        <g v-if="bubble" class="flow-player__bubble">
          <rect
            :x="bubble.node.x + bubble.node.w / 2 - (bubble.label.length * 6.6 + 16) / 2"
            :y="bubble.node.y - 26"
            :width="bubble.label.length * 6.6 + 16"
            :fill="getKindColor(bubble.kind)"
            height="20"
            rx="10"
          />

          <text :x="bubble.node.x + bubble.node.w / 2" :y="bubble.node.y - 12" text-anchor="middle" v-text="bubble.label" />
        </g>

        <g v-if="packet" :transform="packetPosition" class="flow-player__packet">
          <circle r="7" :fill="getKindColor(packet.kind)" />

          <rect v-if="packet.label" x="6" y="-23" :width="getLabelWidth(packet.label)" height="18" rx="5" :stroke="getKindColor(packet.kind)" />

          <text v-if="packet.label" x="12" y="-10" :fill="getKindColor(packet.kind)" v-text="packet.label" />
        </g>
      </svg>
    </div>

    <div class="flow-player__panel">
      <div class="flow-player__controls">
        <UButton :icon="playing ? 'i-lucide-pause' : 'i-lucide-play'" size="sm" @click="togglePlay">
          <span v-text="playing ? 'Pausa' : finished ? 'Repetir' : 'Reproducir'" />
        </UButton>

        <UButton icon="i-lucide-skip-back" color="neutral" variant="outline" size="sm" title="Paso anterior" @click="showPreviousStep" />

        <UButton icon="i-lucide-skip-forward" color="neutral" variant="outline" size="sm" title="Paso siguiente" @click="showNextStep" />

        <UButton icon="i-lucide-rotate-ccw" color="neutral" variant="outline" size="sm" title="Volver al inicio" @click="restartFlow" />

        <USelect v-model="speed" :items="FLOW_SPEEDS" size="sm" class="flow-player__speed" />
      </div>

      <div :style="{ borderLeftColor: currentStep ? getKindColor(currentStep.kind) : undefined }" class="flow-player__now">
        <template v-if="currentStep">
          <small v-text="`Paso ${currentIndex + 1} de ${flow.steps.length} · ${STEP_KIND_LABELS[currentStep.kind]}`" />

          <strong v-text="currentStep.title" />

          <p v-text="currentStep.description" />
        </template>

        <template v-else>
          <small v-text="finished ? 'Fin del recorrido' : 'Listo'" />

          <strong v-text="finished ? 'El mensaje llegó a destino' : 'Pulsa Reproducir o avanza paso a paso'" />

          <p v-text="'Los mensajes se mueven entre los nodos; el nodo activo se ilumina. Toca un nodo para ver su definición.'" />
        </template>
      </div>

      <ol class="flow-player__steps">
        <template v-for="(step, index) in flow.steps" :key="index">
          <li
            :class="{ 'flow-player__step--done': index < currentIndex, 'flow-player__step--current': index === currentIndex }"
            @click="jumpToStep(index)"
            v-text="step.title"
          />
        </template>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.flow-player { display: flex; flex-direction: column; gap: 14px; margin: 1.5rem 0; }

.flow-player__canvas { min-width: 0; overflow-x: auto; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 14px; }

.flow-player__svg { display: block; width: 100%; min-width: 640px; height: auto; }

.flow-player__column { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; fill: var(--ui-text-muted); }

.flow-player__edge { fill: none; stroke: var(--mk-edge); stroke-width: 1.4; }

.flow-player__edge--hot { stroke-width: 2.6; }

.flow-player__node rect, .flow-player__node polygon { stroke-width: 1.5; transition: filter .2s; }

.flow-player__node--link { cursor: pointer; }

.flow-player__node--lit rect, .flow-player__node--lit polygon { filter: drop-shadow(0 0 7px var(--glow)); }

.flow-player__node--provider rect { fill: var(--mk-node-provider-bg); stroke: var(--mk-node-provider); stroke-dasharray: 4 3; }

.flow-player__node--gate rect { fill: var(--mk-node-gate-bg); stroke: var(--mk-node-gate); stroke-width: 2; }

.flow-player__node--exchange polygon { fill: var(--mk-node-exchange-bg); stroke: var(--mk-node-exchange); }

.flow-player__node--queue rect { fill: var(--mk-node-queue-bg); stroke: var(--mk-node-queue); }

.flow-player__node--service rect { fill: var(--mk-node-service-bg); stroke: var(--mk-node-service); stroke-width: 2; }

.flow-player__label { font-size: 13px; font-weight: 600; fill: var(--ui-text-highlighted); }

.flow-player__node--exchange .flow-player__label, .flow-player__node--queue .flow-player__label { font-family: var(--font-mono); font-size: 11.5px; }

.flow-player__caption { font-size: 10.5px; fill: var(--ui-text-muted); }

.flow-player__ring { fill: none; stroke-width: 2.5; }

.flow-player__bubble text { font-size: 11px; font-weight: 600; fill: var(--ui-bg); }

.flow-player__packet rect { fill: var(--ui-bg); stroke-width: 1.2; }

.flow-player__packet text { font-family: var(--font-mono); font-size: 10.5px; font-weight: 600; }

.flow-player__panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px 16px; min-width: 0; padding: 14px 16px; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 14px; }

.flow-player__controls { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

.flow-player__speed { margin-left: auto; min-width: 96px; }

.flow-player__now { display: flex; flex-direction: column; gap: 2px; min-height: 110px; padding: 6px 10px; background: var(--ui-bg-muted); border-left: 3px solid var(--ui-border-accented); border-radius: 6px; }

.flow-player__now small { color: var(--ui-text-muted); font-size: 12px; }

.flow-player__now p { margin: 0; font-size: 13.5px; }

@media (max-width: 700px) { .flow-player__panel { grid-template-columns: 1fr; } }

.flow-player__steps { max-height: 220px; margin: 0; padding-left: 20px; overflow: auto; font-size: 13px; list-style: decimal; }

.flow-player__steps li { margin: 3px 0; color: var(--ui-text-muted); cursor: pointer; }

.flow-player__steps .flow-player__step--done { color: var(--ui-text); }

.flow-player__steps .flow-player__step--current { color: var(--ui-text-highlighted); font-weight: 600; }

@media (prefers-reduced-motion: reduce) { .flow-player__node rect, .flow-player__node polygon { transition: none; } }
</style>
