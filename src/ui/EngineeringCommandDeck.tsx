import {
  Box,
  ChevronsDownUp,
  ChevronsUpDown,
  Eye,
  FlipVertical2,
  Layers3,
  Pause,
  Play,
  Ruler,
  ScanLine,
  SquareDashed,
  StepForward,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { CAMERA_PRESETS } from '../config/cameraPresets'
import { EXPLODE_TEACHING_STEPS } from '../config/explodeConfig'
import { useCulvertStore } from '../store/useCulvertStore'
import type { ClippingMode, DimensionMode, TransparencyMode } from '../types/culvert'

const TRANSPARENCY_OPTIONS: ReadonlyArray<{ value: TransparencyMode; label: string }> = [
  { value: 'solid', label: '实体' },
  { value: 'transparent', label: '半透明' },
  { value: 'xray', label: 'X-Ray' },
]

const CLIPPING_OPTIONS: ReadonlyArray<{ value: ClippingMode; label: string }> = [
  { value: 'off', label: '关闭' },
  { value: 'cross', label: '横向剖切' },
  { value: 'longitudinal', label: '纵向剖切' },
]

const DIMENSION_OPTIONS: ReadonlyArray<{ value: DimensionMode; label: string }> = [
  { value: 'off', label: '关闭' },
  { value: 'key', label: '关键尺寸' },
  { value: 'component', label: '构件尺寸' },
  { value: 'all', label: '全部尺寸' },
]

const PRESET_IDS = ['isometric', 'front', 'horizontal', 'side'] as const
const PRESET_ICONS = { isometric: Box, front: Eye, horizontal: SquareDashed, side: ScanLine }

export function EngineeringCommandDeck() {
  const state = useCulvertStore()
  const percent = Math.round(state.explodeProgress * 100)
  const teachingStep = [...EXPLODE_TEACHING_STEPS]
    .reverse()
    .find((step) => state.explodeProgress + 0.001 >= step.progress)

  const animateTo = (next: number) => {
    state.showAllComponents()
    state.animateExplodeTo(next)
  }

  const playAuto = () => {
    state.showAllComponents()
    state.setAutoDemoPlaying(!state.autoDemoPlaying)
  }

  return (
    <section className="command-deck glass pointer-events-auto w-full rounded-xl px-3 py-3" aria-label="工程模型统一控制台">
      <div className="grid grid-cols-[.85fr_1.2fr_1fr_1.35fr] divide-x divide-cyan-200/10">
        <DeckGroup icon={<Layers3 size={15} />} title="显示">
          <div className="grid grid-cols-3 gap-1.5">
            {TRANSPARENCY_OPTIONS.map((option) => (
              <DeckButton
                key={option.value}
                active={state.transparencyMode === option.value}
                onClick={() => state.setTransparencyMode(option.value)}
              >
                {option.label}
              </DeckButton>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={state.bottomViewEnabled}
            onClick={() => state.setBottomViewEnabled(!state.bottomViewEnabled)}
            className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] ring-1 ring-inset transition ${state.bottomViewEnabled ? 'bg-amber-300/20 text-amber-100 ring-amber-200/35' : 'bg-white/4 text-slate-400 ring-white/8 hover:bg-white/8 hover:text-slate-200'}`}
          >
            <FlipVertical2 size={12} />{state.bottomViewEnabled ? '退出底板底视' : '查看底板底面'}
          </button>
        </DeckGroup>

        <DeckGroup icon={<ScanLine size={15} />} title="剖切与尺寸">
          <div className="grid grid-cols-3 gap-1.5">
            {CLIPPING_OPTIONS.map((option) => (
              <DeckButton
                key={option.value}
                active={state.clippingMode === option.value}
                onClick={() => state.setClippingMode(option.value)}
              >
                {option.label}
              </DeckButton>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <Ruler size={12} className="shrink-0 text-slate-500" />
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
              {DIMENSION_OPTIONS.map((option) => (
                <DeckButton
                  key={option.value}
                  active={state.dimensionMode === option.value}
                  disabled={option.value === 'component' && state.selectedComponentId === null}
                  onClick={() => state.setDimensionMode(option.value)}
                >
                  {option.label}
                </DeckButton>
              ))}
            </div>
          </div>
          {state.clippingMode !== 'off' && (
            <div className="mt-2 flex items-center gap-2">
              <span className="shrink-0 text-[9px] text-amber-200/70">位置</span>
              <input
                aria-label="剖切位置"
                type="range"
                min={0}
                max={100}
                value={Math.round(state.clippingProgress * 100)}
                onChange={(event) => state.setClippingProgress(Number(event.target.value) / 100)}
                className="h-1 min-w-0 flex-1 cursor-pointer accent-amber-300"
              />
              <output className="w-8 text-right font-mono text-[9px] text-amber-100">{Math.round(state.clippingProgress * 100)}%</output>
            </div>
          )}
        </DeckGroup>

        <DeckGroup icon={<ChevronsUpDown size={15} />} title="爆炸分解" meta={`${percent}%`}>
          <input
            aria-label="爆炸比例"
            type="range"
            min={0}
            max={100}
            step={1}
            value={percent}
            onChange={(event) => state.setExplodeProgress(Number(event.target.value) / 100)}
            className="h-1.5 w-full cursor-pointer accent-cyan-400"
          />
          <div className="mt-1.5 truncate text-[9px] text-slate-500">{teachingStep?.label ?? '完整涵洞'}</div>
          <div className="mt-2 grid grid-cols-4 gap-1">
            <IconButton
              label="组合"
              disabled={!state.autoDemoPlaying && !state.explodeAnimating && state.explodeProgress <= 0.001}
              active={state.explodeAnimating && state.explodeTarget === 0}
              onClick={() => animateTo(0)}
              icon={<ChevronsDownUp size={12} />}
            />
            <IconButton
              label="逐步"
              disabled={state.explodeProgress >= 0.999}
              onClick={() => { state.showAllComponents(); state.stepExplode() }}
              icon={<StepForward size={12} />}
            />
            <IconButton
              label="分解"
              disabled={!state.autoDemoPlaying && !state.explodeAnimating && state.explodeProgress >= 0.999}
              active={state.explodeAnimating && state.explodeTarget === 1}
              onClick={() => animateTo(1)}
              icon={<ChevronsUpDown size={12} />}
            />
            <IconButton
              label={state.autoDemoPlaying ? '暂停' : '演示'}
              active={state.autoDemoPlaying}
              onClick={playAuto}
              icon={state.autoDemoPlaying ? <Pause size={12} /> : <Play size={12} />}
            />
          </div>
        </DeckGroup>

        <DeckGroup icon={<SquareDashed size={15} />} title="投影方向">
          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_IDS.map((id) => {
              const Icon = PRESET_ICONS[id]
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => state.setCameraPreset(id)}
                  className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-[10px] ring-1 ring-inset transition ${state.cameraPreset === id ? 'bg-cyan-400/18 text-cyan-50 ring-cyan-300/35' : 'bg-white/4 text-slate-400 ring-white/8 hover:bg-white/8 hover:text-slate-100'}`}
                  title={CAMERA_PRESETS[id].label}
                >
                  <Icon size={12} />{CAMERA_PRESETS[id].label}
                </button>
              )
            })}
          </div>
        </DeckGroup>
      </div>
    </section>
  )
}

function DeckGroup({ icon, title, meta, children }: { icon: ReactNode; title: string; meta?: string; children: ReactNode }) {
  return (
    <div className="min-w-0 px-3 first:pl-1 last:pr-1">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-cyan-100">
        <span className="text-cyan-300">{icon}</span>
        <span>{title}</span>
        {meta && <span className="ml-auto font-mono text-[10px] font-normal text-cyan-300/80">{meta}</span>}
      </div>
      {children}
    </div>
  )
}

function DeckButton({ active, disabled = false, onClick, children }: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-1 py-1.5 text-[8px] ring-1 ring-inset transition disabled:cursor-not-allowed disabled:opacity-30 ${active ? 'bg-cyan-400/18 text-cyan-50 ring-cyan-300/35' : 'bg-white/4 text-slate-400 ring-white/8 hover:bg-white/8 hover:text-slate-200'}`}
    >
      {children}
    </button>
  )
}

function IconButton({ label, icon, active = false, disabled = false, onClick }: {
  label: string
  icon: ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={label}
      className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[8px] ring-1 ring-inset transition disabled:cursor-not-allowed disabled:opacity-30 ${active ? 'bg-cyan-400/18 text-cyan-50 ring-cyan-300/35' : 'bg-white/4 text-slate-400 ring-white/8 hover:bg-white/8 hover:text-slate-100'}`}
    >
      {icon}<span>{label}</span>
    </button>
  )
}
