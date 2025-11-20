export default function Packages() {
  const tiers = [
    { name: "Basic", price: "₹11,000", features: ["1 Scene", "Basic Lighting", "AR setup"] },
    { name: "Standard", price: "₹25,000", features: ["3 Scenes", "Dynamic Lighting", "VR integration"] },
    { name: "Premium", price: "₹42,000", features: ["Full Game", "AI scripting", "Cinematic Design"] },
  ];

  return (
    <section className="bg-white mt-8 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Compare Packages</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <div key={t.name} className="border rounded-lg p-4 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-2">{t.name}</h3>
            <p className="text-indigo-600 font-bold text-lg">{t.price}</p>
            <ul className="mt-3 text-sm text-gray-600 space-y-1">
              {t.features.map((f) => (
                <li key={f}>✅ {f}</li>
              ))}
            </ul>
            <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Continue ({t.price})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
