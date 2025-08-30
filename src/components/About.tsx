'use client';

import { motion } from 'framer-motion'; 
import {
    FaJsSquare,
    FaReact,
    FaNodeJs,
    FaPython,
    FaDocker,
    FaGitAlt,
} from 'react-icons/fa';
import { SiMysql } from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';

const About = () => {
    const skills = [
        { name: 'JavaScript', icon: <FaJsSquare className="text-yellow-400" /> },
        { name: 'React', icon: <FaReact className="text-sky-400" /> },
        { name: 'Next.js', icon: <TbBrandNextjs className="text-gray-800" /> },
        { name: 'Node.js', icon: <FaNodeJs className="text-green-500" /> },
        { name: 'Python', icon: <FaPython className="text-blue-500" /> },
        { name: 'MySQL', icon: <SiMysql className="text-blue-600" /> },
        { name: 'Docker', icon: <FaDocker className="text-sky-500" /> },
        { name: 'Git', icon: <FaGitAlt className="text-orange-600" /> },
    ];

    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        I'm a passionate junior full-stack developer with a keen eye for creating elegant solutions
                        to various problems. With a good experience in web development, I specialize
                        in building responsive, user-friendly applications that make a difference.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Experience</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">Application Developer</h4>
                                <p className="text-gray-600">Intern • PT Hartono Istana Teknologi (Polytron)</p>
                                <p className="text-gray-600">Feb 2025 - Feb 2026</p>
                                <p className="mt-2 text-gray-600">
                                    Developed and maintained multiple web applications using Node.js and Bootstrap.
                                    Implemented RestAPIs, CI/CD pipelines and improved application performance.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">My Tech Stack</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5, scale: 1.05 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center w-32 h-32 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                                >
                                    <div className="text-5xl mb-2">{skill.icon}</div>
                                    <p className="font-medium text-gray-700">{skill.name}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About; 