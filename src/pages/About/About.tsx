import { useState } from 'react';
import styles from './About.module.css';
import { Card } from '../../components';
import { CurrentBadge } from '../../components';
import personalInfo from '../../data/personalInfo';
import education from '../../data/education';
import experience from '../../data/experience';

export function About() {
  const [openExpId, setOpenExpId] = useState<string | null>(
    experience.find((e) => e.isCurrent)?.id ?? null,
  );

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>About me</h2>
      <p className={styles.bio}>{personalInfo.aboutBio}</p>

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeading}>Education</h3>
          {education.map((entry) => (
            <div key={entry.id} className={styles.eduEntry}>
              <p className={styles.institution}>{entry.institution}</p>
              <p className={styles.degree}>
                {entry.degree} · {entry.years}
              </p>
              {entry.note && (
                <p className={styles.note}>{entry.note}</p>
              )}
            </div>
          ))}
        </Card>

        <Card>
          <h3 className={styles.cardHeading}>Experience</h3>
          {experience.map((entry) => (
            <div key={entry.id} className={styles.expItem}>
              <button
                className={styles.expHeader}
                onClick={() =>
                  setOpenExpId(openExpId === entry.id ? null : entry.id)
                }
              >
                <div className={styles.expHeaderLeft}>
                  <div className={styles.expCompany}>
                    {entry.company}
                    {entry.isCurrent && <CurrentBadge />}
                  </div>
                  <p className={styles.expRole}>{entry.role}</p>
                  <p className={styles.expDate}>{entry.dateRange}</p>
                  <p className={styles.expHook}>{entry.hook}</p>
                </div>
                <div className={styles.expToggle}>
                  <span className={styles.expToggleText}>see contributions</span>
                  <span
                    className={`${styles.chevron} ${openExpId === entry.id ? styles.chevronOpen : ''}`}
                  >
                    ▾
                  </span>
                </div>
              </button>
              <div
                className={`${styles.expBody} ${openExpId === entry.id ? styles.expBodyOpen : ''}`}
              >
                <ul className={styles.contribList}>
                  {entry.contributions.map((item, i) => (
                    <li key={i} className={styles.contribItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
