import type { EntitiesCollectionItem } from '@nuxt/content';

export type EntityMapView = Pick<EntitiesCollectionItem, 'entities' | 'relations'>;

export type MapEntity = EntitiesCollectionItem['entities'][number];

export type MapRelation = EntitiesCollectionItem['relations'][number];

export const ENTITY_LAYOUT = { cellHeight: 136, cellWidth: 250, height: 58, padding: 18, width: 168 };

type Point = readonly [number, number];

export const getEntityBox = (entity: MapEntity) => ({
  height: ENTITY_LAYOUT.height,
  width: ENTITY_LAYOUT.width,
  x: ENTITY_LAYOUT.padding + entity.col * ENTITY_LAYOUT.cellWidth + (ENTITY_LAYOUT.cellWidth - ENTITY_LAYOUT.width) / 2,
  y: ENTITY_LAYOUT.padding + entity.row * ENTITY_LAYOUT.cellHeight + (ENTITY_LAYOUT.cellHeight - ENTITY_LAYOUT.height) / 2,
});

export const getEntityMapSize = (entities: MapEntity[]) => ({
  height: ENTITY_LAYOUT.padding * 2 + (Math.max(0, ...entities.map(entity => entity.row)) + 1) * ENTITY_LAYOUT.cellHeight,
  width: ENTITY_LAYOUT.padding * 2 + (Math.max(0, ...entities.map(entity => entity.col)) + 1) * ENTITY_LAYOUT.cellWidth,
});

const getEntityCenter = (entity: MapEntity): Point => {
  const box = getEntityBox(entity);

  return [box.x + box.width / 2, box.y + box.height / 2];
};

const clipToEntity = (center: Point, toward: Point): Point => { // where the line from the center leaves the box
  const dx = toward[0] - center[0];
  const dy = toward[1] - center[1];
  const scale = Math.min(ENTITY_LAYOUT.width / 2 / (Math.abs(dx) || 1e-6), ENTITY_LAYOUT.height / 2 / (Math.abs(dy) || 1e-6));

  return [center[0] + dx * Math.min(scale, 1), center[1] + dy * Math.min(scale, 1)];
};

const getUnit = (start: Point, end: Point): Point => {
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]) || 1;

  return [(end[0] - start[0]) / length, (end[1] - start[1]) / length];
};

export const getRelationShape = (from: MapEntity, to: MapEntity) => {
  const tail = clipToEntity(getEntityCenter(from), getEntityCenter(to));
  const head = clipToEntity(getEntityCenter(to), getEntityCenter(from));

  const [ux, uy] = getUnit(tail, head);
  const side: Point = [uy * 9, -ux * 9]; // marks sit beside the line, the verb tag stays on it

  return {
    fromMark: [tail[0] + ux * 12 + side[0], tail[1] + uy * 12 + side[1]] as Point, // cardinality on each end
    middle: [(tail[0] + head[0]) / 2, (tail[1] + head[1]) / 2] as Point,
    path: `M${tail[0]},${tail[1]} L${head[0]},${head[1]}`,
    toMark: [head[0] - ux * 12 + side[0], head[1] - uy * 12 + side[1]] as Point,
  };
};
