import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import BookImageData from "../Images/BookImagePage";
import UpdateForm from "./UpdateForm";

export default function BookUpdate() {
  return (
    <>
      <PageMeta title="Update Book Data | Litera Dashboard" />
      <PageBreadcrumb pageTitle="Update Book Data" />
      <div className="rounded-2xl mb-8 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Update Book Data
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the form below to update book data
        </p>
        <UpdateForm />
      </div>

      <BookImageData />
    </>
  );
}
