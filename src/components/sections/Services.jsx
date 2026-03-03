import { useScrollReveal } from '../../hooks/useScrollReveal';
import { services } from '../../data/services';
import styles from './Services.module.css';

/* Each service gets a small icon (20px) and a large ghost icon (96px).
   We store them as [smallSvg, largeSvg] so the ghost can be oversized. */
const icons = {
  '3D Printing & Prototyping': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  'Design & Modeling': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
      <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
      <path d="m2.3 2.3 7.286 7.286" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  'Coding & Electronics': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20v2" /><path d="M12 2v2" /><path d="M17 20v2" /><path d="M17 2v2" />
      <path d="M2 12h2" /><path d="M2 17h2" /><path d="M2 7h2" />
      <path d="M20 12h2" /><path d="M20 17h2" /><path d="M20 7h2" />
      <path d="M7 20v2" /><path d="M7 2v2" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  ),
  'Website Development': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  ),
  'AI Tools & Support': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" />
      <path d="M4 17v2" /><path d="M5 18H3" />
    </svg>
  ),
  'Research Support': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19h8" />
      <path d="m4 17 6-6-6-6" />
    </svg>
  ),
  'Entrepreneurship Mentoring': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  'Community Connections': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
};

function NodeCard({ service, index }) {
  const ref = useScrollReveal();
  const nodeNum = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={ref}
      className={styles.cardWrapper}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <div className={styles.card}>
        {/* Large ghost icon in corner */}
        <div className={styles.ghostIcon}>
          {icons[service.title]}
        </div>

        {/* Top row: NODE label */}
        <div className={styles.cardTop}>
          <span className={styles.nodeId}>NODE_{nodeNum}</span>
        </div>

        {/* Bottom: title + description */}
        <div className={styles.cardBody}>
          <h4 className={styles.cardTitle}>{service.title}</h4>
          <p className={styles.cardDesc}>{service.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const headerRef = useScrollReveal();

  return (
    <section className={styles.services} id="services">
      <div className={styles.container}>
        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.label}>// What We Offer</span>
            <h2 className={styles.title}>Services & Resources</h2>
          </div>
          <p className={styles.headerNote}>
            Interested in our services?{' '}
            <a href="#contact">Contact us</a> for pricing and availability.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service, i) => (
            <NodeCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
