// components/sections/Projects.tsx
"use client"
import { portfolioData } from "@/data/portfolioData";
import { Swiper, SwiperSlide } from 'swiper/react';
// Perubahan: Hapus Navigation dari import
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import Image from "next/image";

export const Projects = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">My Projects</h2>
      <p className="text-xl md:text-2xl text-foreground/80 mb-12 text-center">Here's some of the projects I've worked on.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioData.projects.map((project, i) => (
          <div key={i} className="glass-effect rounded-lg shadow-md overflow-hidden">
            <Swiper
              // Perubahan: Hapus navigation
              modules={[Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              className="w-full h-56 md:h-64"
            >
              {project.images.map((img, j) => (
                <SwiperSlide key={j}>
                  <Image src={img} alt={`${project.title} image ${j+1}`} layout="fill" objectFit="cover" />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="p-6">
              <h3 className="font-bold text-xl">{project.title}</h3>
              <div className="flex gap-4 mt-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><FiGithub size={24} /></a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><FiExternalLink size={24} /></a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};