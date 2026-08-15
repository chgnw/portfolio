import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './Home.module.css';
import personalInfo from '../../data/personalInfo';
import { Button } from '../../components';
import { type SectionId } from '../../hooks/useActiveSection';

interface HomeProps {
  onNavigate: (section: SectionId) => void;
}

const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export function Home({ onNavigate }: HomeProps) {
  const [cvOpen, setCvOpen] = useState(false);

  const closeDropdown = useCallback(() => setCvOpen(false), []);

  useEffect(() => {
    if (!cvOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.cvGroup}`)) closeDropdown();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDropdown();
    }
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [cvOpen, closeDropdown]);

  const heroElements = [
    <p key="eyebrow" className={styles.eyebrow}>{personalInfo.eyebrow}</p>,
    <h1 key="name" className={styles.name}>{personalInfo.name}</h1>,
    <p key="role" className={styles.role}>{personalInfo.role}</p>,
    <p key="bio" className={styles.bio}>{personalInfo.bio}</p>,
    <div key="cta" className={styles.ctaRow}>
      <Button variant="primary" onClick={() => onNavigate('projects')}>
        View My Work
      </Button>
      <div className={styles.cvGroup}>
        <a
          href={personalInfo.cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cvViewBtn}
        >
          View CV
        </a>
        <button
          className={styles.cvToggle}
          onClick={() => setCvOpen((prev) => !prev)}
          aria-label="Download options"
        >
          ▾
        </button>
        {cvOpen && (
          <div className={styles.cvDropdown}>
            <a
              href={personalInfo.cvUrl}
              download
              className={styles.cvDropdownItem}
              onClick={closeDropdown}
            >
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>,
  ];

  return (
    <section className={styles.hero}>
      {heroElements.map((el, i) => (
        <motion.div
          key={el.key}
          custom={i}
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          {el}
        </motion.div>
      ))}
    </section>
  );
}
