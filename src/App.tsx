import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { Header } from './components/header/Header'
import { Hero } from './components/hero/Hero'
import { Footer } from './components/Footer'
import { SectionPlaceholder } from './components/sections/SectionPlaceholder'

function App() {
  useEffect(() => {
    useGLTF.preload('/models/wardrobe.glb')
  }, [])
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SectionPlaceholder
          id="categories"
          title="Категории"
          description="Блок категорий мебели — заглушка"
        />
        <SectionPlaceholder
          id="about"
          title="О компании"
          description="Преимущества и информация — заглушка"
        />
        <SectionPlaceholder
          id="cta"
          title="Связаться"
          description="Призыв к действию — заглушка"
        />
      </main>
      <Footer />
    </>
  )
}

export default App
