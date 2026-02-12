import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
  expires: 7, 
  secure: import.meta.env.PROD, 
  sameSite: 'strict' as const,
}

export const CookieService = {
  setAdminToken: (token: string) => {
    Cookies.set('admin_token', token, COOKIE_OPTIONS)
  },

  getAdminToken: () => {
    return Cookies.get('admin_token')
  },

  removeAdminToken: () => {
    Cookies.remove('admin_token')
  },
  clearAll: () => {
    Cookies.remove('admin_token')
  },
}