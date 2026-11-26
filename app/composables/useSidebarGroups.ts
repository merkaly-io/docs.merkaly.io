import type { ContentNavigationItem } from '@nuxt/content';
import type { Ref } from 'vue';
import { computed, useAppConfig, useRoute } from '#imports';

export interface SidebarGroup {
  id: string;
  items: ContentNavigationItem[];
  title?: string;
}

const hasPath = (item: ContentNavigationItem, path: string): boolean => item.path === path || Boolean(item.children?.some(child => hasPath(child, path)));

const markCollapsible = (items: ContentNavigationItem[], path: string): ContentNavigationItem[] => items.map((item) => {
  const children = item.children && markCollapsible(item.children, path);

  if (item.defaultOpen !== false) return { ...item, children };

  return { // `defaultOpen: false` in .navigation.yml: closed with a chevron, open when it holds the current page
    ...item,
    children,
    defaultOpen: hasPath(item, path) ? undefined : false,
    ui: { linkTrailing: 'inline-flex' }, // Docus hides the chevron of every folder
  };
});

// Groups the top level of the content navigation by its `group` (set in .navigation.yml or the page navigation), without touching paths
export const useSidebarGroups = (navigation?: Ref<ContentNavigationItem[] | null | undefined>) => {
  const appConfig = useAppConfig();
  const route = useRoute();

  return computed<SidebarGroup[]>(() => {
    const items = markCollapsible(navigation?.value ?? [], route.path);
    const groups = appConfig.merkaly.sidebarGroups.map(group => ({
      id: group.id,
      items: [...(group.links ?? []) as ContentNavigationItem[], ...items.filter(item => item.group === group.id)],
      title: group.title,
    }));
    const ungrouped = items.filter(item => !groups.some(group => group.id === item.group)); // never hide a page: it shows last, without a title

    return ungrouped.length ? [...groups, { id: 'otros', items: ungrouped }] : groups;
  });
};
