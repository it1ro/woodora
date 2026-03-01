import { motion } from 'framer-motion'
import { phoneHref } from '../../data/contacts'
import { maxLink, maxLabel } from '../../data/contacts'
import { revealInitial, revealVisible } from './revealMotion'

export function SectionCTA() {
  return (
    <section
      id="cta"
      className="border-t border-neutral-200 bg-white px-4 py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          className="text-3xl font-semibold text-neutral-800 md:text-4xl"
          initial={revealInitial}
          whileInView={revealVisible()}
          viewport={{ once: true, amount: 0.2 }}
        >
          Свяжитесь с нами
        </motion.h2>
        <motion.p
          className="mt-3 text-neutral-600"
          initial={revealInitial}
          whileInView={revealVisible(0.08)}
          viewport={{ once: true, amount: 0.2 }}
        >
          Закажите звонок или напишите — подберём мебель и ответим на вопросы.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={revealInitial}
          whileInView={revealVisible(0.15)}
          viewport={{ once: true, amount: 0.2 }}
        >
          <a
            href={phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-800 px-6 py-3 text-white transition-colors hover:bg-neutral-900"
          >
            <span aria-hidden>📞</span>
            Заказать звонок
          </a>
          <a
            href={maxLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            {maxLabel}
          </a>
          <a
            href="#categories"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            В каталог
          </a>
        </motion.div>
      </div>
    </section>
  )
}
