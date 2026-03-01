import { Header } from './components/header/Header'
import { Hero } from './components/hero/Hero'
import { Footer } from './components/Footer'
import { SectionPlaceholder } from './components/sections/SectionPlaceholder'

function App() {
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
      </main>
      <Footer />
    </>
  )
}

export default App
