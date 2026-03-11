import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (e, link) => {
    if (link.href) {
      e.preventDefault();
      const sectionId = link.href.slice(1);
      if (location.pathname === '/') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="SparkLab" className={styles.logo} />
        </div>

        <nav className={styles.links}>
          {footerLinks.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                className={styles.link}
                onClick={(e) => handleNav(e, link)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={styles.link}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className={styles.note}>
          UNBC Innovation Hub &bull; Prince George, BC
        </div>
      </div>
    </footer>
  );
}
