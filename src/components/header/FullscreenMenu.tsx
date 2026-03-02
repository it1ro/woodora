import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { menuItems } from '../../data/menu'
import { phone, phoneHref, maxLink, maxLabel } from '../../data/contacts'
import { categories } from '../../data/categories'

interface FullscreenMenuProps {
  isOpen: boolean
  onClose: () => void
}

const overlayVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden' as const,
    pointerEvents: 'none' as const,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    visibility: 'visible' as const,
    pointerEvents: 'auto' as const,
    backdropFilter: 'blur(24px)',
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    visibility: 'hidden' as const,
    pointerEvents: 'none' as const,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.2 },
  },
}

const contentVariants = {
  closed: { opacity: 0, y: 16 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: { opacity: 0, y: 16, transition: { duration: 0.2 } },
}

const blockVariants = {
  closed: { opacity: 0, y: 12 },
  open: { opacity: 1, y: 0 },
}

export function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !containerRef.current) return
    const focusable = containerRef.current.querySelector<HTMLElement>(
      'a[href], button'
    )
    focusable?.focus()
  }, [isOpen])

  // Focus trap: Tab/Shift+Tab циклически внутри меню
  useEffect(() => {
    if (!isOpen || !containerRef.current) return
    const container = containerRef.current
    const getFocusables = (): HTMLElement[] =>
      Array.from(
        container.querySelectorAll<HTMLElement>('a[href], button')
      ).filter(
        (el) =>
          el.tabIndex !== -1 &&
          !el.hasAttribute('disabled') &&
          el.getAttribute('aria-hidden') !== 'true'
      )

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = getFocusables()
      if (list.length === 0) return
      const current = document.activeElement as HTMLElement | null
      if (!current || !container.contains(current)) return
      const idx = list.indexOf(current)
      if (idx === -1) return
      if (e.shiftKey) {
        if (idx === 0) {
          e.preventDefault()
          list[list.length - 1].focus()
        }
      } else {
        if (idx === list.length - 1) {
          e.preventDefault()
          list[0].focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen])

  return (
    <motion.div
      id="fullscreen-menu"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Меню: карта сайта, каталог, контакты"
      className="fixed inset-0 z-[100] overflow-y-auto bg-white/96"
      variants={overlayVariants}
      initial="closed"
      animate={isOpen ? 'open' : 'exit'}
    >
      {/* Кнопка закрытия — в том же месте, что и гамбургер в хедере (h-14, px-4, кнопка h-10 w-10) */}
      <button
        type="button"
        onClick={onClose}
        className="fixed left-4 top-[0.5rem] z-[101] flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        aria-label="Закрыть меню"
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <motion.div
        className="mx-auto w-full max-w-3xl px-4 py-12 sm:max-w-4xl sm:px-6 sm:py-16 md:max-w-5xl md:py-20 lg:max-w-6xl lg:px-8 lg:py-24"
        variants={contentVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'exit'}
        onClick={(e) => e.stopPropagation()}
      >
            {/* На больших экранах: карта сайта и контакты в одной колонке, каталог занимает основное пространство */}
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-x-16 lg:gap-y-12 xl:gap-x-20">
              {/* Левая колонка: Карта сайта + Контакты */}
              <div className="lg:space-y-12">
                {/* Карта сайта */}
                <motion.section
                  variants={blockVariants}
                  className="mb-10 lg:mb-0"
                  aria-labelledby="fullscreen-menu-sitemap-heading"
                >
                  <h2
                    id="fullscreen-menu-sitemap-heading"
                    className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 sm:mb-5 sm:text-sm md:mb-6"
                  >
                    Карта сайта
                  </h2>
                  <nav
                    className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-8 sm:gap-y-3 md:flex-col md:gap-y-2 md:gap-x-0 lg:gap-y-3"
                    aria-label="Карта сайта"
                  >
                    {menuItems.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        className="text-base font-medium text-neutral-900 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded px-1 py-0.5 sm:text-lg md:text-xl"
                        onClick={onClose}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </motion.section>

                {/* Контакты */}
                <motion.section
                  variants={blockVariants}
                  className="mb-10 lg:mb-0"
                  aria-labelledby="fullscreen-menu-contacts-heading"
                >
                  <h2
                    id="fullscreen-menu-contacts-heading"
                    className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 sm:mb-5 sm:text-sm md:mb-6"
                  >
                    Контакты
                  </h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-x-8 sm:gap-y-3 md:flex-col md:gap-y-2 md:gap-x-0 lg:gap-y-3">
                    <a
                      href={phoneHref}
                      className="text-base font-medium text-neutral-900 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded px-1 py-0.5 sm:text-lg md:text-xl"
                      onClick={onClose}
                    >
                      {phone}
                    </a>
                    <a
                      href={maxLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-neutral-900 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded px-1 py-0.5 sm:text-lg md:text-xl"
                    >
                      {maxLabel}
                    </a>
                  </div>
                </motion.section>
              </div>

              {/* Правая колонка: Каталог — на больших экранах сетка категорий */}
              <motion.section
                variants={blockVariants}
                className="lg:mt-0"
                aria-labelledby="fullscreen-menu-catalog-heading"
              >
                <h2
                  id="fullscreen-menu-catalog-heading"
                  className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 sm:mb-5 sm:text-sm md:mb-6"
                >
                  Категории мебели
                </h2>
                <ul className="space-y-6 sm:space-y-8 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-8 md:space-y-0 xl:grid-cols-3 xl:gap-x-12">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <p className="mb-2 text-base font-semibold text-neutral-900 sm:mb-3 sm:text-lg md:text-xl">
                        {cat.title}
                      </p>
                      <ul className="space-y-1 pl-2 sm:space-y-1.5 sm:pl-0">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <a
                              href={sub.href ?? '#'}
                              className="block rounded px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 -mx-2 sm:text-base md:py-1.5 md:text-lg"
                              onClick={onClose}
                            >
                              {sub.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </motion.section>
            </div>
      </motion.div>
    </motion.div>
  )
}
