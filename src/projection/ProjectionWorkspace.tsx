import { View } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Box, Grid2X2, Pause, Play, RotateCcw } from 'lucide-react'
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { COMPONENT_INFO } from '../config/componentInfo'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useCulvertStore } from '../store/useCulvertStore'
import { ProjectionScene, type ProjectionViewId } from './ProjectionViewport'

const ANIMATION_DURATION_MS = 8000

const PANELS: ReadonlyArray<{
  id: ProjectionViewId
  title: string
  note: string
  range: [number, number]
}> = [
  { id: 'front', title: '正面投影图', note: '正交相机 · 从 −X 侧观察', range: [0.14, 0.48] },
  { id: 'side', title: '侧面投影图', note: '正交相机 · 沿 Z 轴投射', range: [0.4, 0.72] },
  { id: 'horizontal', title: '水平投影图', note: '正交相机 · 沿 Y 轴投射', range: [0.64, 0.94] },
  { id: 'isometric', title: '三维轴测图', note: '透视相机 · 可旋转观察', range: [0, 0] },
]

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function stageLabel(progress: number) {
  if (progress >= 1) return '三面投影已生成，可在任一视窗选择构件'
  if (progress < 0.14) return '建立投影方向与投影面'
  if (progress < 0.48) return '沿 X 轴生成正面投影图'
  if (progress < 0.72) return '沿 Z 轴生成侧面投影图'
  return '沿 Y 轴生成水平投影图'
}

export function ProjectionWorkspace() {
  const compact = useMediaQuery('(max-width: 767px)')
  const setWorkspaceMode = useCulvertStore((state) => state.setWorkspaceMode)
  const selectedComponentId = useCulvertStore((state) => state.selectedComponentId)
  const [progress, setProgress] = useState(1)
  const [playing, setPlaying] = useState(false)
  const startRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const progressRef = useRef(1)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playing) return
    const initialProgress = progressRef.current
    startRef.current = performance.now() - initialProgress * ANIMATION_DURATION_MS
    const tick = (now: number) => {
      const next = clamp01((now - startRef.current) / ANIMATION_DURATION_MS)
      progressRef.current = next
      setProgress(next)
      if (next < 1) frameRef.current = requestAnimationFrame(tick)
      else setPlaying(false)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [playing])

  const selectedName = selectedComponentId ? COMPONENT_INFO[selectedComponentId].name : '未选择构件'
  const guideProgress = Math.min(1, progress / 0.94)
  const guideDash = 1 - guideProgress
  const panelReveal = useMemo(() => Object.fromEntries(PANELS.map((panel) => {
    if (panel.id === 'isometric') return [panel.id, 1]
    const [start, end] = panel.range
    return [panel.id, clamp01((progress - start) / (end - start))]
  })) as Record<ProjectionViewId, number>, [progress])

  const restart = () => {
    progressRef.current = 0
    setProgress(0)
    setPlaying(true)
  }

  return (
    <section className="absolute inset-x-2 bottom-2 top-[4.5rem] flex flex-col gap-2 sm:inset-x-4 sm:bottom-4 sm:top-20 sm:gap-3">
      <div className="glass pointer-events-auto flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 sm:px-4 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Grid2X2 size={16} className="shrink-0 text-cyan-300 sm:h-[18px] sm:w-[18px]" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 truncate text-xs font-semibold text-slate-100 sm:text-sm">
              <span className="truncate">三面投影图与三维模型联动</span>
              <span className="hidden rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-200 sm:inline">组合状态</span>
            </div>
            <p className="hidden truncate text-[11px] text-slate-400 sm:block">{stageLabel(progress)} · 当前：{selectedName}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              if (playing) setPlaying(false)
              else if (progress >= 1) restart()
              else setPlaying(true)
            }}
            aria-label={playing ? '暂停投影生成' : progress < 1 ? '继续生成投影' : '重新生成投影'}
            title={playing ? '暂停' : progress < 1 ? '继续生成' : '重新生成投影'}
            className="flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-2 text-xs text-cyan-100 transition hover:bg-cyan-400/18 sm:px-3"
          >
            {playing ? <Pause size={14} /> : progress < 1 ? <Play size={14} /> : <RotateCcw size={14} />}
            <span className="hidden sm:inline">{playing ? '暂停' : progress < 1 ? '继续生成' : '重新生成投影'}</span>
          </button>
          <button
            type="button"
            onClick={() => setWorkspaceMode('model')}
            aria-label="返回三维模型"
            title="返回三维模型"
            className="flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-lg border border-white/10 px-2 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-3"
          >
            <Box size={14} /><span className="hidden sm:inline">返回三维模型</span>
          </button>
        </div>
      </div>

      <div ref={gridRef} className="relative grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2">
        <Canvas
          className="!pointer-events-none !absolute !inset-0 z-10"
          dpr={compact ? [1, 1.2] : [1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          eventSource={gridRef as RefObject<HTMLElement>}
          eventPrefix="client"
        >
          <Suspense fallback={null}>
            <View.Port />
          </Suspense>
        </Canvas>
        <svg className={`pointer-events-none absolute inset-0 z-20 h-full w-full transition-opacity ${playing || progress < 1 ? 'opacity-70' : 'opacity-0'}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="#67e8f9" strokeWidth="0.18" strokeDasharray="1" strokeDashoffset={guideDash}>
            <path d="M75 75 L25 25" />
            <path d="M75 75 L75 25" />
            <path d="M75 75 L25 75" />
          </g>
          <circle cx="75" cy="75" r="1.1" fill="#67e8f9" opacity="0.8" />
        </svg>

        {PANELS.map((panel) => {
          const reveal = panelReveal[panel.id]
          return (
            <article key={panel.id} className="projection-panel relative min-h-0 overflow-hidden rounded-xl border border-cyan-300/15 bg-[#071827]/90">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between bg-gradient-to-b from-slate-950/85 to-transparent px-2 py-2 sm:px-3 sm:py-2.5">
                <div>
                  <h2 className="text-xs font-semibold tracking-wide text-cyan-50">{panel.title}</h2>
                  <p className="mt-0.5 hidden text-[9px] uppercase tracking-[.16em] text-cyan-300/55 sm:block">{panel.note}</p>
                </div>
                {panel.id !== 'isometric' && <span className="hidden rounded border border-cyan-300/15 px-1.5 py-0.5 text-[9px] text-cyan-200/60 sm:inline">ORTHOGRAPHIC</span>}
              </div>
              <View className="absolute inset-0 z-10">
                <ProjectionScene view={panel.id} reveal={reveal} />
              </View>
              {panel.id !== 'isometric' && reveal < 0.98 && (
                <div className="projection-plane pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity" style={{ opacity: 1 - reveal }}>
                  <span className="rounded border border-cyan-300/20 bg-slate-950/65 px-3 py-1 text-[10px] tracking-[.2em] text-cyan-200/70">投影面</span>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <div className="glass flex h-8 items-center gap-2 rounded-lg px-2 text-[10px] text-slate-400 sm:gap-3 sm:px-3">
        <span className="text-cyan-300">生成进度 {Math.round(progress * 100)}%</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-300 transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="hidden sm:inline">点击任一构件，四个视窗同步高亮</span>
      </div>
    </section>
  )
}
