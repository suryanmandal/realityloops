export default function SellerSidebar() {
  return (
    <aside className="sticky top-28 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-2">Seller Info</h3>
      <p className="text-sm text-gray-600 mb-3">Alex Johnson</p>
      <p className="text-sm text-gray-500 mb-1">Level 2 Seller</p>
      <p className="text-sm text-gray-500 mb-4">5.0 (245 reviews)</p>

      <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Contact Seller
      </button>
    </aside>
  );
}
