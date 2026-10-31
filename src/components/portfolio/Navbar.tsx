import type { SectionKey } from "@/lib/content/registry";

interface NavbarProps {
  items: { key: SectionKey; label: string }[];
  activeSection: SectionKey;
  setActiveSection: (section: SectionKey) => void;
}

export const Navbar = ({ items, setActiveSection, activeSection }: NavbarProps) => {
  return (
    <nav className="w-full max-w-md flex justify-center fixed top-4 z-50 px-2">
      <div className="w-full flex justify-center items-center p-2 rounded-full shadow-lg glass-effect bg-black/10 backdrop-blur-lg">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`px-3 sm:px-4 py-2 text-sm rounded-full transition-all duration-300 font-semibold whitespace-nowrap
                ${activeSection === item.key ? "bg-white/20" : "text-foreground/80 hover:bg-white/10"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
