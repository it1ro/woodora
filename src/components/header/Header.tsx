import { useState, useRef, useCallback, useEffect } from 'react'
import { FullscreenMenu } from './FullscreenMenu'
import { CatalogDropdown } from './CatalogDropdown'
import { phone, phoneHref } from '../../data/contacts'
import { maxLink, maxLabel } from '../../data/contacts'

const LOGO = 'Steelwood'

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-6 flex-shrink-0 items-center justify-center">
      <span
        className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${
          open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
        }`}
      />
      <span
        className={`absolute h-0.5 w-5 rounded-full bg-current transition-opacity ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${
          open ? '-translate-y-0.5 -rotate-45' : 'translate-y-1.5'
        }`}
      />
    </span>
  )
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

const MAX_LOGO_URL = 'https://max.ru/s/img/big-logo.png'

function MaxIcon() {
  return (
    <img
      src={MAX_LOGO_URL}
      alt=""
      className="h-5 w-5 object-contain"
      width={20}
      height={20}
      loading="lazy"
    />
  )
}

const noop = () => {}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const catalogHoverRef = useRef(false)
  const catalogTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileCatalogRef = useRef<HTMLDivElement>(null)

  const handleCatalogMouseEnter = useCallback(() => {
    if (catalogTimeoutRef.current) {
      clearTimeout(catalogTimeoutRef.current)
      catalogTimeoutRef.current = null
    }
    catalogHoverRef.current = true
    setCatalogOpen(true)
  }, [])

  const handleCatalogMouseLeave = useCallback(() => {
    catalogHoverRef.current = false
    catalogTimeoutRef.current = setTimeout(() => {
      if (!catalogHoverRef.current) setCatalogOpen(false)
      catalogTimeoutRef.current = null
    }, 150)
  }, [])

  // Закрытие каталога по клику/тапу вне области только на мобильных (когда открыт по кнопке)
  useEffect(() => {
    if (!catalogOpen) return
    const mql = window.matchMedia('(max-width: 767px)')
    if (!mql.matches) return
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (mobileCatalogRef.current?.contains(target)) return
      setCatalogOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [catalogOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-sm"
        role="banner"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {/* Гамбургер — всегда виден, открывает полноэкранное меню (карта сайта, каталог, контакты) */}
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded-lg"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-menu"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <HamburgerIcon open={menuOpen} />
          </button>

          {/* Логотип */}
          <a
            href="/"
            className="truncate font-semibold text-neutral-800 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded px-1"
          >
            {LOGO}
          </a>

          {/* Категории мебели — мобильные: кнопка по клику, выпадашка с isTouch */}
          <div ref={mobileCatalogRef} className="relative md:hidden">
            <button
              type="button"
              className="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 min-h-[2.25rem] min-w-[2.25rem] touch-manipulation"
              onClick={() => setCatalogOpen((o) => !o)}
              aria-expanded={catalogOpen}
              aria-haspopup="menu"
              aria-label="Категории мебели"
            >
              Категории мебели
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <CatalogDropdown
              isOpen={catalogOpen}
              onClose={() => setCatalogOpen(false)}
              onMouseEnter={noop}
              onMouseLeave={noop}
              isTouch={true}
            />
          </div>

          {/* Категории мебели с выпадающим меню — десктоп (hover) */}
          <div
            className="relative hidden md:block"
            onMouseEnter={handleCatalogMouseEnter}
            onMouseLeave={handleCatalogMouseLeave}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
              aria-expanded={catalogOpen}
              aria-haspopup="menu"
              aria-label="Категории мебели"
            >
              Категории мебели
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <CatalogDropdown
              isOpen={catalogOpen}
              onClose={() => setCatalogOpen(false)}
              onMouseEnter={handleCatalogMouseEnter}
              onMouseLeave={handleCatalogMouseLeave}
              isTouch={false}
            />
          </div>
        </div>

        <nav
          className="flex flex-1 shrink-0 items-center justify-end gap-2 sm:gap-4"
          aria-label="Контакты и действия"
        >
          {/* Телефон — скрыт на очень маленьких экранах, виден sm+ */}
          <a
            href={phoneHref}
            className="hidden sm:inline text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded px-1"
          >
            {phone}
          </a>
          {/* Нативное лого Max — переход в Upgoods */}
          <a
            href={maxLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
            aria-label={maxLabel}
          >
            <MaxIcon />
          </a>
          {/* Кнопка заказа звонка */}
          <a
            href={phoneHref}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
            aria-label="Заказать звонок"
          >
            <PhoneIcon />
          </a>
          {/* Корзина — заглушка */}
          <a
            href="#cart"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
            aria-label="Корзина"
          >
            <CartIcon />
          </a>
        </nav>
      </header>

      {/* Полноэкранное меню по гамбургеру */}
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
