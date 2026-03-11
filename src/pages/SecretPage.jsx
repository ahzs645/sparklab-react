import React, { useEffect } from 'react';
import styles from './SecretPage.module.css';

export default function SecretPage() {
  const modelRef = React.useRef(null);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  useEffect(() => {
    const el = modelRef.current;
    if (!el) return;
    el.setAttribute('src', `${import.meta.env.BASE_URL}wp-content/uploads/2025/02/compressed_1739924154961_untitled.glb`);
    el.setAttribute('camera-controls', '');
    el.setAttribute('enable-pan', '');
    el.setAttribute('auto-rotate', '');
    el.setAttribute('rotation-per-second', '41.6deg');
    el.setAttribute('camera-orbit', '-19deg 70deg 105%');
    el.setAttribute('camera-target', '0m 0m 0%');
    el.setAttribute('field-of-view', 'auto');
    el.setAttribute('min-field-of-view', '10deg');
    el.setAttribute('max-field-of-view', '180deg');
  }, []);

  return (
    <section className={styles.secret}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <div className={styles.badge}>You found it</div>
        <div className={styles.modelWrap}>
          <model-viewer
            ref={modelRef}
            style={{
              width: '100%',
              height: '500px',
              backgroundColor: 'transparent',
            }}
          />
        </div>
        <h1 className={styles.title}>The Trophy</h1>
        <p className={styles.subtitle}>
          Not everyone finds this page. You must be curious.
        </p>
      </div>
    </section>
  );
}
