<script setup lang="ts">
import UiProsePre from '@nuxt/ui/components/prose/Pre.vue';

const props = defineProps({
  code: { default: '', type: String },
  language: { default: undefined, type: String },
});
</script>

<template>
  <DiagramMermaid v-if="props.language === 'mermaid'" :model-value="props.code" />

  <UiProsePre v-else :code="props.code" :language="props.language">
    <slot />
  </UiProsePre>
</template>
