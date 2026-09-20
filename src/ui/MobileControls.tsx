import { Boxes, Camera, ChevronsDownUp, ChevronsUpDown, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { useCulvertStore } from '../store/useCulvertStore'
import { ComponentInfoCard } from './ComponentInfoCard'
import { ComponentTree } from './ComponentTree'
import { DebugPanel } from './DebugPanel'
import { TeachingControls } from './TeachingControls'
import { ViewPresetBar } from './ViewPresetBar'

type MobilePanel = 'components' | 'display' | 'camera'

export function MobileControls() {
  const [panel, setPanel] = useState<MobilePanel | null>(null)
  const progress = useCulvertStore((state) => state.explodeProgress)
  const setExplodeProgress = useCulvertStore((state) => state.setExplodeProgress)
  const animateExplodeTo = useCulvertStore((state) => state.animateExplodeTo)
  const showAllComponents = useCulvertStore((state) => state.showAllComponents)
  const percent = Math.round(progress * 100)

  const togglePanel = (next: MobilePanel) => setPanel((current) => current === next ? null : next)
  const animateTo = (target: number) => {
    showAllComponents()
    animateExplodeTo(target)
  }

  return (
    <>
      {panel && (
        <section className="glass pointer-events-auto absolute inset-x-2 bottom-28 z-30 max-h-[56dvh] overflow-y-auto rounded-2xl border-cyan-300/25 p-3 md:hidden">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-cyan-100">{panel === 'components' ? '构件与信息' : panel === 'display' ? '显示与教学工具' : '观察方向'}</span>
            <button type="button" onClick={() => setPanel(null)} aria-label="关闭移动控制面板" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X size={16} /></button>
          </div>
          <div className="space-y-2 [&>aside]:w-full [&>details]:w-full [&>div]:w-full [&>section]:w-full">
            {panel === 'components' && <><ComponentTree /><ComponentInfoCard /></>}
            {panel === 'display' && <><TeachingControls /><DebugPanel /></>}
            {panel === 'camera' && <ViewPresetBar />}
          </div>
        </section>
      )}

      <div className="pointer-events-none absolute inset-x-2 bottom-2 z-30 flex flex-col gap-2 md:hidden">
        <section className="glass pointer-events-auto rounded-xl px-3 py-2" aria-label="移动端爆炸分解控制">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => animateTo(0)} disabled={progress <= 0.001} aria-label="一键组合" className="rounded-lg bg-white/5 p-2 text-cyan-100 disabled:opacity-30"><ChevronsDownUp size={15} /></button>
            <input aria-label="爆炸比例" type="range" min={0} max={100} value={percent} onChange={(event) => setExplodeProgress(Number(event.target.value) / 100)} className="h-6 min-w-0 flex-1 cursor-pointer accent-cyan-400" />
            <output className="w-10 text-right font-mono text-[11px] text-cyan-100">{percent}%</output>
            <button type="button" onClick={() => animateTo(1)} disabled={progress >= 0.999} aria-label="一键分解" className="rounded-lg bg-white/5 p-2 text-cyan-100 disabled:opacity-30"><ChevronsUpDown size={15} /></button>
          </div>
        </section>
        <nav className="glass pointer-events-auto grid grid-cols-3 rounded-xl p-1.5" aria-label="移动端教学工具">
          <MobileTab active={panel === 'components'} onClick={() => togglePanel('components')} icon={<Boxes size={15} />} label="构件" />
          <MobileTab active={panel === 'display'} onClick={() => togglePanel('display')} icon={<SlidersHorizontal size={15} />} label="显示" />
          <MobileTab active={panel === 'camera'} onClick={() => togglePanel('camera')} icon={<Camera size={15} />} label="视角" />
        </nav>
      </div>
    </>
  )
}

function MobileTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`flex min-h-10 items-center justify-center gap-2 rounded-lg text-xs transition ${active ? 'bg-cyan-400/18 text-cyan-50 ring-1 ring-cyan-300/25' : 'text-slate-400'}`}>{icon}{label}</button>
}
