import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';
import blogPosts from '../data/blogPosts.json';
import styles from './BlogPage.module.css';

function BlogCard({ post, index }) {
  const ref = useScrollReveal();
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      to={`/blog/${post.slug}`}
      ref={ref}
      className={styles.card}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      {post.featuredImage && (
        <div className={styles.cardImage}>
          <img
            src={`${import.meta.env.BASE_URL}wp-content/uploads/${post.featuredImage}`}
            alt={post.title}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardDate}>{date}</span>
          {post.categories.map((cat) => (
            <span key={cat} className={styles.cardCategory}>{cat}</span>
          ))}
        </div>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        <p className={styles.cardExcerpt}>{post.excerpt}</p>
        <span className={styles.readMore}>Read more</span>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <SectionHeader label="// Latest Updates" title="Blog" />
        <div className={styles.grid}>
          {blogPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
