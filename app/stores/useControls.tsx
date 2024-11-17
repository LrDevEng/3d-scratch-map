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

interface CameraZoom {
  zoomSlider: number;
  injectSlider: boolean;
  updateSlider: (newZoom: number) => void;
  updateSliderAndInject: (newZoom: number) => void;
}

export const useCameraZoom = create<CameraZoom>((set) => ({
  zoomSlider: 5,
  injectSlider: false,
  updateSlider: (newZoom) =>
    set(() => ({ zoomSlider: newZoom, injectSlider: false })),
  updateSliderAndInject: (newZoom) =>
    set(() => ({ zoomSlider: newZoom, injectSlider: true })),
}));
