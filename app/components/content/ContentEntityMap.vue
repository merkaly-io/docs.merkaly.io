<script setup lang="ts">
import { computed, useAsyncData } from '#imports';

const props = defineProps({
  domain: { required: true, type: String }, // stem of the file in data/entities
});

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const map = computed(() => data.value?.entities.find(item => item.stem === props.domain));
</script>

<template>
  <EntityMap v-if="map" :model-value="map" />

  <UAlert v-else color="warning" icon="i-lucide-triangle-alert" :title="`Mapa de entidades no encontrado: ${props.domain}`" />
</template>
