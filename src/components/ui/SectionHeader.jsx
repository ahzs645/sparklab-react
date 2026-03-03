import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ label, title, light = false }) {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className={`${styles.header} ${light ? styles.light : ''}`}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
