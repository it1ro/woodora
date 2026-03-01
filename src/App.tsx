import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { Header } from './components/header/Header'
import { Hero } from './components/hero/Hero'
import { Footer } from './components/Footer'
import { SectionCategories } from './components/sections/SectionCategories'
import { SectionAdvantages } from './components/sections/SectionAdvantages'
import { SectionCTA } from './components/sections/SectionCTA'
import { SectionWardrobe3D } from './components/sections/SectionWardrobe3D'
import { SectionRoadmap } from './components/sections/SectionRoadmap'

function App() {
  useEffect(() => {
    useGLTF.preload('/models/wardrobe.glb')
  }, [])
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SectionCategories />
        <SectionAdvantages />
        <SectionCTA />
        <SectionWardrobe3D />
        <SectionRoadmap />
      </main>
      <Footer />
    </>
  )
}

export default App
