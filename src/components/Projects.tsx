'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
    const projects = [
        {
            title: 'E-commerce Platform',
            description: 'A full-stack e-commerce platform built with Next.js, Node.js, and MongoDB.',
            technologies: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
            github: 'https://github.com/yourusername/project1',
            live: 'https://project1.com',
        },
        {
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates.',
            technologies: ['React', 'Firebase', 'Material-UI'],
            github: 'https://github.com/yourusername/project2',
            live: 'https://project2.com',
        },
        {
            title: 'AI Image Generator',
            description: 'An AI-powered image generation tool using OpenAI\'s DALL-E API.',
            technologies: ['Python', 'Flask', 'OpenAI API', 'React'],
            github: 'https://github.com/yourusername/project3',
            live: 'https://project3.com',
        },
    ];

    return (
        <section id="projects" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">My Projects</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Here are some of the projects I've worked on. Each project is a unique challenge
                        that helped me grow as a developer.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                        >
                            <div className="p-6 flex flex-col flex-grow">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-auto pt-4">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                        aria-label={`View source code for ${project.title} on Github`}
                                    >
                                        <FaGithub className="w-6 h-6" />
                                    </a>
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                        aria-label={`View live demo for ${project.title}`}
                                    >
                                        <FaExternalLinkAlt className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects; 