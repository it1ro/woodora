import { motion } from 'framer-motion'
import { revealInitial, revealVisible } from './revealMotion'

/**
 * Блок «Дорожная карта» — заглушка.
 * Структура готова к последующему наполнению этапами/шагами.
 */
export function SectionRoadmap() {
  return (
    <section
      id="roadmap"
      className="border-t border-neutral-200 bg-neutral-50 px-4 py-20"
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2
          className="text-3xl font-semibold text-neutral-800 md:text-4xl"
          initial={revealInitial}
          whileInView={revealVisible()}
          viewport={{ once: true, amount: 0.2 }}
        >
          Дорожная карта
        </motion.h2>
        <motion.p
          className="mt-4 text-neutral-500"
          initial={revealInitial}
          whileInView={revealVisible(0.08)}
          viewport={{ once: true, amount: 0.2 }}
        >
          Будет дополнено
        </motion.p>
      </div>
    </section>
  )
}
