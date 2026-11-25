<script setup lang="ts">
import type { StepKind } from '#shared/utils/docs';

const getKindColor = (kind: StepKind) => `var(--mk-kind-${kind})`;
</script>

<template>
  <div class="flow-legend">
    <template v-for="kind in STEP_KINDS" :key="kind">
      <span>
        <i :style="{ background: getKindColor(kind) }" />

        <span v-text="STEP_KIND_LABELS[kind]" />
      </span>
    </template>

    <span v-text="'Rombo violeta: exchange · Verde: cola · Azul: servicio · Ámbar: puerta · Gris punteado: externo'" />
  </div>
</template>

<style scoped>
.flow-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 0 0 1rem; color: var(--ui-text-muted); font-size: 12.5px; }

.flow-legend i { display: inline-block; width: 10px; height: 10px; margin-right: 5px; vertical-align: -1px; border-radius: 50%; }
</style>
