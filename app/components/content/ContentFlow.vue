<script setup lang="ts">
import { computed, useAsyncData } from '#imports';

const props = defineProps({
  autoplay: { default: false, type: Boolean },
  flow: { required: true, type: String }, // stem of the flow in data/flows
});

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const view = computed(() => {
  const flow = data.value?.flows.find(item => item.stem === props.flow);
  const map = data.value?.maps.find(item => item.stem === flow?.map);

  return flow && map ? buildFlowView(flow, map) : undefined;
});
</script>

<template>
  <FlowPlayer v-if="view" :model-value="view" :autoplay="props.autoplay" />

  <UAlert v-else color="warning" icon="i-lucide-triangle-alert" :title="`Flujo no encontrado: ${props.flow}`" />
</template>
