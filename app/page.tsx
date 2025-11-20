"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Card from "./components/Card";
import Footer from "./components/Footer";
import TopNav from "./components/TobNav";
import Filters from "./components/Filters";


const sampleCards = new Array(8).fill(0).map((_, i) => ({
  id: i,
  title: "Setup & Manage Facebook Ads",
  author: "Alex Johnson",
  price: "From ₹11,000",
  rating: 4.7,
  image: "/vrSet.jfif",
}));

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <Navbar />
        <TopNav />
      </div>

      <main className="max-w-[1400px] mx-auto py-6 pt-36 flex gap-4 sm:gap-6 px-2 sm:px-4">
        <aside className="hidden md:block w-1/4 sticky top-36 self-start h-[calc(100vh-9rem)] overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
          <Filters />
        </aside>

        <div className="flex-1">
          <Hero />

          <Section title="AR/VR Platforms">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {sampleCards.map((c) => (
                <Card key={c.id} {...c} />
              ))}
            </div>
          </Section>

          <Section title="XR Development Engines">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {sampleCards.map((c) => (
                <Card key={"eng" + c.id} {...c} />
              ))}
            </div>
          </Section>

          <div className="my-12 border border-dashed border-gray-300 bg-white py-12 text-center text-xl text-indigo-400">
            ADVERTISEMENT
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// const sampleCards = new Array(8).fill(0).map((_, i) => ({
//   id: i,
//   title: "Setup & Manage Facebook Ads",
//   author: "Alex Johnson",
//   price: "From ₹11,000",
//   rating: 4.7,
//   image: "/vrSet.jfif",
// }));

// export default function HomePage() {
//   return (
//     <div className="min-h-screen">
     
//       <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
//         <Navbar />
//         <TopNav />
//       </div>

      
//       <main className="max-w-[1400px] mx-auto py-6 pt-36 flex gap-4 sm:gap-6 px-2 sm:px-4">
        
//         <aside className="hidden md:block w-1/4 sticky top-36 self-start h-[calc(100vh-9rem)] overflow-y-auto bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
//           <Filters />
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1">
//           <Hero />
//           <Section title="AR/VR Platforms">
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {sampleCards.map((c) => (
//                 <Card key={c.id} {...c} />
//               ))}
//             </div>
//           </Section>

//           <Section title="XR Development Engines">
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {sampleCards.map((c) => (
//                 <Card key={"eng" + c.id} {...c} />
//               ))}
//             </div>
//           </Section>

//           <div className="my-12 border border-dashed border-gray-300 bg-white py-12 text-center text-xl text-indigo-400">
//             ADVERTISEMENT
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
