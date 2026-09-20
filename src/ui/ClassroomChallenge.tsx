import { Check, ChevronRight, Grip, MousePointer2, RefreshCw, Shapes, Trophy, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  ASSEMBLY_HINT_ORDER,
  CHALLENGE_MODES,
  ORTHOGRAPHIC_VIEW_IDS,
  ORTHOGRAPHIC_VIEW_LABELS,
} from '../config/classroomChallengeConfig'
import { COMPONENT_INFO } from '../config/componentInfo'
import { useCulvertStore } from '../store/useCulvertStore'
import { COMPONENT_IDS, type ChallengeMode, type CulvertComponentId, type OrthographicViewId } from '../types/culvert'
import { ChallengeProjectionPreview } from './ChallengeProjectionPreview'

const QUESTION_COUNT = 3

interface Feedback {
  correct: boolean
  message: string
}

function randomItem<T>(items: readonly T[], previous?: T): T {
  const choices = previous === undefined ? items : items.filter((item) => item !== previous)
  return choices[Math.floor(Math.random() * choices.length)] ?? items[0]
}

function shuffled<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

function answerOptions(target: CulvertComponentId): CulvertComponentId[] {
  return shuffled([target, ...shuffled(COMPONENT_IDS.filter((id) => id !== target)).slice(0, 3)])
}

export function ClassroomChallenge() {
  const active = useCulvertStore((state) => state.classroomChallengeActive)
  const mode = useCulvertStore((state) => state.challengeMode)
  const assembledComponentIds = useCulvertStore((state) => state.assembledComponentIds)
  const assemblyLastResult = useCulvertStore((state) => state.assemblyLastResult)
  const stop = useCulvertStore((state) => state.stopClassroomChallenge)
  const setMode = useCulvertStore((state) => state.setChallengeMode)
  const setSpotlight = useCulvertStore((state) => state.setChallengeSpotlight)
  const clearSelection = useCulvertStore((state) => state.clearSelection)
  const startAssembly = useCulvertStore((state) => state.startAssemblyChallenge)
  const resetAssembly = useCulvertStore((state) => state.resetAssemblyChallenge)

  const [target, setTarget] = useState<CulvertComponentId>('barrel')
  const [projectionView, setProjectionView] = useState<OrthographicViewId>('front')
  const [requestedView, setRequestedView] = useState<OrthographicViewId>('horizontal')
  const [round, setRound] = useState(1)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false)
  const [scores, setScores] = useState<Record<Exclude<ChallengeMode, 'assembly'>, number>>({
    identify: 0,
    'projection-to-model': 0,
    'model-to-projection': 0,
  })

  const identifyOptions = useMemo(() => answerOptions(target), [target])
  const projectionOptions = useMemo(() => {
    const offset = COMPONENT_IDS.indexOf(target) % ORTHOGRAPHIC_VIEW_IDS.length
    return [...ORTHOGRAPHIC_VIEW_IDS.slice(offset), ...ORTHOGRAPHIC_VIEW_IDS.slice(0, offset)]
  }, [target])

  useEffect(() => {
    if (!active) return
    if (mode === 'identify' || mode === 'model-to-projection') setSpotlight([target])
    else setSpotlight(null)
  }, [active, mode, setSpotlight, target])

  useEffect(() => {
    if (!active || mode !== 'projection-to-model') return
    return useCulvertStore.subscribe((state, previous) => {
      const selected = state.selectedComponentId
      if (!selected || selected === previous.selectedComponentId || feedback?.correct) return
      const correct = selected === target
      setFeedback({
        correct,
        message: correct
          ? `正确，这是${COMPONENT_INFO[target].name}。`
          : `这次选中的是${COMPONENT_INFO[selected].name}，请继续对照投影轮廓。`,
      })
      if (correct) {
        if (!hadWrongAttempt) setScores((current) => ({ ...current, 'projection-to-model': current['projection-to-model'] + 1 }))
        setSpotlight([target])
      } else setHadWrongAttempt(true)
    })
  }, [active, feedback?.correct, hadWrongAttempt, mode, setSpotlight, target])

  if (!active) return null

  const chooseMode = (nextMode: ChallengeMode) => {
    setRound(1)
    setFeedback(null)
    setHadWrongAttempt(false)
    setTarget(randomItem(COMPONENT_IDS, target))
    setProjectionView(randomItem(ORTHOGRAPHIC_VIEW_IDS, projectionView))
    setRequestedView(randomItem(ORTHOGRAPHIC_VIEW_IDS, requestedView))
    clearSelection()
    if (nextMode === 'assembly') startAssembly()
    else setMode(nextMode)
  }

  const recordAnswer = (correct: boolean, message: string) => {
    setFeedback({ correct, message })
    if (correct && !hadWrongAttempt && mode !== 'assembly') {
      setScores((current) => ({ ...current, [mode]: current[mode] + 1 }))
    }
    if (!correct) setHadWrongAttempt(true)
  }

  const nextQuestion = () => {
    if (round >= QUESTION_COUNT) return
    setRound((value) => value + 1)
    setTarget(randomItem(COMPONENT_IDS, target))
    setProjectionView(randomItem(ORTHOGRAPHIC_VIEW_IDS, projectionView))
    setRequestedView(randomItem(ORTHOGRAPHIC_VIEW_IDS, requestedView))
    setFeedback(null)
    setHadWrongAttempt(false)
    clearSelection()
  }

  const retryCurrent = () => {
    setFeedback(null)
    clearSelection()
  }

  const completed = feedback?.correct && round === QUESTION_COUNT
  const totalScore = scores.identify + scores['projection-to-model'] + scores['model-to-projection']
  const nextAssemblyHint = ASSEMBLY_HINT_ORDER.find((id) => !assembledComponentIds.includes(id))
  const assemblyComplete = assembledComponentIds.length === COMPONENT_IDS.length
  const activeModeInfo = CHALLENGE_MODES.find((item) => item.id === mode) ?? CHALLENGE_MODES[0]

  return (
    <aside className="glass pointer-events-auto absolute bottom-5 right-5 top-24 z-40 flex w-[410px] flex-col overflow-hidden rounded-2xl border-cyan-300/25 shadow-2xl">
      <div className="flex items-start justify-between border-b border-white/8 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-amber-300"><Trophy size={14} /> 工程制图课堂挑战</div>
          <h2 className="mt-1 text-sm font-semibold text-slate-50">{activeModeInfo.title}</h2>
          <p className="mt-0.5 text-[10px] text-slate-400">{activeModeInfo.subtitle}</p>
        </div>
        <button type="button" onClick={stop} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white" aria-label="退出课堂挑战"><X size={16} /></button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 border-b border-white/8 p-3">
        {CHALLENGE_MODES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => chooseMode(item.id)}
            className={`rounded-lg px-1.5 py-2 text-[10px] transition ${mode === item.id ? 'bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/30' : 'bg-white/[.025] text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
          >
            挑战 {index + 1}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {mode !== 'assembly' && (
          <div className="mb-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>第 {round}/{QUESTION_COUNT} 题</span>
            <span>首次答对 {scores[mode]}/{QUESTION_COUNT}</span>
          </div>
        )}

        {mode === 'identify' && (
          <div>
            <p className="text-xs leading-5 text-slate-200">三维模型中正在高亮哪个构件？</p>
            <p className="mt-1 text-[10px] text-slate-500">可旋转模型，从位置、形体和前后左右关系综合判断。</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {identifyOptions.map((id) => (
                <button key={id} type="button" disabled={Boolean(feedback?.correct)} onClick={() => recordAnswer(id === target, id === target ? `正确，高亮构件是${COMPONENT_INFO[target].name}。` : `${COMPONENT_INFO[id].name}与高亮构件的位置不一致。`)} className="rounded-lg border border-white/8 bg-white/[.035] px-3 py-3 text-left text-xs text-slate-200 transition hover:border-cyan-300/25 hover:bg-cyan-400/8 disabled:cursor-default">
                  {COMPONENT_INFO[id].name}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'projection-to-model' && (
          <div>
            <p className="text-xs leading-5 text-slate-200">根据下方的{ORTHOGRAPHIC_VIEW_LABELS[projectionView]}轮廓，在左侧三维模型中点击对应构件。</p>
            <ChallengeProjectionPreview componentId={target} view={projectionView} className="mt-3 h-44 border border-cyan-300/15" />
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-cyan-400/5 px-3 py-2 text-[10px] text-cyan-100/70"><MousePointer2 size={13} /> 直接点击三维实体作答，可旋转后再判断</div>
          </div>
        )}

        {mode === 'model-to-projection' && (
          <div>
            <p className="text-xs leading-5 text-slate-200">模型中已高亮{COMPONENT_INFO[target].name}，请选择它的<strong className="mx-1 text-amber-300">{ORTHOGRAPHIC_VIEW_LABELS[requestedView]}</strong>。</p>
            <div className="mt-3 grid gap-2">
              {projectionOptions.map((view, index) => (
                <button key={view} type="button" disabled={Boolean(feedback?.correct)} onClick={() => recordAnswer(view === requestedView, view === requestedView ? `正确，选项 ${String.fromCharCode(65 + index)} 是${ORTHOGRAPHIC_VIEW_LABELS[requestedView]}。` : '投射方向不符，请比较轮廓的宽、高和构件斜置关系。')} className="group relative h-28 overflow-hidden rounded-lg border border-white/10 bg-[#061521] transition hover:border-cyan-300/35 disabled:cursor-default">
                  <ChallengeProjectionPreview componentId={target} view={view} className="absolute inset-0" />
                  <span className="pointer-events-none absolute left-2 top-2 rounded bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-cyan-100">选项 {String.fromCharCode(65 + index)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'assembly' && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-100">已归位 {assembledComponentIds.length}/{COMPONENT_IDS.length}</p>
              <button type="button" onClick={resetAssembly} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/5 hover:text-white"><RefreshCw size={12} /> 重新打散</button>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-[width]" style={{ width: `${assembledComponentIds.length / COMPONENT_IDS.length * 100}%` }} /></div>
            <div className="mt-4 rounded-xl border border-cyan-300/15 bg-cyan-400/5 p-3">
              <div className="flex items-start gap-2 text-xs text-cyan-50"><Grip size={15} className="mt-0.5 shrink-0 text-cyan-300" /><span>拖动任一分解构件靠近涵洞中央的正确装配位置，进入吸附范围后自动归位并变为绿色。</span></div>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">拖动时相机会自动暂停旋转；松开后可继续调整观察方向。构件必须回到真实原点，不以屏幕重合代替空间归位。</p>
            </div>
            {!assemblyComplete && nextAssemblyHint && <p className="mt-3 text-[10px] text-amber-200/75">建议先建立基准：尝试归位“{COMPONENT_INFO[nextAssemblyHint].name}”。也可自由选择其他构件。</p>}
            {assemblyLastResult && !assemblyLastResult.snapped && <p className="mt-3 rounded-lg border border-amber-300/15 bg-amber-300/5 px-3 py-2 text-[10px] text-amber-100/80">{COMPONENT_INFO[assemblyLastResult.componentId].name}尚未进入正确位置的吸附范围，请继续拖动。</p>}
            {assemblyComplete && <div className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-400/10 p-4 text-center"><Check className="mx-auto text-emerald-300" size={24} /><p className="mt-2 text-sm font-semibold text-emerald-100">八个构件全部正确归位</p><p className="mt-1 text-[10px] text-emerald-100/60">涵洞已恢复真实组合关系。</p></div>}
          </div>
        )}

        {feedback && mode !== 'assembly' && (
          <div className={`mt-4 rounded-lg border px-3 py-2 text-[11px] ${feedback.correct ? 'border-emerald-300/20 bg-emerald-400/8 text-emerald-100' : 'border-amber-300/20 bg-amber-300/8 text-amber-100'}`}>
            <div className="flex items-start gap-2">{feedback.correct ? <Check size={14} className="mt-0.5 shrink-0" /> : <Shapes size={14} className="mt-0.5 shrink-0" />}<span>{feedback.message}</span></div>
          </div>
        )}

        {completed && mode !== 'assembly' && (
          <div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-400/8 p-3 text-center text-xs text-cyan-50">本项挑战完成，首次答对 {scores[mode]}/{QUESTION_COUNT} 题。</div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/8 px-4 py-3">
        <span className="text-[10px] text-slate-500">前三项总分 {totalScore}/9</span>
        {mode !== 'assembly' && feedback && !feedback.correct && <button type="button" onClick={retryCurrent} className="rounded-lg px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5">继续观察</button>}
        {mode !== 'assembly' && feedback?.correct && !completed && <button type="button" onClick={nextQuestion} className="flex items-center gap-1 rounded-lg bg-cyan-400/15 px-3 py-2 text-xs text-cyan-100 ring-1 ring-cyan-300/25 transition hover:bg-cyan-400/25">下一题 <ChevronRight size={14} /></button>}
        {completed && <button type="button" onClick={() => chooseMode(mode)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5"><RefreshCw size={13} /> 再练一次</button>}
      </div>
    </aside>
  )
}
