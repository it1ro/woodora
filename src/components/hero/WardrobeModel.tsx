import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

/** BASE_URL нужен для корректной загрузки модели на GitHub Pages (сайт в подпапке /woodora/). */
const MODEL_URL = `${import.meta.env.BASE_URL}models/wardrobe.glb`

/**
 * Загружает и отображает GLB-модель углового шкафа.
 * Ожидается масштаб 1 unit = 1 m, центр угла в начале или заданной точке.
 */
export function WardrobeModel() {
  const { scene } = useGLTF(MODEL_URL)

  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  return (
    <primitive
      object={clonedScene}
      position={[0, 0, 0]}
      scale={1}
      rotation={[0, 0, 0]}
    />
  )
}

/** Предзагрузка модели при старте приложения. */
export function preloadWardrobe() {
  useGLTF.preload(MODEL_URL)
}
