<script setup lang="ts">
import { useAsyncData } from '#imports';

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const { localePath } = useDocusI18n();
</script>

<template>
  <UPageGrid class="content-lifecycle-list">
    <template v-for="lifecycle in data?.lifecycles" :key="lifecycle.stem">
      <UPageCard
        :title="lifecycle.title"
        :description="lifecycle.summary"
        :to="localePath(getLifecyclePath(lifecycle.stem))"
        icon="i-lucide-git-fork"
        variant="subtle"
      />
    </template>
  </UPageGrid>
</template>

<style scoped>
.content-lifecycle-list { margin: 1rem 0; }
</style>
