import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';
import projects from '../data/projects.json';
import styles from './ProjectsPage.module.css';

function FeaturedCard({ project }) {
  const ref = useScrollReveal();

  return (
    <Link to={`/projects/${project.slug}`} ref={ref} className={styles.featured}>
      <div className={styles.featuredImage}>
        {project.featuredImage ? (
          <img
            src={`${import.meta.env.BASE_URL}wp-content/uploads/${project.featuredImage}`}
            alt={project.title}
            loading="lazy"
          />
        ) : (
          <div className={styles.modelPlaceholder}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.featuredBody}>
        <span className={styles.featuredLabel}>Latest Project</span>
        <h2 className={styles.featuredTitle}>{project.title}</h2>
        {project.designer && <p className={styles.featuredDesigner}>by {project.designer}</p>}
        {project.objectives.length > 0 && (
          <p className={styles.featuredExcerpt}>
            {project.objectives[0].replace(/\*\*/g, '').substring(0, 160)}...
          </p>
        )}
        <span className={styles.viewProject}>View project</span>
      </div>
    </Link>
  );
}

function ProjectCard({ project, index }) {
  const ref = useScrollReveal();
  const nodeNum = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={`/projects/${project.slug}`}
      ref={ref}
      className={styles.card}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      <div className={styles.cardImage}>
        {project.featuredImage ? (
          <img
            src={`${import.meta.env.BASE_URL}wp-content/uploads/${project.featuredImage}`}
            alt={project.title}
            loading="lazy"
          />
        ) : (
          <div className={styles.modelPlaceholder}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <span className={styles.nodeId}>_{nodeNum}</span>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        {project.designer && (
          <p className={styles.cardDesigner}>{project.designer}</p>
        )}
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [featured, ...rest] = projects;

  return (
    <section className={styles.projects}>
      <div className={styles.container}>
        <SectionHeader label="// Our Work" title="Projects" />

        <FeaturedCard project={featured} />

        <div className={styles.grid}>
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
