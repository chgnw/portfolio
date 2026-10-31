import { FiDownload } from "react-icons/fi";
import type { SectionProps } from "./types";

export const Home = ({ view, goTo }: SectionProps) => {
  const t = view.texts.home;
  const { profile } = view;
  const next = view.nav.find((n) => n.key !== "home");

  return (
    <div className="text-center flex flex-col items-center justify-center h-full pt-16 md:pt-0">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-5xl md:text-7xl font-bold">{profile.fullName}</h1>
        <p className="text-xl md:text-2xl text-primary">{profile.jobTitle}</p>
        <p className="max-w-xl mx-auto text-lg text-foreground/80 whitespace-pre-line">{profile.shortBio}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        {next && (
          <button
            onClick={() => goTo(next.key)}
            className="relative group px-8 py-4 text-lg rounded-full font-semibold overflow-hidden
                       glass-effect bg-card/70 text-foreground shadow-lg
                       transition-transform duration-300 hover:scale-102 border border-white/20
                       w-full sm:w-80 whitespace-nowrap"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-white">{t.primaryCta}</span>
          </button>
        )}

        {profile.cvUrl && (
          <a
            href={profile.cvUrl}
            download={profile.cvFileName}
            className="relative flex items-center justify-center gap-2 px-8 py-4 text-lg rounded-full font-semibold
                       glass-effect bg-card/70 text-foreground shadow-lg
                       transition-transform duration-300 hover:scale-102 border border-white/20
                       w-full sm:w-80 whitespace-nowrap"
          >
            <FiDownload />
            <span className="relative z-10">{t.cvCta}</span>
          </a>
        )}
      </div>
    </div>
  );
};
