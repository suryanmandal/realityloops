"use client";

import DashboardSidebar from "@/app/components/services/DashboardSidebar";
import DashboardNavbar from "@/app/components/services/DashboardNavbar";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  stockStatus: "Available" | "Out of Stock";
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic Italian pizza",
    price: 450,
    available: true,
    stockStatus: "Available",
    image: "/foods/margherita-pizza.jpg",
  },
  {
    id: 2,
    name: "Classic Burger",
    description: "Beef patty with cheese",
    price: 350,
    available: true,
    stockStatus: "Available",
    image: "/foods/burger.jpg",
  },
  {
    id: 3,
    name: "Creamy Pasta",
    description: "Alfredo sauce pasta",
    price: 380,
    available: false,
    stockStatus: "Out of Stock",
    image: "/foods/pasta.jpg",
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Fresh greens with dressing",
    price: 280,
    available: true,
    stockStatus: "Available",
    image: "/foods/salad.jpg",
  },
  {
    id: 5,
    name: "Grilled Steak",
    description: "Premium beef steak",
    price: 850,
    available: true,
    stockStatus: "Available",
    image: "/foods/grilled-steak.jpg",
  },
  {
    id: 6,
    name: "Chocolate Cake",
    description: "Rich chocolate dessert",
    price: 220,
    available: true,
    stockStatus: "Available",
    image: "/foods/cake.jpeg",
  },
];

export default function MenuPage() {
  const handleEdit = (id: number) => {
    alert(`Edit item: ${menuItems.find((i) => i.id === id)?.name}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      alert(`Deleted!`);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    name: string
  ) => {
    (
      e.target as HTMLImageElement
    ).src = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(
      name
    )}`;
  };

  return (
    <div className="flex">
      <DashboardSidebar />

      <main className="lg:ml-64 ml-0 p-4 lg:p-6 w-full bg-gray-100 min-h-screen">
        <DashboardNavbar title="Menu Management" subtitle="Manage your restaurant menu" />

        <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Menu Items</h2>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              + Add Item
            </button>
          </div>

          {/* MENU GRID */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => handleImageError(e, item.name)}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>

                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        item.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.stockStatus}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm">{item.description}</p>

                  {/* PRICE + BUTTONS */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold">₹{item.price}</span>

                    <div className="flex gap-2">
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 7.125L16.862 4.487"
                          />
                        </svg>
                        
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21a48.11 48.11 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0A48.108 48.108 0 013 5.79m14.456 0L18.16 19.673A2.25 2.25 0 0115.916 21H8.084A2.25 2.25 0 015.84 19.673L4.772 5.79m14.456 0A48.108 48.108 0 0015.75 5.393m-7.5 0V4.477c0-1.18.91-2.164 2.09-2.201a51.964 51.964 0 013.32 0c1.18.037 2.09 1.022 2.09 2.201v.916"
                          />
                        </svg>
                    
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
