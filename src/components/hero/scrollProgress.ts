/**
 * Прогресс скролла в пределах первого экрана (hero).
 * 0 — страница вверху, 1 — проскроллено на высоту viewport.
 * Обновляется из Hero через addEventListener('scroll').
 */
export const heroScrollProgress = { current: 0 }

/**
 * Прогресс скролла по секции с 3D-моделью шкафа.
 * 0 — верх секции касается верха viewport, 1 — низ секции ушёл вверх.
 * Обновляется из SectionWardrobe3D при скролле; используется для rotation.y модели.
 */
export const wardrobeSectionScrollProgress = { current: 0 }
