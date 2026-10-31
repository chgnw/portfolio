import { Img } from "./Img";
import { SmartLink } from "./SmartLink";
import type { SectionProps } from "./types";

const Card = ({ logo, alt, title, titleUrl, children }: { logo: string; alt: string; title: string; titleUrl: string | null; children: React.ReactNode }) => (
  <div className="w-full max-w-md min-h-[9rem] flex items-center gap-6 p-5 rounded-lg glass-effect">
    <div className="relative w-20 h-20 flex-shrink-0">
      <Img src={logo} alt={alt} fill sizes="80px" className="object-contain p-1" />
    </div>
    <div className="text-left">
      <h4 className="text-xl font-bold">
        <SmartLink href={titleUrl} className={titleUrl ? "hover:text-primary transition-colors" : undefined}>{title}</SmartLink>
      </h4>
      {children}
    </div>
  </div>
);

export const About = ({ view }: SectionProps) => {
  const t = view.texts.about;
  return (
    <div className="max-w-5xl mx-auto p-4 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.heading}</h2>
      <p className="w-full mx-auto mb-16 text-xl text-foreground/80 whitespace-pre-line">{view.profile.aboutDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-16">
        <div className="flex flex-col items-center space-y-8">
          <h3 className="text-3xl font-semibold text-foreground mb-4">{t.educationHeading}</h3>
          {view.educations.length === 0 && <p className="text-foreground/60 italic">{t.educationEmpty}</p>}
          {view.educations.map((edu) => (
            <Card key={edu.id} logo={edu.logoUrl} alt={`${edu.institution} logo`} title={edu.institution} titleUrl={edu.institutionUrl}>
              <p className="text-md text-foreground/90">{edu.degree}</p>
              {edu.period && <p className="text-sm text-foreground/70">{edu.period}</p>}
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-8">
          <h3 className="text-3xl font-semibold text-foreground mb-4">{t.experienceHeading}</h3>
          {view.experiences.length === 0 && <p className="text-foreground/60 italic">{t.experienceEmpty}</p>}
          {view.experiences.map((exp) => (
            <Card key={exp.id} logo={exp.logoUrl} alt={`${exp.company} logo`} title={exp.company} titleUrl={exp.companyUrl}>
              <p className="text-md text-foreground/90">
                {exp.role}
                {exp.employmentType && <> - <span className="italic">{exp.employmentType}</span></>}
              </p>
              {exp.period && <p className="text-sm text-foreground/70">{exp.period}</p>}
              {exp.description && <p className="text-sm text-foreground/70 mt-2 whitespace-pre-line">{exp.description}</p>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
