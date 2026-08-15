import styles from './Button.module.css';
import { cn } from '../../utils/cn';

interface ButtonProps {
  variant: 'primary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  download?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}

export function Button({ variant, children, onClick, href, download, type = 'button', className: extraClassName, disabled }: ButtonProps) {
  const className = cn(styles.button, styles[variant], extraClassName);

  if (href) {
    return (
      <a href={href} className={className} download={download}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
}
