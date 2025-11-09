"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/components/sections/Home";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contacts } from "@/components/sections/Contacts";

const sectionComponents: Record<string, React.ComponentType<{ setActiveSection: (section: string) => void }>> = {
  home: Home,
  about: About,
  projects: Projects,
  skills: Skills,
  contacts: Contacts,
};

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("home");
  const ActiveComponent = sectionComponents[activeSection];

  const variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.98 },
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 pt-28 md:pt-24 overflow-hidden">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Wrapper untuk konten */}
      <div className="w-full max-w-5xl flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ ease: "easeInOut", duration: 0.5 }}
            className="w-full"
          >
            <ActiveComponent setActiveSection={setActiveSection} />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}