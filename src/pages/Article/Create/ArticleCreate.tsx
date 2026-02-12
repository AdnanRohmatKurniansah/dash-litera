import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import CreateForm from "./CreateForm";

export default function ArticleCreate() {
  return (
    <>
      <PageMeta title="Add New Article | Litera Dashboard" />
      <PageBreadcrumb pageTitle="Add New Article" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Add New Article
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the form below to add a new article
        </p>
        <CreateForm />
      </div>
    </>
  );
}
