import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { WardrobeShowcaseScene } from '../hero/WardrobeShowcaseScene'
import { wardrobeSectionScrollProgress } from '../hero/scrollProgress'

/** Цвет фона сцены — совпадает с фоном страницы (neutral-50). */
const SCENE_BACKGROUND = 0xfafafa

/** Макс. device pixel ratio для Canvas — ограничение для производительности на HiDPI. */
const MAX_DPR = 2

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
      className="relative flex min-h-screen w-full flex-col bg-neutral-50"
      style={{ minHeight: '100vh' }}
      aria-label="3D-модель шкафа"
    >
      <div className="shrink-0 px-4 pt-6 text-center sm:pt-8">
        <h2 className="text-2xl font-semibold text-neutral-800 sm:text-3xl md:text-4xl">
          Рассмотрите в деталях
        </h2>
      </div>
      <div className="relative h-[calc(100vh-14rem)] shrink-0">
        <Canvas
          className="h-full w-full"
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, MAX_DPR]}
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
      </div>
      <div className="shrink-0 py-6 text-center sm:py-8">
        <a
          href="#categories"
          className="inline-flex items-center rounded-lg bg-amber-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          В каталог
        </a>
      </div>
    </section>
  )
}
