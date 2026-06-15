"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "./../components/PublicNavbar";
import Footer from "./../components/Footer";
import { ArrowRight, Sparkles, Sofa, Armchair, LayoutGrid } from "lucide-react";

interface Store {
  _id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

export default function FurnitureShowroomPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/public/furniture/stores?limit=20`
        );
        const data = await response.json();
        if (data.success) {
          setStores(data.data.stores);
        }
      } catch (error) {
        console.error("Error fetching furniture stores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <PublicNavbar />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Visualize Furniture in Your Room with AR
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Showrooms & Customers
            <br />
            Through <span className="text-indigo-600">3D Furniture Catalogs</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See furniture in your room before you buy. Experience retail showrooms in stunning 3D
            and augmented reality. The future of shopping is here.
          </p>
          <button
            onClick={() => {
              const storesSection = document.getElementById("showrooms");
              storesSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Showrooms
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Image Preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="aspect-video flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Sofa className="h-16 w-16 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-700">
                  Immersive 3D Furniture Experience
                </p>
                <p className="text-gray-500 mt-2">Place models directly in your room</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showrooms Section */}
      <section id="showrooms" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Showrooms
            </h2>
            <p className="text-gray-600">
              Discover amazing brands and furniture shops with 3D catalogs
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : stores.length > 0 ? (
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {stores.map((store) => (
                <div
                  key={store._id}
                  onClick={() => router.push(`/fur/${store._id}`)}
                  className="flex-shrink-0 w-80 snap-start cursor-pointer group"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform group-hover:scale-105">
                    {/* Store Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Armchair className="h-10 w-10 text-indigo-600" />
                        </div>
                      </div>
                    </div>

                    {/* Store Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {store.storeName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Owner: {store.ownerName}
                      </p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {store.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            store.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {store.status}
                        </span>
                        <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No furniture showrooms available at the moment
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Reality<span className="text-indigo-600">Loops</span> Spatial Retail
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the retail experience by bringing furniture catalogs
              to life with cutting-edge 3D and AR technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <LayoutGrid className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                True Scale Visualization
              </h3>
              <p className="text-gray-600">
                View 3D models of sofas, tables, and chairs to understand how they fit
                in your physical floor plan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Sofa className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Augmented Reality Try-On
              </h3>
              <p className="text-gray-600">
                Place virtual furniture in your living room or office in real-time to match colors
                and styles before purchasing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Instant & Material Rich
              </h3>
              <p className="text-gray-600">
                Observe detailed wood grains, fabric weaves, and leather finishes on interactive 3D assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
