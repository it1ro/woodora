import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CallbackModalProps {
  isOpen: boolean
  onClose: () => void
  /** Ref кнопки/элемента, открывающего модалку — фокус вернётся на него при закрытии */
  triggerRef?: React.RefObject<HTMLElement | null>
}

const overlayVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden' as const,
    pointerEvents: 'none' as const,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    visibility: 'visible' as const,
    pointerEvents: 'auto' as const,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    visibility: 'hidden' as const,
    pointerEvents: 'none' as const,
    transition: { duration: 0.2 },
  },
}

const panelVariants = {
  closed: { opacity: 0, scale: 0.96 },
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
}

/** Из строки оставляем только цифры */
function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Форматирование телефона: +7 (XXX) XXX-XX-XX (макс. 10 цифр после 7) */
function formatPhoneDisplay(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length === 0) return ''
  const rest = d.startsWith('7') || d.startsWith('8') ? d.slice(1) : d
  const ten = rest.slice(0, 10)
  const a = ten.slice(0, 3)
  const b = ten.slice(3, 6)
  const c = ten.slice(6, 8)
  const e = ten.slice(8, 10)
  if (ten.length <= 3) return `+7${a ? ` (${a}` : ''}`
  if (ten.length <= 6) return `+7 (${a}) ${b}`
  if (ten.length <= 8) return `+7 (${a}) ${b}-${c}`
  return `+7 (${a}) ${b}-${c}-${e}`
}

/** Валидация: 10 цифр или 11 (начинается с 7/8) */
function validatePhoneDigits(digits: string): boolean {
  const d = digits.replace(/\D/g, '')
  if (d.length === 10) return /^9\d{9}$/.test(d)
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) return /^[78]9\d{9}$/.test(d)
  return false
}

/** Нормализованный телефон для API: 10 цифр (начинается с 9) */
function normalizePhoneForApi(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) return d.slice(1)
  return d.slice(0, 10)
}

/** Заглушка отправки заявки на звонок. TODO: заменить на реальный API. */
async function submitCallbackRequest(payload: {
  name: string
  phone: string
  comment: string
}): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (process.env.NODE_ENV !== 'production') {
    console.log('[CallbackModal] Заявка (заглушка):', payload)
  }
}

type FormErrors = { name?: string; phone?: string }

export function CallbackModal({ isOpen, onClose, triggerRef }: CallbackModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    onClose()
    requestAnimationFrame(() => {
      triggerRef?.current?.focus()
    })
  }, [onClose, triggerRef])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && handleClose()
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleClose])

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false)
      setName('')
      setPhoneDigits('')
      setComment('')
      setErrors({})
      setIsSubmitting(false)
      setSubmitError(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstInput = panelRef.current.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        'input, textarea'
      )
      firstInput?.focus()
    }
  }, [isOpen])

  // Focus trap: Tab/Shift+Tab циклически внутри модалки
  useEffect(() => {
    if (!isOpen || !panelRef.current) return
    const container = panelRef.current
    const getFocusables = (): HTMLElement[] =>
      Array.from(
        container.querySelectorAll<HTMLElement>('input, textarea, button, [href]')
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

  const phoneDisplay = formatPhoneDisplay(phoneDigits)
  const isFormValid = Boolean(name.trim() && validatePhoneDigits(phoneDigits))

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = getPhoneDigits(e.target.value).slice(0, 11)
    setPhoneDigits(digits)
    setErrors((prev) => (prev.phone ? { ...prev, phone: undefined } : prev))
  }, [])

  const sendRequest = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await submitCallbackRequest({
        name: name.trim(),
        phone: normalizePhoneForApi(phoneDigits),
        comment: comment.trim(),
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не удалось отправить заявку. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }, [name, phoneDigits, comment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: FormErrors = {}
    if (!name.trim()) nextErrors.name = 'Введите имя'
    if (!validatePhoneDigits(phoneDigits)) nextErrors.phone = 'Введите корректный номер телефона'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    void sendRequest()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const dialogDescId = submitted
    ? 'callback-modal-desc-success'
    : submitError
      ? 'callback-modal-desc-error'
      : 'callback-modal-desc-form'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="exit"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="callback-modal-title"
          aria-describedby={dialogDescId}
        >
          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
          >
            <div className="relative flex items-center justify-center border-b border-neutral-200 px-5 py-4 sm:px-6">
              <h2
                id="callback-modal-title"
                className="text-lg font-semibold text-neutral-900"
              >
                Заказать звонок
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 sm:right-6"
                aria-label="Закрыть"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-5 sm:px-6 sm:py-6">
              {submitted ? (
                <div id="callback-modal-desc-success" className="py-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-neutral-700 font-medium">Заявка принята</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Мы перезвоним вам в ближайшее время.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-5 w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <p id="callback-modal-desc-form" className="mb-4 text-sm text-neutral-600">
                    Оставьте контакты — мы перезвоним в удобное время.
                  </p>
                  {submitError && (
                    <div
                      id="callback-modal-desc-error"
                      className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                      role="alert"
                    >
                      <p className="font-medium">Ошибка отправки</p>
                      <p className="mt-0.5">{submitError}</p>
                      <button
                        type="button"
                        onClick={() => void sendRequest()}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60"
                        disabled={isSubmitting}
                      >
                        Повторить
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="callback-name" className="mb-1 block text-sm font-medium text-neutral-700">
                        Имя <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="callback-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                        }}
                        required
                        placeholder="Как к вам обращаться"
                        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 ${
                          errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500'
                        }`}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'callback-name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="callback-name-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="callback-phone" className="mb-1 block text-sm font-medium text-neutral-700">
                        Телефон <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="callback-phone"
                        type="tel"
                        value={phoneDisplay}
                        onChange={handlePhoneChange}
                        required
                        placeholder="+7 (___) ___-__-__"
                        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 ${
                          errors.phone
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500'
                        }`}
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'callback-phone-error' : undefined}
                      />
                      {errors.phone && (
                        <p id="callback-phone-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="callback-comment" className="mb-1 block text-sm font-medium text-neutral-700">
                        Комментарий
                      </label>
                      <textarea
                        id="callback-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="О чём хотите спросить (необязательно)"
                        className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                      />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? 'Отправка…' : 'Жду звонка'}
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
