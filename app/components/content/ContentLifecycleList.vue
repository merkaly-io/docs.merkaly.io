<script setup lang="ts">
import { computed, useAsyncData } from '#imports';

const props = defineProps({
  domain: { default: undefined, type: String }, // only the lifecycles of one domain
});

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const { localePath } = useDocusI18n();

const lifecycles = computed(() => (data.value?.lifecycles ?? []).filter(lifecycle => !props.domain || lifecycle.domain === props.domain));
</script>

<template>
  <UPageGrid v-if="lifecycles.length" class="content-lifecycle-list">
    <template v-for="lifecycle in lifecycles" :key="lifecycle.stem">
      <UPageCard
        :title="lifecycle.title"
        :description="lifecycle.summary"
        :to="localePath(getLifecyclePath(lifecycle.stem))"
        icon="i-lucide-git-fork"
        variant="subtle"
      />
    </template>
  </UPageGrid>

  <p v-else class="content-lifecycle-list__empty" v-text="'Todavía no hay ciclos de vida en este dominio.'" />
</template>

<style scoped>
.content-lifecycle-list { margin: 1rem 0; }

.content-lifecycle-list__empty { color: var(--ui-text-muted); }
</style>
