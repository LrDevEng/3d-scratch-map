import { type MutableRefObject } from 'react';
import { Mesh } from 'three';
import { create } from 'zustand';

type EarthRef = {
  earthRef: MutableRefObject<Mesh | null> | null;
  update: (ref: MutableRefObject<Mesh | null>) => void;
};

export const useEarthRef = create<EarthRef>((set) => ({
  earthRef: null,
  update: (newEarthRef) => set({ earthRef: newEarthRef }),
}));
