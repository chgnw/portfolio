import styles from './Skills.module.css';
import skills from '../../data/skills';
import { Card } from '../../components';

export function Skills() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Skills</h2>

      {skills.map((category) => (
        <div key={category.id} className={styles.category}>
          <p className={styles.categoryLabel}>{category.label}</p>

          <div className={styles.skillGrid}>
            {category.skills.map((skill) => (
              <Card key={skill.id} className={styles.skillChip}>
                <div className={styles.dot} />
                <p className={styles.skillName}>{skill.name}</p>
                {skill.certificateUrl && (
                  <a
                    href={skill.certificateUrl}
                    className={styles.certLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View certificate
                  </a>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
