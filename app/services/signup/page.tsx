"use client";

import AuthLeftPanel from "@/app/components/AuthLeftPanel";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* LEFT PANEL */}
      <AuthLeftPanel />

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 bg-white px-10 py-12 flex flex-col justify-center">
        
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-600 mt-1">Get started with your free trial</p>

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

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">Or sign up with email</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* FORM */}
        <form className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" className="input" />
          <input type="text" placeholder="Last Name" className="input" />
          <input type="text" placeholder="Restaurant Name" className="input col-span-2" />
          <input type="email" placeholder="Email" className="input col-span-2" />

          <div className="relative col-span-2">
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

          <button className="col-span-2 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700">
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link href="/services/login" className="text-blue-600 font-medium underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
