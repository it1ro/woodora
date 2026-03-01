import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { heroScrollProgress } from './scrollProgress'

/** Базовая позиция камеры (должна совпадать с camera в Canvas в Hero.tsx). */
const BASE_POSITION = new THREE.Vector3(5, 1.4, 5)
/** Насколько «отъезжать» камерой при полном скролле (коэффициент расстояния). */
const ZOOM_OUT_FACTOR = 0.25

/**
 * Обновляет позицию камеры в зависимости от прогресса скролла (0..1):
 * при скролле вниз камера слегка отдаляется (zoom out), создавая параллакс.
 */
export function ParallaxCamera() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const t = heroScrollProgress.current
    const scale = 1 + ZOOM_OUT_FACTOR * t
    camera.position.x = BASE_POSITION.x * scale
    camera.position.y = BASE_POSITION.y * scale
    camera.position.z = BASE_POSITION.z * scale
    camera.lookAt(target.current)
  })

  return null
}
