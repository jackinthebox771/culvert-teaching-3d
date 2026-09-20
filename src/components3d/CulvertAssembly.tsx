import { useFBX } from '@react-three/drei'
import { useMemo } from 'react'
import fbxUrl from '../../docs/涵洞三维模型.fbx?url'
import { loadVerifiedFbxGeometry } from '../geometry/loadVerifiedFbxGeometry'
import { Barrel } from './Barrel'
import { BottomSlab } from './BottomSlab'
import { Headwall } from './Headwall'
import { WingWall } from './WingWall'

export function CulvertAssembly() {
  const source = useFBX(fbxUrl)
  const geometry = useMemo(() => loadVerifiedFbxGeometry(source), [source])
  return (
    <group name="culvert" userData={{ componentId: 'culvert' }}>
      <BottomSlab geometry={geometry['bottom-slab']} />
      <Barrel geometry={geometry.barrel} />
      <Headwall end="front" geometry={geometry['front-headwall']} />
      <Headwall end="rear" geometry={geometry['rear-headwall']} />
      <WingWall end="front" side="left" geometry={geometry['front-left-wing-wall']} />
      <WingWall end="front" side="right" geometry={geometry['front-right-wing-wall']} />
      <WingWall end="rear" side="left" geometry={geometry['rear-left-wing-wall']} />
      <WingWall end="rear" side="right" geometry={geometry['rear-right-wing-wall']} />
    </group>
  )
}
