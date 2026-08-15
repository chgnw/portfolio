import styles from './Card.module.css';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className, noPadding }: CardProps) {
  return (
    <div className={cn(styles.card, noPadding && styles.noPadding, className)}>
      {children}
    </div>
  );
}
