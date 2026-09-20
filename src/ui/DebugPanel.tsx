import { Bug, ChevronDown } from 'lucide-react'
import { CULVERT_DIMENSIONS as D, TODO_VERIFY_DIMENSIONS } from '../config/culvertDimensions'
import { useCulvertStore } from '../store/useCulvertStore'

const options = [
  ['axesVisible', 'XYZ 坐标轴'],
  ['gridVisible', '工程网格'],
  ['originsVisible', '构件原点'],
  ['boundingBoxesVisible', 'Bounding Box'],
  ['labelsVisible', '构件名称'],
] as const

export function DebugPanel() {
  const state = useCulvertStore()
  return (
    <details className="glass pointer-events-auto w-80 rounded-2xl p-4" open>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-cyan-100">
        <span className="flex items-center gap-2"><Bug size={16} className="text-amber-300" />Debug 模式</span>
        <ChevronDown size={14} />
      </summary>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/[.025] px-2 py-1.5 text-[11px] text-slate-300">
            <input
              type="checkbox"
              checked={state[key]}
              onChange={(event) => state.setDebugOption(key, event.target.checked)}
              className="accent-cyan-400"
            />
            {label}
          </label>
        ))}
      </div>
      <div className="mt-3 space-y-1 border-t border-white/8 pt-3 font-mono text-[10px] leading-relaxed text-slate-400">
        <div><span className="text-slate-600">原点</span> X 0 · Y 0 · Z 0</div>
        <div><span className="text-slate-600">相机</span> {state.cameraTelemetry}</div>
        <div><span className="text-slate-600">爆炸</span> {(state.explodeProgress * 100).toFixed(0)}%{state.autoDemoPlaying ? ' · AUTO' : state.explodeAnimating ? ' · ANIMATING' : ''}</div>
        <div><span className="text-slate-600">总体</span> L {D.overall.length.value} · W {D.overall.width.value} mm</div>
        <div><span className="text-slate-600">洞身</span> Ri {D.barrel.innerRadius.value} · Ro {D.barrel.outerRadius.value} mm</div>
        <div><span className={TODO_VERIFY_DIMENSIONS.length ? 'text-amber-300/70' : 'text-emerald-300/70'}>{TODO_VERIFY_DIMENSIONS.length ? 'TODO_VERIFY' : '尺寸状态'}</span> {TODO_VERIFY_DIMENSIONS.length ? `${TODO_VERIFY_DIMENSIONS.length} 项` : '图纸/FBX 已核对'}</div>
      </div>
    </details>
  )
}
