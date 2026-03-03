import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', href, onClick, className = '' }) {
  const cls = `${styles.btn} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
