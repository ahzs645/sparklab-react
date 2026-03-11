import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';
import styles from './ContactPage.module.css';

function InfoCard({ icon, label, children }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={styles.card}>
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardLabel}>{label}</h3>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <section className={styles.contact}>
      <div className={styles.container}>
        <SectionHeader label="// Get in Touch" title="Contact Us" />

        <div className={styles.grid}>
          <InfoCard
            label="Location"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          >
            <p>Second Floor, Room 270</p>
            <p>Wood Innovation and Design Center</p>
            <p>499 George St,</p>
            <p>Prince George, BC V2L 1R5</p>
          </InfoCard>

          <InfoCard
            label="Inquiries"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          >
            <p>For any questions or inquiries, please email us at:</p>
            <a href="mailto:sparklab@unbc.ca" className={styles.emailLink}>sparklab@unbc.ca</a>
          </InfoCard>

          <InfoCard
            label="Meeting Schedule"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
              </svg>
            }
          >
            <p>Join us every <strong>Thursday at 2 PM</strong> in the Creator Space for our general meeting with members and newcomers!</p>
          </InfoCard>

          <InfoCard
            label="About SparkLab"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" /><path d="M10 22h4" />
              </svg>
            }
          >
            <p>SparkLab is a community-driven space, primarily run by our dedicated members. We thrive on collaboration and innovation, and we are here to support your creative and entrepreneurial endeavors.</p>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}
