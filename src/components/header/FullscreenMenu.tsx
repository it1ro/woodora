import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { menuItems } from '../../data/menu'
import { phone, phoneHref, maxLink, maxLabel } from '../../data/contacts'
import { categories } from '../../data/categories'

interface FullscreenMenuProps {
  isOpen: boolean
  onClose: () => void
}

const overlayVariants = {
  closed: { opacity: 0, transition: { duration: 0.2 } },
  open: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="fullscreen-menu"
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Меню: карта сайта, каталог, контакты"
          className="fixed inset-0 z-[100] overflow-y-auto bg-white/98 backdrop-blur-md"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="mx-auto max-w-3xl px-4 py-12 sm:py-16"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Карта сайта */}
            <motion.section variants={blockVariants} className="mb-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Карта сайта
              </h2>
              <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Карта сайта">
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-lg font-medium text-neutral-800 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded px-1 py-0.5"
                    onClick={onClose}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </motion.section>

            {/* Каталог: категории и подкатегории */}
            <motion.section variants={blockVariants} className="mb-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Каталог
              </h2>
              <ul className="space-y-6">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <p className="mb-2 text-base font-semibold text-neutral-900">
                      {cat.title}
                    </p>
                    <ul className="space-y-1 pl-2">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <a
                            href={sub.href ?? '#'}
                            className="block rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 -mx-2"
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

            {/* Контакты */}
            <motion.section variants={blockVariants}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Контакты
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a
                  href={phoneHref}
                  className="text-lg font-medium text-neutral-800 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded px-1 py-0.5"
                  onClick={onClose}
                >
                  {phone}
                </a>
                <a
                  href={maxLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-neutral-800 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded px-1 py-0.5"
                >
                  {maxLabel}
                </a>
              </div>
            </motion.section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
