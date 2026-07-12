import {useState, useEffect, useCallback} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import slidesJson from './slides.json';
import styles from './styles.module.css';

const CAPTIONS = [
  ['城市废墟', '每一次探索都要计算风险与回报'],
  ['荒野求生', '季节、天气和资源共同塑造生存策略'],
  ['临时据点', '把找到的一切变成活下去的资本'],
  ['未知威胁', '观察环境，永远为撤退留一条路'],
  ['末日旅途', '载具既是工具，也是移动的家'],
  ['战术选择', '没有万能解法，只有当下更好的判断'],
  ['社区内容', '贴图、翻译与 MOD 让世界持续生长'],
  ['净化协议', '属于 CCB 社区的末日分支'],
];
const SLIDES = slidesJson.map((img, index) => ({img, caption: CAPTIONS[index] ?? ['现场记录', '来自 CCB 的游戏画面']}));

const INTERVAL = 4000;

export default function HomepageCarousel() {
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;

  const go = useCallback((i) => setIdx((i + n) % n), [n]);
  const next = useCallback(() => go(idx + 1), [go, idx]);
  const prev = useCallback(() => go(idx - 1), [go, idx]);

  useEffect(() => {
    if (paused || n <= 1) return undefined;
    const t = setInterval(() => setIdx((c) => (c + 1) % n), INTERVAL);
    return () => clearInterval(t);
  }, [paused, n]);

  if (n === 0) return null;

  const srcOf = (img) => `${baseUrl}${img}`;

  return (
    <section className={styles.carousel}>
      <div
        className={styles.viewport}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={i === idx ? `${styles.slide} ${styles.slideActive}` : styles.slide}
            aria-hidden={i !== idx}>
            <img className={styles.slideImg} src={srcOf(s.img)} alt={`${s.caption[0]}：${s.caption[1]}`} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className={styles.caption}><strong>{s.caption[0]}</strong><span>{s.caption[1]}</span></div>
          </div>
        ))}

        {n > 1 && (
          <>
            <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev} aria-label="上一张">‹</button>
            <button className={`${styles.navBtn} ${styles.next}`} onClick={next} aria-label="下一张">›</button>
            <div className={styles.dots}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                  onClick={() => go(i)}
                  aria-label={`查看${SLIDES[i].caption[0]}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
