import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import projects from '../data/projects.json';
import styles from './ProjectDetailPage.module.css';

function ModelViewer({ config }) {
  const modelRef = React.useRef(null);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  useEffect(() => {
    const el = modelRef.current;
    if (!el) return;
    el.setAttribute('src', `${import.meta.env.BASE_URL}${config.src.replace(/^\//, '')}`);
    el.setAttribute('camera-controls', '');
    el.setAttribute('enable-pan', '');
    if (config.autoRotate) el.setAttribute('auto-rotate', '');
    el.setAttribute('camera-orbit', config.cameraOrbit);
    el.setAttribute('camera-target', config.cameraTarget);
    el.setAttribute('field-of-view', 'auto');
    el.setAttribute('min-field-of-view', '10deg');
    el.setAttribute('max-field-of-view', '180deg');
  }, [config]);

  return (
    <div className={styles.modelContainer}>
      <model-viewer
        ref={modelRef}
        style={{
          width: '100%',
          height: `${config.height}px`,
          backgroundColor: config.bgColor,
        }}
      />
    </div>
  );
}

function ContentSection({ title, icon, children }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={styles.section}>
      <div className={styles.sectionHeader}>
        {icon && <span className={styles.sectionIcon}>{icon}</span>}
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function renderListItem(item) {
  const parts = item.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <button className={styles.lightboxClose} onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
      <img src={src} alt={alt} className={styles.lightboxImage} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const headerRef = useScrollReveal();
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <section className={styles.detail}>
        <div className={styles.container}>
          <h1>Project not found</h1>
          <Link to="/projects" className={styles.backLink}>Back to Projects</Link>
        </div>
      </section>
    );
  }

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <section className={styles.detail}>
      <div className={styles.container}>
        <Link to="/projects" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          All Projects
        </Link>

        {/* Hero header with model */}
        <header ref={headerRef} className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.projectLabel}>
              PROJECT_{String(projectIndex + 1).padStart(2, '0')}
            </span>
            <h1 className={styles.title}>{project.title}</h1>

            <div className={styles.metaCards}>
              {project.projectDate && (
                <div className={styles.metaCard}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
                  </svg>
                  <div>
                    <span className={styles.metaLabel}>Date</span>
                    <span className={styles.metaValue}>{project.projectDate}</span>
                  </div>
                </div>
              )}
              {project.designer && (
                <div className={styles.metaCard}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  </svg>
                  <div>
                    <span className={styles.metaLabel}>Designer</span>
                    <span className={styles.metaValue}>{project.designer}</span>
                  </div>
                </div>
              )}
              {project.lab && (
                <div className={styles.metaCard}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" />
                  </svg>
                  <div>
                    <span className={styles.metaLabel}>Lab</span>
                    <span className={styles.metaValue}>{project.lab}</span>
                  </div>
                </div>
              )}
              {project.contact && (
                <div className={styles.metaCard}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <div>
                    <span className={styles.metaLabel}>Contact</span>
                    <span className={styles.metaValue}>{project.contact}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {project.modelViewer && (
          <ModelViewer config={project.modelViewer} />
        )}

        {/* Two-column layout for objectives + materials */}
        {(project.objectives.length > 0 || project.materials.length > 0) && (
          <div className={styles.twoCol}>
            {project.objectives.length > 0 && (
              <ContentSection title="Objectives & Constraints" icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                </svg>
              }>
                <ul className={styles.list}>
                  {project.objectives.map((item, i) => (
                    <li key={i}>{renderListItem(item)}</li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {project.materials.length > 0 && (
              <ContentSection title="Materials & Tools" icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              }>
                <ul className={styles.list}>
                  {project.materials.map((item, i) => (
                    <li key={i}>{renderListItem(item)}</li>
                  ))}
                </ul>
              </ContentSection>
            )}
          </div>
        )}

        <div className={styles.content}>
          {project.phases.length > 0 && (
            <ContentSection title="Phases of Development" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
              </svg>
            }>
              <div className={styles.phases}>
                {project.phases.map((phase, i) => (
                  <div key={i} className={styles.phase}>
                    <div className={styles.phaseNum}>{String(i + 1).padStart(2, '0')}</div>
                    <div className={styles.phaseContent}>
                      <h4 className={styles.phaseTitle}>{phase.title}</h4>
                      <ul className={styles.list}>
                        {phase.items.map((item, j) => (
                          <li key={j}>{renderListItem(item)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </ContentSection>
          )}

          {project.skillsDeveloped.length > 0 && (
            <ContentSection title="Skills Developed" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            }>
              <ul className={styles.list}>
                {project.skillsDeveloped.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </ContentSection>
          )}

          {project.supportResources.length > 0 && (
            <ContentSection title="Support & Resources" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" />
              </svg>
            }>
              <ul className={styles.list}>
                {project.supportResources.map((item, i) => (
                  <li key={i}>{renderListItem(item)}</li>
                ))}
              </ul>
            </ContentSection>
          )}

          {project.productImages.length > 0 && (
            <ContentSection title="Product Images" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            }>
              <div className={styles.gallery}>
                {project.productImages.map((img, i) => (
                  <figure
                    key={i}
                    className={styles.figure}
                    onClick={() => setLightboxImg({
                      src: `${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`,
                      alt: img.alt || img.caption
                    })}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                      alt={img.alt || img.caption}
                      loading="lazy"
                    />
                    <div className={styles.figOverlay}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" />
                      </svg>
                    </div>
                    {img.caption && (
                      <figcaption className={styles.figCaption}>
                        Fig. {i + 1}: {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </ContentSection>
          )}

          {project.clientFeedback && (
            <ContentSection title="Client Feedback" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
              </svg>
            }>
              <blockquote className={styles.quote}>
                <svg className={styles.quoteIcon} width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.3 5.2C7.4 7 4.8 10.6 4.8 14.4c0 2.2 1.2 3.6 3 3.6 1.6 0 2.8-1.2 2.8-2.8 0-1.6-1.2-2.6-2.6-2.6-.2 0-.6 0-.8.2.6-2.4 2.8-5 5.2-6.2L11.3 5.2zm8.4 0c-3.8 1.8-6.4 5.4-6.4 9.2 0 2.2 1.2 3.6 3 3.6 1.6 0 2.8-1.2 2.8-2.8 0-1.6-1.2-2.6-2.6-2.6-.2 0-.6 0-.8.2.6-2.4 2.8-5 5.2-6.2L19.7 5.2z" />
                </svg>
                <p>{project.clientFeedback.quote}</p>
                {project.clientFeedback.name && (
                  <footer className={styles.quoteAuthor}>
                    &mdash; {project.clientFeedback.name}
                  </footer>
                )}
              </blockquote>
            </ContentSection>
          )}
        </div>

        {/* Prev/Next navigation */}
        {(prevProject || nextProject) && (
          <nav className={styles.projectNav}>
            {prevProject ? (
              <Link to={`/projects/${prevProject.slug}`} className={styles.navPrev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <div>
                  <span className={styles.navLabel}>Previous</span>
                  <span className={styles.navTitle}>{prevProject.title}</span>
                </div>
              </Link>
            ) : <div />}
            {nextProject ? (
              <Link to={`/projects/${nextProject.slug}`} className={styles.navNext}>
                <div>
                  <span className={styles.navLabel}>Next</span>
                  <span className={styles.navTitle}>{nextProject.title}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ) : <div />}
          </nav>
        )}
      </div>

      {lightboxImg && (
        <Lightbox src={lightboxImg.src} alt={lightboxImg.alt} onClose={() => setLightboxImg(null)} />
      )}
    </section>
  );
}
