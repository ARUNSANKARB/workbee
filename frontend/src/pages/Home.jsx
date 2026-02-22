import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import heroIllustration from '../assets/kuWhatsApp Image 2026-02-12 at 5.11.09 PM.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Electrician', icon: '⚡' },
    { name: 'Plumber', icon: '🔧' },
    { name: 'Maid', icon: '🧹' },
    { name: 'Catering', icon: '🍽️' },
    { name: 'Cook', icon: '👨‍🍳' },
    { name: 'AC Repair', icon: '❄️' },
  ];

  const features = [
    { icon: '✓', title: 'Verified Professionals', desc: 'Background Checked Experts' },
    { icon: '⏱️', title: 'Easy & Fast Booking', desc: 'Book Services in Minutes' },
    { icon: '🔒', title: 'Secure Payments', desc: 'Safe Online Transactions' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-dark mb-6 leading-tight">
                Your Local Service Partner On-Demand
              </h1>
              
              <p className="text-lg text-dark mb-8">
                Book Trusted Electricians, Cooks, Maids & More Instantly.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-3.5 text-2xl">📍</span>
                  <input
                    type="text"
                    placeholder="Search for services (e.g. Electrician, Maid...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-dark focus:outline-none font-medium"
                  />
                </div>
                <Button type="submit" size="lg">
                  Search
                </Button>
              </form>
            </motion.div>

            {/* Right Illustration (image background) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block"
            >
              <div
                className="w-[420px] h-[320px] bg-right bg-no-repeat bg-contain ml-auto"
                style={{ backgroundImage: `url(${heroIllustration})` }}
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-dark">Popular Services</h2>
            <p className="text-xl text-gray-600 mt-2">Get Help from Nearby Experts</p>
          </div>

          <div className="grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="cursor-pointer"
              >
                <Link to={`/services?category=${cat.name}`}>
                  <div className="bg-dark rounded-2xl p-8 text-center hover:shadow-2xl transition-all transform hover:scale-105">
                    <div className="text-5xl mb-4">{cat.icon}</div>
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (kept informational - sign up button removed as requested) */}
      <section id="cta" className="bg-secondary text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8">Join thousands of users getting reliable services done instantly!</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
