import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function PageHero({eyebrow, title, description, children}) {
  return (
    <header className={styles.hero}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <Heading as="h1">{title}</Heading>
        <p>{description}</p>
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </header>
  );
}
