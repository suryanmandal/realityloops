"use client";

import React, { useState } from "react";
import { Star, Video } from "lucide-react";
import Link from "next/link";

interface CardProps {
  id: number;
  title: string;
  author: string;
  price: string;
  rating: number;
  reviews?: number;
  image: string;
}

export default function Card({
  id,
  title,
  author,
  price,
  rating,
  reviews = 247,
  image,
}: CardProps) {
  const [isFav, setIsFav] = useState<boolean>(false);

  return (
    <Link href={`/details/${id}`} className="block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden cursor-pointer">
        {/* Image Section */}
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-44 object-cover rounded-t-2xl"
          />

          {/* Favourite (Heart) Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFav((s) => !s);
            }}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 transition-all duration-200"
            >
              <path
                d="M12.001 21s-7.5-5.06-9.75-8.1C-0.25 9.3 3.6 4.5 8.5 7.3c1.9 1.2 3.5 3 3.5 3s1.6-1.8 3.5-3C20.4 4.5 24.25 9.3 21.75 12.9 19.5 15.94 12.001 21 12.001 21z"
                fill={isFav ? "#a855f7" : "none"}
                stroke={isFav ? "#7c3aed" : "#4b5563"}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Overlay Title */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h3 className="text-white text-lg font-semibold text-center px-3">
              {title}
            </h3>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center mb-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt={author}
              className="h-8 w-8 rounded-full object-cover mr-2"
            />
            <span className="text-xs font-medium text-gray-900">{author}</span>
            <span className="ml-2 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap">
              Reality Loops Choice
            </span>
          </div>

          <p className="text-sm text-gray-800 mb-3 leading-snug">
            I will{" "}
            <span className="text-indigo-600 underline hover:text-indigo-800">
              create and optimize high-converting Facebook ad campaigns
            </span>{" "}
            for your business
          </p>

          <div className="flex items-center text-sm text-gray-700 mb-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">({reviews})</span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Video className="h-4 w-4 mr-2 text-blue-500" />
            Offers video consultations
          </div>

          <p className="text-lg font-semibold text-gray-900">
            From <span className="font-bold">{price}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
