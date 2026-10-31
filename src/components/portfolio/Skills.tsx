"use client";

import { useState } from "react";
import { FiAward } from "react-icons/fi";
import { Icon } from "@/components/icons/Icon";
import { CertificateModal } from "./CertificateModal";
import type { SectionProps } from "./types";

export const Skills = ({ view }: SectionProps) => {
  const t = view.texts.skills;
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  return (
    <>
      <div className="max-w-5xl mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-bold ${t.tagline ? "mb-4" : "mb-12"}`}>{t.heading}</h2>
        {t.tagline && <p className="text-xl text-foreground/80 mb-12">{t.tagline}</p>}
        {view.skills.length === 0 && <p className="text-foreground/60 italic">{t.empty}</p>}

        <div className="flex flex-wrap justify-center gap-5 md:gap-6">
          {view.skills.map((skill) => (
            <div
              key={skill.id}
              className="w-32 md:w-44 aspect-square flex flex-col items-center justify-center p-4
                         rounded-xl glass-effect bg-card/70 shadow-md
                         transform transition-all duration-300 hover:scale-105 hover:shadow-primary/30 group"
            >
              <Icon icon={skill.icon} label={skill.name} className="text-[3.5rem] md:text-[4rem] mb-3" />
              <p className="font-semibold text-center text-sm md:text-base mb-2">{skill.name}</p>

              {skill.certificateUrl && (
                <button
                  onClick={() => setSelectedCertificate(skill.certificateUrl)}
                  className="text-xs md:text-sm flex items-center gap-1 text-accent hover:underline cursor-pointer"
                >
                  <FiAward /> {t.certificateCta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <CertificateModal
        isOpen={selectedCertificate !== null}
        onClose={() => setSelectedCertificate(null)}
        imageSrc={selectedCertificate}
      />
    </>
  );
};
