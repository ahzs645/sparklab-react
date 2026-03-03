import styles from './Footer.module.css';

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: 'projects.html' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const handleNav = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src="/logo.svg" alt="SparkLab" className={styles.logo} />
        </div>

        <nav className={styles.links}>
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.link}
              onClick={(e) => handleNav(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.note}>
          UNBC Innovation Hub &bull; Prince George, BC
        </div>
      </div>
    </footer>
  );
}
