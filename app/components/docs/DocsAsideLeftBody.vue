<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';
import type { Ref } from 'vue';
import { inject } from '#imports';

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');
const groups = useSidebarGroups(navigation);
</script>

<template>
  <SidebarGroups :model-value="groups" />
</template>
