<script setup lang="ts">
import { onMounted, ref, useColorMode, useId, watch } from '#imports';

const code = defineModel({ required: true, type: String });

const colorMode = useColorMode();
const renderId = `mermaid-${useId()}`;
const svg = ref('');
const failed = ref(false);

async function renderDiagram() {
  const { default: mermaid } = await import('mermaid'); // client only and on demand: it is heavy

  mermaid.initialize({ securityLevel: 'strict', startOnLoad: false, theme: colorMode.value === 'dark' ? 'dark' : 'neutral' });

  await mermaid.render(renderId, code.value)
    .then((result) => {
      svg.value = result.svg;
      failed.value = false;
    })
    .catch(() => {
      failed.value = true; // loud: the raw code stays visible with a warning
    });
}

onMounted(renderDiagram);

watch([() => colorMode.value, code], renderDiagram);
</script>

<template>
  <div class="diagram-mermaid">
    <div v-if="svg && !failed" class="diagram-mermaid__svg" v-html="svg" />

    <template v-else>
      <UAlert v-if="failed" color="warning" icon="i-lucide-triangle-alert" title="El diagrama no se pudo dibujar" />

      <pre class="diagram-mermaid__code" v-text="code" />
    </template>
  </div>
</template>

<style scoped>
.diagram-mermaid { margin: 1.25rem 0; padding: 12px; overflow-x: auto; background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 12px; }

.diagram-mermaid__svg { display: flex; justify-content: center; }

.diagram-mermaid__svg :deep(svg) { max-width: 100%; height: auto; }

.diagram-mermaid__code { margin: 0; color: var(--ui-text-muted); font-size: 12.5px; white-space: pre; }
</style>
