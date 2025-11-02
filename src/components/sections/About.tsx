import { portfolioData } from "@/data/portfolioData";
import Image from 'next/image';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
      <p className="max-w-3xl mx-auto mb-16 text-lg text-foreground/80">
        {portfolioData.about.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-16">
        <div className="flex flex-col items-center space-y-8">
          <h3 className="text-3xl font-semibold text-foreground mb-4">Educations</h3>
          {portfolioData.about.education.map((edu, i) => (
            // Perubahan: Menambahkan h-32 untuk tinggi tetap
            <div key={i} className="w-full max-w-md h-32 flex items-center gap-6 p-4 rounded-lg glass-effect">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image src={edu.image} alt={`${edu.university} logo`} layout="fill" objectFit="contain" className="p-1"/>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-bold">{edu.university}</h4>
                <p className="text-md text-foreground/90">{edu.degree}</p>
                <p className="text-sm text-foreground/70">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-8">
          <h3 className="text-3xl font-semibold text-foreground mb-4">Experiences</h3>
          {portfolioData.about.experience.map((exp, i) => (
             // Perubahan: Menambahkan h-32 untuk tinggi tetap
             <div key={i} className="w-full max-w-md h-32 flex items-center gap-6 p-4 rounded-lg glass-effect">
               <div className="relative w-20 h-20 flex-shrink-0">
                <Image src={exp.image} alt={`${exp.company} logo`} layout="fill" objectFit="contain" className="p-1"/>
               </div>
              <div className="text-left">
                <h4 className="text-xl font-bold">{exp.company}</h4>
                <p className="text-md text-foreground/90">{exp.role} - <span className="italic">{exp.status}</span></p>
                <p className="text-sm text-foreground/70">{exp.period}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};