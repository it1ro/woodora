import { Suspense, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Center, Environment } from '@react-three/drei'
import type { Group } from 'three'
import { WardrobeModel } from './WardrobeModel'
import { ModelErrorBoundary } from './ModelErrorBoundary'
import { wardrobeSectionScrollProgress } from './scrollProgress'

/** Начальный поворот вокруг Y (радианы): модель до скролла уже повёрнута на 90°. */
const ROTATION_OFFSET_Y = Math.PI
/** Полных оборотов за проход секции — меньше = мягче. */
const ROTATION_FULL_TURNS = 1.25
/** Степень сглаживания: 0 — мгновенно, 1 — не двигается. */
const ROTATION_SMOOTH = 0.07
/** Дистанция камеры по скроллу (позиция Z), не clipping planes. */
const CAMERA_Z_SCROLL_NEAR = 4
const CAMERA_Z_SCROLL_FAR = 10
/** Чувствительность вращения мышью (радианы на пиксель). */
const DRAG_SENSITIVITY = 0.005
/** Чувствительность зума колёсиком. */
const WHEEL_ZOOM_SENSITIVITY = 0.02
/** Границы ручного зума относительно позиции от скролла. */
const MANUAL_ZOOM_MIN = -8
const MANUAL_ZOOM_MAX = 6
/** Чувствительность панорамирования камеры (колёсико зажато). */
const PAN_SENSITIVITY = 0.001

/**
 * Сцена 3D-шкафа для блока показа: фон задаётся снаружи (Canvas),
 * модель вращается вокруг Y по скроллу и по перетаскиванию, камера отдаляется и зумится колёсиком.
 */
export function WardrobeShowcaseScene() {
  const { camera, gl } = useThree()
  const groupRef = useRef<Group>(null)
  const currentY = useRef(0)
  const currentZ = useRef(CAMERA_Z_SCROLL_NEAR)
  const dragRotationY = useRef(0)
  const manualZoomOffset = useRef(0)
  const panOffsetX = useRef(0)
  const panOffsetY = useRef(0)
  const isDragging = useRef(false)
  const isPanning = useRef(false)
  const prevPointerX = useRef(0)
  const prevPointerY = useRef(0)

  useEffect(() => {
    const canvas = gl.domElement
    canvas.style.cursor = 'grab'

    const updateCursor = () => {
      if (isDragging.current) canvas.style.cursor = 'grabbing'
      else if (isPanning.current) canvas.style.cursor = 'move'
      else canvas.style.cursor = 'grab'
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 0) {
        isDragging.current = true
        prevPointerX.current = e.clientX
        canvas.setPointerCapture?.(e.pointerId)
      } else if (e.button === 1) {
        e.preventDefault()
        isPanning.current = true
        prevPointerX.current = e.clientX
        prevPointerY.current = e.clientY
        canvas.setPointerCapture?.(e.pointerId)
      }
      updateCursor()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - prevPointerX.current
        prevPointerX.current = e.clientX
        dragRotationY.current += deltaX * DRAG_SENSITIVITY
      } else if (isPanning.current) {
        const deltaX = e.clientX - prevPointerX.current
        const deltaY = e.clientY - prevPointerY.current
        prevPointerX.current = e.clientX
        prevPointerY.current = e.clientY
        const scale = (camera.position.z * PAN_SENSITIVITY)
        panOffsetX.current -= deltaX * scale
        panOffsetY.current += deltaY * scale
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 0) {
        isDragging.current = false
      } else if (e.button === 1) {
        isPanning.current = false
      }
      updateCursor()
      canvas.releasePointerCapture?.(e.pointerId)
    }

    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return
      e.preventDefault()
      manualZoomOffset.current -= e.deltaY * WHEEL_ZOOM_SENSITIVITY
      manualZoomOffset.current = Math.max(
        MANUAL_ZOOM_MIN,
        Math.min(MANUAL_ZOOM_MAX, manualZoomOffset.current)
      )
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  useFrame((_, delta) => {
    const progress = wardrobeSectionScrollProgress.current
    const t = 1 - Math.exp(-ROTATION_SMOOTH * 60 * delta)

    if (groupRef.current) {
      const targetY = progress * ROTATION_FULL_TURNS * Math.PI * 2
      currentY.current += (targetY - currentY.current) * t
      groupRef.current.rotation.y =
        ROTATION_OFFSET_Y + currentY.current + dragRotationY.current
    }

    const baseZ =
      CAMERA_Z_SCROLL_NEAR + progress * (CAMERA_Z_SCROLL_FAR - CAMERA_Z_SCROLL_NEAR)
    const targetZ = baseZ + manualZoomOffset.current
    currentZ.current += (targetZ - currentZ.current) * t
    camera.position.set(
      panOffsetX.current,
      panOffsetY.current,
      currentZ.current
    )
  })

  return (
    <>
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <ambientLight intensity={0.4} />
      <Environment preset="studio" />
      <Center>
        <group ref={groupRef} position={[0, -1.5, -2]}>
          <ModelErrorBoundary>
            <Suspense fallback={null}>
              <WardrobeModel />
            </Suspense>
          </ModelErrorBoundary>
        </group>
      </Center>
    </>
  )
}
