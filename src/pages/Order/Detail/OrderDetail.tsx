import { useParams } from "react-router"
import { MapPin, CreditCard, Truck, Package, User } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import PageMeta from "../../../components/common/PageMeta"
import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import { formatDate, formatRp } from "../../../lib/utils"
import Badge from "../../../components/ui/Badge"
import Button from "../../../components/ui/Button"
import { useOrderDetail, useProcessOrder } from "../../../api/queries/order"
import { OrderDetailSkeleton } from "./OrderDetailSkeleton"
import { useState } from "react"
import { Modal } from "../../../components/ui/Modal"

export default function OrderDetail() {
  const { id } = useParams()
  const { data, isLoading, error } = useOrderDetail(id!)
  const [processTarget, setProcessTarget] = useState<{id: string, title: string} | null>(null)
  const processOrder = useProcessOrder()

  const order = data?.data

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

  if (isLoading) return <OrderDetailSkeleton />
  if (error || !order) return 

  return (
    <>
      <PageMeta title="Order Detail | Litera Dashboard" />
      <PageBreadcrumb pageTitle="Order Detail" />

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border p-6 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">
                #{order.id.slice(-8).toUpperCase()}
              </h2>
              {order.receipt_number && (
                <p className="text-sm text-gray-500">
                  Receipt: {order.receipt_number}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {formatDate(order.created_at, "long")}
              </p>
            </div>

            <Badge>{order.status}</Badge>
          </div>

          {order.status === "Paid" && (
            <Button onClick={() => handleProcess(order.id, order.id.slice(-8).toUpperCase())} disabled={processOrder.isPending} size="sm" className="bg-green-600 hover:bg-green-700" >
              Process Order
            </Button>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <User size={16} /> Customer
          </h3>

          <div className="text-normal space-y-1">
            <p><strong>Name:</strong> {order.address?.name}</p>
            <p><strong>Email:</strong> {order.user?.email}</p>
            <p><strong>Phone:</strong> {order.address?.phone}</p>
          </div>
        </div>

        {order.shipping && (
          <div className="bg-white rounded-2xl border p-6 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck size={16} /> Shipping
            </h3>

            <div className="text-normal space-y-1">
              <p>
                {order.shipping.courier} - {order.shipping.service}
              </p>
              <p>Cost: {formatRp(order.shipping.cost)}</p>
              <p>ETD: {order.shipping.etd}</p>
            </div>

            {order.address && (
              <div className="flex gap-2 mt-3 text-normal">
                <MapPin size={16} />
                <div>
                  <p className="font-medium">{order.address.name}</p>
                  <p className="text-gray-500 text-sm">
                    {order.address.street}, {order.address.district},{" "}
                    {order.address.city}, {order.address.province} {order.address.zip}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Package size={16} /> Items
          </h3>

          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              <img
                src={item.book.image_url}
                alt={item.book.name}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.book.name}</p>
                <p className="text-sm text-gray-500">{item.book.author}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatRp(item.price)}</p>
                <p className="text-sm text-gray-500">x{item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {order.payment && (
          <div className="bg-white rounded-2xl border p-6 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard size={16} /> Payment
            </h3>

            <div className="text-normal space-y-1">
              <p>Status: {order.payment.status}</p>
              <p>Method: {order.payment.method ?? "-"}</p>
              {order.payment.paid_at && (
                <p>Paid At: {formatDate(order.payment.paid_at, "long")}</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatRp(order.total)}</span>
          </div>
        </div>

      </div>

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
    </>
  )
}