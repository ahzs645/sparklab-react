import { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'About', href: '#about', to: '/' },
  { label: 'Services', href: '#services', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar({ theme, onToggleTheme }) {
  const scrolled = useScrollPosition(50);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = useCallback((e, link) => {
    setMenuOpen(false);

    // If the link has a hash anchor (About, Services, Contact)
    if (link.href) {
      e.preventDefault();
      const sectionId = link.href.slice(1);

      if (location.pathname === '/') {
        // Already on home page, just scroll
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to home then scroll
        navigate('/');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
    // For route links (Blog, Projects), Link handles it
  }, [location.pathname, navigate]);

  const handleLogo = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="/" className={styles.logo} onClick={handleLogo}>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="SparkLab" className={styles.logoImg} />
        </a>

        <div className={styles.links}>
          {navLinks.map((link) =>
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
                className={`${styles.link} ${location.pathname.startsWith(link.to) && link.to !== '/' ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            )
          )}
          <button
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <Link to="/contact" className={styles.ctaBtn}>
            Join Us
          </Link>
        </div>

        <div className={styles.rightControls}>
          <button
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.visible : ''}`}>
        <div className={styles.mobileMenu}>
          {navLinks.map((link, i) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                className={styles.mobileLink}
                style={{ animationDelay: menuOpen ? `${0.05 + i * 0.06}s` : '0s' }}
                onClick={(e) => handleNav(e, link)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={styles.mobileLink}
                style={{ animationDelay: menuOpen ? `${0.05 + i * 0.06}s` : '0s' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            className={styles.mobileCta}
            onClick={() => setMenuOpen(false)}
          >
            Join Us
          </Link>
        </div>
      </div>
    </>
  );
}
