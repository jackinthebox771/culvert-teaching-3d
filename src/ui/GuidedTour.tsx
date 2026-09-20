import { ArrowLeft, ArrowRight, Check, GraduationCap, X } from 'lucide-react'
import { useCulvertStore } from '../store/useCulvertStore'

const TOUR_STEPS = [
  {
    title: '整体认知',
    text: '涵洞由底板、洞身、前后面墙和四片翼墙组成。先从轴测方向建立完整空间印象。',
    focus: '观察四类构件的上下、前后和内外关系。',
  },
  {
    title: '底板与燕尾形空槽',
    text: '模型自动翻转并隔离底板，底面中央的燕尾形空槽属于常规轴测方向不易直接观察的形体。',
    focus: '比较槽口端宽、中宽和纵向贯通范围。',
  },
  {
    title: '洞身剖切',
    text: '横向剖切保留右半部分，洞身被聚焦显示，用于辨认两侧边墙、拱圈和内部贯通通道。',
    focus: '注意内外拱弧同心，以及直墙与拱圈的连续关系。',
  },
  {
    title: '面墙形体',
    text: '前端面墙被单独聚焦，其拱形穿孔与洞身通道同轴，顶部两端设置倒角。',
    focus: '观察穿孔轮廓、顶部直段和两端倒角。',
  },
  {
    title: '翼墙八字展开',
    text: '模型旋转到翼墙水平工作位并在屏幕中央放大，四片翼墙同步高亮，清晰呈现向外斜置的八字形平面关系。',
    focus: '比较翼墙在水平投影与立面投影中的轮廓变化。',
  },
  {
    title: '三面投影联动',
    text: '完整涵洞恢复组合并进入四视窗。三个正交投影与三维轴测图共享同一构件状态。',
    focus: '点击任一构件，核对它在三个投影图中的同步位置。',
  },
  {
    title: '重新组合',
    text: '导览结束，模型恢复完整组合和默认轴测方向。现在可以自由旋转或进入课堂挑战。',
    focus: '回顾二维工程图、三维结构与构件关系之间的对应。',
  },
] as const

export function GuidedTour() {
  const active = useCulvertStore((state) => state.guidedTourActive)
  const step = useCulvertStore((state) => state.guidedTourStep)
  const setStep = useCulvertStore((state) => state.setGuidedTourStep)
  const stop = useCulvertStore((state) => state.stopGuidedTour)
  if (!active) return null

  const content = TOUR_STEPS[step]
  const last = step === TOUR_STEPS.length - 1
  return (
    <aside className="glass pointer-events-auto absolute bottom-5 left-1/2 z-50 w-[min(620px,calc(100vw-24px))] -translate-x-1/2 rounded-2xl border-cyan-300/25 p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-cyan-400/12 p-2 text-cyan-300"><GraduationCap size={18} /></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-300/70">5 分钟结构导览 · {step + 1}/{TOUR_STEPS.length}</span>
            </div>
            <h2 className="mt-1 text-base font-semibold text-slate-50">{content.title}</h2>
          </div>
        </div>
        <button type="button" onClick={stop} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-200" aria-label="退出结构导览"><X size={16} /></button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-300">{content.text}</p>
      <p className="mt-2 rounded-lg border border-amber-300/15 bg-amber-300/5 px-3 py-2 text-[11px] text-amber-100/80"><span className="font-semibold text-amber-300">制图观察：</span>{content.focus}</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {TOUR_STEPS.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setStep(index)}
              className={`h-1.5 flex-1 rounded-full transition ${index <= step ? 'bg-cyan-400' : 'bg-slate-700'}`}
              aria-label={`转到第 ${index + 1} 步：${item.title}`}
            />
          ))}
        </div>
        <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"><ArrowLeft size={14} /> 上一步</button>
        <button type="button" onClick={() => last ? stop() : setStep(step + 1)} className="flex items-center gap-1 rounded-lg bg-cyan-400/15 px-3 py-2 text-xs font-medium text-cyan-100 ring-1 ring-cyan-300/25 transition hover:bg-cyan-400/25">
          {last ? <><Check size={14} /> 完成导览</> : <>下一步 <ArrowRight size={14} /></>}
        </button>
      </div>
    </aside>
  )
}
