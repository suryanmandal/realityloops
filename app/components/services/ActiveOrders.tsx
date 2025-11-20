"use client";
import OrderCard from "./OrderCard";

export default function ActiveOrders() {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Active Orders</h2>

      <OrderCard />
      <OrderCard />
    </div>
  );
}
