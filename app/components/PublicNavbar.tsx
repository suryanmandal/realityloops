"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, X, Menu } from "lucide-react";

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const exploreRef = useRef<HTMLDivElement>(null);
    const loginRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLFormElement>(null);
    const mobileSearchRef = useRef<HTMLFormElement>(null);

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
                const base = process.env.NEXT_PUBLIC_API || "https://api.realityloops.in";
                let response;
                try {
                    response = await fetch(
                        `${base}/api/v1/public/restaurants?limit=20`
                    );
                } catch (netErr) {
                    if (base !== "https://api.realityloops.in") {
                        console.warn("Local backend offline. Falling back to production API.");
                        response = await fetch(
                            "https://api.realityloops.in/api/v1/public/restaurants?limit=20"
                        );
                    } else {
                        throw netErr;
                    }
                }
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
                    const base = process.env.NEXT_PUBLIC_API || "https://api.realityloops.in";
                    let response;
                    try {
                        response = await fetch(
                            `${base}/api/v1/public/restaurants?search=${encodeURIComponent(searchQuery)}&limit=10`
                        );
                    } catch (netErr) {
                        if (base !== "https://api.realityloops.in") {
                            console.warn("Local backend offline. Falling back to production API.");
                            response = await fetch(
                                `https://api.realityloops.in/api/v1/public/restaurants?search=${encodeURIComponent(searchQuery)}&limit=10`
                            );
                        } else {
                            throw netErr;
                        }
                    }
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
            if (
                mobileSearchRef.current &&
                !mobileSearchRef.current.contains(event.target as Node)
            ) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            router.push(`/res/${searchResults[0]._id}`);
            setShowSearchResults(false);
            setSearchQuery("");
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className="w-full bg-white border-b border-gray-200 px-4 py-3.5 relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Logo */}
                <div
                    onClick={() => {
                        router.push("/");
                        setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-xl w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
                        RL
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                        Reality<span className="text-indigo-600">Loops</span>
                    </span>
                </div>

                {/* Desktop Search (Hidden on Mobile) */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative" ref={searchRef}>
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setShowSearchResults(true)}
                            placeholder="Search restaurants..."
                            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                                type="button"
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
                                        <p className="text-sm text-gray-500 font-medium mb-1">No restaurants found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </form>

                {/* Desktop Menu Options (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-4">
                    {/* RealityForge */}
                    <button
                        onClick={() => router.push("/forge")}
                        className="flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-emerald-600 font-semibold transition-colors text-sm cursor-pointer"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        RealityForge 3D
                    </button>

                    {/* Explore Dropdown */}
                    <div className="relative" ref={exploreRef}>
                        <button
                            onClick={() => setShowExplore(!showExplore)}
                            className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors text-sm cursor-pointer"
                        >
                            Explore
                            <ChevronDown className={`w-4 h-4 transition-transform ${showExplore ? "rotate-180" : ""}`} />
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
                                                <div className="text-xs text-gray-500 truncate">
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

                    {/* Restaurant Owner badge */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                        <span className="text-xs text-gray-700">Owner?</span>
                        <button
                            onClick={() => router.push("/restaurant/auth/signup")}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                        >
                            Join us
                        </button>
                    </div>

                    {/* Login/Logout Button */}
                    {isCustomerLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-all shadow-sm text-sm cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push("/restaurant/auth/login")}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-sm text-sm cursor-pointer"
                        >
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Hamburger Menu Toggle Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none transition cursor-pointer"
                    aria-label="Toggle Navigation Menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Mobile Dropdown Panel */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg p-4 space-y-4 z-40">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative w-full" ref={mobileSearchRef}>
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowSearchResults(true)}
                                placeholder="Search restaurants..."
                                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setShowSearchResults(false);
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown inside Mobile Menu */}
                        {showSearchResults && searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                <div className="p-2">
                                    {isSearching ? (
                                        <div className="px-3 py-4 text-center text-xs text-gray-500">Searching...</div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map((restaurant) => (
                                            <button
                                                key={restaurant._id}
                                                type="button"
                                                onClick={() => {
                                                    router.push(`/res/${restaurant._id}`);
                                                    setShowSearchResults(false);
                                                    setSearchQuery("");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-md text-sm transition-colors"
                                            >
                                                <div className="font-medium text-gray-900">{restaurant.restaurantName}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-4 text-center text-xs text-gray-500">No restaurants found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Nav Actions */}
                    <div className="flex flex-col gap-1.5">
                        {/* RealityForge */}
                        <button
                            onClick={() => {
                                router.push("/forge");
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full p-2.5 text-slate-700 hover:bg-gray-50 rounded-lg font-semibold text-sm text-left transition"
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            RealityForge 3D
                        </button>

                        {/* Explore List */}
                        <div className="border-t border-gray-100 pt-2 mt-1">
                            <div className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-wider">
                                Top Restaurants
                            </div>
                            {restaurants.length > 0 ? (
                                <div className="grid grid-cols-1 gap-0.5 mt-1">
                                    {restaurants.slice(0, 3).map((restaurant) => (
                                        <button
                                            key={restaurant._id}
                                            onClick={() => {
                                                router.push(`/res/${restaurant._id}`);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 font-medium"
                                        >
                                            {restaurant.restaurantName}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400 px-3 py-2">No restaurants found</div>
                            )}
                        </div>

                        {/* Join Us (Restaurant Owner) */}
                        <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between px-3">
                            <span className="text-xs text-gray-600">Restaurant owner?</span>
                            <button
                                onClick={() => {
                                    router.push("/restaurant/auth/signup");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
                            >
                                Join us
                            </button>
                        </div>

                        {/* Login/Logout */}
                        <div className="pt-3 border-t border-gray-100 mt-2">
                            {isCustomerLoggedIn ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-sm transition text-center shadow-sm"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        router.push("/restaurant/auth/login");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition text-center shadow-sm"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
