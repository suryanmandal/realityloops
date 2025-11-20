// components/Section.tsx
"use client";
import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold bg-white p-3 rounded-md mb-4 shadow-sm">
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}
