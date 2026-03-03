import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './About.module.css';

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const num = parseInt(target);
          if (isNaN(num)) {
            setCount(target);
            return;
          }
          let start = 0;
          const duration = 1200;
          const startTime = performance.now();
          const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            start = Math.round(eased * num);
            setCount(start + suffix);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <span ref={ref}>{typeof count === 'number' ? '0' : count}</span>;
}

const stats = [
  { value: '8', suffix: '+', label: 'Services Offered' },
  { value: 'Open', label: 'To Everyone' },
  { value: 'Weekly', label: 'Meetups' },
];

export default function About() {
  const imageRef = useScrollReveal();
  const textRef = useScrollReveal();

  return (
    <section className={styles.about} id="about">
      <div className={styles.grid}>
        <div ref={imageRef} className={styles.imageWrap}>
          <div className={styles.imageFrame}>
            <img
              src="https://sparklab.unbc.ca/wp-content/uploads/2024/07/dsc2547-engageinimpactfulprojects-800x534-1.jpg"
              alt="SparkLab team collaborating"
              className={styles.image}
              loading="lazy"
            />
          </div>
          <div className={styles.imageAccent} />
        </div>

        <div ref={textRef} className={styles.text}>
          <span className={styles.label}>About Us</span>
          <h2 className={styles.heading}>Where Ideas Take Shape</h2>
          <p>
            SparkLab is a community-driven innovation hub at UNBC, dedicated to
            fostering creativity, collaboration, and impactful action. We provide a
            space for students, researchers, and the public to experiment, explore,
            and bridge disciplines to tackle real-world challenges.
          </p>
          <p>
            Our team comprises passionate individuals committed to creating a dynamic
            environment where ideas flourish into innovative solutions. Whether
            you&apos;re prototyping your first invention or scaling a business
            concept, SparkLab is your launchpad.
          </p>

          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <div className={styles.statValue}>
                  {isNaN(parseInt(s.value)) ? (
                    s.value
                  ) : (
                    <CountUp target={s.value} suffix={s.suffix || ''} />
                  )}
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
