import { Boxes, Eye, EyeOff } from 'lucide-react'
import { COMPONENT_INFO_LIST } from '../config/componentInfo'
import { useCulvertStore } from '../store/useCulvertStore'
import type { CulvertComponentId } from '../types/culvert'

const componentAccent: Record<CulvertComponentId, string> = {
  'bottom-slab': '#d94b45',
  barrel: '#27c9d4',
  'front-headwall': '#49c878',
  'rear-headwall': '#49c878',
  'front-left-wing-wall': '#e6bd3a',
  'front-right-wing-wall': '#e6bd3a',
  'rear-left-wing-wall': '#e6bd3a',
  'rear-right-wing-wall': '#e6bd3a',
}

export function ComponentTree() {
  const visibility = useCulvertStore((state) => state.visibility)
  const selectedId = useCulvertStore((state) => state.selectedComponentId)
  const hoveredId = useCulvertStore((state) => state.hoveredComponentId)
  const setComponentVisible = useCulvertStore((state) => state.setComponentVisible)
  const setSelectedComponentId = useCulvertStore((state) => state.setSelectedComponentId)
  const setHoveredComponentId = useCulvertStore((state) => state.setHoveredComponentId)

  const select = (id: CulvertComponentId) => {
    if (!visibility[id]) setComponentVisible(id, true)
    setSelectedComponentId(id)
  }

  return (
    <aside className="glass pointer-events-auto w-56 rounded-xl p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-cyan-100">
        <Boxes size={16} className="text-cyan-300" />构件层级
      </div>
      <div className="mb-2 border-b border-white/8 pb-2 text-[9px] uppercase tracking-[.2em] text-slate-500">culvert / 涵洞 · 8 个构件</div>
      <div className="space-y-0.5">
        {COMPONENT_INFO_LIST.map((node) => {
          const selected = selectedId === node.id
          const hovered = hoveredId === node.id
          return (
            <div
              key={node.id}
              className={`group flex items-center rounded-lg transition ${selected ? 'bg-cyan-400/18 ring-1 ring-inset ring-cyan-300/35' : hovered ? 'bg-cyan-300/8' : 'hover:bg-cyan-300/8'}`}
              onMouseEnter={() => visibility[node.id] && setHoveredComponentId(node.id)}
              onMouseLeave={() => setHoveredComponentId(null)}
            >
              <span className="ml-2 h-5 w-1 shrink-0 rounded-full opacity-90" style={{ backgroundColor: componentAccent[node.id] }} />
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => select(node.id)}
                className={`min-w-0 flex-1 px-2 py-1.5 text-left text-[11px] ${node.indent ? 'pl-3' : ''} ${visibility[node.id] ? selected ? 'text-cyan-50' : 'text-slate-200' : 'text-slate-600'}`}
              >
                {node.name}
              </button>
              <button
                type="button"
                aria-label={`${visibility[node.id] ? '隐藏' : '显示'}${node.name}`}
                onClick={() => setComponentVisible(node.id, !visibility[node.id])}
                className="mr-1.5 rounded p-1 text-slate-400 transition hover:bg-white/8 hover:text-cyan-200"
              >
                {visibility[node.id] ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
            </div>
          )
        })}
      </div>
      <div className="mt-2 border-t border-white/8 pt-2 text-[9px] leading-relaxed text-slate-500">
        悬停预览 · 点击选择 · 眼睛控制显隐
      </div>
    </aside>
  )
}
