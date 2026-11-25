<script setup lang="ts">
import { computed, useAsyncData } from '#imports';

const props = defineProps({
  domain: { default: undefined, type: String }, // only the terms of one domain, without the domain filter
});

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const terms = computed(() => (data.value?.terms ?? []).filter(term => !props.domain || term.domain === props.domain));
</script>

<template>
  <GlossaryTermList :model-value="terms" :domains="!props.domain" />
</template>
