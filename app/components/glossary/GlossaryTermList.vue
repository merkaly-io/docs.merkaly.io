<script setup lang="ts">
import { computed, ref, refDebounced } from '#imports';
import type { GlossaryCollectionItem } from '@nuxt/content';
import type { PropType } from 'vue';
import type { TermType } from '#shared/utils/docs';

const terms = defineModel({ required: true, type: Array as PropType<GlossaryCollectionItem[]> });

const { localePath } = useDocusI18n();

const search = ref('');
const searchDebounced = refDebounced(search, 150);
const selectedType = ref<TermType | null>(null);

const normalizeText = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); // accents do not matter when searching

const matchingTerms = computed(() => {
  const query = normalizeText(searchDebounced.value.trim());

  return terms.value.filter(term => !query || normalizeText(`${term.name} ${term.summary} ${term.stem}`).includes(query));
});

const typeFilters = computed(() => TERM_TYPES
  .map(type => ({ count: matchingTerms.value.filter(term => term.type === type).length, type }))
  .filter(filter => filter.count));

const groups = computed(() => TERM_TYPES
  .filter(type => !selectedType.value || selectedType.value === type)
  .map(type => ({ terms: matchingTerms.value.filter(term => term.type === type), type }))
  .filter(group => group.terms.length));

function toggleType(type: TermType) {
  selectedType.value = selectedType.value === type ? null : type;
}
</script>

<template>
  <div class="glossary-term-list">
    <UInput v-model="search" icon="i-lucide-search" placeholder="Busca un término: payment.confirmed, cola, webhooks..." size="lg" />

    <div class="glossary-term-list__filters">
      <template v-for="filter in typeFilters" :key="filter.type">
        <UButton
          :color="TERM_TYPE_COLORS[filter.type]"
          :variant="selectedType === filter.type ? 'solid' : 'soft'"
          size="xs"
          @click="toggleType(filter.type)"
        >
          <span v-text="`${TERM_TYPE_LABELS[filter.type]} · ${filter.count}`" />
        </UButton>
      </template>
    </div>

    <p v-if="!groups.length" class="glossary-term-list__empty" v-text="'Ningún término coincide con la búsqueda.'" />

    <template v-for="group in groups" :key="group.type">
      <section class="glossary-term-list__group">
        <h3 v-text="TERM_TYPE_LABELS[group.type]" />

        <dl>
          <template v-for="term in group.terms" :key="term.stem">
            <div class="glossary-term-list__item">
              <dt>
                <NuxtLink :to="localePath(getTermPath(term.stem))">
                <span v-text="term.name" />
              </NuxtLink>
              </dt>

              <dd v-text="term.summary" />
            </div>
          </template>
        </dl>
      </section>
    </template>
  </div>
</template>

<style scoped>
.glossary-term-list { display: flex; flex-direction: column; gap: 14px; margin: 1rem 0; }

.glossary-term-list__filters { display: flex; flex-wrap: wrap; gap: 6px; }

.glossary-term-list__empty { color: var(--ui-text-muted); }

.glossary-term-list__group h3 { margin: 10px 0 6px; color: var(--ui-text-muted); font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }

.glossary-term-list__group dl { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; margin: 0; }

.glossary-term-list__item { padding: 10px 12px; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 10px; }

.glossary-term-list__item dt a { color: var(--ui-text-highlighted); font-family: var(--font-mono); font-size: 13px; font-weight: 600; }

.glossary-term-list__item dt a:hover { color: var(--ui-primary); }

.glossary-term-list__item dd { margin: 4px 0 0; color: var(--ui-text-muted); font-size: 13.5px; }
</style>
