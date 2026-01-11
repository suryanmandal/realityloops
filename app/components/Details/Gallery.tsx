"use client";
import Image from "next/image";

export default function Gallery() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <Image
        src="/ar-image.jpg"
        alt="Unreal Engine Service"
        width={800}
        height={400}
        className="rounded-lg object-cover w-full"
      />
      <div className="flex gap-2 mt-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="relative w-24 h-16">
            <Image
              src="/vr-headset.png"
              alt="Thumbnail"
              fill
              className="object-cover rounded-md cursor-pointer hover:opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
