<script setup lang="ts">
import { computed, createError, definePageMeta, useAsyncData, useRoute, useSeoMeta } from '#imports';

definePageMeta({ layout: 'docs' });

const route = useRoute();
const { localePath } = useDocusI18n();

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const term = computed(() => findTerm(String(route.params.term), data.value!));

if (!term.value) throw createError({ fatal: true, statusCode: 404, message: 'Término no encontrado' });

const owner = computed(() => findTerm(term.value?.owner, data.value!));
const related = computed(() => getRelatedTerms(term.value!, data.value!));
const owned = computed(() => getOwnedTerms(term.value!.stem, data.value!));
const appearances = computed(() => getTermAppearances(term.value!.stem, data.value!));

useSeoMeta({
  description: () => term.value?.summary,
  title: () => term.value?.name,
});
</script>

<template>
  <UPage v-if="term">
    <UPageHeader :title="term.name" :description="term.summary" :headline="`Glosario · ${TERM_TYPE_LABELS[term.type]}`" :ui="{ title: 'font-mono' }" />

    <UPageBody>
      <p v-if="term.details" class="docs-term__details" v-text="term.details" />

      <dl class="docs-term__facts">
        <div>
          <dt v-text="'Tipo'" />

          <dd>
            <UBadge :color="TERM_TYPE_COLORS[term.type]" variant="subtle">
              <span v-text="TERM_TYPE_LABELS[term.type]" />
            </UBadge>
          </dd>
        </div>

        <div v-if="term.owner">
          <dt v-text="'Dueño'" />

          <dd>
            <GlossaryTermBadge v-if="owner" :model-value="owner" />

            <code v-else v-text="term.owner" />
          </dd>
        </div>

        <div v-if="term.source">
          <dt v-text="'En el código'" />

          <dd>
            <code v-text="term.source" />
          </dd>
        </div>
      </dl>

      <section v-if="related.length" class="docs-term__section">
        <h2 v-text="'Relacionado con'" />

        <div class="docs-term__badges">
          <template v-for="item in related" :key="item.stem">
            <GlossaryTermBadge :model-value="item" />
          </template>
        </div>
      </section>

      <section v-if="owned.length" class="docs-term__section">
        <h2 v-text="'Le pertenece'" />

        <div class="docs-term__badges">
          <template v-for="item in owned" :key="item.stem">
            <GlossaryTermBadge :model-value="item" />
          </template>
        </div>
      </section>

      <section class="docs-term__section">
        <h2 v-text="'Aparece en'" />

        <p v-if="!appearances.flows.length && !appearances.lifecycles.length" class="docs-term__empty" v-text="'Todavía no aparece en ningún flujo ni ciclo de vida.'" />

        <ul class="docs-term__appearances">
          <template v-for="flow in appearances.flows" :key="flow.stem">
            <li>
              <UIcon name="i-lucide-workflow" />

              <NuxtLink :to="localePath(getFlowPath(flow.stem))">
                <span v-text="flow.title" />
              </NuxtLink>
            </li>
          </template>

          <template v-for="lifecycle in appearances.lifecycles" :key="lifecycle.stem">
            <li>
              <UIcon name="i-lucide-git-fork" />

              <NuxtLink :to="localePath(getLifecyclePath(lifecycle.stem))">
                <span v-text="lifecycle.title" />
              </NuxtLink>
            </li>
          </template>
        </ul>
      </section>

      <UButton :to="localePath('/glosario')" icon="i-lucide-arrow-left" color="neutral" variant="link">
        <span v-text="'Volver al glosario'" />
      </UButton>
    </UPageBody>
  </UPage>
</template>

<style scoped>
.docs-term__details { margin: 0 0 1rem; }

.docs-term__facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 0 0 1.5rem; }

.docs-term__facts dt { margin-bottom: 4px; color: var(--ui-text-muted); font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }

.docs-term__facts dd { margin: 0; }

.docs-term__section { margin: 0 0 1.5rem; }

.docs-term__section h2 { margin: 0 0 8px; font-size: 1.1rem; font-weight: 600; }

.docs-term__badges { display: flex; flex-wrap: wrap; gap: 6px; }

.docs-term__empty { color: var(--ui-text-muted); }

.docs-term__appearances { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }

.docs-term__appearances li { display: flex; gap: 8px; align-items: center; }

.docs-term__appearances a { color: var(--ui-primary); }
</style>
