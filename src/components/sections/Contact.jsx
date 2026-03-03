import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Contact.module.css';

export default function Contact() {
  const ref = useScrollReveal();

  return (
    <section className={styles.contact} id="contact">
      {/* Background typographic noise */}
      <div className={styles.bgNoise}>
        <span className={styles.bgWord1}>CREATE</span>
        <span className={styles.bgWord2}>AMAZING</span>
      </div>

      <div ref={ref} className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgePulse}>&#128293;</span>
          <span>Thursdays @ 2 PM</span>
        </div>

        <h2 className={styles.heading}>
          Ready to Create Something Amazing?
        </h2>

        <p className={styles.text}>
          Join our community of innovators. Whether you have a project in mind
          or just want to explore, everyone is welcome.
        </p>

        <a
          href="mailto:sparklab@unbc.ca?subject=I want to join SparkLab!"
          className={styles.cta}
        >
          Join The Meeting
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.ctaIcon}
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
