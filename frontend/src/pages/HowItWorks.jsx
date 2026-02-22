import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      icon: '🔍',
      title: 'Search for a Service',
      description:
        'Browse our wide range of services or search for exactly what you need. Filter by category, location, ratings, and price to find the perfect match.',
      color: 'bg-blue-50',
      borderColor: 'border-blue-400',
    },
    {
      number: '02',
      icon: '📅',
      title: 'Book Instantly',
      description:
        'Select your preferred professional, choose a time slot that works for you, and confirm your booking in just a few clicks. It\'s that simple!',
      color: 'bg-amber-50',
      borderColor: 'border-primary',
    },
    {
      number: '03',
      icon: '✅',
      title: 'Get It Done',
      description:
        'Your verified professional arrives at the scheduled time. Sit back, relax, and let the expert handle the rest. Pay securely after the job is done.',
      color: 'bg-green-50',
      borderColor: 'border-green-400',
    },
  ];

  const benefits = [
    { icon: '🛡️', title: 'Verified Professionals', desc: 'Every worker is background-checked and skill-verified before joining our platform.' },
    { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees. See the price upfront before you book any service.' },
    { icon: '⭐', title: 'Rated & Reviewed', desc: 'Read genuine reviews from other customers to make informed decisions.' },
    { icon: '🔄', title: 'Easy Rescheduling', desc: 'Plans changed? Reschedule or cancel your booking hassle-free.' },
    { icon: '📱', title: 'Real-Time Tracking', desc: 'Track your professional\'s arrival and stay updated at every step.' },
    { icon: '🎧', title: '24/7 Support', desc: 'Our support team is always ready to help you with any issues.' },
  ];

  const faqs = [
    { q: 'How do I book a service?', a: 'Simply search for the service you need, pick a professional, choose a time, and confirm. You\'ll receive instant confirmation.' },
    { q: 'Are the professionals verified?', a: 'Yes! Every professional on WorkBee goes through a thorough background check and skill verification process.' },
    { q: 'What if I\'m not satisfied?', a: 'We offer a satisfaction guarantee. If you\'re unhappy with the service, contact us and we\'ll make it right.' },
    { q: 'How do payments work?', a: 'Payment is collected securely after the service is completed. We support multiple payment methods for your convenience.' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary via-yellow-300 to-accent py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-dark mb-6"
          >
            How WorkBee Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xl text-dark/80 max-w-2xl mx-auto"
          >
            Getting reliable home services has never been easier.
            Three simple steps is all it takes.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Icon card */}
                <div className={`flex-shrink-0 w-40 h-40 ${step.color} border-4 ${step.borderColor} rounded-3xl flex flex-col items-center justify-center shadow-lg`}>
                  <span className="text-sm font-bold text-gray-400 mb-1">STEP</span>
                  <span className="text-4xl font-black text-dark">{step.number}</span>
                  <span className="text-4xl mt-1">{step.icon}</span>
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-dark mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-dark mb-3">Why Choose WorkBee?</h2>
            <p className="text-gray-600 text-lg">Built for your peace of mind</p>
          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-hover transition-shadow"
              >
                <span className="text-4xl block mb-4">{b.icon}</span>
                <h4 className="text-lg font-bold text-dark mb-2">{b.title}</h4>
                <p className="text-gray-500 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-dark text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <h4 className="font-bold text-dark mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">Join thousands of happy customers using WorkBee every day.</p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
              Sign Up Free
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/services')}
              className="border-white text-white hover:bg-white hover:text-dark"
            >
              Browse Services
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
