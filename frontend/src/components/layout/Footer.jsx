import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🐝</span>
              <span className="text-xl font-bold">WorkBee</span>
            </div>
            <p className="text-gray-300 text-sm">Your local skill exchange platform</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition">Services</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition">How It Works</Link></li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h4 className="font-bold mb-4">For Workers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/signup" className="hover:text-primary transition">Register</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: support@workbee.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Hours: 24/7 Support</li>
              <li><Link to="/contact" className="hover:text-primary transition font-medium">Contact Us →</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 flex justify-between items-center">
          <p className="text-sm text-gray-300">© 2026 WorkBee. All rights reserved.</p>
          <div className="space-x-4 text-sm">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
