"use client";
import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube,
    FaInstagram,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#0d1117] text-gray-400 text-sm mt-10">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* ABOUT */}
                <div>
                    <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">About</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">How It Works</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                    </ul>
                </div>

                {/* FOR RESTAURANTS */}
                <div>
                    <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">For Restaurants</h3>
                    <ul className="space-y-2">
                        <li><a href="/restaurant/auth/signup" className="hover:text-white">Partner With Us</a></li>
                        <li><a href="#" className="hover:text-white">Pricing</a></li>
                        <li><a href="#" className="hover:text-white">Resources</a></li>
                        <li><a href="/restaurant/auth/login" className="hover:text-white">Restaurant Login</a></li>
                    </ul>
                </div>

                {/* HELP */}
                <div>
                    <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Help</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                        <li><a href="#" className="hover:text-white">Support Center</a></li>
                        <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* COMPANY INFO */}
                <div>
                    <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Reality Loops</h3>
                    <p className="text-gray-400">
                        Experience food in 3D before you order. The future of dining is here.
                    </p>
                    <p className="mt-4">
                        Email:{" "}
                        <a href="mailto:realityloops1@gmail.com" className="text-indigo-400 hover:underline">
                            realityloops1@gmail.com
                        </a>
                    </p>
                    <p className="mt-1">
                        Contact:{" "}
                        <a href="tel:+917602548747" className="text-indigo-400 hover:underline">
                            +91 7602548747
                        </a>
                    </p>

                    {/* Social Icons */}
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="hover:text-white transition-colors" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn"><FaLinkedinIn /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="YouTube"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 py-4 bg-[#10151c]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-gray-400 text-xs">
                    <div className="text-center md:text-left">
                        © 2026 Reality Loops. All rights reserved.
                    </div>

                    <div className="flex items-center gap-4">
                        <span>Made with ❤️ for better dining experiences</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
