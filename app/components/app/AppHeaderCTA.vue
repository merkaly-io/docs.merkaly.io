<script setup lang="ts">
import { useAppConfig, useRoute } from '#imports';

const appConfig = useAppConfig();
const route = useRoute();

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`); // the list and its pages
</script>

<template>
  <nav class="hidden lg:flex items-center gap-0.5">
    <UButton
      v-for="link in appConfig.merkaly.headerLinks"
      :key="link.to"
      :to="link.to"
      :label="link.label"
      :icon="link.icon"
      :active="isActive(link.to)"
      color="neutral"
      variant="ghost"
      active-color="primary"
      active-variant="soft"
      :ui="{ leadingIcon: 'size-4 hidden xl:inline-flex' }"
    />
  </nav>
</template>
