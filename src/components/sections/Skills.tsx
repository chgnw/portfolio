// components/sections/Skills.tsx
"use client"; // Tambahkan ini di paling atas

import { useState } from "react"; // Import useState
import { portfolioData, Skill } from "@/data/portfolioData"; // Asumsikan Anda export Skill type
import Image from "next/image";
import { FiAward } from "react-icons/fi";
import { CertificateModal } from "@/components/CertificateModal"; // Import modal

export const Skills = () => {
  // State untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  const handleOpenModal = (certificatePath: string) => {
    setSelectedCertificate(certificatePath);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12">Skills</h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          {portfolioData.skills.map((skill, i) => (
            <div 
              key={i} 
              className="w-40 h-40 flex flex-col items-center justify-center p-4 
                         rounded-xl glass-effect bg-card/70 dark:bg-card/50 shadow-md 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-primary/30 group"
            >
               <div className="relative w-16 h-16 mb-3">
                  <Image src={skill.icon} alt={skill.name} layout="fill" objectFit="contain"/>
               </div>
              <p className="font-semibold text-center mb-2">{skill.name}</p>

              {skill.certificatePath && (
                <button
                  onClick={() => handleOpenModal(skill.certificatePath!)}
                  className="text-xs flex items-center gap-1 text-accent hover:underline cursor-pointer no-underline">
                  <FiAward /> Lihat Sertifikat
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Render komponen Modal di sini */}
      <CertificateModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        imageSrc={selectedCertificate} 
      />
    </>
  );
};