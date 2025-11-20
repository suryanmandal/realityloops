"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const filters = [
  { title: "Game type", options: ["AR", "VR", "Metaverse"] },
  { title: "Game engine", options: ["Unity", "Unreal", "Godot"] },
  { title: "Genre", options: ["Action", "Puzzle", "Simulation", "Adventure"] },
  { title: "Plugins", options: ["Physics", "AI", "Multiplayer", "Sound FX"] },
  { title: "Service includes", options: ["Design", "Development", "Testing"] },
  { title: "Delivery time", options: ["1 Day", "3 Days", "1 Week"] },
  { title: "Budget", options: ["$10 - $50", "$50 - $100", "$100+"] },
];

export default function Filters() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <aside className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Service Options
      </h2>

      <div className="space-y-2">
        {filters.map((filter, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-2 last:border-none"
          >
            {/* Header */}
            <button
              onClick={() => toggleSection(index)}
              className="flex justify-between items-center w-full py-2 text-left text-gray-800 font-medium hover:text-purple-600 transition"
            >
              {filter.title}
              {openIndex === index ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Dropdown Options */}
            {openIndex === index && (
              <div className="pl-2 mt-2 space-y-1 animate-fadeIn">
                {filter.options.map((option, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-purple-600 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
