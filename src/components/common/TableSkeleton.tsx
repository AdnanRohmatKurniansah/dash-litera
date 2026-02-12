interface TableSkeletonProps {
  rows?: number
  columns?: number
  showActions?: boolean
}

const TableSkeleton = ({ 
  rows = 5, 
  columns = 6, 
  showActions = true 
}: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns - (showActions ? 1 : 0) }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-4">
              {colIndex === 0 ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : (
                <div className={`h-4 rounded bg-gray-200 dark:bg-gray-800 ${
                  colIndex === 1 ? 'w-40' : 
                  colIndex === 2 ? 'w-20' : 
                  colIndex === 3 ? 'w-28' : 
                  'w-24'
                }`} />
              )}
            </td>
          ))}
          {showActions && (
            <td className="px-4 py-4">
              <div className="flex justify-center gap-2">
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  )
}

export default TableSkeleton