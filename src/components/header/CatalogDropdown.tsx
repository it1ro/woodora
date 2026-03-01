import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { categories, type Category } from '../../data/categories'

interface CatalogDropdownProps {
  isOpen: boolean
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  /** На мобильных открывать по клику; на десктопе — по hover */
  isTouch?: boolean
}

const contentVariants = {
  enter: { opacity: 0, x: 8 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
}

export function CatalogDropdown({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  isTouch = false,
}: CatalogDropdownProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(
    categories[0] ?? null
  )

  if (!isOpen) return null

  return (
    <div
      className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2"
      style={{ width: 'min(90vw, 32rem)', minWidth: 'min(280px, 90vw)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="menu"
      aria-label="Каталог категорий"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="w-full min-w-0 rounded-xl border border-neutral-200 bg-white/98 shadow-lg backdrop-blur-sm"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-0">
          {/* Список категорий слева */}
          <ul className="min-w-0 border-r border-neutral-100 py-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  role="menuitem"
                  className={`w-full truncate px-4 py-2.5 text-left text-sm transition-colors ${
                    activeCategory?.id === cat.id
                      ? 'bg-neutral-100 font-medium text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => isTouch && onClose()}
                >
                  {cat.title}
                </button>
              </li>
            ))}
          </ul>
          {/* Подкатегории справа */}
          <div className="min-h-[200px] min-w-0 overflow-hidden p-4">
            <AnimatePresence mode="wait">
              {activeCategory && (
                <motion.div
                  key={activeCategory.id}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.15 }}
                  className="space-y-1"
                >
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                    {activeCategory.title}
                  </p>
                  <ul className="space-y-0.5">
                    {activeCategory.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <a
                          href={sub.href ?? '#'}
                          className="block rounded px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                          onClick={() => isTouch && onClose()}
                        >
                          {sub.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
