import { readFileSync } from 'node:fs'
import { Box3, Vector3 } from 'three'

globalThis.window = { innerWidth: 1920, innerHeight: 1080 }
const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js')

const input = process.argv[2]
const compact = process.argv.includes('--compact')
const cavity = process.argv.includes('--cavity')
const slabTop = process.argv.includes('--slab-top')
if (!input) throw new Error('Usage: node scripts/inspectFbx.mjs <file.fbx>')

const bytes = readFileSync(input)
const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
const root = new FBXLoader().parse(buffer, '')
root.updateMatrixWorld(true)

const size = new Vector3()
const center = new Vector3()
const sceneBox = new Box3().setFromObject(root)
sceneBox.getSize(size)
sceneBox.getCenter(center)

const meshes = []
let cavityPoints = []
let slabTopPoints = []
root.traverse((object) => {
  if (!object.isMesh || !object.geometry) return
  object.geometry.computeBoundingBox()
  const localBox = object.geometry.boundingBox.clone()
  const worldBox = localBox.clone().applyMatrix4(object.matrixWorld)
  const localSize = localBox.getSize(new Vector3())
  const worldSize = worldBox.getSize(new Vector3())
  const worldCenter = worldBox.getCenter(new Vector3())
  const positions = object.geometry.getAttribute('position')
  const coordinates = [new Map(), new Map(), new Map()]
  const point = new Vector3()
  for (let vertexIndex = 0; vertexIndex < positions.count; vertexIndex += 1) {
    point.fromBufferAttribute(positions, vertexIndex).applyMatrix4(object.matrixWorld)
    if (cavity && object.name.includes('15164') && Math.round(point.y * 304.8) === 1500) {
      cavityPoints.push([Math.round(point.x * 304.8), Math.round(point.z * 304.8)])
    }
    if (slabTop && object.name.includes('15164') && Math.round(point.y * 304.8) === 2500) {
      slabTopPoints.push([Math.round(point.x * 304.8), Math.round(point.z * 304.8)])
    }
    ;[point.x, point.y, point.z].forEach((coordinate, axis) => {
      const millimetres = Math.round(coordinate * 304.8)
      coordinates[axis].set(millimetres, (coordinates[axis].get(millimetres) ?? 0) + 1)
    })
  }
  const importantCoordinatesMm = coordinates.map((axis) =>
    [...axis.entries()]
      .sort((a, b) => a[0] - b[0])
      .filter(([, count], index, values) => count >= 4 || index === 0 || index === values.length - 1)
      .map(([value, count]) => ({ value, count })),
  )
  meshes.push({
    name: object.name,
    type: object.type,
    vertices: object.geometry.getAttribute('position')?.count ?? 0,
    triangles: object.geometry.index
      ? object.geometry.index.count / 3
      : (object.geometry.getAttribute('position')?.count ?? 0) / 3,
    position: object.position.toArray(),
    rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
    scale: object.scale.toArray(),
    localSize: localSize.toArray(),
    worldSize: worldSize.toArray(),
    worldCenter: worldCenter.toArray(),
    worldMin: worldBox.min.toArray(),
    worldMax: worldBox.max.toArray(),
    material: Array.isArray(object.material)
      ? object.material.map((item) => item?.name)
      : object.material?.name,
    importantCoordinatesMm: {
      x: importantCoordinatesMm[0],
      y: importantCoordinatesMm[1],
      z: importantCoordinatesMm[2],
    },
  })
})

if (cavity) {
  cavityPoints = [...new Map(cavityPoints.map((pair) => [pair.join(','), pair])).values()]
    .sort((a, b) => a[1] - b[1] || a[0] - b[0])
  console.log(JSON.stringify(cavityPoints, null, 2))
  process.exit(0)
}
if (slabTop) {
  slabTopPoints = [...new Map(slabTopPoints.map((pair) => [pair.join(','), pair])).values()]
    .sort((a, b) => a[1] - b[1] || a[0] - b[0])
  console.log(JSON.stringify(slabTopPoints, null, 2))
  process.exit(0)
}

if (compact) {
  const compactMeshes = meshes.map((mesh) => ({
    name: mesh.name,
    vertices: mesh.vertices,
    boundsMm: {
      min: mesh.worldMin.map((value) => Math.round(value * 304.8)),
      max: mesh.worldMax.map((value) => Math.round(value * 304.8)),
      size: mesh.worldSize.map((value) => Math.round(value * 304.8)),
    },
    gridCoordinatesMm: Object.fromEntries(
      Object.entries(mesh.importantCoordinatesMm).map(([axis, entries]) => [
        axis,
        entries.filter(({ value, count }) => value % 250 === 0 && count >= 2),
      ]),
    ),
  }))
  console.log(JSON.stringify({
    sceneBoundsMm: {
      min: sceneBox.min.toArray().map((value) => Math.round(value * 304.8)),
      max: sceneBox.max.toArray().map((value) => Math.round(value * 304.8)),
      size: size.toArray().map((value) => Math.round(value * 304.8)),
    },
    meshes: compactMeshes,
  }, null, 2))
  process.exit(0)
}

console.log(JSON.stringify({
  root: {
    name: root.name,
    scale: root.scale.toArray(),
    children: root.children.map((child) => ({ name: child.name, type: child.type })),
  },
  scene: {
    size: size.toArray(),
    center: center.toArray(),
    min: sceneBox.min.toArray(),
    max: sceneBox.max.toArray(),
  },
  meshCount: meshes.length,
  meshes,
}, null, 2))
