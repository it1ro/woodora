import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { HeroScene } from './HeroScene'
import { heroScrollProgress } from './scrollProgress'

const CAMERA_POSITION: [number, number, number] = [5, 1.4, 5]
const CAMERA_FOV = 45

function updateScrollProgress() {
  const vh = window.innerHeight
  heroScrollProgress.current = Math.min(1, Math.max(0, window.scrollY / vh))
}

export function Hero() {
  useEffect(() => {
    updateScrollProgress()
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress)
    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [])

  return (
    <section
      className="relative h-screen w-full"
      style={{ minHeight: '100vh' }}
      aria-label="Главный экран — 3D угловой шкаф"
    >
      <Canvas
        className="h-full w-full"
        camera={{
          position: CAMERA_POSITION,
          fov: CAMERA_FOV,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        shadows
      >
        <HeroScene />
      </Canvas>
    </section>
  )
}
