import Image from "next/image";

export default function Recommended() {
  const recs = [
    { title: "I will build VR environments", price: "₹13,000", image: "/vrSet.jfif" },
    { title: "AR game development", price: "₹15,000", image: "/vrSet.jfif" },
  ];

  return (
    <section className="bg-white mt-8 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {recs.map((r, i) => (
          <div key={i} className="border rounded-lg p-2 hover:shadow-md transition">
            <Image
              src={r.image}
              alt={r.title}
              width={200}
              height={120}
              className="rounded-md object-cover w-full"
            />
            <p className="mt-2 text-sm font-medium">{r.title}</p>
            <p className="text-sm text-indigo-600">{r.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
