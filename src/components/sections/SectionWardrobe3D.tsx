import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { WardrobeShowcaseScene } from '../hero/WardrobeShowcaseScene'
import { wardrobeSectionScrollProgress } from '../hero/scrollProgress'

/** Цвет фона сцены — совпадает с фоном страницы (neutral-50). */
const SCENE_BACKGROUND = 0xfafafa

/** Доля viewport: вращение начинается раньше (секция ещё ниже). Больше = триггер раньше. */
const SCROLL_RANGE_EXTRA = 0.95

function updateSectionProgress(sectionRef: React.RefObject<HTMLElement | null>) {
  const el = sectionRef.current
  if (!el) return
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  const extra = vh * SCROLL_RANGE_EXTRA
  // Прогресс 0..1 на расширенном диапазоне: начинается раньше, заканчивается позже
  const progress =
    (rect.height + extra * 2) > 0
      ? Math.min(1, Math.max(0, (-rect.top + extra) / (rect.height + extra * 2)))
      : 0
  wardrobeSectionScrollProgress.current = progress
}

export function SectionWardrobe3D() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const tick = () => updateSectionProgress(sectionRef)
    tick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)
    return () => {
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full bg-neutral-50"
      style={{ minHeight: '100vh' }}
      aria-label="3D-модель шкафа"
    >
      <Canvas
        className="h-full w-full"
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        shadows
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(SCENE_BACKGROUND)
        }}
        camera={{
          position: [0, 0, 4],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <WardrobeShowcaseScene />
      </Canvas>
    </section>
  )
}
