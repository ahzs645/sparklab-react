import React, { useEffect } from 'react';
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

function ContentSection({ title, children }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function renderListItem(item) {
  // Parse **bold** markers back to JSX
  const parts = item.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const headerRef = useScrollReveal();

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

  return (
    <section className={styles.detail}>
      <div className={styles.container}>
        <Link to="/projects" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Projects
        </Link>

        <header ref={headerRef} className={styles.header}>
          <h1 className={styles.title}>{project.title}</h1>
          <div className={styles.meta}>
            {project.projectDate && (
              <span className={styles.metaItem}>
                <strong>Date:</strong> {project.projectDate}
              </span>
            )}
            {project.designer && (
              <span className={styles.metaItem}>
                <strong>Designer:</strong> {project.designer}
              </span>
            )}
            {project.lab && (
              <span className={styles.metaItem}>
                <strong>Lab:</strong> {project.lab}
              </span>
            )}
            {project.contact && (
              <span className={styles.metaItem}>
                <strong>Contact:</strong> {project.contact}
              </span>
            )}
          </div>
        </header>

        {project.modelViewer && (
          <ModelViewer config={project.modelViewer} />
        )}

        <div className={styles.content}>
          {project.objectives.length > 0 && (
            <ContentSection title="Objectives & Constraints">
              <ul className={styles.list}>
                {project.objectives.map((item, i) => (
                  <li key={i}>{renderListItem(item)}</li>
                ))}
              </ul>
            </ContentSection>
          )}

          {project.materials.length > 0 && (
            <ContentSection title="Materials & Tools">
              <ul className={styles.list}>
                {project.materials.map((item, i) => (
                  <li key={i}>{renderListItem(item)}</li>
                ))}
              </ul>
            </ContentSection>
          )}

          {project.phases.length > 0 && (
            <ContentSection title="Phases of Development">
              <div className={styles.phases}>
                {project.phases.map((phase, i) => (
                  <div key={i} className={styles.phase}>
                    <h4 className={styles.phaseTitle}>{phase.title}</h4>
                    <ul className={styles.list}>
                      {phase.items.map((item, j) => (
                        <li key={j}>{renderListItem(item)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ContentSection>
          )}

          {project.skillsDeveloped.length > 0 && (
            <ContentSection title="Skills Developed">
              <div className={styles.tags}>
                {project.skillsDeveloped.map((skill, i) => (
                  <span key={i} className={styles.tag}>{skill}</span>
                ))}
              </div>
            </ContentSection>
          )}

          {project.supportResources.length > 0 && (
            <ContentSection title="Support & Resources">
              <ul className={styles.list}>
                {project.supportResources.map((item, i) => (
                  <li key={i}>{renderListItem(item)}</li>
                ))}
              </ul>
            </ContentSection>
          )}

          {project.productImages.length > 0 && (
            <ContentSection title="Product Images">
              <div className={styles.gallery}>
                {project.productImages.map((img, i) => (
                  <figure key={i} className={styles.figure}>
                    <img
                      src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                      alt={img.alt || img.caption}
                      loading="lazy"
                    />
                    {img.caption && (
                      <figcaption className={styles.figCaption}>
                        <strong>Figure {i + 1}:</strong> {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </ContentSection>
          )}

          {project.clientFeedback && (
            <ContentSection title="Client Feedback">
              <blockquote className={styles.quote}>
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
      </div>
    </section>
  );
}
