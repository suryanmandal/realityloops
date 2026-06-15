"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ShoppingBag, Plus, Minus, Check, X, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";

// DYNAMIC IMPORT: Prevents Next.js SSR document window crashes
const Model3DViewer = dynamic(() => import("@/components/Model3DViewer"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#131926]/40 flex items-center justify-center text-gray-400 font-semibold text-sm">Loading Interactive 3D Dish...</div>
});

interface FoodItem {
  _id?: string;
  name: string;
  oldPrice: string;
  newPrice: string;
  image: string;
  isVeg: boolean;
  arModelPath?: string;
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

interface Restaurant {
  restaurantName: string;
  ownerName: string;
  phone: string;
  address: string;
  email: string;
  heroImage?: string;
}

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export default function Page() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(1);
  const [showCategory, setShowCategory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem>({ name: "", oldPrice: "", newPrice: "", image: "", isVeg: true });
  
  const recommendedRef = useRef<HTMLDivElement>(null);
  const winterTrackRef = useRef<HTMLDivElement>(null);
  
  // Real database states
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart & Ordering States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState("Table 5");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${process.env.NEXT_PUBLIC_API}/${cleanPath}`;
  };

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

  // Fetch Restaurant Account & Real Database Products
  const fetchMenuData = async () => {
    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        setLoading(false);
        return;
      }

      // 1. Fetch Restaurant Account Details
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/account`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setRestaurant(result.data.restaurant);
      }

      // 2. Fetch Active Products from the Backend Database
      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/restaurant/product`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (productsRes.ok) {
        const prodResult = await productsRes.json();
        // Filter for active/available products
        const activeProds = (prodResult.data.products || []).filter((p: any) => p.isAvailable !== false);
        setDbProducts(activeProds);
      }

    } catch (err) {
      console.error("Failed to fetch immersive menu resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      if (track.clientWidth === 0) return;
      const index = Math.round(track.scrollLeft / track.clientWidth) + 1;
      setSlide(index);
    };
    track.addEventListener("scroll", onScroll);
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Map database products to UI structures or fall back to static items
  const dynamicRecommended = dbProducts.length > 0 
    ? dbProducts.map((p: any) => ({
        _id: p._id,
        name: p.title,
        oldPrice: (p.mrp || p.price * 1.2).toFixed(0),
        newPrice: p.price.toFixed(0),
        image: getFullImageUrl(p.image),
        isVeg: p.isVegetarian ?? true,
        arModelPath: p.arModelPath ? getFullImageUrl(p.arModelPath) : undefined
      }))
    : recommendedItems;

  const openModal = (item: FoodItem) => {
    setSelectedFood(item);
    setShowModal(true);
  };

  // Cart operations
  const addToCart = (item: FoodItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Avoid triggering details modal when clicking ADD directly
    
    // Fallback/standard ID for static items
    const productId = item._id || `static-${item.name}`;
    const price = parseFloat(item.newPrice);

    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) {
        return prev.map((c) =>
          c.productId === productId
            ? { ...c, quantity: c.quantity + 1, subtotal: (c.quantity + 1) * price }
            : c
        );
      }
      return [
        ...prev,
        {
          productId,
          productName: item.name,
          quantity: 1,
          unitPrice: price,
          subtotal: price,
        },
      ];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = item.quantity + delta;
            return {
              ...item,
              quantity: nextQty,
              subtotal: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Submit Order to backend (POST /api/v1/staff/orders)
  const submitOrder = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);
    setOrderError("");

    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No restaurant authentication found. Please log in first.");
      }

      const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

      // Clean items to ensure standard ObjectId formatting for product ID
      const cleanedItems = cart.map((item) => {
        const hasValidId = item.productId && !item.productId.startsWith("static-");
        return {
          productId: hasValidId ? item.productId : "60f42307273a4592b1979966", // Seeded Pizza objectId fallback
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        };
      });

      const orderPayload = {
        tableNumber: tableNumber || "Table 5",
        items: cleanedItems,
        totalAmount,
        paymentAmount: totalAmount,
        customerNotes: "Order placed directly from customer 3D interactive tablet."
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/staff/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit order to dashboard.");
      }

      setOrderSuccess(true);
      setCart([]); // Clear cart
      
      // Auto close sheets after success delay
      setTimeout(() => {
        setOrderSuccess(false);
        setShowCart(false);
      }, 3000);

    } catch (err: any) {
      console.error("Order submission failed:", err);
      setOrderError(err.message || "Network error placing table order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const displayRestaurantName = restaurant?.restaurantName || "one8 Commune";
  const displayOwner = restaurant?.ownerName || "Virat Kohli";
  const displayAddress = restaurant?.address || "18 World Cup Avenue, Cricket Enclave, New Delhi";
  const displayPhone = restaurant?.phone || "9876543210";
  const displayEmail = restaurant?.email || "pizza@grandpizzeria.com";

  const FoodCard = ({ item }: { item: FoodItem }) => (
    <div
      onClick={() => openModal(item)}
      className="group relative w-52 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl md:w-60 border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden md:h-56">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80`;
          }}
        />
        {/* Veg/Non-Veg Icon */}
        <div
          className={`absolute top-4 left-4 flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white shadow`}
        >
          <div className={`h-2.5 w-2.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
        </div>
        {/* Discount Price Tag */}
        <div className="absolute bottom-4 left-4 rounded-lg bg-yellow-400 px-3.5 py-1.5 text-sm font-extrabold text-black shadow-lg">
          ₹{item.newPrice}
        </div>
        
        {/* ADD Button - always styled, pops on hover */}
        <div className="absolute bottom-4 right-4 md:translate-y-16 md:opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button 
            onClick={(e) => addToCart(item, e)}
            className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-5 py-2 text-xs font-black text-white shadow-lg tracking-wider uppercase border border-emerald-500/20 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="truncate text-base font-bold text-gray-900">{item.name}</h3>
        <p className="mt-1 truncate text-xs text-gray-400 font-semibold">Recommended specialty dish</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center select-none text-gray-300">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wider animate-pulse">Initializing 3D Menu Ambiance...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfd] pb-24 font-sans select-none relative overflow-x-hidden">
      
      {/* Dynamic Ambient Hero Poster Slider Background */}
      <section className="relative h-[48vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#fcfcfd] via-black/35 to-black/55" />
        
        {/* Hero image loader */}
        {restaurant?.heroImage ? (
          <img 
            src={getFullImageUrl(restaurant.heroImage)} 
            alt="Restaurant dynamic banner" 
            className="w-full h-full object-cover scale-100 animate-[pulse_10s_ease-in-out_infinite]"
          />
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" 
            alt="Ambience fallback poster"
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute left-6 bottom-6 z-20 max-w-xl text-white">
          <h1 className="text-4xl font-black tracking-tight text-white">{displayRestaurantName}</h1>
          <p className="text-xs text-gray-300 mt-2 font-medium tracking-wide flex items-center">
            📍 {displayAddress}
          </p>
        </div>
      </section>

      {/* Info Card section */}
      <section className="relative z-25 -mt-8 px-4">
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <span className="inline-block rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 border border-emerald-500/10">✨ Interactive Tablet</span>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  👤 <strong className="font-semibold text-gray-800">Owner:</strong> {displayOwner}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 w-11 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition shadow-sm cursor-pointer"
              title="View Map"
            >
              📍
            </a>
            <a 
              href={`tel:${displayPhone}`}
              className="h-11 w-11 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition shadow-sm cursor-pointer"
              title="Call Restaurant"
            >
              📞
            </a>
            <a 
              href={`mailto:${displayEmail}`}
              className="h-11 w-11 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition shadow-sm cursor-pointer"
              title="Email Info"
            >
              ✉️
            </a>
          </div>
        </div>
      </section>

      {/* Recommended Grid */}
      <section className="max-w-5xl mx-auto mt-8">
        <h2 className="px-4 text-2xl font-black tracking-tight text-gray-900 mb-4">
          Chef Specialties & Recommended
        </h2>
        <div className="relative">
          <ArrowButton direction="left" position="left" onClick={() => scrollByAmount(recommendedRef, "left")} />
          <div ref={recommendedRef} className="flex gap-5 overflow-x-auto px-4 pb-8 scrollbar-hide">
            {dynamicRecommended.map((item) => (
              <FoodCard key={item.name} item={item} />
            ))}
          </div>
          <ArrowButton direction="right" position="right" onClick={() => scrollByAmount(recommendedRef, "right")} />
        </div>
      </section>

      {/* Winter Specials */}
      <section className="max-w-5xl mx-auto mt-4">
        <h2 className="px-4 text-2xl font-black tracking-tight text-orange-600 mb-4">
          Winter Seasonal Treats
        </h2>
        <div className="relative">
          <ArrowButton direction="left" position="left" onClick={() => scrollByAmount(winterTrackRef, "left")} />
          <div ref={winterTrackRef} className="flex gap-5 overflow-x-auto px-4 pb-8 scrollbar-hide">
            {winterSpecialItems.map((item) => (
              <FoodCard key={item.name} item={item} />
            ))}
          </div>
          <ArrowButton direction="right" position="right" onClick={() => scrollByAmount(winterTrackRef, "right")} />
        </div>
      </section>

      {/* Category FAB & Cart FAB */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-4">
        {/* Menu category filter button */}
        {!showCategory && (
          <button
            onClick={() => setShowCategory(true)}
            className="flex h-14 px-6 gap-2 items-center justify-center rounded-full bg-black text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer"
          >
            <span className="text-xl">📖</span>
            <span className="text-xs font-black uppercase tracking-wider">Categories</span>
          </button>
        )}

        {/* Shopping bag cart button */}
        {cartItemsCount > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="flex h-14 px-6 gap-2.5 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl hover:scale-105 transition-transform border border-emerald-500/20 cursor-pointer relative"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider">Cart ({cartItemsCount})</span>
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center text-[10px] font-black border-2 border-white shadow">
              {cartItemsCount}
            </span>
          </button>
        )}
      </div>

      {/* CATEGORY SELECTOR MODAL */}
      {showCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-11/12 max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-slideUp">
            <h3 className="mb-4 text-lg font-black text-emerald-600">Category Catalog</h3>
            {["Recommended", "Winter Specials", "Indian Breads", "Chinese Wok", "Pizzas & Pastas", "Desserts"].map((c, i) => (
              <div
                key={c}
                onClick={() => setShowCategory(false)}
                className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0 cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <span className="text-sm font-semibold text-gray-800">{c}</span>
                <span className="text-[10px] font-bold text-gray-400 bg-slate-100 px-2 py-0.5 rounded-full">{i + 3} items</span>
              </div>
            ))}
            <button
              onClick={() => setShowCategory(false)}
              className="w-full mt-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-sm cursor-pointer"
            >
              ✕ Close Catalog
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC FOOD DETAIL / 3D VIEWER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="h-[85vh] w-full max-w-lg rounded-t-3xl bg-white shadow-2xl flex flex-col relative animate-slideUp">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 z-50 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white text-xl font-bold cursor-pointer"
            >
              ×
            </button>
            
            {/* Visual Header containing Google <model-viewer> or Fallback image */}
            <div className="relative h-1/2 overflow-hidden rounded-t-3xl border-b border-gray-100 bg-[#0f172a]">
              {selectedFood.arModelPath ? (
                <Model3DViewer
                  src={selectedFood.arModelPath}
                  alt={`3D representation of ${selectedFood.name}`}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6 bg-gradient-to-br from-emerald-950/20 to-slate-950/40">
                  <div>
                    <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-2 opacity-50 animate-pulse" />
                    <p className="text-2xl font-black text-white">3D Ambience Experience</p>
                    <p className="mt-1 text-xs text-gray-400 max-w-xs font-semibold leading-relaxed">No 3D asset bound yet. The restaurant administrator can snap a photo to unlock the full 3D interactive rotation.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{selectedFood.name}</h2>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      selectedFood.isVeg ? 'bg-green-50 text-green-700 border-green-500/10' : 'bg-red-50 text-red-700 border-red-500/10'
                    }`}>
                      {selectedFood.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-600">₹{selectedFood.newPrice}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">Our premium, chef-tailored food item prepared using only fresh, locally sourced gourmet ingredients. Fully customized and baked in our premium kitchen chambers.</p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    addToCart(selectedFood);
                    setShowModal(false);
                  }}
                  className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-lg py-4 text-sm flex items-center justify-center space-x-2 cursor-pointer border border-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Order Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART BOTTOM SHEET MODAL */}
      {showCart && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fadeIn">
          {/* Dismiss area */}
          <div className="absolute inset-0" onClick={() => !placingOrder && setShowCart(false)} />
          
          <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl p-6 flex flex-col max-h-[85vh] relative z-10 animate-slideUp">
            
            {/* Header */}
            <header className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-black text-gray-900">Your Order Bag</h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">Dishes will be placed instantly to the kitchen live orders tracker</p>
              </div>
              {!placingOrder && (
                <button 
                  onClick={() => setShowCart(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </header>

            {/* Success state */}
            {orderSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-bounce">
                  <Check className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900">Order Placed Successfully!</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed font-semibold">The kitchen has received your dishes. Monitor your table status for real-time preparation updates.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Scrollable Cart Items list */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-b-0">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm truncate max-w-xs">{item.productName}</h4>
                        <span className="text-xs text-gray-500 font-medium">₹{item.unitPrice} each</span>
                      </div>
                      
                      {/* Plus / Minus Counter block */}
                      <div className="flex items-center space-x-3.5 bg-slate-50 border border-gray-200 rounded-xl px-2.5 py-1">
                        <button 
                          onClick={() => updateCartQuantity(item.productId, -1)}
                          disabled={placingOrder}
                          className="text-gray-500 hover:text-red-500 disabled:opacity-50 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-gray-800 select-none min-w-[12px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.productId, 1)}
                          disabled={placingOrder}
                          className="text-gray-500 hover:text-emerald-500 disabled:opacity-50 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Table config */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  
                  {/* Table Number setup */}
                  <div className="flex items-center justify-between bg-slate-50 border border-gray-200 rounded-2xl p-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Table Location</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">Your table number in restaurant workspace</p>
                    </div>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      disabled={placingOrder}
                      className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-black uppercase text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6", "Table 7", "Table 12"].map((table) => (
                        <option key={table} value={table}>{table}</option>
                      ))}
                    </select>
                  </div>

                  {/* Summary calculations */}
                  <div className="flex items-center justify-between text-base font-black px-1">
                    <span className="text-gray-500">Order Subtotal</span>
                    <span className="text-gray-900 text-xl">₹{cartSubtotal}</span>
                  </div>

                  {orderError && (
                    <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-semibold flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{orderError}</span>
                    </div>
                  )}

                  {/* Place Order CTA Button */}
                  <button
                    onClick={submitOrder}
                    disabled={placingOrder || cart.length === 0}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-black text-white shadow-lg shadow-emerald-500/10 border border-emerald-500/20 py-4.5 rounded-2xl text-sm flex items-center justify-center space-x-2 cursor-pointer transition-all duration-200"
                  >
                    {placingOrder ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending dishes to kitchen...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order (₹{cartSubtotal})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
