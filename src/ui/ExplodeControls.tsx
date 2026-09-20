import { ChevronsDownUp, ChevronsUpDown, Pause, Play, StepForward } from 'lucide-react'
import { EXPLODE_TEACHING_STEPS } from '../config/explodeConfig'
import { useCulvertStore } from '../store/useCulvertStore'

export function ExplodeControls() {
  const progress = useCulvertStore((state) => state.explodeProgress)
  const target = useCulvertStore((state) => state.explodeTarget)
  const animating = useCulvertStore((state) => state.explodeAnimating)
  const autoPlaying = useCulvertStore((state) => state.autoDemoPlaying)
  const setExplodeProgress = useCulvertStore((state) => state.setExplodeProgress)
  const animateExplodeTo = useCulvertStore((state) => state.animateExplodeTo)
  const setAutoDemoPlaying = useCulvertStore((state) => state.setAutoDemoPlaying)
  const stepExplode = useCulvertStore((state) => state.stepExplode)
  const showAllComponents = useCulvertStore((state) => state.showAllComponents)

  const percent = Math.round(progress * 100)
  const teachingStep = [...EXPLODE_TEACHING_STEPS].reverse().find((step) => progress + 0.001 >= step.progress)

  const animateTo = (next: number) => {
    showAllComponents()
    animateExplodeTo(next)
  }

  const playAuto = () => {
    showAllComponents()
    setAutoDemoPlaying(!autoPlaying)
  }

  return (
    <section className="glass pointer-events-auto w-[min(46rem,calc(100vw-2rem))] rounded-2xl px-3 py-2.5" aria-label="爆炸分解控制">
      <div className="mb-2 flex items-center gap-2">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[.16em] text-cyan-300/80">爆炸分解</span>
        <input
          aria-label="爆炸比例"
          type="range"
          min={0}
          max={100}
          step={1}
          value={percent}
          onChange={(event) => setExplodeProgress(Number(event.target.value) / 100)}
          className="h-1.5 min-w-0 flex-1 cursor-pointer accent-cyan-400"
        />
        <output className="w-10 text-right font-mono text-[11px] text-cyan-100">{percent}%</output>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1 truncate text-[10px] text-slate-400">
          {teachingStep?.label ?? '完整涵洞'}
        </div>
        <div className="flex items-center gap-1">
          <ControlButton
            label="一键组合"
            disabled={!autoPlaying && !animating && progress <= 0.001}
            active={animating && target === 0}
            onClick={() => animateTo(0)}
            icon={<ChevronsDownUp size={13} />}
          />
          <ControlButton
            label="逐步分解"
            disabled={progress >= 0.999}
            onClick={() => { showAllComponents(); stepExplode() }}
            icon={<StepForward size={13} />}
          />
          <ControlButton
            label="一键分解"
            disabled={!autoPlaying && !animating && progress >= 0.999}
            active={animating && target === 1}
            onClick={() => animateTo(1)}
            icon={<ChevronsUpDown size={13} />}
          />
          <ControlButton
            label={autoPlaying ? '暂停' : '自动演示'}
            active={autoPlaying}
            onClick={playAuto}
            icon={autoPlaying ? <Pause size={13} /> : <Play size={13} />}
          />
        </div>
      </div>
    </section>
  )
}

interface ControlButtonProps {
  label: string
  icon: React.ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
}

function ControlButton({ label, icon, onClick, active = false, disabled = false }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] ring-1 ring-inset transition disabled:cursor-not-allowed disabled:opacity-35 ${active ? 'bg-cyan-400/20 text-cyan-50 ring-cyan-300/35' : 'bg-white/5 text-slate-300 ring-white/8 hover:bg-white/9 hover:text-white'}`}
    >
      {icon}{label}
    </button>
  )
}
