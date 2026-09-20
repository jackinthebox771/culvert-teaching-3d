export function SceneLights({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.48} color="#b9e8ff" />
      <hemisphereLight args={['#8bdfff', '#07111d', 1.25]} />
      <directionalLight
        castShadow={!compact}
        color="#d9f5ff"
        intensity={2.1}
        position={[10, 16, -10]}
        shadow-mapSize={compact ? [512, 512] : [2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <directionalLight color="#2b9cff" intensity={0.75} position={[-12, 7, 10]} />
    </>
  )
}
