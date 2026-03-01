import { useEffect, useRef } from 'react'
import { heroScrollProgress } from './scrollProgress'

/** Путь к фоновому изображению hero. Добавьте public/images/hero-bg.jpg или замените на финальное. */
const HERO_BG_IMAGE = '/images/hero-bg.jpg'

const PARALLAX_FACTOR = 0.4

function updateScrollProgress(bgRef: React.RefObject<HTMLDivElement | null>) {
  const vh = window.innerHeight
  const scrollY = window.scrollY
  heroScrollProgress.current = Math.min(1, Math.max(0, scrollY / vh))
  if (bgRef.current) {
    const offsetY = scrollY * PARALLAX_FACTOR
    bgRef.current.style.transform = `translate3d(0, ${offsetY}px, 0)`
  }
}

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tick = () => updateScrollProgress(bgRef)
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
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
      aria-label="Главный экран"
    >
      {/* Слой фона с параллаксом */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 h-[calc(100%+50vh)] w-full bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(250,250,250,0.43), rgba(245,245,245,0.45)), url(${HERO_BG_IMAGE})`,
          top: 0,
        }}
        aria-hidden
      />

      {/* Контент поверх */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
          Мебель для образования, офиса и дома
        </h1>
        <p className="mt-4 text-lg text-neutral-600 md:text-xl">
          Шкафы, столы, кровати и комплекты для детских садов, школ, офисов и общежитий
        </p>
        <a
          href="#categories"
          className="mt-8 inline-block rounded-lg bg-amber-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Смотреть каталог
        </a>
      </div>
    </section>
  )
}
