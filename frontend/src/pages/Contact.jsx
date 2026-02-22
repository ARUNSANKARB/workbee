import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Frontend-only: show success feedback
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: <FiMail className="text-2xl" />,
            label: 'Email Us',
            value: 'support@workbee.com',
            extra: 'help@workbee.com',
        },
        {
            icon: <FiPhone className="text-2xl" />,
            label: 'Call Us',
            value: '+91 98765 43210',
            extra: '+91 87654 32100',
        },
        {
            icon: <FiMapPin className="text-2xl" />,
            label: 'Visit Us',
            value: '42, MG Road, Kochi',
            extra: 'Kerala, India – 682016',
        },
        {
            icon: <FiClock className="text-2xl" />,
            label: 'Business Hours',
            value: 'Mon – Sat: 8 AM – 9 PM',
            extra: 'Sunday: 9 AM – 5 PM',
        },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-secondary via-slate-800 to-dark py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold text-white mb-6"
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Have a question or feedback? We'd love to hear from you.
                        Our team is always here to help.
                    </motion.p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-hover transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-full mb-4 text-dark">
                                    {info.icon}
                                </div>
                                <h3 className="font-bold text-dark text-lg mb-2">{info.label}</h3>
                                <p className="text-gray-700 text-sm font-medium">{info.value}</p>
                                <p className="text-gray-500 text-sm">{info.extra}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form + Map Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-dark mb-2">Send Us a Message</h2>
                            <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

                            {submitted && (
                                <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 font-medium">
                                    ✅ Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-dark mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-dark mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-dark mb-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we help?"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-dark mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us more about your query..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition resize-none"
                                    />
                                </div>
                                <Button type="submit" variant="primary" size="lg" className="w-full">
                                    <FiSend /> Send Message
                                </Button>
                            </form>
                        </motion.div>

                        {/* Map / Office Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-dark mb-2">Our Office</h2>
                            <p className="text-gray-500 mb-8">Come visit us or reach out through any of our channels.</p>

                            {/* Map placeholder */}
                            <div className="flex-1 bg-gray-200 rounded-2xl overflow-hidden min-h-[300px] relative">
                                <iframe
                                    title="WorkBee Office Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.579!2d76.2899!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTUnNTIuMyJOIDc2wrAxNyczNS42IkU!5e0!3m2!1sen!2sin!4v1"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            {/* Quick reach-out */}
                            <div className="mt-6 bg-white rounded-2xl p-6 shadow-card">
                                <h4 className="font-bold text-dark mb-3">Quick Reach-Out</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <FiMail className="text-primary" />
                                        <span className="text-gray-700">support@workbee.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiPhone className="text-primary" />
                                        <span className="text-gray-700">+91 98765 43210</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiMapPin className="text-primary" />
                                        <span className="text-gray-700">42, MG Road, Kochi, Kerala – 682016</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
