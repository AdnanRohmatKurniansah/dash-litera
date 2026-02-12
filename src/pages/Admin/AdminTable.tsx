import { useState } from 'react'
import { toast } from 'sonner'
import Pagination from '../../components/common/Pagination'
import Input from '../../components/ui/InputField'
import Button from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table'
import { formatDate } from '../../lib/utils'
import { TableEmpty } from '../../components/common/Table'
import { Admin } from '../../types'
import { useTableFilter } from '../../hooks/useTableFilter'
import { Link } from 'react-router'
import { Edit, PlusCircle, Search, Trash } from 'lucide-react'
import { useAdminDelete, useAdmins } from '../../api/queries/admin'
import { AxiosError } from 'axios'
import TableSkeleton from '../../components/common/TableSkeleton'
import SortIcon from '../../components/common/SortIcon'
import { Modal } from '../../components/ui/Modal'


const AdminTable = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null)

  const { data, isLoading, error } = useAdmins({ page, limit })
  const deleteAdmin = useAdminDelete()

  const admins = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const {
    data: filteredAdmins,
    search,
    setSearch,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  } = useTableFilter<Admin>({
    data: admins,
    searchableKeys: ['name', 'phone', 'role'],
    defaultSortKey: 'name',
    defaultSortOrder: 'desc',
  })
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleSort = (key: keyof Admin) => {
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

    deleteAdmin.mutate(deleteTarget.id, {
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
    toast.error('Failed to load admins data')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Input type="text" placeholder="Search by name, phone, or role..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10"/>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        </div>
        <Link to={'/dashboard/admin/create'}>
            <Button size="sm">
                <PlusCircle className='w-4' />
                Add Admin
            </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer select-none">
              Name <SortIcon columnKey="name" sortKey={sortKey} sortOrder={sortOrder} />
            </TableHead>
            <TableHead onClick={() => handleSort('username')} className="cursor-pointer select-none">
              Username <SortIcon columnKey="username" sortKey={sortKey} sortOrder={sortOrder} />
            </TableHead>
            <TableHead onClick={() => handleSort('role')} className="cursor-pointer select-none">
              Role <SortIcon columnKey="role" sortKey={sortKey} sortOrder={sortOrder} />
            </TableHead>
            <TableHead onClick={() => handleSort('phone')} className="cursor-pointer select-none">
              Phone <SortIcon columnKey="phone" sortKey={sortKey} sortOrder={sortOrder} />
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
            <TableSkeleton rows={5} columns={7} showActions={true} />
          ) : filteredAdmins.length === 0 ? (
            <TableEmpty message={search ? 'No admins found matching your search' : 'No admins data available'} colSpan={7} />
          ) : (
            filteredAdmins.map((admin: Admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={admin.profile || '/images/avatar.png'}
                      alt={admin.name} width={40} height={40} className="rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {admin.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {admin.username}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {admin.role}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {admin.phone || '-'}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(admin.created_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(admin.updated_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start gap-2">
                    <Link to={`/dashboard/admin/edit/${admin.id}`}>
                      <Button className='bg-green-600 hover:bg-green-700' size='sm'>
                        <Edit className='w-4' />
                      </Button>
                    </Link>
                    <Button className='bg-red-600 hover:bg-red-700' size='sm' 
                      onClick={() => handleDelete(admin.id, admin.name)}
                      disabled={deleteAdmin.isPending}
                      aria-label="Delete admin">
                      <Trash className='w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && filteredAdmins.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={limit} onPageChange={handlePageChange} maxPageButtons={5} showInfo={true} />
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} className="max-w-md m-4" >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete admin{" "}
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
              disabled={deleteAdmin.isPending} >
              {deleteAdmin.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminTable