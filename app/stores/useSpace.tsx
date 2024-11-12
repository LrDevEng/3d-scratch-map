import { type MutableRefObject } from 'react';
import { create } from 'zustand';

type SpaceRef = {
  spaceRef: MutableRefObject<HTMLCanvasElement | null> | null;
  update: (ref: MutableRefObject<HTMLCanvasElement | null>) => void;
};

export const useSpaceRef = create<SpaceRef>((set) => ({
  spaceRef: null,
  update: (newSpaceRef) => set({ spaceRef: newSpaceRef }),
}));
