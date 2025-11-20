import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";
import OrdersTable from "@/app/components/services/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar
          title="Order History"
          subtitle="View and manage all past orders"
        />

        <OrdersTable />
      </main>
    </div>
  );
}
