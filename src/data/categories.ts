/**
 * Категории и подкатегории для каталога (меню и выпадающий блок).
 */
export interface Subcategory {
  id: string
  title: string
  href?: string
}

export interface Category {
  id: string
  title: string
  subcategories: Subcategory[]
}

export const categories: Category[] = [
  {
    id: 'kindergartens',
    title: 'Мебель для детских садов',
    subcategories: [
      { id: 'kd-shkafy', title: 'Шкафы и стеллажи' },
      { id: 'kd-stoly', title: 'Столы и стулья' },
      { id: 'kd-krovati', title: 'Кровати и матрасы' },
    ],
  },
  {
    id: 'schools',
    title: 'Для школ',
    subcategories: [
      { id: 'sh-party', title: 'Парты и стулья' },
      { id: 'sh-shkafy', title: 'Шкафы для раздевалок' },
      { id: 'sh-auditorii', title: 'Аудиторная мебель' },
    ],
  },
  {
    id: 'offices',
    title: 'Для офисов',
    subcategories: [
      { id: 'of-stoly', title: 'Офисные столы' },
      { id: 'of-kresla', title: 'Кресла и стулья' },
      { id: 'of-peregorodki', title: 'Перегородки и стеллажи' },
    ],
  },
  {
    id: 'dormitories',
    title: 'Для общежитий и лагерей',
    subcategories: [
      { id: 'ob-krovati', title: 'Кровати двухъярусные' },
      { id: 'ob-shkafy', title: 'Шкафы и тумбы' },
      { id: 'ob-obshchaya', title: 'Мебель для общих зон' },
    ],
  },
  {
    id: 'home',
    title: 'Для дома',
    subcategories: [
      { id: 'hm-garderob', title: 'Гардеробные и шкафы' },
      { id: 'hm-gostinaya', title: 'Гостиная' },
      { id: 'hm-spalnya', title: 'Спальня и детская' },
    ],
  },
]
