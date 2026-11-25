<script setup lang="ts">
import { computed, useAsyncData } from '#imports';

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const terms = computed(() => data.value?.terms ?? []);
</script>

<template>
  <GlossaryTermList :model-value="terms" />
</template>
