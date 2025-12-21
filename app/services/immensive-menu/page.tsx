"use client";

// localhost:3000/services/immensive-menu
import { useEffect, useRef, useState } from "react";

interface FoodItem {
  name: string;
  oldPrice: string;
  newPrice: string;
  image: string;
  isVeg: boolean;
}

const recommendedItems: FoodItem[] = [
  { name: "Cajun Burger", oldPrice: "239", newPrice: "199", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", isVeg: false },
  { name: "Chinese Platter", oldPrice: "600", newPrice: "300", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", isVeg: true },
  { name: "Veg Grilled Sandwich", oldPrice: "310", newPrice: "155", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", isVeg: true },
  { name: "Chicken 65", oldPrice: "420", newPrice: "210", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", isVeg: false },
];

const winterSpecialItems: FoodItem[] = [
  { name: "Tomato Shorba", oldPrice: "180", newPrice: "149", image: "https://aromaticessence.co/wp-content/uploads/2024/01/tomato-shorba-recipe-featured-480x270.jpg", isVeg: true },
  { name: "Sarson Ka Saag", oldPrice: "350", newPrice: "299", image: "https://rajjoskitchen.com/wp-content/uploads/2024/02/IMG-20240201-WA0006.jpg", isVeg: true },
  { name: "Gajar Ka Halwa", oldPrice: "220", newPrice: "179", image: "https://c8.alamy.com/comp/2DCTBN5/close-up-of-carrot-halwadessert-gajar-ka-halwa-indian-sweet-against-white-background-2DCTBN5.jpg", isVeg: true },
  { name: "Hot Chocolate", oldPrice: "200", newPrice: "169", image: "https://images.stockcake.com/public/9/0/8/9080eee5-14a0-44a8-8b38-bed7b9c9c437_large/cozy-winter-beverage-stockcake.jpg", isVeg: true },
  { name: "Tandoori Chicken", oldPrice: "450", newPrice: "399", image: "https://www.seriouseats.com/thmb/U_vFiw41FzWnvJsgYFR9QxUWM_k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2011__08__20110803-grilled-tandoori-chicken-tikka-indian-primary-d08b14e94b5a469fb06ccf745849f1a2.jpg", isVeg: false },
  { name: "Paneer Tikka", oldPrice: "380", newPrice: "329", image: "https://www.sanjanafeasts.co.uk/wp-content/uploads/2023/07/Paneer-Tikka-Kebabs-on-a-platter-with-fresh-naan-bread-720x540.jpg", isVeg: true },
];

const ArrowButton = ({
  direction,
  onClick,
  position,
}: {
  direction: "left" | "right";
  onClick: () => void;
  position: "left" | "right";
}) => (
  <button
    onClick={onClick}
    className={`
      hidden md:block
      absolute ${position}-0 top-1/2 -translate-y-1/2
      z-30
      text-3xl font-bold
      text-black
      hover:opacity-70
      transition
      rounded-full
      bg-white/90
      shadow-lg
      h-10 w-10
      flex items-center justify-center
      pointer-events-auto
    `}
  >
    {direction === "left" ? "‹" : "›"}
  </button>
);


export default function Page() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(1);
  const [showCategory, setShowCategory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState({ title: "", price: "" });
  const recommendedRef = useRef<HTMLDivElement>(null);
  const winterTrackRef = useRef<HTMLDivElement>(null);
  const scrollByAmount = (
  ref: React.RefObject<HTMLDivElement | null>,
  direction: "left" | "right"
) => {
  if (!ref.current) return;

  ref.current.scrollBy({
    left: direction === "left" ? -300 : 300,
    behavior: "smooth",
  });
};

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth) + 1;
      setSlide(index);
    };
    track.addEventListener("scroll", onScroll);
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const openModal = (title: string, price: string) => {
    setSelectedFood({ title, price });
    setShowModal(true);
  };

  const FoodCard = ({ item }: { item: FoodItem }) => (
    <div
      onClick={() => openModal(item.name, item.newPrice)}
      className="group relative w-52 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl md:w-60"
    >
      <div className="relative h-48 overflow-hidden md:h-56">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {/* Veg/Non-Veg Icon */}
        <div
          className={`absolute top-4 left-4 flex h-6 w-6 items-center justify-center rounded border-2 ${
            item.isVeg ? "border-green-600" : "border-red-600"
          } bg-white shadow`}
        >
          <div className={`h-3 w-3 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
        </div>
        {/* Discount Price Tag */}
        <div className="absolute bottom-4 left-4 rounded-lg bg-yellow-400 px-4 py-2 text-base font-extrabold text-black shadow-lg">
          ₹{item.newPrice}
        </div>
        {/* ADD Button - appears on hover */}
        <div className="absolute bottom-4 right-4 translate-y-16 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-green-600 shadow-lg">
            ADD
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="truncate text-lg font-bold text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-through">₹{item.oldPrice}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* HERO */}
      <section className="relative h-[380px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        <div className="absolute top-4 left-0 z-20 flex w-full justify-between px-4">
          <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow-lg">←</button>
          <div className="flex gap-3">
            <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow-lg">♡</button>
            <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow-lg">🔗</button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        >
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              src={`https://images.unsplash.com/photo-${
                i === 1
                  ? "1517248135467-4c7edcad34c4"
                  : i === 2
                  ? "1559339352-11d035aa65de"
                  : i === 3
                  ? "1554118811-1e0d58224f24"
                  : "1544148103-0773bf10d330"
              }?auto=format&fit=crop&w=1200&q=80`}
              className="h-full w-full shrink-0 snap-center object-cover"
              alt={`Restaurant ambiance ${i}`}
            />
          ))}
        </div>

        <div className="absolute bottom-40 right-4 z-20 rounded-full bg-white/90 px-4 py-2 text-sm font-bold backdrop-blur">
          📷 {slide}/4
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-20 rounded-3xl bg-white/95 backdrop-blur p-6 shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Flamingo</h1>
              <p className="mt-1 text-sm text-gray-600">17 km • Lajpat Nagar, Jalandhar</p>
              <p className="text-sm text-gray-600">North Indian, Italian • ₹800 for two</p>
            </div>
            <div className="rounded-xl bg-green-700 px-4 py-3 text-center text-white shadow-lg">
              <div className="text-lg font-bold">5.0 ★</div>
              <div className="text-xs opacity-90">13 ratings</div>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <div className="flex flex-1 items-center justify-between rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-green-700">
              Open till 11PM <span className="text-xl">▼</span>
            </div>
            <button className="h-12 w-12 rounded-xl bg-gray-100 shadow">📍</button>
            <button className="h-12 w-12 rounded-xl bg-gray-100 shadow">📞</button>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg">
          🔍 <span className="text-gray-500">Search for dishes...</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
        {["Pure Veg", "Bestseller", "Spicy", "Kids Special"].map((c) => (
          <span
            key={c}
            className="shrink-0 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium"
          >
            {c}
          </span>
        ))}
      </div>

      {/* RECOMMENDED */}
      <h2 className="px-4 py-5 text-2xl font-black text-gray-900">
  Recommended
</h2>

<div className="relative">
  <ArrowButton
    direction="left"
    position="left"
    onClick={() => scrollByAmount(recommendedRef, "left")}
  />

  <div
    ref={recommendedRef}
    className="flex gap-5 overflow-x-auto px-4 pb-8 scrollbar-hide"
  >
    {recommendedItems.map((item) => (
      <FoodCard key={item.name} item={item} />
    ))}
  </div>

  <ArrowButton
    direction="right"
    position="right"
    onClick={() => scrollByAmount(recommendedRef, "right")}
  />
</div>

<h2 className="px-4 py-5 text-2xl font-black text-orange-600">
  Winter Special 
</h2>

<div className="relative">
  <ArrowButton
    direction="left"
    position="left"
    onClick={() => scrollByAmount(winterTrackRef, "left")}
  />

  <div
    ref={winterTrackRef}
    className="flex gap-5 overflow-x-auto px-4 pb-10 scrollbar-hide"
  >
    {winterSpecialItems.map((item) => (
      <FoodCard key={item.name} item={item} />
    ))}
  </div>

  <ArrowButton
    direction="right"
    position="right"
    onClick={() => scrollByAmount(winterTrackRef, "right")}
  />
</div>


      {/* FAB */}
      {!showCategory && (
        <button
          onClick={() => setShowCategory(true)}
          className="fixed bottom-8 right-6 z-40 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-black text-white shadow-2xl"
        >
          <span className="text-2xl">📖</span>
          <span className="text-xs font-medium">MENU</span>
        </button>
      )}

      {/* CATEGORY MODAL */}
      {showCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="w-11/12 max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="mb-5 text-xl font-black text-green-700">Recommended for you</h3>
            {["Winter Special", "Indian Snacks", "Chinese", "Main Course", "Desserts"].map((c, i) => (
              <div
                key={c}
                onClick={() => setShowCategory(false)}
                className="flex items-center justify-between border-b border-gray-200 py-5 last:border-0"
              >
                <span className="text-lg font-medium">{c}</span>
                <span className="text-gray-500">{i + 3}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowCategory(false)}
            className="fixed bottom-8 right-6 rounded-full bg-gray-900 px-8 py-4 text-white shadow-2xl"
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* FOOD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80">
          <div className="h-[85vh] w-full max-w-lg rounded-t-3xl bg-white shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 z-10 h-10 w-10 rounded-full bg-black/50 text-white"
            >
              ×
            </button>
            <div className="relative h-1/2 overflow-hidden rounded-t-3xl bg-gradient-to-br from-orange-600 to-orange-900">
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div>
                  <p className="text-3xl font-black">3D / AR View</p>
                  <p className="mt-3 text-lg opacity-90">Coming Soon!</p>
                </div>
              </div>
            </div>
            <div className="p-6 pt-8">
              <h2 className="text-3xl font-black text-gray-900">{selectedFood.title}</h2>
              <p className="mt-3 text-3xl font-black text-green-700">₹{selectedFood.price}</p>
              <div className="mt-8 flex gap-4">
                <button className="flex-1 rounded-2xl bg-green-700 py-5 text-lg font-bold text-white shadow-lg">
                  ADD +
                </button>
                <button className="flex-1 rounded-2xl border-2 border-orange-600 py-5 text-lg font-bold text-orange-600">
                  📷 View in AR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
