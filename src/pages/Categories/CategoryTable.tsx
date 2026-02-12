import { useState } from 'react'
import { toast } from 'sonner'
import Pagination from '../../components/common/Pagination'
import Input from '../../components/ui/InputField'
import Button from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table'
import { formatDate } from '../../lib/utils'
import { TableEmpty } from '../../components/common/Table'
import { Category } from '../../types'
import { useTableFilter } from '../../hooks/useTableFilter'
import { Link } from 'react-router'
import { Edit, PlusCircle, Search, Trash } from 'lucide-react'
import { useCategoriesDelete, useCategories } from '../../api/queries/categories'
import { AxiosError } from 'axios'
import TableSkeleton from '../../components/common/TableSkeleton'
import SortIcon from '../../components/common/SortIcon'
import { Modal } from '../../components/ui/Modal'


const CategoryTable = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null)

  const { data, isLoading, error } = useCategories({ page, limit })
  const deleteCategory = useCategoriesDelete()

  const categories = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const {
    data: filteredCategories,
    search,
    setSearch,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  } = useTableFilter<Category>({
    data: categories,
    searchableKeys: ['name'],
    defaultSortKey: 'name',
    defaultSortOrder: 'desc',
  })
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleSort = (key: keyof Category) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    deleteCategory.mutate(deleteTarget.id, {
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
    toast.error('Failed to load categories data')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Input type="text" placeholder="Search by title, content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10"/>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        </div>
        <Link to={'/dashboard/book/category/create'}>
            <Button size="sm">
                <PlusCircle className='w-4' />
                Add Category
            </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer select-none">
              Image Url 
            </TableHead>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer select-none">
              Name <SortIcon columnKey="name" sortKey={sortKey} sortOrder={sortOrder} />
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
          ) : filteredCategories.length === 0 ? (
            <TableEmpty message={search ? 'No categories found matching your search' : 'No categories data available'} colSpan={7} />
          ) : (
            filteredCategories.map((category: Category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={category.image_url} alt={category.name} width={80} height={80} className="rounded object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {category.name}
                    </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(category.created_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(category.updated_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start gap-2">
                    <Link to={`/dashboard/book/category/edit/${category.id}`}>
                      <Button className='bg-green-600 hover:bg-green-700' size='sm'>
                        <Edit className='w-4' />
                      </Button>
                    </Link>
                    <Button className='bg-red-600 hover:bg-red-700' size='sm' 
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deleteCategory.isPending}
                      aria-label="Delete category">
                      <Trash className='w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && filteredCategories.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={limit} onPageChange={handlePageChange} maxPageButtons={5} showInfo={true} />
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} className="max-w-md m-4" >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete category{" "}
            <span className="font-semibold">
              "{deleteTarget?.name}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 disabled:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteCategory.isPending} >
              {deleteCategory.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CategoryTable