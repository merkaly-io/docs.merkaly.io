<script setup lang="ts">
import { useAsyncData } from '#imports';

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const { localePath } = useDocusI18n();
</script>

<template>
  <UPageGrid class="content-flow-list">
    <template v-for="flow in data?.flows" :key="flow.stem">
      <UPageCard :title="flow.title" :description="flow.summary" :to="localePath(getFlowPath(flow.stem))" icon="i-lucide-workflow" variant="subtle" />
    </template>
  </UPageGrid>
</template>

<style scoped>
.content-flow-list { margin: 1rem 0; }
</style>
