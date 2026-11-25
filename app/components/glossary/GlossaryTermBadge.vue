<script setup lang="ts">
import type { GlossaryCollectionItem } from '@nuxt/content';
import type { PropType } from 'vue';

const term = defineModel({ required: true, type: Object as PropType<GlossaryCollectionItem> });

const { localePath } = useDocusI18n();
</script>

<template>
  <UButton
    :to="localePath(getTermPath(term.stem))"
    :color="TERM_TYPE_COLORS[term.type]"
    :title="term.summary"
    variant="soft"
    size="xs"
    class="glossary-term-badge"
  >
    <span v-text="term.name" />
  </UButton>
</template>

<style scoped>
.glossary-term-badge { font-family: var(--font-mono); }
</style>
