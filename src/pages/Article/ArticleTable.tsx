import { useState } from 'react'
import { toast } from 'sonner'
import Pagination from '../../components/common/Pagination'
import Input from '../../components/ui/InputField'
import Button from '../../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table'
import { formatDate } from '../../lib/utils'
import { TableEmpty } from '../../components/common/Table'
import { Article } from '../../types'
import { useTableFilter } from '../../hooks/useTableFilter'
import { Link } from 'react-router'
import { Edit, PlusCircle, Search, Trash } from 'lucide-react'
import { useArticleDelete, useArticles } from '../../api/queries/article'
import { AxiosError } from 'axios'
import TableSkeleton from '../../components/common/TableSkeleton'
import SortIcon from '../../components/common/SortIcon'
import { Modal } from '../../components/ui/Modal'


const ArticleTable = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState<{id: string, title: string} | null>(null)

  const { data, isLoading, error } = useArticles({ page, limit })
  const deleteArticle = useArticleDelete()

  const articles = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const {
    data: filteredArticles,
    search,
    setSearch,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  } = useTableFilter<Article>({
    data: articles,
    searchableKeys: ['title', 'content'],
    defaultSortKey: 'title',
    defaultSortOrder: 'desc',
  })
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleSort = (key: keyof Article) => {
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

    deleteArticle.mutate(deleteTarget.id, {
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
    toast.error('Failed to load articles data')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Input type="text" placeholder="Search by title, content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10"/>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        </div>
        <Link to={'/dashboard/article/create'}>
            <Button size="sm">
                <PlusCircle className='w-4' />
                Add Article
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
            <TableHead onClick={() => handleSort('content')} className="cursor-pointer select-none">
              Content <SortIcon columnKey="content" sortKey={sortKey} sortOrder={sortOrder} />
            </TableHead>
            <TableHead onClick={() => handleSort('published_at')} className="cursor-pointer select-none">
              Published At <SortIcon columnKey="published_at" sortKey={sortKey} sortOrder={sortOrder} />
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
          ) : filteredArticles.length === 0 ? (
            <TableEmpty message={search ? 'No articles found matching your search' : 'No articles data available'} colSpan={7} />
          ) : (
            filteredArticles.map((article: Article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={article.image_url} alt={article.title} width={80} height={80} className="rounded object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {article.title}
                    </p>
                </TableCell>
                <TableCell>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                    {article.content
                    ? article.content.length > 30
                        ? article.content.slice(0, 30) + "..."
                        : article.content
                    : "-"}
                    </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(article.published_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(article.updated_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start gap-2">
                    <Link to={`/dashboard/article/edit/${article.id}`}>
                      <Button className='bg-green-600 hover:bg-green-700' size='sm'>
                        <Edit className='w-4' />
                      </Button>
                    </Link>
                    <Button className='bg-red-600 hover:bg-red-700' size='sm' 
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={deleteArticle.isPending}
                      aria-label="Delete article">
                      <Trash className='w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && filteredArticles.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={limit} onPageChange={handlePageChange} maxPageButtons={5} showInfo={true} />
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} className="max-w-md m-4" >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete article{" "}
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
              disabled={deleteArticle.isPending} >
              {deleteArticle.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ArticleTable