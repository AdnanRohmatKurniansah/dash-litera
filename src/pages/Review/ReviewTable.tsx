import { useState } from 'react'
import { toast } from 'sonner'
import Pagination from '../../components/common/Pagination'
import Input from '../../components/ui/InputField'
import Button from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table'
import { formatDate, stripHtml } from '../../lib/utils'
import { TableEmpty } from '../../components/common/Table'
import { Review } from '../../types'
import { useTableFilter } from '../../hooks/useTableFilter'
import { Link } from 'react-router'
import { Search, Star} from 'lucide-react'
import { useReviewDelete, useReviews } from '../../api/queries/review'
import { AxiosError } from 'axios'
import TableSkeleton from '../../components/common/TableSkeleton'
import SortIcon from '../../components/common/SortIcon'
import { Modal } from '../../components/ui/Modal'


const StarRating = ({
  value,
}: {
  value: number
  onChange?: (val: number) => void
  readonly?: boolean
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 transition-colors ${
          star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
)

const ReviewTable = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<{id: string, title: string} | null>(null)

  const { data, isLoading, error } = useReviews({ page, limit })
  const deleteReview = useReviewDelete()

  const reviews = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const {
    data: filteredReviews,
    search,
    setSearch,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  } = useTableFilter<Review>({
    data: reviews,
    searchableKeys: ['rating', 'comment', 'created_at'],
    defaultSortKey: 'created_at',
    defaultSortOrder: 'desc',
  })
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleSort = (key: keyof Review) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    deleteReview.mutate(deleteTarget.id, {
      onSuccess: (res) => {
        toast.success(res.message)
        setDeleteTarget(null)
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message)
        } else {
          toast.error("Something went wrong")
        }
      },
    })
  }

  if (error) {
    toast.error('Failed to load reviews data')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Input type="text" placeholder="Search by receipt number, total, status..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10"/>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        </div>
      </div>
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead onClick={() => handleSort('rating')} className="cursor-pointer select-none">
                    Rating<SortIcon columnKey="rating" sortKey={sortKey} sortOrder={sortOrder} />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead onClick={() => handleSort('comment')} className="cursor-pointer select-none">
                    Comment<SortIcon columnKey="status" sortKey={sortKey} sortOrder={sortOrder} />
                </TableHead>
                <TableHead>Book</TableHead>
                <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer select-none" >
                    Created At<SortIcon columnKey="created_at" sortKey={sortKey} sortOrder={sortOrder} />
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {isLoading ? (
            <TableSkeleton rows={5} columns={8} showActions />
            ) : filteredReviews.length === 0 ? (
            <TableEmpty
                message="No reviews data available"
                colSpan={7}
            />
            ) : (
            filteredReviews.map((review: Review) => (
                <TableRow key={review.id}>
                <TableCell>
                    <StarRating value={review.rating} />
                </TableCell>
                <TableCell>
                    <div className="flex flex-col text-sm font-medium ">
                        <span className="font-medium text-gray-800">
                            {review.user?.name ?? "-"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {review.user?.email}
                        </span>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                    {review.comment
                    ? stripHtml(review.comment).slice(0, 30) + "..."
                    : "-"}
                    </p>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <img src={review.book?.image_url} alt={review.book?.name} width={80} height={80} className="rounded object-cover" />
                         <div className="flex-1">
                            <p className="font-medium">{review.book?.name}</p>
                            <p className="text-sm text-gray-500">{review.book?.author}</p>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <p className='font-medium text-gray-800 text-sm'>{formatDate(review.created_at)}</p>
                </TableCell>
                <TableCell>
                    <div className="flex justify-start gap-2">
                        <Link to={`/dashboard/review/detail/${review.id}`}>
                            <Button size="sm">
                            Detail
                            </Button>
                        </Link>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(review.id, review.id.slice(-8).toUpperCase())} disabled={deleteReview.isPending}>
                            Delete
                        </Button>
                    </div>
                </TableCell>
                </TableRow>
            ))
            )}
        </TableBody>
      </Table>
      {!isLoading && filteredReviews.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={limit} onPageChange={handlePageChange} maxPageButtons={5} showInfo={true} />
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} className="max-w-md m-4" >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete review{" "}
            <span className="font-semibold">
              "#{deleteTarget?.title}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 disabled:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteReview.isPending} >
              {deleteReview.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ReviewTable