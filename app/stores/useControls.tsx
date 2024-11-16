import { create } from 'zustand';

interface AutoRotate {
  rotate: boolean;
  update: (rotate: boolean) => void;
}

export const useAutoRotateGlobe = create<AutoRotate>((set) => ({
  rotate: true,
  update: (rotate) => set(() => ({ rotate: rotate })),
}));

export const useAutoRotateStars = create<AutoRotate>((set) => ({
  rotate: true,
  update: (rotate) => set(() => ({ rotate: rotate })),
}));

interface CameraZoomPosition {
  zoomPosition: number;
  update: (newZoomPosition: number) => void;
}

export const useCameraZoomPosition = create<CameraZoomPosition>((set) => ({
  zoomPosition: 6,
  update: (newZoomPosition) => set(() => ({ zoomPosition: newZoomPosition })),
}));
