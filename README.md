# Litera Admin Dashboard

Admin Dashboard untuk aplikasi Litera – Book Store Online.  
Dashboard ini digunakan untuk mengelola seluruh data toko buku mulai dari buku, kategori, artikel, pesanan, review, hingga statistik penjualan.

Dashboard terhubung dengan Litera REST API berbasis Node.js, Express, Prisma, dan MongoDB.

---

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Axios
- React Router
- React Query (optional)
- JWT Authentication

### Backend (API)
- Node.js
- Express.js
- Prisma ORM
- MongoDB
- JWT
- Bcrypt
- Cloudinary
- Zod Validation

---

## Base URL API

```
http://localhost:{PORT}/api/v1
```

---

# Available Features & Endpoints

---

# 1. Authentication (Admin)

Digunakan untuk login dan manajemen akun admin.

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/admin/login` | Login admin |
| POST | `/admin/logout` | Logout admin |
| GET | `/admin/profile` | Mendapatkan data profile admin |
| PUT | `/admin/update-profile` | Update profile admin |
| PUT | `/admin/change-password` | Mengubah password admin |

---

# 2. Statistics Dashboard

Menampilkan ringkasan data untuk dashboard utama.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/statistic/dashboard` | Data ringkasan dashboard |
| GET | `/statistic/orders` | Statistik pesanan |
| GET | `/statistic/top-products` | Produk terlaris |
| GET | `/statistic/low-stock` | Buku dengan stok rendah |

---

# 3. Admin Management

CRUD untuk mengelola admin lain.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/admin` | List semua admin |
| GET | `/admin/:id` | Detail admin |
| POST | `/admin/create` | Membuat admin baru |
| PUT | `/admin/update/:id` | Update data admin |
| DELETE | `/admin/delete/:id` | Hapus admin |

---

# 4. Book Management

Mengelola data buku di sistem.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/book` | List semua buku |
| GET | `/book/:id` | Detail buku |
| POST | `/book/create` | Tambah buku |
| PUT | `/book/update/:id` | Update buku |
| DELETE | `/book/delete/:id` | Hapus buku |
| GET | `/book/filter` | Filter buku |
| GET | `/book/discounted` | Buku dengan diskon |

---

# 5. Book Images Management

Mengelola gambar buku.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/book/images/:bookId` | List gambar berdasarkan buku |
| GET | `/book/images/detail/:id` | Detail gambar |
| POST | `/book/images/:bookId` | Tambah gambar buku |
| PUT | `/book/images/update/:id` | Update gambar |
| DELETE | `/book/images/delete/:id` | Hapus gambar |

---

# 6. Category Management

Mengelola kategori buku.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/category` | List kategori |
| GET | `/category/:id` | Detail kategori |
| POST | `/category/create` | Tambah kategori |
| PUT | `/category/update/:id` | Update kategori |
| DELETE | `/category/delete/:id` | Hapus kategori |

---

# 7. Article Management

Mengelola artikel atau blog.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/article` | List artikel |
| GET | `/article/:id` | Detail artikel |
| POST | `/article/create` | Tambah artikel |
| PUT | `/article/update/:id` | Update artikel |
| DELETE | `/article/delete/:id` | Hapus artikel |

---

# 8. Order Management

Mengelola pesanan pelanggan.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/order` | List semua pesanan |
| GET | `/order/detail/:id` | Detail pesanan |
| PUT | `/order/process/:id` | Proses pesanan |
| DELETE | `/order/delete/:id` | Hapus pesanan |
| GET | `/order/completed-books` | Buku yang telah selesai dibeli |

---

# 9. Review Management

Mengelola review yang diberikan oleh user terhadap buku.

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/review/admin` | List semua review |
| GET | `/review/admin/detail/:id` | Detail review |
| DELETE | `/review/admin/delete/:id` | Hapus review |

---

# Authentication

Semua endpoint dashboard (kecuali login) memerlukan Authorization header:

```
Authorization: Bearer <access_token>
```

---

# Environment Variables (Frontend)

Contoh file `.env`:

```
VITE_API_BASE_URL=http://localhost:{PORT}/api/v1
```

---

# Project Structure (Example)

```
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── routes/
 ├── hooks/
 ├── types/
 └── utils/
```

---

# Notes

- Seluruh endpoint menggunakan JSON sebagai request dan response format.
- Semua operasi CRUD memerlukan role admin yang valid.
- Pastikan token JWT disimpan dengan aman di sisi client.
- Dashboard hanya dapat diakses oleh admin yang telah terautentikasi.