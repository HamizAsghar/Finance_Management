'use client'
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-amber-500">About Us</h3>
            <p className="mt-4 text-sm text-gray-400">
              We provide cutting-edge financial tools to help you track, analyze, and
              achieve your financial goals. Your success is our priority.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-500">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {["Features", "Pricing", "Testimonials", "Contact Us"].map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-amber-500"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-500">Resources</h3>
            <ul className="mt-4 space-y-2">
              {["Blog", "FAQs", "Support Center", "Terms & Conditions"].map(
                (resource, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-amber-500"
                    >
                      {resource}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-500">Contact Us</h3>
            <p className="mt-4 text-sm text-gray-400">hamizasghar@gmail.com</p>
            <p className="text-sm text-gray-400">+92 3226389316</p>
            <div className="mt-4 flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="rounded-full bg-white p-2 text-gray-900 shadow-lg hover:text-amber-500"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Finance Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
