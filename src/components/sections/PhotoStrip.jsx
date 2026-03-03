import { photos } from '../../data/photos';
import styles from './PhotoStrip.module.css';

export default function PhotoStrip() {
  const allPhotos = [...photos, ...photos];

  return (
    <div className={styles.strip}>
      <div className={styles.track}>
        {allPhotos.map((photo, i) => (
          <img
            key={i}
            src={photo.src}
            alt={photo.alt}
            className={styles.photo}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
