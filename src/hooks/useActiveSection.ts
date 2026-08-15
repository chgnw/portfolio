import { useState } from 'react';

export type SectionId = 'home' | 'about' | 'projects' | 'skills' | 'contact';

export function useActiveSection(initial: SectionId = 'home') {
  const [activeSection, setActiveSection] = useState<SectionId>(initial);
  return { activeSection, setActiveSection };
}
