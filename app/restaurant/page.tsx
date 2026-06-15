"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "./../components/PublicNavbar";
import Footer from "./../components/Footer";
import { ArrowRight, Sparkles } from "lucide-react";

interface Restaurant {
  _id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

export default function HomePage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/public/restaurants?limit=20`
        );
        const data = await response.json();
        if (data.success) {
          setRestaurants(data.data.restaurants);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
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
            Experience Food in Augmented Reality
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connecting Restaurants & Customers
            <br />
            Through <span className="text-indigo-600">3D Food Models</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See your food before you order. Experience restaurant menus in stunning 3D
            and augmented reality. The future of dining is here.
          </p>
          <button
            onClick={() => {
              const restaurantsSection = document.getElementById("restaurants");
              restaurantsSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Restaurants
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="aspect-video flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-700">
                  3D Food Experience Preview
                </p>
                <p className="text-gray-500 mt-2">Image Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section id="restaurants" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Restaurants
            </h2>
            <p className="text-gray-600">
              Discover amazing restaurants with 3D menus
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  onClick={() => router.push(`/res/${restaurant._id}`)}
                  className="flex-shrink-0 w-80 snap-start cursor-pointer group"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform group-hover:scale-105">
                    {/* Restaurant Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {restaurant.restaurantName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Owner: {restaurant.ownerName}
                      </p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {restaurant.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            restaurant.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {restaurant.status}
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
            No restaurants available at the moment
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Reality<span className="text-indigo-600">Loops</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the dining experience by bringing restaurant
              menus to life with cutting-edge 3D and AR technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                See Before You Order
              </h3>
              <p className="text-gray-600">
                View realistic 3D models of dishes from every angle before making
                your choice.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AR Experience
              </h3>
              <p className="text-gray-600">
                Place food items on your table using augmented reality technology.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-pink-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Instant & Interactive
              </h3>
              <p className="text-gray-600">
                Browse menus quickly with interactive 3D models that load instantly.
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

// const sampleCards = new Array(8).fill(0).map((_, i) => ({
//   id: i,
//   title: "Setup & Manage Facebook Ads",
//   author: "Alex Johnson",
//   price: "From ₹11,000",
//   rating: 4.7,
//   image: "/vrSet.jfif",
// }));

// export default function HomePage() {
//   return (
//     <div className="min-h-screen">
     
//       <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
//         <Navbar />
//         <TopNav />
//       </div>

      
//       <main className="max-w-[1400px] mx-auto py-6 pt-36 flex gap-4 sm:gap-6 px-2 sm:px-4">
        
//         <aside className="hidden md:block w-1/4 sticky top-36 self-start h-[calc(100vh-9rem)] overflow-y-auto bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
//           <Filters />
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1">
//           <Hero />
//           <Section title="AR/VR Platforms">
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {sampleCards.map((c) => (
//                 <Card key={c.id} {...c} />
//               ))}
//             </div>
//           </Section>

//           <Section title="XR Development Engines">
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {sampleCards.map((c) => (
//                 <Card key={"eng" + c.id} {...c} />
//               ))}
//             </div>
//           </Section>

//           <div className="my-12 border border-dashed border-gray-300 bg-white py-12 text-center text-xl text-indigo-400">
//             ADVERTISEMENT
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
