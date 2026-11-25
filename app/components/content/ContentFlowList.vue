<script setup lang="ts">
import { computed, useAsyncData } from '#imports';

const props = defineProps({
  domain: { default: undefined, type: String }, // only the flows of one domain
});

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const { localePath } = useDocusI18n();

const flows = computed(() => (data.value?.flows ?? []).filter(flow => !props.domain || flow.domain === props.domain));
</script>

<template>
  <UPageGrid v-if="flows.length" class="content-flow-list">
    <template v-for="flow in flows" :key="flow.stem">
      <UPageCard :title="flow.title" :description="flow.summary" :to="localePath(getFlowPath(flow.stem))" icon="i-lucide-workflow" variant="subtle" />
    </template>
  </UPageGrid>

  <p v-else class="content-flow-list__empty" v-text="'Todavía no hay flujos en este dominio.'" />
</template>

<style scoped>
.content-flow-list { margin: 1rem 0; }

.content-flow-list__empty { color: var(--ui-text-muted); }
</style>
