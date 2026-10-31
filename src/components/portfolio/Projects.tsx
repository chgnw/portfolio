"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons/Icon";
import { Img } from "./Img";
import { SmartLink } from "./SmartLink";
import type { SectionProps } from "./types";

import "swiper/css";
import "swiper/css/pagination";

export const Projects = ({ view }: SectionProps) => {
  const t = view.texts.projects;
  const [flippedCards, setFlippedCards] = useState<string[]>([]);

  const toggleFlip = (id: string) =>
    setFlippedCards((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">{t.heading}</h2>
      {t.tagline && <p className="text-xl text-foreground/80 mb-12 text-center">{t.tagline}</p>}
      {view.projects.length === 0 && <p className="text-center text-foreground/60 italic">{t.empty}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {view.projects.map((project) => {
          const isFlipped = flippedCards.includes(project.id);

          return (
            <div key={project.id} className="w-full h-[600px]" style={{ perspective: "1000px" }}>
              <motion.div
                className="relative w-full h-full cursor-pointer"
                onClick={() => toggleFlip(project.id)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 glass-effect rounded-lg shadow-md overflow-hidden"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
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
                      <SwiperSlide key={`${img}-${j}`}>
                        <Img src={img} alt={`${project.title} image ${j + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain" />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <div className="p-6 flex flex-col h-[calc(100%-18rem)]">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs font-medium bg-white/10 text-foreground/90 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-xl">{project.title}</h3>
                    <p className="text-sm text-foreground/80 mt-3 mb-4 flex-grow whitespace-pre-line overflow-hidden">{project.summary}</p>

                    <div className="flex items-center justify-between mt-auto gap-3">
                      <div className="flex flex-wrap gap-4">
                        {project.links.map((link, k) => (
                          <SmartLink
                            key={k}
                            href={link.url}
                            title={link.label}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(link.icon.iconKey || link.icon.imageUrl) ? (
                              <Icon icon={link.icon} size={24} label={link.label} />
                            ) : (
                              <span className="text-sm underline underline-offset-4">{link.label}</span>
                            )}
                          </SmartLink>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-foreground/60 animate-pulse shrink-0">
                        <FiInfo size={16} />
                        <span>{t.flipHint}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 glass-effect rounded-lg shadow-md overflow-hidden p-6"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="h-full flex flex-col">
                    <h3 className="font-bold text-2xl mb-4 pb-2 border-b border-white/10">{project.title}</h3>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                      <div className="space-y-4 pr-2">
                        {project.details.map((d, k) => (
                          <div key={k}>
                            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              <span className="w-1 h-6 bg-primary rounded-full"></span>
                              {d.heading}
                            </h4>
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{d.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-foreground/60 mt-4 pt-4 border-t border-white/10 animate-pulse">
                      <FiInfo size={16} />
                      <span>{t.flipBackHint}</span>
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
