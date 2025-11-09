import { portfolioData } from "@/data/portfolioData";
import { FiDownload } from "react-icons/fi";

interface HomeProps {
  setActiveSection: (section: string) => void;
}

export const Home = ({ setActiveSection }: HomeProps) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full pt-16 md:pt-0">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-5xl md:text-7xl font-bold">{portfolioData.name}</h1>
        <p className="text-xl md:text-2xl text-primary">{portfolioData.jobTitle}</p>
        <p className="max-w-xl mx-auto text-lg text-foreground/80">{portfolioData.shortDescription}</p>
      </div>
      

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={() => setActiveSection("about")}
          className="relative group px-8 py-4 text-lg rounded-full font-semibold overflow-hidden
                     glass-effect bg-card/70 text-foreground shadow-lg 
                     transition-transform duration-300 hover:scale-102 border border-white/20
                     w-full sm:w-80 whitespace-nowrap"
        >
          <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
            Get to Know Me Better
          </span>
        </button>
        
        <a
          href="#" 
          onClick={() => alert('CV coming soon!')}
          className="relative flex items-center justify-center gap-2 px-8 py-4 text-lg rounded-full font-semibold
                     glass-effect bg-card/70 text-foreground shadow-lg 
                     transition-transform duration-300 hover:scale-102 border border-white/20
                     w-full sm:w-80 whitespace-nowrap"
        >
          <FiDownload />
          <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
            Download CV
          </span>
        </a>
      </div>
    </div>
  );
};