import { BookOpenCheck, GraduationCap, Grid2X2, Info, Trophy } from 'lucide-react'
import { useEffect } from 'react'
import { ProjectionWorkspace } from '../projection/ProjectionWorkspace'
import { CulvertScene } from '../scene/CulvertScene'
import { useCulvertStore } from '../store/useCulvertStore'
import { ComponentInfoCard } from '../ui/ComponentInfoCard'
import { ComponentTree } from '../ui/ComponentTree'
import { ClassroomChallenge } from '../ui/ClassroomChallenge'
import { DebugPanel } from '../ui/DebugPanel'
import { EngineeringCommandDeck } from '../ui/EngineeringCommandDeck'
import { GuidedTour } from '../ui/GuidedTour'
import { MobileControls } from '../ui/MobileControls'

export default function App() {
  const clearSelection = useCulvertStore((state) => state.clearSelection)
  const workspaceMode = useCulvertStore((state) => state.workspaceMode)
  const setWorkspaceMode = useCulvertStore((state) => state.setWorkspaceMode)
  const guidedTourActive = useCulvertStore((state) => state.guidedTourActive)
  const startGuidedTour = useCulvertStore((state) => state.startGuidedTour)
  const classroomChallengeActive = useCulvertStore((state) => state.classroomChallengeActive)
  const startClassroomChallenge = useCulvertStore((state) => state.startClassroomChallenge)

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

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 sm:p-5">
        <div>
          <div className="mb-1 flex items-center gap-2 text-cyan-300">
            <BookOpenCheck size={16} />
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.24em] sm:inline">Engineering Graphics Lab</span>
          </div>
          <h1 className="whitespace-nowrap text-base font-semibold tracking-wide text-slate-50 sm:text-xl">涵洞三维结构教学</h1>
          <div className="mt-1 flex items-center gap-2 text-[10px] sm:text-xs">
            <span className="font-medium text-cyan-300/75">工程仪表盘</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-500">Phase 6C · 移动端适配</span>
          </div>
        </div>
        <div className="flex items-start gap-1.5 sm:gap-2">
          {!guidedTourActive && !classroomChallengeActive && (
            <button
              type="button"
              onClick={startGuidedTour}
              aria-label="开始 5 分钟结构导览"
              title="开始 5 分钟结构导览"
              className="glass pointer-events-auto flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-xl px-2.5 text-xs text-amber-100 transition hover:border-amber-300/35 hover:bg-amber-300/10 sm:px-3"
            >
              <GraduationCap size={15} /><span className="hidden lg:inline">开始 5 分钟结构导览</span>
            </button>
          )}
          {!guidedTourActive && !classroomChallengeActive && (
            <button
              type="button"
              onClick={startClassroomChallenge}
              aria-label="进入课堂挑战"
              title="进入课堂挑战"
              className="glass pointer-events-auto flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-xl px-2.5 text-xs text-amber-100 transition hover:border-amber-300/35 hover:bg-amber-300/10 sm:px-3"
            >
              <Trophy size={15} /><span className="hidden lg:inline">进入课堂挑战</span>
            </button>
          )}
          {workspaceMode === 'model' && !guidedTourActive && !classroomChallengeActive && (
            <button
              type="button"
              onClick={() => setWorkspaceMode('projection')}
              aria-label="进入三面投影图"
              title="进入三面投影图"
              className="glass pointer-events-auto flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-xl px-2.5 text-xs text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 sm:px-3"
            >
              <Grid2X2 size={15} /><span className="hidden lg:inline">进入三面投影图</span>
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
          {!guidedTourActive && !classroomChallengeActive && (
            <div className="pointer-events-none absolute inset-x-0 top-28 z-10 hidden items-start justify-between px-5 md:flex">
              <ComponentTree />
              <div className="flex max-h-[calc(100vh-18rem)] flex-col gap-3 overflow-y-auto pb-2">
                <DebugPanel />
                <ComponentInfoCard />
              </div>
            </div>
          )}

          {!guidedTourActive && !classroomChallengeActive && (
            <div className="pointer-events-none absolute inset-x-5 bottom-4 z-10 hidden md:block">
              <EngineeringCommandDeck />
            </div>
          )}

          {!guidedTourActive && !classroomChallengeActive && <MobileControls />}

          <div className="pointer-events-none absolute bottom-44 left-5 hidden text-[9px] leading-relaxed text-slate-600 xl:block">
            左键旋转 · 点击构件选择 · Esc 取消<br />滚轮缩放 · 右键平移 · 坐标：X 横向 · Y 竖直 · Z 涵洞纵向
          </div>
        </>
      ) : (
        <ProjectionWorkspace />
      )}
      <GuidedTour />
      <ClassroomChallenge />
    </main>
  )
}
