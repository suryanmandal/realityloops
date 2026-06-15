"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, X } from "lucide-react";

interface Restaurant {
    _id: string;
    restaurantName: string;
    ownerName: string;
    address: string;
}

export default function PublicNavbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [showExplore, setShowExplore] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
    const exploreRef = useRef<HTMLDivElement>(null);
    const loginRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("userToken");
            setIsCustomerLoggedIn(!!token);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        setIsCustomerLoggedIn(false);
        router.push("/");
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };

    // Fetch restaurants for explore
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
            }
        };
        fetchRestaurants();
    }, []);

    // Handle real-time search with API
    useEffect(() => {
        const searchRestaurants = async () => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                setShowSearchResults(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API}/api/v1/public/restaurants?search=${encodeURIComponent(searchQuery)}&limit=10`
                    );
                    const data = await response.json();
                    if (data.success) {
                        setSearchResults(data.data.restaurants);
                    }
                } catch (error) {
                    console.error("Error searching restaurants:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowSearchResults(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchRestaurants();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                exploreRef.current &&
                !exploreRef.current.contains(event.target as Node)
            ) {
                setShowExplore(false);
            }
            if (
                loginRef.current &&
                !loginRef.current.contains(event.target as Node)
            ) {
                setShowLogin(false);
            }
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // If there are search results, navigate to first one or keep dropdown open
        if (searchResults.length > 0) {
            router.push(`/res/${searchResults[0]._id}`);
            setShowSearchResults(false);
            setSearchQuery("");
        }
    };

    return (
        <nav className="w-full bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Logo */}
                <div
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-xl w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
                        RL
                    </div>
                    <span className="text-xl font-bold text-gray-900 hidden sm:block">
                        Reality<span className="text-indigo-600">Loops</span>
                    </span>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md relative" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setShowSearchResults(true)}
                            placeholder="Search restaurants..."
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setShowSearchResults(false);
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                            <div className="p-2">
                                {isSearching ? (
                                    <div className="px-3 py-8 flex flex-col items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                                        <p className="text-sm text-gray-500">Searching...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                                            Found {searchResults.length} restaurant{searchResults.length !== 1 ? 's' : ''}
                                        </div>
                                        {searchResults.map((restaurant) => (
                                            <button
                                                key={restaurant._id}
                                                onClick={() => {
                                                    router.push(`/res/${restaurant._id}`);
                                                    setShowSearchResults(false);
                                                    setSearchQuery("");
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-md transition-colors group"
                                            >
                                                <div className="font-medium text-gray-900 group-hover:text-indigo-600">
                                                    {restaurant.restaurantName}
                                                </div>
                                                <div className="text-xs text-gray-500 line-clamp-1">
                                                    {restaurant.address}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <div className="px-3 py-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">No restaurants found</p>
                                        <p className="text-xs text-gray-400">Try a different search term</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </form>

                {/* RealityForge */}
                <button
                    onClick={() => router.push("/forge")}
                    className="flex items-center gap-1.5 px-4 py-2 text-slate-700 hover:text-emerald-600 font-semibold transition-colors text-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    RealityForge 3D
                </button>

                {/* Explore Dropdown */}
                <div className="relative" ref={exploreRef}>

                    <button
                        onClick={() => setShowExplore(!showExplore)}
                        className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                    >
                        Explore
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${showExplore ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {showExplore && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                            <div className="p-2">
                                <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                                    Top Restaurants
                                </div>
                                {restaurants.length > 0 ? (
                                    restaurants.slice(0, 5).map((restaurant) => (
                                        <button
                                            key={restaurant._id}
                                            onClick={() => {
                                                router.push(`/res/${restaurant._id}`);
                                                setShowExplore(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                                        >
                                            <div className="font-medium text-gray-900">
                                                {restaurant.restaurantName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {restaurant.address}
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                        No restaurants found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Are you a restaurant owner? */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <span className="text-sm text-gray-700">
                        Are you a restaurant owner?
                    </span>
                    <button
                        onClick={() => router.push("/restaurant/auth/signup")}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline"
                    >
                        Join us
                    </button>
                </div>

                {/* Customer Login / Logout Button */}
                {isCustomerLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] text-sm"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => router.push("/restaurant/auth/login")}
                        className="flex items-center gap-1 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] text-sm"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile "Join us" */}
            <div className="lg:hidden mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <span className="text-sm text-gray-700">Restaurant owner?</span>
                <button
                    onClick={() => router.push("/restaurant/auth/signup")}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline"
                >
                    Join us
                </button>
            </div>
        </nav>
    );
}
