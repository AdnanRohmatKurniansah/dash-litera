import { useState } from 'react'
import { toast } from 'sonner'
import Pagination from '../../../components/common/Pagination'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/common/Table'
import { formatDate } from '../../../lib/utils'
import { TableEmpty } from '../../../components/common/Table'
import { BookImage } from '../../../types'
import { useTableFilter } from '../../../hooks/useTableFilter'
import { Link, useParams } from 'react-router'
import { Edit, PlusCircle, Search, Trash } from 'lucide-react'
import { AxiosError } from 'axios'
import TableSkeleton from '../../../components/common/TableSkeleton'
import SortIcon from '../../../components/common/SortIcon'
import { Modal } from '../../../components/ui/Modal'
import { useBookImages, useBookImagesDelete } from '../../../api/queries/book-images'


const BookImageTable = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<{id: string, title: string} | null>(null)
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useBookImages(id!, { page, limit })
  const deleteBook = useBookImagesDelete()

  const bookImages = data?.data || []

  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const {
    data: filteredBookImages,
    search,
    setSearch,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  } = useTableFilter<BookImage>({
    data: bookImages,
    searchableKeys: ['title'],
    defaultSortKey: 'title',
    defaultSortOrder: 'desc',
  })
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleSort = (key: keyof BookImage) => {
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

    deleteBook.mutate(deleteTarget.id, {
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
    toast.error('Failed to load book images data')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10"/>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        </div>
        <Link to={`/dashboard/book/image/create/${id}`}>
            <Button size="sm">
                <PlusCircle className='w-4' />
                Add Book Images
            </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer select-none">
              Image Url 
            </TableHead>
            <TableHead onClick={() => handleSort('title')} className="cursor-pointer select-none">
              Title <SortIcon columnKey="title" sortKey={sortKey} sortOrder={sortOrder} />
            </TableHead>
            <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer select-none">
              Created At <SortIcon columnKey="created_at" sortKey={sortKey} sortOrder={sortOrder} />
            </TableHead>
            <TableHead onClick={() => handleSort('updated_at')} className="cursor-pointer select-none">
              Updated At<SortIcon columnKey="updated_at" sortKey={sortKey} sortOrder={sortOrder} />
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={5} columns={5} showActions={true} />
          ) : filteredBookImages.length === 0 ? (
            <TableEmpty message={search ? 'No book images found matching your search' : 'No book images data available'} colSpan={7} />
          ) : (
            filteredBookImages.map((bookImage: BookImage) => (
              <TableRow key={bookImage.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={bookImage.image_url} alt={bookImage.title} width={80} height={80} className="rounded object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {bookImage.title}
                    </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(bookImage.created_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(bookImage.updated_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start gap-2">
                    <Link to={`/dashboard/book/image/edit/${bookImage.id}`}>
                      <Button className='bg-green-600 hover:bg-green-700' size='sm'>
                        <Edit className='w-4' />
                      </Button>
                    </Link>
                    <Button className='bg-red-600 hover:bg-red-700' size='sm' 
                      onClick={() => handleDelete(bookImage.id, bookImage.title)}
                      disabled={deleteBook.isPending}
                      aria-label="Delete book">
                      <Trash className='w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && filteredBookImages.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={limit} onPageChange={handlePageChange} maxPageButtons={5} showInfo={true} />
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} className="max-w-md m-4" >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete book's image{" "}
            <span className="font-semibold">
              "{deleteTarget?.title}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 disabled:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteBook.isPending} >
              {deleteBook.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BookImageTable