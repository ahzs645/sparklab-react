import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './VisitInfo.module.css';

function MapPinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

export default function VisitInfo() {
  const leftRef = useScrollReveal();
  const emailRef = useScrollReveal();
  const meetingRef = useScrollReveal();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left panel — heading + location card */}
        <div className={styles.left}>
          <div className={styles.gridBg} />
          <div className={styles.ghostIcon}>
            <MapPinIcon />
          </div>

          <div ref={leftRef} className={styles.leftContent}>
            <div className={styles.leftTop}>
              <h2 className={styles.heading}>
                Visit<br />SparkLab
              </h2>
              <p className={styles.subtext}>
                Located in the heart of the Wood Innovation and Design Center.
              </p>
            </div>

            <div className={styles.locationCard}>
              <div className={styles.locationIconWrap}>
                <MapPinIcon className={styles.locationIcon} />
              </div>
              <div className={styles.locationText}>
                <div className={styles.locationName}>Wood Innovation and Design Center</div>
                <div className={styles.locationLine}>Second Floor, Room 270</div>
                <div className={styles.locationMuted}>499 George St</div>
                <div className={styles.locationMuted}>Prince George, BC V2L 1R5</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — email + meeting */}
        <div className={styles.right}>
          <div ref={emailRef} className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <MailIcon />
            </div>
            <div>
              <div className={styles.infoLabel}>PING_US</div>
              <a href="mailto:sparklab@unbc.ca" className={styles.emailLink}>
                sparklab@unbc.ca
              </a>
            </div>
          </div>

          <div ref={meetingRef} className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <CalendarIcon />
            </div>
            <div>
              <div className={styles.infoLabel}>WEEKLY_SYNC</div>
              <div className={styles.meetingTime}>Every Thursday @ 2:00 PM</div>
              <div className={styles.badge}>
                <span className={styles.badgeDot} />
                Open to members &amp; newcomers
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
