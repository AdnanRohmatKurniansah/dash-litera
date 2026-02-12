import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/Account/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./layout/guards/ProtectedRoute";
import GuestRoute from "./layout/guards/GuestRoute";
import AdminData from "./pages/Admin/AdminPage";
import AdminCreate from "./pages/Admin/Create/AdminCreate";
import SuperadminLayout from "./layout/SuperadminLayout";
import AdminUpdate from "./pages/Admin/Update/AdminUpdate";
import ArticleData from "./pages/Article/ArticlePage";
import ArticleCreate from "./pages/Article/Create/ArticleCreate";
import ArticleUpdate from "./pages/Article/Update/ArticleUpdate";
import CategoryData from "./pages/Categories/CategoryPage";
import CategoryCreate from "./pages/Categories/Create/CategoryCreate";
import CategoryUpdate from "./pages/Categories/Update/CategoryUpdate";
import BookData from "./pages/Book/BookPage";
import BookCreate from "./pages/Book/Create/BookCreate";
import BookUpdate from "./pages/Book/Update/BookUpdate";
import BookImageCreate from "./pages/Book/Images/Create/BookImage";
import BookImageUpdate from "./pages/Book/Images/Update/ImageUpdate";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <GuestRoute>
            <SignIn />
          </GuestRoute>
        } />

        <Route path="dashboard" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />

          <Route path="account" element={<UserProfiles />} />

          <Route path="admin" element={<SuperadminLayout />}>
            <Route index element={<AdminData />} />
            <Route path="create" element={<AdminCreate />} />
            <Route path="edit/:id" element={<AdminUpdate />} />
          </Route>
          <Route path="article" element={<Outlet />}>
            <Route index element={<ArticleData />} />
            <Route path="create" element={<ArticleCreate />} />
            <Route path="edit/:id" element={<ArticleUpdate />} />
          </Route>
          <Route path="book" element={<Outlet />}>
            <Route index element={<BookData />} />
            <Route path="create" element={<BookCreate />} />
            <Route path="edit/:id" element={<BookUpdate />} />
            <Route path="image/create/:id" element={<BookImageCreate />} />
            <Route path="image/edit/:id" element={<BookImageUpdate />} />

            <Route path="category" element={<Outlet />}>
              <Route index element={<CategoryData />} />
              <Route path="create" element={<CategoryCreate />} />
              <Route path="edit/:id" element={<CategoryUpdate />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
