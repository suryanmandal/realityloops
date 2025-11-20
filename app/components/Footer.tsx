"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
  FaLock,
  FaBullhorn,
  FaGift,
  FaQuestionCircle,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0d1117] text-gray-400 text-sm mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* ABOUT */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">About</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
            <li><a href="#" className="hover:text-white">Corporate Information</a></li>
          </ul>
        </div>

        {/* ECOSYSTEM */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Ecosystem</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Reality Loops Studio</a></li>
            <li><a href="#" className="hover:text-white">Creator Hub</a></li>
            <li><a href="#" className="hover:text-white">Agency Network</a></li>
            <li><a href="#" className="hover:text-white">Marketplace Partners</a></li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Help</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Payments & Refunds</a></li>
            <li><a href="#" className="hover:text-white">Shipping</a></li>
            <li><a href="#" className="hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:text-white">Support Center</a></li>
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Policies</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Terms of Use</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
            <li><a href="#" className="hover:text-white">Grievance Redressal</a></li>
          </ul>
        </div>

        {/* COMPANY INFO */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Company Info</h3>
          <p className="text-gray-300 font-medium">Reality Loops Technologies Pvt. Ltd.</p>
          <p className="mt-2 text-gray-400">
            Lovely Professional University,<br />
            Phagwara, Punjab, India – 144001
          </p>
          <p className="mt-2">CIN: B03XXXXXXXXXXXXXX</p>
          <p className="mt-2">
            Email:{" "}
            <a href="mailto:realityloops1@gmail.com" className="text-blue-400 hover:underline">
              realityloops1@gmail.com
            </a>
          </p>
          <p className="mt-1">
            Contact:{" "}
            <a href="tel:+917602548747" className="text-green-400 hover:underline">
              +91 7602548747
            </a>
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#"><FaFacebookF className="hover:text-white" /></a>
            <a href="#"><FaTwitter className="hover:text-white" /></a>
            <a href="#"><FaPinterestP className="hover:text-white" /></a>
            <a href="#"><FaLinkedinIn className="hover:text-white" /></a>
            <a href="#"><FaYoutube className="hover:text-white" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 bg-[#10151c]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-gray-400 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1"><FaLock /> Become a Seller</span>
            <span className="flex items-center gap-1"><FaBullhorn /> Advertise</span>
            <span className="flex items-center gap-1"><FaGift /> Gift Cards</span>
            <span className="flex items-center gap-1"><FaQuestionCircle /> Help Center</span>
          </div>

          <div className="text-center md:text-right">
            © 2025 Reality Loops. All rights reserved.
          </div>

          {/* Payment Logos */}
          <div className="flex space-x-2">
            <span className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-semibold">VISA</span>
            <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-semibold">MC</span>
            <span className="bg-white text-purple-600 px-2 py-1 rounded text-xs font-semibold">RuPay</span>
            <span className="bg-white text-green-600 px-2 py-1 rounded text-xs font-semibold">UPI</span>
            <span className="bg-white text-blue-800 px-2 py-1 rounded text-xs font-semibold">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
