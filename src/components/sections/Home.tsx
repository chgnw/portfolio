// components/sections/Home.tsx
import { portfolioData } from "@/data/portfolioData";

interface HomeProps {
  setActiveSection: (section: string) => void;
}

export const Home = ({ setActiveSection }: HomeProps) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full pt-16 md:pt-0">
      <h1 className="text-5xl md:text-7xl font-bold mb-4">{portfolioData.name}</h1>
      <p className="text-xl md:text-2xl text-primary mb-6">{portfolioData.jobTitle}</p>
      <p className="max-w-lg mx-auto text-lg text-foreground/80 mb-10">{portfolioData.shortDescription}</p>
      
      {/* Perubahan: Tombol dengan animasi sweep dari kiri ke kanan */}
      <button
        onClick={() => setActiveSection("about")}
        className="relative group px-8 py-4 text-lg rounded-full font-semibold overflow-hidden
                   glass-effect bg-card/70 text-foreground shadow-lg 
                   transition-transform duration-300 hover:scale-102 border border-white/20"
      >
        <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
          Get to Know Me Better
        </span>
      </button>
    </div>
  );
};