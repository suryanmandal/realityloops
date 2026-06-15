"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";

export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/");

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const r = params.get("redirect");
      if (r) setRedirectUrl(r);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/user/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save customer token specifically to prevent collision
        localStorage.setItem("userToken", data.token);

        // Redirect back to restaurant or home page
        router.push(redirectUrl);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please check your internet connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-slate-950 to-emerald-950/20 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Immersive 3D Dining Experience
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            Customer Login
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to start ordering your favorite foods in 3D!
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800/80 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-sm text-slate-400">
            Don't have a customer account?{" "}
            <Link href={redirectUrl !== "/" ? `/restaurant/auth/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/restaurant/auth/signup"} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}