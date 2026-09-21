import { Crosshair, Eye, Focus, X } from 'lucide-react'
import { COMPONENT_INFO } from '../config/componentInfo'
import { useCulvertStore } from '../store/useCulvertStore'

export function ComponentInfoCard() {
  const selectedId = useCulvertStore((state) => state.selectedComponentId)
  const isolationEnabled = useCulvertStore((state) => state.isolationEnabled)
  const clearSelection = useCulvertStore((state) => state.clearSelection)
  const toggleIsolation = useCulvertStore((state) => state.toggleIsolation)
  const showAllComponents = useCulvertStore((state) => state.showAllComponents)
  const requestCameraFocus = useCulvertStore((state) => state.requestCameraFocus)

  if (!selectedId) return null
  const info = COMPONENT_INFO[selectedId]

  return (
    <section className="glass pointer-events-auto w-72 rounded-xl p-3" aria-live="polite">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[.18em] text-cyan-400/70">已选构件</div>
          <h2 className="mt-1 text-base font-semibold text-cyan-50">{info.name}</h2>
          <div className="mt-0.5 font-mono text-[9px] text-slate-500">{info.id}</div>
        </div>
        <button type="button" onClick={clearSelection} aria-label="取消选择" className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/8 hover:text-slate-100">
          <X size={15} />
        </button>
      </div>

      <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-300">
        <p><span className="text-slate-500">类别：</span>{info.category}</p>
        <p><span className="text-slate-500">位置：</span>{info.location}</p>
        <p><span className="text-slate-500">作用：</span>{info.role}</p>
        <p><span className="text-slate-500">形体：</span>{info.shape}</p>
        <p><span className="text-amber-300/70">关键特征：</span>{info.keyFeature}</p>
        <p className="rounded-lg border border-cyan-300/10 bg-cyan-300/[.035] px-2.5 py-2 text-cyan-100/80">
          <span className="text-cyan-400/70">制图观察：</span>{info.drawingTip}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-white/8 pt-3">
        {info.dimensions.map((dimension) => (
          <div key={dimension.label} className="flex items-center justify-between gap-2 text-[10px]">
            <span className="text-slate-500">{dimension.label}</span>
            <span className="font-mono text-slate-200">{dimension.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => requestCameraFocus(selectedId)} className="flex items-center justify-center gap-1.5 rounded-lg bg-cyan-400/15 px-2 py-2 text-[11px] text-cyan-100 ring-1 ring-inset ring-cyan-300/20 transition hover:bg-cyan-400/25">
          <Crosshair size={13} />相机聚焦
        </button>
        <button type="button" onClick={toggleIsolation} className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] ring-1 ring-inset transition ${isolationEnabled ? 'bg-amber-300/18 text-amber-100 ring-amber-200/30' : 'bg-white/5 text-slate-300 ring-white/8 hover:bg-white/8'}`}>
          <Focus size={13} />{isolationEnabled ? '退出隔离' : '聚焦构件'}
        </button>
        <button type="button" onClick={showAllComponents} className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 px-2 py-2 text-[11px] text-slate-400 ring-1 ring-inset ring-white/8 transition hover:bg-white/8 hover:text-slate-200">
          <Eye size={13} />显示全部构件
        </button>
      </div>
    </section>
  )
}
