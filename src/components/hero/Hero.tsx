import { useEffect, useRef } from 'react'
import { heroScrollProgress } from './scrollProgress'

/** Путь к фоновому изображению hero (BASE_URL для корректной работы на GitHub Pages). */
const HERO_BG_IMAGE = `${import.meta.env.BASE_URL}images/hero-bg.jpg`

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
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(250,250,250,0.5), rgba(245,245,245,0)), url(${HERO_BG_IMAGE})`,
          top: 0,
        }}
        aria-hidden
      />

      {/* Контент поверх */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <h1
          className="font-hero-brand font-bold tracking-tight text-neutral-900"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
        >
          STEEL & WOOD
        </h1>
        <p className="mt-6 text-2xl font-semibold text-neutral-800 md:text-3xl">
          Мебель для образования, офиса и дома
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
