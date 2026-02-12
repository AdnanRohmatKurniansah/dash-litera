interface SortIconProps<T extends string> {
  columnKey: T
  sortKey?: T
  sortOrder: 'asc' | 'desc'
  className?: string
}

export default function SortIcon<T extends string>({
  columnKey,
  sortKey,
  sortOrder,
  className = '',
}: SortIconProps<T>) {
  const isActive = sortKey === columnKey

  return (
    <span
      className={`ml-1 text-xs transition ${
        isActive
          ? 'text-gray-800 dark:text-white'
          : 'text-gray-300 dark:text-gray-600'
      } ${className}`}
    >
      {isActive ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}
    </span>
  )
}