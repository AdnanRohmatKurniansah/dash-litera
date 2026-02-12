import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "./_components/EcommerceMetrics";
import MonthlySalesChart from "./_components/MonthlySalesChart";
import RecentOrders from "./_components/RecentOrders";
import StatisticsChart from "./_components/StatisticsChart";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Litera Dashboard | Manage all data in Litera Web App"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>
        <div className="col-span-12">
          <MonthlySalesChart />
        </div>
        <div className="col-span-12">
          <StatisticsChart />
        </div>
        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
