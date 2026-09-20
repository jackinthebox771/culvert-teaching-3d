import { Box, Eye, ScanLine, SquareDashed } from 'lucide-react'
import { CAMERA_PRESETS } from '../config/cameraPresets'
import { useCulvertStore } from '../store/useCulvertStore'

const PRESET_IDS = ['isometric', 'front', 'horizontal', 'side'] as const
const icons = { isometric: Box, front: Eye, horizontal: SquareDashed, side: ScanLine }

export function ViewPresetBar() {
  const active = useCulvertStore((state) => state.cameraPreset)
  const setCameraPreset = useCulvertStore((state) => state.setCameraPreset)
  return (
    <div className="glass pointer-events-auto flex items-center gap-1 rounded-xl p-1.5">
      {PRESET_IDS.map((id) => {
        const Icon = icons[id]
        return (
          <button
            key={id}
            type="button"
            onClick={() => setCameraPreset(id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${active === id ? 'bg-cyan-400/18 text-cyan-100 ring-1 ring-cyan-300/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}
            title={CAMERA_PRESETS[id].label}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{CAMERA_PRESETS[id].label}</span>
          </button>
        )
      })}
    </div>
  )
}
