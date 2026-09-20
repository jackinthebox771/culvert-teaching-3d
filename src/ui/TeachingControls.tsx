import { FlipVertical2, Layers3, Ruler, ScanLine } from 'lucide-react'
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

export function TeachingControls() {
  const transparencyMode = useCulvertStore((state) => state.transparencyMode)
  const clippingMode = useCulvertStore((state) => state.clippingMode)
  const clippingProgress = useCulvertStore((state) => state.clippingProgress)
  const dimensionMode = useCulvertStore((state) => state.dimensionMode)
  const bottomViewEnabled = useCulvertStore((state) => state.bottomViewEnabled)
  const selectedId = useCulvertStore((state) => state.selectedComponentId)
  const setTransparencyMode = useCulvertStore((state) => state.setTransparencyMode)
  const setClippingMode = useCulvertStore((state) => state.setClippingMode)
  const setClippingProgress = useCulvertStore((state) => state.setClippingProgress)
  const setDimensionMode = useCulvertStore((state) => state.setDimensionMode)
  const setBottomViewEnabled = useCulvertStore((state) => state.setBottomViewEnabled)

  return (
    <section className="glass pointer-events-auto w-[min(60rem,calc(100vw-2rem))] rounded-2xl px-3 py-2" aria-label="结构透视与尺寸控制">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <ControlGroup icon={<Layers3 size={13} />} label="显示">
          {TRANSPARENCY_OPTIONS.map((option) => (
            <ModeButton key={option.value} active={transparencyMode === option.value} onClick={() => setTransparencyMode(option.value)}>
              {option.label}
            </ModeButton>
          ))}
        </ControlGroup>

        <ControlGroup icon={<ScanLine size={13} />} label="剖切">
          {CLIPPING_OPTIONS.map((option) => (
            <ModeButton key={option.value} active={clippingMode === option.value} onClick={() => setClippingMode(option.value)}>
              {option.label}
            </ModeButton>
          ))}
        </ControlGroup>

        <button
          type="button"
          aria-pressed={bottomViewEnabled}
          onClick={() => setBottomViewEnabled(!bottomViewEnabled)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] ring-1 ring-inset transition ${bottomViewEnabled ? 'bg-amber-300/20 text-amber-100 ring-amber-200/35' : 'bg-white/5 text-slate-300 ring-white/8 hover:bg-white/9'}`}
        >
          <FlipVertical2 size={13} />{bottomViewEnabled ? '退出底板底视' : '查看底板底面'}
        </button>

        <ControlGroup icon={<Ruler size={13} />} label="尺寸">
          {DIMENSION_OPTIONS.map((option) => (
            <ModeButton
              key={option.value}
              active={dimensionMode === option.value}
              disabled={option.value === 'component' && selectedId === null}
              onClick={() => setDimensionMode(option.value)}
            >
              {option.label}
            </ModeButton>
          ))}
        </ControlGroup>
      </div>

      {clippingMode !== 'off' && (
        <div className="mt-2 flex items-center gap-2 border-t border-white/8 pt-2">
          <span className="shrink-0 text-[10px] text-amber-200/75">剖切位置</span>
          <input
            aria-label="剖切位置"
            type="range"
            min={0}
            max={100}
            value={Math.round(clippingProgress * 100)}
            onChange={(event) => setClippingProgress(Number(event.target.value) / 100)}
            className="h-1.5 min-w-0 flex-1 cursor-pointer accent-amber-300"
          />
          <output className="w-9 text-right font-mono text-[10px] text-amber-100">{Math.round(clippingProgress * 100)}%</output>
        </div>
      )}
    </section>
  )
}

function ControlGroup({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <span className="mr-0.5 flex items-center gap-1 text-[10px] text-slate-500">{icon}{label}</span>
      {children}
    </div>
  )
}

function ModeButton({ active, disabled = false, onClick, children }: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-[9px] ring-1 ring-inset transition disabled:cursor-not-allowed disabled:opacity-30 ${active ? 'bg-cyan-400/18 text-cyan-100 ring-cyan-300/30' : 'bg-white/4 text-slate-400 ring-white/7 hover:bg-white/8 hover:text-slate-200'}`}
    >
      {children}
    </button>
  )
}
