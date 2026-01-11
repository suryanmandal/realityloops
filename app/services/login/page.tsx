"use client";
import AuthLeftPanel from "@/app/components/AuthLeftPanel";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT PANEL */}
      <AuthLeftPanel />

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 bg-white px-10 py-16 flex flex-col justify-center">

        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-600 mt-1">Login to continue</p>
    
     {/* SOCIAL LOGIN BUTTONS */}
        <div className="mt-8 space-y-4">
          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-100">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="text-gray-700 font-medium">Login with Google</span>
          </button>

          {/* Facebook */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-100">
            <img
              src="/facebook-svgrepo-com.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
            <span className="text-gray-700 font-medium">Login with Facebook</span>
          </button>
        </div>

           {/* OR DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Or login with email</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* FORM */}
        <form className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            className="input"
          />

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              className="input w-full"
            />
            <span
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPwd ? "🙈" : "👁️"}
            </span>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700">
            Login
          </button>

        </form>

     

       

        {/* SIGNUP LINK */}
        <p className="text-center text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link href="/services/signup" className="text-blue-600 font-medium underline">
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}
