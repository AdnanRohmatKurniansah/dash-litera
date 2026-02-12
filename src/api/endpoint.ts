export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: '/admin/login',
    ADMIN_LOGOUT: '/admin/logout',
    ADMIN_PROFILE: '/admin/profile',
    ADMIN_PROFILE_UPDATE: '/admin/update-profile',
    ADMIN_CHANGE_PASSWORD: '/admin/change-password',
  },

  STATS: {
    DASHBOARD: '/statistic/dashboard',
    ORDERS: '/statistic/orders',
    TOP_PRODUCTS: '/statistic/top-products',
    LOW_STOCK: '/statistic/low-stock',
  },

  ADMINS: {
    LIST: '/admin',                 
    DETAIL: (id: string) => `/admin/${id}`,
    CREATE: '/admin/create',
    UPDATE: (id: string) => `/admin/update/${id}`,
    DELETE: (id: string) => `/admin/delete/${id}`,
  },

  ARTICLES: {
    LIST: '/article',                 
    DETAIL: (id: string) => `/article/${id}`,
    CREATE: '/article/create',
    UPDATE: (id: string) => `/article/update/${id}`,
    DELETE: (id: string) => `/article/delete/${id}`,
  },

  CATEGORIES: {
    LIST: '/category',                 
    DETAIL: (id: string) => `/category/${id}`,
    CREATE: '/category/create',
    UPDATE: (id: string) => `/category/update/${id}`,
    DELETE: (id: string) => `/category/delete/${id}`,
  },

  BOOKS: {
    LIST: '/book',
    DETAIL: (id: string) => `/book/${id}`,
    CREATE: '/book/create',
    UPDATE: (id: string) => `/book/update/${id}`,
    DELETE: (id: string) => `/book/delete/${id}`,
    FILTER: '/book/filter',
    DISCOUNTED: '/book/discounted',
  },

  BOOK_IMAGES: {
    LIST: (bookId: string) => `/book/images/${bookId}`,
    DETAIL: (id: string) => `/book/images/detail/${id}`,
    CREATE: (bookId: string) => `/book/images/${bookId}`,
    UPDATE: (id: string) => `/book/images/update/${id}`,
    DELETE: (id: string) => `/book/images/delete/${id}`,
  },

  // ORDERS: {
  //   LIST: '/order',
  //   DETAIL: (id: string) => `/order/detail/${id}`,
  //   DELETE: (id: string) => `/order/delete/${id}`,
  //   SHIPPING_COST: '/order/cost',
  //   CHECKOUT: '/order/checkout',
  //   COMPLETED_BOOKS: '/order/completed-books',
  // },

  // REVIEWS: {
  //   LIST_BY_BOOK: (bookId: string) => `/reviews/book/${bookId}`,
  //   BOOK_RATING: (bookId: string) => `/reviews/book/${bookId}/rating`,
  //   DELETE: (id: string) => `/reviews/delete/${id}`,
  // },
} as const