import { Boxes, Eye, EyeOff } from 'lucide-react'
import { COMPONENT_INFO_LIST } from '../config/componentInfo'
import { useCulvertStore } from '../store/useCulvertStore'
import type { CulvertComponentId } from '../types/culvert'

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
    <aside className="glass pointer-events-auto w-64 rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-100">
        <Boxes size={16} className="text-cyan-300" />构件层级
      </div>
      <div className="mb-2 text-[10px] uppercase tracking-[.2em] text-slate-500">culvert / 涵洞</div>
      <div className="space-y-1">
        {COMPONENT_INFO_LIST.map((node) => {
          const selected = selectedId === node.id
          const hovered = hoveredId === node.id
          return (
            <div
              key={node.id}
              className={`flex items-center rounded-lg transition ${selected ? 'bg-cyan-400/18 ring-1 ring-inset ring-cyan-300/35' : hovered ? 'bg-cyan-300/8' : 'hover:bg-cyan-300/8'}`}
              onMouseEnter={() => visibility[node.id] && setHoveredComponentId(node.id)}
              onMouseLeave={() => setHoveredComponentId(null)}
            >
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => select(node.id)}
                className={`min-w-0 flex-1 px-2.5 py-1.5 text-left text-xs ${node.indent ? 'pl-5' : ''} ${visibility[node.id] ? selected ? 'text-cyan-50' : 'text-slate-200' : 'text-slate-600'}`}
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
      <div className="mt-3 border-t border-white/8 pt-2 text-[10px] leading-relaxed text-slate-500">
        悬停预览 · 点击选择 · 眼睛控制显隐
      </div>
    </aside>
  )
}
