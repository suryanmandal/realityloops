"use client";
import { NextPage } from 'next';
import Image from 'next/image';
import {
  StarIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid';

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import TopNav from '@/app/components/TobNav';
import Footer from '@/app/components/Footer';

const DetailsPage: NextPage = () => {
  const [showFaq, setShowFaq] = useState<string | null>(null);

  const faqs = [
    {
      question: 'What is the delivery time for +2 days?',
      answer:
        'Delivery time is the expected turnaround time from order placement to delivery completion.',
    },
    {
      question: 'Can you explain the 3D VFX detail?',
      answer:
        '3D VFX involves creating realistic digital effects to enhance your videos or movies using Unreal Engine.',
    },
    {
      question: 'Can you make game playable?',
      answer:
        'Yes, I can create playable game demos or prototypes depending on the scope of your project.',
    },
  ];

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen">
     <Navbar/>
     <TopNav/>

      {/* Breadcrumb and Title */}
      <section className="max-w-7xl mx-auto p-6 bg-white rounded-lg mt-6 shadow-sm">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 space-x-2">
          <span className="hover:text-indigo-600 cursor-pointer"> Graphics & Design </span>
          <span> &gt; </span>
          <span className="hover:text-indigo-600 cursor-pointer">Game Design</span>
          <span> &gt; </span>
          <span className="text-gray-700 font-semibold cursor-default">
            I will develop unreal engine games, vr solutions, and 3d environments
          </span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-3">
          I will develop unreal engine games, or VR solutions, and 3d environments
        </h1>

        {/* Seller Info and Rating */}
        <div className="flex items-center space-x-3 mb-6">
          <Image
            src="/ar-image.jpg"
            alt="Seller"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <div className="font-semibold">Nikola Tesla</div>
            <div className="flex items-center space-x-1 text-yellow-400 text-sm">
              <StarIcon className="w-4 h-4" />
              <span>4.9</span>
              <span className="text-gray-400">(1.7k)</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Media and description */}
          <article className="md:col-span-2">
            {/* Main Image */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 shadow-md">
              <Image
                src="/ar-image.jpg"
                alt="Unreal Engine"
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {[
                '/ar-image.jpg',
                '/vr-headset.png',
                '/ar-image.jpg'
              ].map((src, idx) => (
                <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden shadow-sm border border-gray-300 cursor-pointer">
                  <Image src={src} alt={`Thumbnail ${idx + 1}`} width={80} height={80} objectFit="cover" />
                </div>
              ))}
            </div>

            {/* Description */}
            <section className="prose max-w-none text-gray-800 mb-8">
              <p>
                I will develop Unreal Engine games, VR solutions, and 3D environments tailored
                to your needs. Whether you're looking for immersive VR experiences, engaging
                games, or detailed 3D assets, I will deliver high-quality work.
              </p>
              <h3> What’s Included </h3>
              <ul>
                <li>Game development using Unreal Engine 4/5</li>
                <li>3D assets modeling and texturing</li>
                <li>VR environment creation</li>
                <li>UI and game mechanics design</li>
                <li>Multiplatform compatibility</li>
              </ul>
              <h3> Why Choose Me? </h3>
              <p>
                Over 5 years of experience working with Unreal Engine and VR applications. Passionate
                about making visually stunning and mechanically engaging content.
              </p>
            </section>

            {/* Reviews Preview */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <Image
                      src="/ar-image.jpg"
                      alt="Reviewer"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-700">alicewalker23</p>
                      <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4" />
                          ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Nikola created a fantastic 3d game environment for our project. Highly recommended!
                  </p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <Image
                      src="/ar-image.jpg"
                      alt="Reviewer"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-700">gameDevPro99</p>
                      <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4" />
                          ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Delivered everything on time and exceeded expectations on quality.
                  </p>
                </div>
              </div>
            </section>
          </article>

          {/* Right Column - Pricing and Packages */}
          <aside className="sticky top-20 bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="text-gray-900 text-lg font-semibold">Select a Package</div>

            {/* Package Tabs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'Basic', price: '$95', delivery: '7 Days' },
                { title: 'Standard', price: '$185', delivery: '10 Days' },
                { title: 'Premium', price: '$285', delivery: '15 Days' },
              ].map((pkg) => (
                <div
                  key={pkg.title}
                  className="border rounded-md p-3 cursor-pointer hover:border-indigo-600"
                >
                  <h4 className="text-sm font-semibold">{pkg.title}</h4>
                  <p className="text-lg font-bold text-indigo-600">{pkg.price}</p>
                  <p className="text-xs text-gray-500">{pkg.delivery} delivery</p>
                </div>
              ))}
            </div>

            {/* Package Details (Basic as example) */}
            <div className="mt-4 text-gray-700">
              <ul className="space-y-2 text-sm">
                <li>
                  <CheckCircleIcon className="inline w-5 h-5 text-green-500 mr-2" />
                  3D environment creation
                </li>
                <li>
                  <CheckCircleIcon className="inline w-5 h-5 text-green-500 mr-2" />
                  Game mechanics design
                </li>
                <li>
                  <CheckCircleIcon className="inline w-5 h-5 text-green-500 mr-2" />
                  VR support for Oculus
                </li>
                <li>
                  <CheckCircleIcon className="inline w-5 h-5 text-green-500 mr-2" />
                  Source files included
                </li>
              </ul>
            </div>

            {/* Order Button */}
            <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 flex items-center justify-center space-x-2">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Continue ($95)</span>
            </button>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>

          {faqs.map(({ question, answer }) => (
            <div key={question} className="mb-4 border-b border-gray-200 pb-3">
              <button
                onClick={() =>
                  setShowFaq(showFaq === question ? null : question)
                }
                className="flex items-center justify-between w-full font-medium text-lg focus:outline-none"
              >
                {question}
                {showFaq === question ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {showFaq === question && (
                <p className="text-gray-700 mt-2">{answer}</p>
              )}
            </div>
          ))}
        </section>

        {/* Recommended For You */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 max-w-7xl mx-auto px-6">
            Recommended for you
          </h2>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded shadow hover:shadow-lg transition cursor-pointer">
                <div className="relative w-full aspect-video rounded-t overflow-hidden">
                  <Image
                    src={`/ar-image.jpg`}
                    alt={`Recommended ${n}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    Unreal Engine game development service {n}
                  </h3>
                  <p className="text-sm text-gray-600">by Some Seller</p>
                  <div className="flex items-center space-x-1 mt-1 text-yellow-400">
                    <StarIcon className="w-4 h-4" />
                    <span>4.{5 + n}</span>
                    <span className="text-gray-400">(100+)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
<Footer/>
    </main>
  );
};

export default DetailsPage;
