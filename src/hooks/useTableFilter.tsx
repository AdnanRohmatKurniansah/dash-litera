import { useMemo, useState } from 'react'

type SortOrder = 'asc' | 'desc'

interface UseTableFilterProps<T> {data: T[]
  searchableKeys: (keyof T)[]
  defaultSortKey?: keyof T
  defaultSortOrder?: SortOrder
}

export function searchData<T>(data: T[], keyword: string, keys: (keyof T)[]): T[] {
  if (!keyword) return data

  const lower = keyword.toLowerCase()

  return data.filter((item) =>
    keys.some((key) =>
      String(item[key] ?? '').toLowerCase().includes(lower)
    )
  )
}

export function sortData<T>(data: T[], key: keyof T, order: SortOrder = 'asc'): T[] {
  if (!data || !Array.isArray(data)) return []

  return [...data].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal == null || bVal == null) return 0

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }

    return order === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })
}

export function useTableFilter<T>({
  data,
  searchableKeys,
  defaultSortKey,
  defaultSortOrder = 'asc',
}: UseTableFilterProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<keyof T | undefined>(defaultSortKey)
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder)

  const filteredData = useMemo(() => {
    let result = searchData(data, search, searchableKeys)
    if (sortKey) {
      result = sortData(result, sortKey, sortOrder)
    }
    return result
  }, [data, search, sortKey, sortOrder, searchableKeys])

  return {
    data: filteredData,
    search,
    setSearch,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  }
}
