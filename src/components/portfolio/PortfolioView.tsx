"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SectionKey } from "@/lib/content/registry";
import type { PortfolioView as View } from "@/lib/content/view";
import { IconProvider } from "@/components/icons/Icon";
import { Navbar } from "./Navbar";
import { Home } from "./Home";
import { About } from "./About";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Contacts } from "./Contacts";
import { Starfield } from "./Starfield";
import type { SectionProps } from "./types";

const sectionComponents: Partial<Record<SectionKey, ComponentType<SectionProps>>> = {
  home: Home,
  about: About,
  projects: Projects,
  skills: Skills,
  contacts: Contacts,
};

const variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.98 },
};

interface Props {
  view: View;
  /** Server pre-rendered library icons. */
  icons?: Record<string, ReactNode>;
  /** Controlled section (used by the dashboard preview to follow the editor). */
  section?: SectionKey;
  onSectionChange?: (section: SectionKey) => void;
  /** Secret shortcut to the dashboard (production only). */
  enableDashboardShortcut?: boolean;
}

export function PortfolioView({ view, icons = {}, section, onSectionChange, enableDashboardShortcut }: Props) {
  const [internal, setInternal] = useState<SectionKey>(view.nav[0]?.key ?? "home");
  const requested = section ?? internal;
  // Hidden sections fall back to the first visible one.
  const active = view.nav.some((n) => n.key === requested) ? requested : (view.nav[0]?.key ?? "home");
  const ActiveComponent = sectionComponents[active];

  const goTo = (key: SectionKey) => {
    setInternal(key);
    onSectionChange?.(key);
  };

  // Hidden menu: Ctrl/Cmd + Shift + K opens the dashboard login.
  useEffect(() => {
    if (!enableDashboardShortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        window.location.href = "/dashboard";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enableDashboardShortcut]);

  return (
    <IconProvider icons={icons}>
      <div className="portfolio-bg text-foreground">
        <Starfield />
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4 pt-28 md:pt-24 overflow-hidden">
          <Navbar items={view.nav} activeSection={active} setActiveSection={goTo} />
          <div className="w-full max-w-5xl flex-grow flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                className="w-full"
              >
                {ActiveComponent && <ActiveComponent view={view} goTo={goTo} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </IconProvider>
  );
}
