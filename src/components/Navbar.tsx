interface NavbarProps {
  setActiveSection: (section: string) => void;
  activeSection: string;
}

const navItems = ["Home", "About", "Projects", "Skills", "Contacts"];

export const Navbar = ({ setActiveSection, activeSection }: NavbarProps) => {
  return (
    <nav className="w-full max-w-md flex justify-center fixed top-4 z-50">
      <div 
        className="w-full flex justify-center items-center p-2 rounded-full shadow-lg
                   glass-effect bg-black/10 backdrop-blur-lg"
      >
        <div className="flex gap-2">
          {navItems.map((item) => (
              <button
              key={item}
              onClick={() => setActiveSection(item.toLowerCase())}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-300 font-semibold
                  ${
                  activeSection === item.toLowerCase()
                      ? "bg-white/20"
                      : "text-foreground/80 hover:bg-white/10"
                  }`}
              >
                {item}
              </button>
          ))}
        </div>
      </div>
    </nav>
  );
};