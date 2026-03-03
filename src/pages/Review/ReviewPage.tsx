import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ReviewTable from "./ReviewTable";

export default function ReviewData() {
  return (
    <>
      <PageMeta title="Review Data Management | Litera Dashboard" />
      <PageBreadcrumb pageTitle="Review Data" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Review Data
        </h3>
        <ReviewTable />
      </div>
    </>
  );
}
