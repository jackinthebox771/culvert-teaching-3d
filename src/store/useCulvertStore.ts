import { create } from 'zustand'
import {
  COMPONENT_IDS,
  type CameraPresetId,
  type ClippingMode,
  type CulvertComponentId,
  type DimensionMode,
  type TransparencyMode,
  type WorkspaceMode,
} from '../types/culvert'

interface CulvertState {
  debugEnabled: boolean
  axesVisible: boolean
  gridVisible: boolean
  originsVisible: boolean
  boundingBoxesVisible: boolean
  labelsVisible: boolean
  hoveredComponentId: CulvertComponentId | null
  selectedComponentId: CulvertComponentId | null
  isolationEnabled: boolean
  cameraPreset: CameraPresetId | null
  cameraFocusRequest: { componentId: CulvertComponentId; sequence: number } | null
  cameraTelemetry: string
  explodeProgress: number
  explodeTarget: number
  explodeAnimating: boolean
  autoDemoPlaying: boolean
  transparencyMode: TransparencyMode
  clippingMode: ClippingMode
  clippingProgress: number
  dimensionMode: DimensionMode
  bottomViewEnabled: boolean
  workspaceMode: WorkspaceMode
  spotlightComponentIds: CulvertComponentId[] | null
  guidedTourActive: boolean
  guidedTourStep: number
  visibility: Record<CulvertComponentId, boolean>
  toggleDebug: () => void
  setDebugOption: (key: 'axesVisible' | 'gridVisible' | 'originsVisible' | 'boundingBoxesVisible' | 'labelsVisible', value: boolean) => void
  setHoveredComponentId: (id: CulvertComponentId | null) => void
  setSelectedComponentId: (id: CulvertComponentId | null) => void
  clearSelection: () => void
  toggleIsolation: () => void
  showAllComponents: () => void
  requestCameraFocus: (id: CulvertComponentId) => void
  setCameraPreset: (preset: CameraPresetId) => void
  setCameraTelemetry: (telemetry: string) => void
  setComponentVisible: (id: CulvertComponentId, visible: boolean) => void
  setExplodeProgress: (progress: number) => void
  setExplodeProgressFromAnimation: (progress: number) => void
  animateExplodeTo: (progress: number) => void
  setExplodeAnimating: (animating: boolean) => void
  setAutoDemoPlaying: (playing: boolean) => void
  stepExplode: () => void
  setTransparencyMode: (mode: TransparencyMode) => void
  setClippingMode: (mode: ClippingMode) => void
  setClippingProgress: (progress: number) => void
  setDimensionMode: (mode: DimensionMode) => void
  setBottomViewEnabled: (enabled: boolean) => void
  setWorkspaceMode: (mode: WorkspaceMode) => void
  startGuidedTour: () => void
  setGuidedTourStep: (step: number) => void
  stopGuidedTour: () => void
}

const initialVisibility = Object.fromEntries(COMPONENT_IDS.map((id) => [id, true])) as Record<CulvertComponentId, boolean>

export const useCulvertStore = create<CulvertState>((set) => ({
  debugEnabled: true,
  axesVisible: true,
  gridVisible: true,
  originsVisible: false,
  boundingBoxesVisible: false,
  labelsVisible: true,
  hoveredComponentId: null,
  selectedComponentId: null,
  isolationEnabled: false,
  cameraPreset: 'isometric',
  cameraFocusRequest: null,
  cameraTelemetry: 'x -36.00 · y 25.00 · z -41.00',
  explodeProgress: 0,
  explodeTarget: 0,
  explodeAnimating: false,
  autoDemoPlaying: false,
  transparencyMode: 'solid',
  clippingMode: 'off',
  clippingProgress: 0.5,
  dimensionMode: 'off',
  bottomViewEnabled: false,
  workspaceMode: 'model',
  spotlightComponentIds: null,
  guidedTourActive: false,
  guidedTourStep: 0,
  visibility: initialVisibility,
  toggleDebug: () => set((state) => ({ debugEnabled: !state.debugEnabled })),
  setDebugOption: (key, value) => set({ [key]: value }),
  setHoveredComponentId: (hoveredComponentId) => set({ hoveredComponentId }),
  setSelectedComponentId: (selectedComponentId) => set({ selectedComponentId, spotlightComponentIds: null }),
  clearSelection: () => set({ selectedComponentId: null, hoveredComponentId: null, isolationEnabled: false, spotlightComponentIds: null }),
  toggleIsolation: () => set((state) => ({ isolationEnabled: state.selectedComponentId ? !state.isolationEnabled : false })),
  showAllComponents: () => set({ visibility: initialVisibility, isolationEnabled: false }),
  requestCameraFocus: (componentId) => set((state) => ({
    selectedComponentId: componentId,
    cameraPreset: null,
    cameraFocusRequest: { componentId, sequence: (state.cameraFocusRequest?.sequence ?? 0) + 1 },
  })),
  setCameraPreset: (cameraPreset) => set({
    cameraPreset,
    cameraFocusRequest: null,
    spotlightComponentIds: null,
    bottomViewEnabled: cameraPreset === 'bottom',
  }),
  setCameraTelemetry: (cameraTelemetry) => set({ cameraTelemetry }),
  setComponentVisible: (id, visible) => set((state) => ({
    visibility: { ...state.visibility, [id]: visible },
    selectedComponentId: !visible && state.selectedComponentId === id ? null : state.selectedComponentId,
    hoveredComponentId: !visible && state.hoveredComponentId === id ? null : state.hoveredComponentId,
    isolationEnabled: !visible && state.selectedComponentId === id ? false : state.isolationEnabled,
  })),
  setExplodeProgress: (progress) => {
    const clamped = Math.min(1, Math.max(0, progress))
    set((state) => ({
      explodeProgress: clamped,
      explodeTarget: clamped,
      explodeAnimating: false,
      autoDemoPlaying: false,
      bottomViewEnabled: false,
      cameraPreset: state.bottomViewEnabled ? 'isometric' : state.cameraPreset,
      dimensionMode: state.bottomViewEnabled ? 'off' : state.dimensionMode,
      selectedComponentId: state.bottomViewEnabled ? null : state.selectedComponentId,
      hoveredComponentId: state.bottomViewEnabled ? null : state.hoveredComponentId,
    }))
  },
  setExplodeProgressFromAnimation: (progress) => set({ explodeProgress: Math.min(1, Math.max(0, progress)) }),
  animateExplodeTo: (progress) => set((state) => ({
    explodeTarget: Math.min(1, Math.max(0, progress)),
    explodeAnimating: true,
    autoDemoPlaying: false,
    isolationEnabled: false,
    bottomViewEnabled: false,
    cameraPreset: state.bottomViewEnabled ? 'isometric' : state.cameraPreset,
    dimensionMode: state.bottomViewEnabled ? 'off' : state.dimensionMode,
    selectedComponentId: state.bottomViewEnabled ? null : state.selectedComponentId,
    hoveredComponentId: state.bottomViewEnabled ? null : state.hoveredComponentId,
  })),
  setExplodeAnimating: (explodeAnimating) => set({ explodeAnimating }),
  setAutoDemoPlaying: (autoDemoPlaying) => set((state) => ({
    autoDemoPlaying,
    explodeAnimating: false,
    isolationEnabled: false,
    bottomViewEnabled: false,
    cameraPreset: state.bottomViewEnabled ? 'isometric' : state.cameraPreset,
    dimensionMode: state.bottomViewEnabled ? 'off' : state.dimensionMode,
    selectedComponentId: state.bottomViewEnabled ? null : state.selectedComponentId,
    hoveredComponentId: state.bottomViewEnabled ? null : state.hoveredComponentId,
  })),
  stepExplode: () => set((state) => ({
    explodeTarget: Math.min(1, (Math.floor(state.explodeProgress * 4 + 0.001) + 1) / 4),
    explodeAnimating: state.explodeProgress < 1,
    autoDemoPlaying: false,
    isolationEnabled: false,
    bottomViewEnabled: false,
    cameraPreset: state.bottomViewEnabled ? 'isometric' : state.cameraPreset,
    dimensionMode: state.bottomViewEnabled ? 'off' : state.dimensionMode,
    selectedComponentId: state.bottomViewEnabled ? null : state.selectedComponentId,
    hoveredComponentId: state.bottomViewEnabled ? null : state.hoveredComponentId,
  })),
  setTransparencyMode: (transparencyMode) => set({ transparencyMode }),
  setClippingMode: (clippingMode) => set((state) => ({
    clippingMode,
    clippingProgress: clippingMode === 'off' ? state.clippingProgress : 0.5,
    bottomViewEnabled: clippingMode === 'off' ? state.bottomViewEnabled : false,
    cameraPreset: clippingMode !== 'off' && state.bottomViewEnabled ? 'isometric' : state.cameraPreset,
    dimensionMode: clippingMode !== 'off' && state.bottomViewEnabled ? 'off' : state.dimensionMode,
    selectedComponentId: clippingMode !== 'off' && state.bottomViewEnabled ? null : state.selectedComponentId,
    hoveredComponentId: clippingMode !== 'off' && state.bottomViewEnabled ? null : state.hoveredComponentId,
  })),
  setClippingProgress: (progress) => set({ clippingProgress: Math.min(1, Math.max(0, progress)) }),
  setDimensionMode: (dimensionMode) => set({ dimensionMode }),
  setBottomViewEnabled: (bottomViewEnabled) => set({
    bottomViewEnabled,
    selectedComponentId: bottomViewEnabled ? 'bottom-slab' : null,
    isolationEnabled: false,
    clippingMode: 'off',
    dimensionMode: bottomViewEnabled ? 'component' : 'off',
    explodeProgress: 0,
    explodeTarget: 0,
    explodeAnimating: false,
    autoDemoPlaying: false,
    cameraPreset: bottomViewEnabled ? 'bottom' : 'isometric',
    cameraFocusRequest: null,
    transparencyMode: 'solid',
  }),
  setWorkspaceMode: (workspaceMode) => set((state) => ({
    workspaceMode,
    explodeProgress: workspaceMode === 'projection' ? 0 : state.explodeProgress,
    explodeTarget: workspaceMode === 'projection' ? 0 : state.explodeTarget,
    explodeAnimating: false,
    autoDemoPlaying: false,
    bottomViewEnabled: false,
    clippingMode: 'off',
    dimensionMode: 'off',
    transparencyMode: 'solid',
    isolationEnabled: false,
    cameraFocusRequest: null,
    spotlightComponentIds: null,
  })),
  startGuidedTour: () => set({
    guidedTourActive: true,
    guidedTourStep: 0,
    workspaceMode: 'model',
    selectedComponentId: null,
    hoveredComponentId: null,
    isolationEnabled: false,
    cameraPreset: 'isometric',
    cameraFocusRequest: null,
    spotlightComponentIds: null,
    explodeProgress: 0,
    explodeTarget: 0,
    explodeAnimating: false,
    autoDemoPlaying: false,
    transparencyMode: 'solid',
    clippingMode: 'off',
    dimensionMode: 'off',
    bottomViewEnabled: false,
  }),
  setGuidedTourStep: (requestedStep) => set((state) => {
    const guidedTourStep = Math.min(6, Math.max(0, requestedStep))
    const common = {
      guidedTourStep,
      hoveredComponentId: null,
      explodeProgress: 0,
      explodeTarget: 0,
      explodeAnimating: false,
      autoDemoPlaying: false,
      transparencyMode: 'solid' as const,
      dimensionMode: 'off' as const,
      bottomViewEnabled: false,
      cameraFocusRequest: null,
      spotlightComponentIds: null,
    }
    if (guidedTourStep === 1) return {
      ...common,
      workspaceMode: 'model' as const,
      selectedComponentId: 'bottom-slab' as const,
      isolationEnabled: false,
      cameraPreset: 'bottom' as const,
      bottomViewEnabled: true,
      dimensionMode: 'component' as const,
      clippingMode: 'off' as const,
    }
    if (guidedTourStep === 2) return {
      ...common,
      workspaceMode: 'model' as const,
      selectedComponentId: 'barrel' as const,
      isolationEnabled: true,
      cameraPreset: null,
      clippingMode: 'cross' as const,
      clippingProgress: 0.5,
      cameraFocusRequest: { componentId: 'barrel' as const, sequence: (state.cameraFocusRequest?.sequence ?? 0) + 1 },
    }
    if (guidedTourStep === 3) return {
      ...common,
      workspaceMode: 'model' as const,
      selectedComponentId: 'front-headwall' as const,
      isolationEnabled: true,
      cameraPreset: null,
      clippingMode: 'off' as const,
      cameraFocusRequest: { componentId: 'front-headwall' as const, sequence: (state.cameraFocusRequest?.sequence ?? 0) + 1 },
    }
    if (guidedTourStep === 4) return {
      ...common,
      workspaceMode: 'model' as const,
      selectedComponentId: null,
      isolationEnabled: false,
      cameraPreset: 'wingWallPlan' as const,
      clippingMode: 'off' as const,
      spotlightComponentIds: [
        'front-left-wing-wall',
        'front-right-wing-wall',
        'rear-left-wing-wall',
        'rear-right-wing-wall',
      ] as CulvertComponentId[],
    }
    if (guidedTourStep === 5) return {
      ...common,
      workspaceMode: 'projection' as const,
      selectedComponentId: null,
      isolationEnabled: false,
      cameraPreset: 'isometric' as const,
      clippingMode: 'off' as const,
    }
    return {
      ...common,
      workspaceMode: 'model' as const,
      selectedComponentId: null,
      isolationEnabled: false,
      cameraPreset: 'isometric' as const,
      clippingMode: 'off' as const,
    }
  }),
  stopGuidedTour: () => set({
    guidedTourActive: false,
    guidedTourStep: 0,
    workspaceMode: 'model',
    selectedComponentId: null,
    hoveredComponentId: null,
    isolationEnabled: false,
    cameraPreset: 'isometric',
    cameraFocusRequest: null,
    spotlightComponentIds: null,
    explodeProgress: 0,
    explodeTarget: 0,
    explodeAnimating: false,
    autoDemoPlaying: false,
    transparencyMode: 'solid',
    clippingMode: 'off',
    dimensionMode: 'off',
    bottomViewEnabled: false,
  }),
}))
