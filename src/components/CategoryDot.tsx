import { Category, getCategory, CategorySlug } from '@/data/posts'

interface Props {
  category: CategorySlug | Category
  size?: number
  className?: string
}

export default function CategoryDot({ category, size = 8, className = '' }: Props) {
  const cat = typeof category === 'string' ? getCategory(category) : category
  return (
    <span
      aria-hidden="true"
      className={`inline-block rounded-full ${className}`}
      style={{ width: size, height: size, background: cat.color }}
    />
  )
}
