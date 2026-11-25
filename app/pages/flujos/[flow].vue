<script setup lang="ts">
import { computed, createError, definePageMeta, useAsyncData, useRoute, useSeoMeta } from '#imports';

definePageMeta({ layout: 'docs' });

const route = useRoute();
const { localePath } = useDocusI18n();

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const flow = computed(() => data.value?.flows.find(item => item.stem === String(route.params.flow)));
const map = computed(() => data.value?.maps.find(item => item.stem === flow.value?.map));

if (!flow.value || !map.value) throw createError({ fatal: true, statusCode: 404, message: 'Flujo no encontrado' });

const view = computed(() => buildFlowView(flow.value!, map.value!));
const terms = computed(() => {
  const stems = getFlowTermStems(flow.value!, data.value!);

  return data.value!.terms.filter(term => stems.has(term.stem));
});

useSeoMeta({
  description: () => flow.value?.summary,
  title: () => flow.value?.title,
});
</script>

<template>
  <UPage v-if="flow">
    <UPageHeader :title="flow.title" :description="flow.summary" headline="Flujos" />

    <UPageBody>
      <FlowPlayer :model-value="view" autoplay />

      <FlowLegend />

      <section v-if="terms.length" class="docs-flow__section">
        <h2 v-text="'Términos de este flujo'" />

        <div class="docs-flow__badges">
          <template v-for="term in terms" :key="term.stem">
            <GlossaryTermBadge :model-value="term" />
          </template>
        </div>
      </section>

      <UButton :to="localePath('/flujos')" icon="i-lucide-arrow-left" color="neutral" variant="link">
        <span v-text="'Todos los flujos'" />
      </UButton>
    </UPageBody>
  </UPage>
</template>

<style scoped>
.docs-flow__section { margin: 1.5rem 0; }

.docs-flow__section h2 { margin: 0 0 8px; font-size: 1.1rem; font-weight: 600; }

.docs-flow__badges { display: flex; flex-wrap: wrap; gap: 6px; }
</style>
