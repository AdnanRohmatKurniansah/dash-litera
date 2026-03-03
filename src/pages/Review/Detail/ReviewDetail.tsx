import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Star, BookOpen, User, Calendar, MessageSquare } from 'lucide-react'
import PageMeta from '../../../components/common/PageMeta'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb'
import Button from '../../../components/ui/Button'
import { formatDate } from '../../../lib/utils'
import apiClient from '../../../lib/axios'
import { API_ENDPOINTS } from '../../../api/endpoint'
import type { Review } from '../../../types'

const StarRating = ({ value }: { value: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
)

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400 w-32 shrink-0">{label}</span>
    <span className="text-sm font-medium text-gray-800 dark:text-white/90">{value ?? '-'}</span>
  </div>
)

const ReviewDetailSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
      <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[1, 2].map(i => (
        <div key={i} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          {[1,2,3].map(j => <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />)}
        </div>
      ))}
    </div>
  </div>
)

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['review', id],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REVIEWS.DETAIL(id!))
      return data.data as Review
    },
    enabled: !!id,
  })

  if (isLoading) return (
    <>
      <PageMeta title="Review Detail | Litera Dashboard" />
      <PageBreadcrumb pageTitle="Review Detail" />
      <ReviewDetailSkeleton />
    </>
  )

  if (error || !data) return (
    <>
      <PageMeta title="Review Not Found | Litera Dashboard" />
      <PageBreadcrumb pageTitle="Review Detail" />
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium mb-4">Review not found</p>
        <Button size="sm" onClick={() => navigate('/dashboard/review')}>
          Back to Reviews
        </Button>
      </div>
    </>
  )

  const review = data

  return (
    <>
      <PageMeta title={`Review #${review.id.slice(-8).toUpperCase()} | Litera Dashboard`} />
      <PageBreadcrumb pageTitle="Review Detail" />

      <div className="flex items-center gap-3 mb-6">
        <p className="text-xs text-gray-500">{formatDate(review.created_at, 'long')}</p>
      </div>

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-5 flex items-center gap-6">
        <div className="text-5xl font-black text-gray-800 dark:text-white/90">
          {review.rating}
        </div>
        <div className="space-y-1.5">
          <StarRating value={review.rating} />
          <p className="text-sm text-gray-500">
            {review.rating === 5 ? 'Excellent' :
             review.rating === 4 ? 'Very Good' :
             review.rating === 3 ? 'Good' :
             review.rating === 2 ? 'Fair' : 'Poor'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02]">
            <User className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80">Customer</h4>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              {review.user?.profile ? (
                <img
                  src={review.user.profile}
                  alt={review.user.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-400">
                  {review.user?.name?.charAt(0).toUpperCase() ?? '?'}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800 dark:text-white/90">{review.user?.name ?? '-'}</p>
                <p className="text-sm text-gray-500">{review.user?.email ?? '-'}</p>
              </div>
            </div>
            <InfoRow label="User ID" value={<span className="font-mono text-xs">{review.userId}</span>} />
            <InfoRow label="Reviewed At" value={formatDate(review.created_at, 'full')} />
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02]">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80">Book</h4>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              {review.book?.image_url ? (
                <img
                  src={review.book.image_url}
                  alt={review.book.name}
                  className="w-12 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                />
              ) : (
                <div className="w-12 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800 dark:text-white/90 line-clamp-2">{review.book?.name ?? '-'}</p>
                <p className="text-sm text-gray-500">{review.book?.author ?? '-'}</p>
              </div>
            </div>
            <InfoRow label="Book ID" value={<span className="font-mono text-xs">{review.bookId}</span>} />
            <InfoRow
              label="Slug"
              value={
                <a
                  href={`/books/${review.book?.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-xs">
                  {review.book?.slug ?? '-'}
                </a>
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mt-5">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02]">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80">Comment</h4>
        </div>
        <div className="p-5">
          {review.comment ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <p className="text-sm italic">No comment provided</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}