"use client"
import { useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FiGithub, FiExternalLink, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from "next/image";

import 'swiper/css';
import 'swiper/css/pagination';

export const Projects = () => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const toggleFlip = (index: number) => {
    setFlippedCards(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">My Projects</h2>
      <p className="text-xl text-foreground/80 mb-12 text-center">Here's some of the projects I've worked on.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioData.projects.map((project, i) => {
          const isFlipped = flippedCards.includes(i);

          return (
            <div
              key={i}
              className="w-full h-[600px] perspective-1000"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="relative w-full h-full cursor-pointer"
                onClick={() => toggleFlip(i)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 glass-effect rounded-lg shadow-md overflow-hidden backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    className="w-full h-64 md:h-72"
                  >
                    {project.images.map((img, j) => (
                      <SwiperSlide key={j}>
                        <Image src={img} alt={`${project.title} image ${j + 1}`} fill className="object-contain" />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <div className="p-6 flex flex-col h-[calc(100%-18rem)]">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.techStack.map((tech, k) => (
                        <span key={k} className="px-3 py-1 text-xs font-medium bg-white/10 text-foreground/90 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-xl">{project.title}</h3>

                    <p className="text-sm text-foreground/80 mt-3 mb-4 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiGithub size={24} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiExternalLink size={24} />
                          </a>
                        )}
                      </div>

                      {/* Click indicator */}
                      <div className="flex items-center gap-2 text-xs text-foreground/60 animate-pulse">
                        <FiInfo size={16} />
                        <span>Click for details</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 glass-effect rounded-lg shadow-md overflow-hidden backface-hidden p-6"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="h-full flex flex-col">
                    {/* Fixed Title */}
                    <h3 className="font-bold text-2xl mb-4 pb-2 border-b border-white/10">{project.title}</h3>

                    {/* Scrollable Content */}
                    <div
                      className="flex-1 overflow-y-auto scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      <div className="space-y-4 pr-2">
                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Background
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {project.details.background}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Process
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {project.details.process}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Tech Stack Reasoning
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {project.details.techReasoning}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Click to flip back indicator */}
                    <div className="flex items-center justify-center gap-2 text-xs text-foreground/60 mt-4 pt-4 border-t border-white/10 animate-pulse">
                      <FiInfo size={16} />
                      <span>Click to flip back</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};