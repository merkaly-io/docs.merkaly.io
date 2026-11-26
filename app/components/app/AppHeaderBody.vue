<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';
import type { Ref } from 'vue';
import { inject, useAppConfig, useRoute } from '#imports';

const appConfig = useAppConfig();
const route = useRoute();
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');
const groups = useSidebarGroups(navigation);
</script>

<template>
  <nav class="flex flex-wrap gap-1 mb-4">
    <UButton
      v-for="link in appConfig.merkaly.headerLinks"
      :key="link.to"
      :to="link.to"
      :label="link.label"
      :icon="link.icon"
      :active="route.path === link.to || route.path.startsWith(`${link.to}/`)"
      color="neutral"
      variant="soft"
      active-color="primary"
      size="sm"
    />
  </nav>

  <SidebarGroups :model-value="groups" />
</template>
