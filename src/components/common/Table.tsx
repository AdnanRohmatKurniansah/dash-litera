import { ReactNode } from "react"

interface TableProps {
  children: ReactNode
  className?: string
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

interface TableRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

interface TableHeadProps {
  children: ReactNode
  className?: string
  sortable?: boolean
  sorted?: 'asc' | 'desc' | null
  onClick?: () => void
}

interface TableCellProps {
  children: ReactNode
  className?: string
  colSpan?: number
}

export const Table = ({ children, className = '' }: TableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className={`w-full ${className}`}>
          {children}
        </table>
      </div>
    </div>
  )
}

export const TableHeader = ({ children, className = '' }: TableHeaderProps) => {
  return (
    <thead className={`border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 ${className}`}>
      {children}
    </thead>
  )
}

export const TableBody = ({ children, className = '' }: TableBodyProps) => {
  return (
    <tbody className={`divide-y divide-gray-200 dark:divide-gray-800 ${className}`}>
      {children}
    </tbody>
  )
}

export const TableRow = ({ children, className = '', onClick }: TableRowProps) => {
  return (
    <tr 
      className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export const TableHead = ({ 
  children, 
  className = '', 
  sortable = false,
  sorted = null,
  onClick 
}: TableHeadProps) => {
  const baseClasses = "px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400"
  const sortableClasses = sortable || onClick
    ? "cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" 
    : ""

  return (
    <th 
      className={`${baseClasses} ${sortableClasses} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {children}
        {sortable && sorted && (
          <span className="ml-1">{sorted === 'asc' ? '▲' : '▼'}</span>
        )}
      </div>
    </th>
  )
}

export const TableCell = ({ children, className = '', colSpan }: TableCellProps) => {
  return (
    <td 
      className={`px-4 py-4 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  )
}

export const TableEmpty = ({ 
  message = 'No data available',
  colSpan = 6,
}: { 
  message?: string
  colSpan?: number
  icon?: boolean 
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </TableCell>
    </TableRow>
  )
}