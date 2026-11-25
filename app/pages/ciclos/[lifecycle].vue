<script setup lang="ts">
import { computed, createError, definePageMeta, useAsyncData, useRoute, useSeoMeta } from '#imports';

definePageMeta({ layout: 'docs' });

const route = useRoute();
const { localePath } = useDocusI18n();

const { data } = await useAsyncData('docs-index', loadDocsIndex);

const lifecycle = computed(() => data.value?.lifecycles.find(item => item.stem === String(route.params.lifecycle)));

if (!lifecycle.value) throw createError({ fatal: true, statusCode: 404, message: 'Ciclo de vida no encontrado' });

const entity = computed(() => findTerm(lifecycle.value?.term, data.value!));

useSeoMeta({
  description: () => lifecycle.value?.summary,
  title: () => lifecycle.value?.title,
});
</script>

<template>
  <UPage v-if="lifecycle">
    <UPageHeader :title="lifecycle.title" :description="lifecycle.summary" headline="Ciclos de vida" />

    <UPageBody>
      <div v-if="entity" class="docs-lifecycle__entity">
        <span v-text="'Entidad:'" />

        <GlossaryTermBadge :model-value="entity" />
      </div>

      <p class="docs-lifecycle__hint" v-text="'Toca un estado para ver a dónde puede ir, desde dónde llega y quién lo dispara.'" />

      <StateMachine :model-value="lifecycle" />

      <section v-if="lifecycle.flags?.length" class="docs-lifecycle__section">
        <h2 v-text="'Grupos de estados'" />

        <dl class="docs-lifecycle__flags">
          <template v-for="flag in lifecycle.flags" :key="flag.id">
            <div>
              <dt v-text="flag.label" />

              <dd v-text="flag.description" />
            </div>
          </template>
        </dl>
      </section>

      <template v-for="mapping in lifecycle.mappings ?? []" :key="mapping.title">
        <section class="docs-lifecycle__section">
          <h2 v-text="mapping.title" />

          <table class="docs-lifecycle__table">
            <thead>
              <tr>
                <th v-text="mapping.columns[0]" />

                <th v-text="mapping.columns[1]" />

                <th v-text="'Nota'" />
              </tr>
            </thead>

            <tbody>
              <template v-for="row in mapping.rows" :key="row.from">
                <tr>
                  <td>
                    <code v-text="row.from" />
                  </td>

                  <td>
                    <code v-text="row.to" />
                  </td>

                  <td v-text="row.note" />
                </tr>
              </template>
            </tbody>
          </table>
        </section>
      </template>

      <UButton :to="localePath('/ciclos')" icon="i-lucide-arrow-left" color="neutral" variant="link">
        <span v-text="'Todos los ciclos de vida'" />
      </UButton>
    </UPageBody>
  </UPage>
</template>

<style scoped>
.docs-lifecycle__entity { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; color: var(--ui-text-muted); font-size: 14px; }

.docs-lifecycle__hint { margin: 0; color: var(--ui-text-muted); font-size: 14px; }

.docs-lifecycle__section { margin: 1.5rem 0; }

.docs-lifecycle__section h2 { margin: 0 0 8px; font-size: 1.1rem; font-weight: 600; }

.docs-lifecycle__flags { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin: 0; }

.docs-lifecycle__flags div { padding: 10px 12px; border: 1px solid var(--ui-border); border-radius: 10px; }

.docs-lifecycle__flags dt { color: var(--mk-state-flag); font-weight: 600; }

.docs-lifecycle__flags dd { margin: 4px 0 0; font-size: 14px; }

.docs-lifecycle__table { width: 100%; font-size: 14px; border-collapse: collapse; }

.docs-lifecycle__table th, .docs-lifecycle__table td { padding: 8px 10px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--ui-border); }

.docs-lifecycle__table th { color: var(--ui-text-muted); font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
</style>
