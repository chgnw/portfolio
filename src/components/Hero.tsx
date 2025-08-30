'use client';

import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
                    >
                        Hi, I'm <span className="text-blue-600">Christopher Gunawan</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl sm:text-2xl text-gray-600 mb-8"
                    >
                        Full Stack Developer
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <a
                            href="#contact"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Get in Touch
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero; 