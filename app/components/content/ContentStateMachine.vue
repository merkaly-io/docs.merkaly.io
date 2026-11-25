<script setup lang="ts">
import { computed, useAsyncData } from '#imports';

const props = defineProps({
  lifecycle: { required: true, type: String }, // stem of the lifecycle in data/lifecycles
});

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const lifecycle = computed(() => data.value?.lifecycles.find(item => item.stem === props.lifecycle));
</script>

<template>
  <StateMachine v-if="lifecycle" :model-value="lifecycle" />

  <UAlert v-else color="warning" icon="i-lucide-triangle-alert" :title="`Ciclo de vida no encontrado: ${props.lifecycle}`" />
</template>
