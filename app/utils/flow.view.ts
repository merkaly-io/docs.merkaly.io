import type { FlowsCollectionItem, MapsCollectionItem } from '@nuxt/content';

export type FlowNode = MapsCollectionItem['nodes'][number];

export type FlowStep = FlowsCollectionItem['steps'][number];

export interface FlowView {
  columns: NonNullable<MapsCollectionItem['columns']>;
  height: number;
  nodes: FlowNode[];
  steps: FlowStep[];
  width: number;
}

export type FlowSegment = [number, number, number, number];

export const buildFlowView = (flow: FlowsCollectionItem, map: MapsCollectionItem): FlowView => ({
  columns: map.columns ?? [],
  height: map.height,
  nodes: map.nodes,
  steps: flow.steps,
  width: map.width,
});

export const getEdgeKey = (from: string, to: string) => [from, to].sort().join('|'); // one line per pair, both directions

const getCenter = (node: FlowNode) => [node.x + node.w / 2, node.y + node.h / 2] as const;

const getAnchor = (node: FlowNode, target: FlowNode) => {
  const [cx, cy] = getCenter(node);
  const [tx, ty] = getCenter(target);
  const dx = tx - cx;
  const dy = ty - cy;

  if (Math.abs(dx) > Math.abs(dy) * 0.9 || node.kind === 'gate' || node.kind === 'service') { // tall nodes always connect on the side
    const y = Math.max(node.y + 10, Math.min(node.y + node.h - 10, ty));

    return [dx > 0 ? node.x + node.w : node.x, y] as const;
  }

  return [cx, dy > 0 ? node.y + node.h : node.y] as const;
};

export const getSegment = (from: FlowNode, to: FlowNode): FlowSegment => {
  const [x1, y1] = getAnchor(from, to);
  const [x2, y2] = getAnchor(to, from);
  const direction = from.id === [from.id, to.id].sort()[0] ? 1 : -1; // both directions share the line, slightly apart
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ox = -(y2 - y1) / length * 5 * direction;
  const oy = (x2 - x1) / length * 5 * direction;

  return [x1 + ox, y1 + oy, x2 + ox, y2 + oy];
};

export const getLabelWidth = (label: string) => label.length * 6.4 + 10; // monospace estimate, no DOM measuring
