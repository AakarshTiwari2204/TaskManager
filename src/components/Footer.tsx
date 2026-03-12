import Link from "next/link";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A simple To-Do List web app to help you organize your daily tasks effectively.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:aakarshtiwari524@gmail.com" 
                  className="text-sm hover:text-white transition-colors"
                >
                  aakarshtiwari524@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 9569991970</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Follow</h3>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com/aakar_s_h"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm">Instagram</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/aakarsh-tiwari-92683028b"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-sm">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center text-sm text-gray-400">
            © 2025 Aakarsh Tiwari. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}