'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: false,
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: false, message: '' });

        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
            };

            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            setStatus({
                loading: false,
                success: true,
                error: false,
                message: 'Message sent successfully! I will get back to you soon.',
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: true,
                message: 'Failed to send message. Please try again later.',
            });
            console.error('Error sending email:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const socialLinks = [
        {
            name: 'GitHub',
            icon: FaGithub,
            url: 'https://github.com/chgnw',
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedin,
            url: 'https://www.linkedin.com/in/chgnw',
        },
        // {
        //     name: 'Twitter',
        //     icon: FaTwitter,
        //     url: 'https://twitter.com/yourusername',
        // },
    ];

    return (
        <section id="contact" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={status.loading}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={status.loading}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    disabled={status.loading}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            {status.message && (
                                <div
                                    className={`p-4 rounded-md ${status.success
                                            ? 'bg-green-50 text-green-800'
                                            : status.error
                                                ? 'bg-red-50 text-red-800'
                                                : ''
                                        }`}
                                >
                                    {status.message}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={status.loading}
                                className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors ${status.loading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-blue-700'
                                    }`}
                            >
                                {status.loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900">Connect with me</h3>
                            <div className="flex space-x-6">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        <link.icon className="w-8 h-8" />
                                    </a>
                                ))}
                            </div>
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <p className="text-gray-600">chgnw14@gmail.com</p>
                                <p className="text-gray-600">North Jakarta, Indonesia</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact; 