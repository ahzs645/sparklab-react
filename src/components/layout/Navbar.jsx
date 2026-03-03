import { useState, useCallback } from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: 'projects.html' },
  { label: 'Contact', href: '#contact' },
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

  const handleNav = useCallback((e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMenuOpen(false);
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#" className={styles.logo} onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="SparkLab" className={styles.logoImg} />
        </a>

        <div className={styles.links}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.link}
              onClick={(e) => handleNav(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <button
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <a
            href="#contact"
            className={styles.ctaBtn}
            onClick={(e) => handleNav(e, '#contact')}
          >
            Join Us
          </a>
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
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={styles.mobileLink}
              style={{ animationDelay: menuOpen ? `${0.05 + i * 0.06}s` : '0s' }}
              onClick={(e) => handleNav(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={styles.mobileCta}
            onClick={(e) => handleNav(e, '#contact')}
          >
            Join Us
          </a>
        </div>
      </div>
    </>
  );
}
