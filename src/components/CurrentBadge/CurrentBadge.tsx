import styles from './CurrentBadge.module.css';

export function CurrentBadge() {
  return (
    <span className={styles.badge}>
      <span className={styles.dot} />
      Current
    </span>
  );
}
