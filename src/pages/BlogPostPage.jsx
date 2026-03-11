import { useParams, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import blogPosts from '../data/blogPosts.json';
import styles from './BlogPostPage.module.css';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const ref = useScrollReveal();

  if (!post) {
    return (
      <section className={styles.postPage}>
        <div className={styles.container}>
          <h1>Post not found</h1>
          <Link to="/blog" className={styles.backLink}>Back to Blog</Link>
        </div>
      </section>
    );
  }

  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className={styles.postPage}>
      <div className={styles.container}>
        <Link to="/blog" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Blog
        </Link>

        <article ref={ref} className={styles.article}>
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.date}>{date}</span>
              {post.categories.map((cat) => (
                <span key={cat} className={styles.category}>{cat}</span>
              ))}
            </div>
            <h1 className={styles.title}>{post.title}</h1>
          </header>

          {post.featuredImage && (
            <div className={styles.featuredImage}>
              <img
                src={`${import.meta.env.BASE_URL}wp-content/uploads/${post.featuredImage}`}
                alt={post.title}
              />
            </div>
          )}

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </section>
  );
}
