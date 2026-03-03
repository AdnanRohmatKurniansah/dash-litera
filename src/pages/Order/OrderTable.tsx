import { useState } from 'react'
import { toast } from 'sonner'
import Pagination from '../../components/common/Pagination'
import Input from '../../components/ui/InputField'
import Button from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table'
import { formatDate, formatRp } from '../../lib/utils'
import { TableEmpty } from '../../components/common/Table'
import { Order } from '../../types'
import { useTableFilter } from '../../hooks/useTableFilter'
import { Link } from 'react-router'
import { Search} from 'lucide-react'
import { useOrderDelete, useOrders, useProcessOrder } from '../../api/queries/order'
import { AxiosError } from 'axios'
import TableSkeleton from '../../components/common/TableSkeleton'
import SortIcon from '../../components/common/SortIcon'
import { Modal } from '../../components/ui/Modal'


const OrderTable = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<{id: string, title: string} | null>(null)
  const [processTarget, setProcessTarget] = useState<{id: string, title: string} | null>(null)

  const { data, isLoading, error } = useOrders({ page, limit })
  const deleteOrder = useOrderDelete()
  const processOrder = useProcessOrder()

  const orders = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const {
    data: filteredOrders,
    search,
    setSearch,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  } = useTableFilter<Order>({
    data: orders,
    searchableKeys: ['receipt_number', 'total', 'status'],
    defaultSortKey: 'created_at',
    defaultSortOrder: 'desc',
  })
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleSort = (key: keyof Order) => {
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

    deleteOrder.mutate(deleteTarget.id, {
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

  const handleProcess = (id: string, title: string) => {
    setProcessTarget({ id, title })
  }

  const confirmProcess = () => {
    if (!processTarget) return

    processOrder.mutate(processTarget.id, {
      onSuccess: (res) => {
        toast.success(res.message)
        setProcessTarget(null)
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
    toast.error('Failed to load orders data')
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
                <TableHead onClick={() => handleSort('receipt_number')} className="cursor-pointer select-none">
                    Receipt<SortIcon columnKey="receipt_number" sortKey={sortKey} sortOrder={sortOrder} />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead onClick={() => handleSort('status')} className="cursor-pointer select-none">
                    Status<SortIcon columnKey="status" sortKey={sortKey} sortOrder={sortOrder} />
                </TableHead>
                <TableHead onClick={() => handleSort('total')} className="cursor-pointer select-none">
                    Total <SortIcon columnKey="total" sortKey={sortKey} sortOrder={sortOrder} />
                </TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Courier</TableHead>
                <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer select-none" >
                    Created At<SortIcon columnKey="created_at" sortKey={sortKey} sortOrder={sortOrder} />
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {isLoading ? (
            <TableSkeleton rows={5} columns={8} showActions />
            ) : filteredOrders.length === 0 ? (
            <TableEmpty
                message="No orders data available"
                colSpan={7}
            />
            ) : (
            filteredOrders.map((order: Order) => (
                <TableRow key={order.id}>
                <TableCell>
                    {order.receipt_number ? order.receipt_number : '-'}
                </TableCell>
                <TableCell>
                    <div className="flex flex-col text-sm font-medium ">
                        <span className="font-medium text-gray-800">
                            {order.address?.name ?? "-"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {order.user?.email}
                        </span>
                    </div>
                </TableCell>
                <TableCell>
                    <span
                    className={`px-2 py-1 rounded text-xs font-medium
                        ${
                        order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Paid"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Processing"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                    {order.status}
                    </span>
                </TableCell>
                <TableCell>
                    <p className='font-medium text-gray-800 text-sm'>Rp {formatRp(order.total)}</p>
                </TableCell>
               <TableCell>
                <span className={`text-sm font-medium ${
                    order.payment?.status === "Paid"
                        ? "text-green-600"
                        : order.payment?.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                    {order.payment?.status ?? "No Payment"}
                </span>
                </TableCell>
                <TableCell>
                    <p className='font-medium text-gray-800 text-sm'>{order.shipping
                    ? `${order.shipping.courier} - ${order.shipping.service}`
                    : "-"}</p>
                </TableCell>
                <TableCell>
                    <p className='font-medium text-gray-800 text-sm'>{formatDate(order.created_at)}</p>
                </TableCell>
                <TableCell>
                    <div className="flex justify-start gap-2">
                    <Link to={`/dashboard/order/detail/${order.id}`}>
                        <Button size="sm">
                        Detail
                        </Button>
                    </Link>
                    {order.status === "Paid" && order.receipt_number == null  && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleProcess(order.id, order.id.slice(-8).toUpperCase())} disabled={processOrder.isPending}>
                        Process
                        </Button>
                    )}
                    <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(order.id, order.id.slice(-8).toUpperCase())} disabled={deleteOrder.isPending || order.status !== "Pending"}>
                        Delete
                    </Button>
                    </div>
                </TableCell>
                </TableRow>
            ))
            )}
        </TableBody>
      </Table>
      {!isLoading && filteredOrders.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={limit} onPageChange={handlePageChange} maxPageButtons={5} showInfo={true} />
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} className="max-w-md m-4" >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete order{" "}
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
              disabled={deleteOrder.isPending} >
              {deleteOrder.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!processTarget} onClose={() => setProcessTarget(null)} className="max-w-md m-4" >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Confirm Process
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to process order{" "}
            <span className="font-semibold">
              "#{processTarget?.title}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={() => setProcessTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 disabled:bg-green-700"
              onClick={confirmProcess}
              disabled={processOrder.isPending} >
              {processOrder.isPending ? "Processing..." : "Process"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default OrderTable