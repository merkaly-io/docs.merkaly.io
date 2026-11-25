import type { LifecyclesCollectionItem } from '@nuxt/content';

export type StateMachineView = Pick<LifecyclesCollectionItem, 'flags' | 'states' | 'transitions'>;

export type MachineState = LifecyclesCollectionItem['states'][number];

export type MachineTransition = LifecyclesCollectionItem['transitions'][number];

export const STATE_LAYOUT = { cellHeight: 112, cellWidth: 196, height: 50, padding: 16, width: 156 };

type Point = readonly [number, number];

export const getStateBox = (state: MachineState) => ({
  height: STATE_LAYOUT.height,
  width: STATE_LAYOUT.width,
  x: STATE_LAYOUT.padding + state.col * STATE_LAYOUT.cellWidth + (STATE_LAYOUT.cellWidth - STATE_LAYOUT.width) / 2,
  y: STATE_LAYOUT.padding + state.row * STATE_LAYOUT.cellHeight + (STATE_LAYOUT.cellHeight - STATE_LAYOUT.height) / 2,
});

export const getMachineSize = (states: MachineState[]) => ({
  height: STATE_LAYOUT.padding * 2 + (Math.max(0, ...states.map(state => state.row)) + 1) * STATE_LAYOUT.cellHeight,
  width: STATE_LAYOUT.padding * 2 + (Math.max(0, ...states.map(state => state.col)) + 1) * STATE_LAYOUT.cellWidth,
});

const getStateCenter = (state: MachineState): Point => {
  const box = getStateBox(state);

  return [box.x + box.width / 2, box.y + box.height / 2];
};

const clipToBox = (center: Point, toward: Point): Point => { // where the line from the center leaves the box
  const dx = toward[0] - center[0];
  const dy = toward[1] - center[1];
  const scale = Math.min(STATE_LAYOUT.width / 2 / (Math.abs(dx) || 1e-6), STATE_LAYOUT.height / 2 / (Math.abs(dy) || 1e-6));

  return [center[0] + dx * Math.min(scale, 1), center[1] + dy * Math.min(scale, 1)];
};

export const getTransitionShape = (from: MachineState, to: MachineState) => {
  const start = getStateCenter(from);
  const end = getStateCenter(to);
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]) || 1;
  const bend = 18; // curves keep both directions of a pair apart
  const control: Point = [(start[0] + end[0]) / 2 - (end[1] - start[1]) / length * bend, (start[1] + end[1]) / 2 + (end[0] - start[0]) / length * bend];
  const head = clipToBox(end, control);
  const tail = clipToBox(start, control);
  const angle = Math.atan2(head[1] - control[1], head[0] - control[0]);
  const wing = (side: number) => `${head[0] - 9 * Math.cos(angle) + side * 4.5 * Math.sin(angle)},${head[1] - 9 * Math.sin(angle) - side * 4.5 * Math.cos(angle)}`;

  return {
    arrow: `${head[0]},${head[1]} ${wing(1)} ${wing(-1)}`,
    path: `M${tail[0]},${tail[1]} Q${control[0]},${control[1]} ${head[0]},${head[1]}`,
  };
};
