import styles from './Projects.module.css';
import projects from '../../data/projects';
import { Card } from '../../components';
import { Tag } from '../../components';

export function Projects() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Projects</h2>
      <p className={styles.subtitle}>Things I've built</p>

      <div className={styles.grid}>
        {projects.map((project) => (
          <Card key={project.id} noPadding>
            <div className={styles.thumbnail}>
              {project.thumbnail ? (
                <img
                  src={`/src/assets/images/${project.thumbnail}`}
                  alt={project.name}
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>

            <div className={styles.body}>
              <div className={styles.tagRow}>
                {project.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>

              <h3 className={styles.projectName}>{project.name}</h3>

              <p className={styles.description}>{project.description}</p>

              <div className={styles.linksRow}>
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
