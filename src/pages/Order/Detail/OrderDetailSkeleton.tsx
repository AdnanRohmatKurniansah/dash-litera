export const OrderDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-60 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="h-8 w-32 bg-gray-200 rounded mt-3" />
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <div className="h-5 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-36 bg-gray-200 rounded" />
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <div className="h-5 w-28 bg-gray-200 rounded" />
        <div className="h-4 w-52 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <div className="h-5 w-24 bg-gray-200 rounded" />

        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="w-16 h-20 bg-gray-200 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-3">
        <div className="h-5 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <div className="h-6 w-40 bg-gray-200 rounded ml-auto" />
      </div>
    </div>
  )
}