import { BookOpenCheck, GraduationCap, Grid2X2, Info } from 'lucide-react'
import { useEffect } from 'react'
import { ProjectionWorkspace } from '../projection/ProjectionWorkspace'
import { CulvertScene } from '../scene/CulvertScene'
import { useCulvertStore } from '../store/useCulvertStore'
import { ComponentInfoCard } from '../ui/ComponentInfoCard'
import { ComponentTree } from '../ui/ComponentTree'
import { DebugPanel } from '../ui/DebugPanel'
import { ExplodeControls } from '../ui/ExplodeControls'
import { GuidedTour } from '../ui/GuidedTour'
import { TeachingControls } from '../ui/TeachingControls'
import { ViewPresetBar } from '../ui/ViewPresetBar'

export default function App() {
  const clearSelection = useCulvertStore((state) => state.clearSelection)
  const workspaceMode = useCulvertStore((state) => state.workspaceMode)
  const setWorkspaceMode = useCulvertStore((state) => state.setWorkspaceMode)
  const guidedTourActive = useCulvertStore((state) => state.guidedTourActive)
  const startGuidedTour = useCulvertStore((state) => state.startGuidedTour)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearSelection()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [clearSelection])

  return (
    <main className="blueprint-grid relative h-full w-full bg-[#06121f]">
      {workspaceMode === 'model' && (
        <div className="absolute inset-0">
          <CulvertScene />
        </div>
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5">
        <div>
          <div className="mb-1 flex items-center gap-2 text-cyan-300">
            <BookOpenCheck size={18} />
            <span className="text-[10px] font-semibold uppercase tracking-[.24em]">Engineering Graphics Lab</span>
          </div>
          <h1 className="text-xl font-semibold tracking-wide text-slate-50">涵洞三维结构教学</h1>
          <p className="mt-1 text-xs text-slate-500">Phase 6A · 5 分钟结构导览</p>
        </div>
        <div className="flex items-start gap-2">
          {!guidedTourActive && (
            <button
              type="button"
              onClick={startGuidedTour}
              className="glass pointer-events-auto flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-amber-100 transition hover:border-amber-300/35 hover:bg-amber-300/10"
            >
              <GraduationCap size={15} /> 开始 5 分钟结构导览
            </button>
          )}
          {workspaceMode === 'model' && !guidedTourActive && (
            <button
              type="button"
              onClick={() => setWorkspaceMode('projection')}
              className="glass pointer-events-auto flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
            >
              <Grid2X2 size={15} /> 进入三面投影图
            </button>
          )}
          <div className="glass hidden max-w-sm items-start gap-2 rounded-xl px-3 py-2 text-[11px] leading-relaxed text-slate-400 2xl:flex">
            <Info size={15} className="mt-0.5 shrink-0 text-cyan-300" />
            三个投影视窗使用正交相机，四个视窗共享构件选择状态。
          </div>
        </div>
      </header>

      {workspaceMode === 'model' ? (
        <>
          {!guidedTourActive && (
            <div className="pointer-events-none absolute inset-x-0 top-28 z-10 flex items-start justify-between px-5">
              <ComponentTree />
              <div className="flex max-h-[calc(100vh-10rem)] flex-col gap-3 overflow-y-auto pb-2">
                <DebugPanel />
                <ComponentInfoCard />
              </div>
            </div>
          )}

          {!guidedTourActive && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
              <TeachingControls />
              <ExplodeControls />
              <ViewPresetBar />
            </div>
          )}

          <div className="pointer-events-none absolute bottom-5 left-5 hidden text-[10px] leading-relaxed text-slate-600 md:block">
            左键旋转 · 点击构件选择 · Esc 取消<br />滚轮缩放 · 右键平移 · 坐标：X 横向 · Y 竖直 · Z 涵洞纵向
          </div>
        </>
      ) : (
        <ProjectionWorkspace />
      )}
      <GuidedTour />
    </main>
  )
}
