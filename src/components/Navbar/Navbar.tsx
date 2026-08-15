import styles from './Navbar.module.css';
import { cn } from '../../utils/cn';
import { type SectionId } from '../../hooks/useActiveSection';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={cn(styles.link, activeSection === item.id && styles.active)}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
