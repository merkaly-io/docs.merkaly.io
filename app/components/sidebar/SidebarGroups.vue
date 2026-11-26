<script setup lang="ts">
import type { SidebarGroup } from '~/composables/useSidebarGroups';
import { useUIConfig } from '#imports';

const groups = defineModel<SidebarGroup[]>({ default: () => [] });

const contentNavVariants = useUIConfig('contentNavigation');
</script>

<template>
  <div class="flex flex-col gap-6">
    <section v-for="group in groups" :key="group.id">
      <p v-if="group.title" class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {{ group.title }}
      </p>

      <UContentNavigation
        :navigation="group.items"
        :highlight="contentNavVariants.highlight ?? true"
        :highlight-color="contentNavVariants.highlightColor"
        :variant="contentNavVariants.variant ?? 'link'"
        :color="contentNavVariants.color"
      />
    </section>
  </div>
</template>
