import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components';
import { useActiveSection, type SectionId } from './hooks/useActiveSection';
import { Home } from './pages/Home/Home';
import { About } from './pages/About/About';
import { Projects } from './pages/Projects/Projects';
import { Skills } from './pages/Skills/Skills';
import { Contact } from './pages/Contact/Contact';

const sectionOrder: Record<SectionId, number> = {
  home: 0, about: 1, projects: 2, skills: 3, contact: 4,
};

const pageVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 200 : -200,
    y: direction === 0 ? 30 : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeInOut' as const },
  }),
};

export function App() {
  const { activeSection, setActiveSection } = useActiveSection('home');
  const prevIndexRef = useRef(sectionOrder[activeSection]);
  const currentIndex = sectionOrder[activeSection];
  const direction = currentIndex - prevIndexRef.current;
  prevIndexRef.current = currentIndex;

  const onNavigate = (section: SectionId) => setActiveSection(section);

  return (
    <div>
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <main>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeSection}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {activeSection === 'home' && <Home onNavigate={onNavigate} />}
            {activeSection === 'about' && <About />}
            {activeSection === 'projects' && <Projects />}
            {activeSection === 'skills' && <Skills />}
            {activeSection === 'contact' && <Contact />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
