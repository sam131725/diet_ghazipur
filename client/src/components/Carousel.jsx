import { useEffect, useState } from 'react';
import { useLive } from '../api.js';
import { useLang, pick } from '../i18n.jsx';

const FALLBACK = [{ _id: 'f', title: 'DIET GHAZIPUR', subtitle: 'Centre for Quality Education and Teacher Training', imageUrl: '' }];

export default function Carousel() {
  const { lang, t } = useLang();
  const { data } = useLive('/carousel?active=1', 'carousel');
  const slides = data.length ? data : FALLBACK;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { if (i >= slides.length) setI(0); }, [slides.length, i]);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const go = (d) => setI((v) => (v + d + slides.length) % slides.length);

  return (
    <div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="ctrack" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <div className="slide" key={s._id} aria-hidden={k !== i}
            style={s.imageUrl ? { backgroundImage: `url(${s.imageUrl})` } : undefined}>
            <div className="cap">
              <h2>{s._id === 'f' ? t(s.title) : pick(lang, s, 'title')}</h2>
              {s.subtitle && <p>{s._id === 'f' ? t(s.subtitle) : pick(lang, s, 'subtitle')}</p>}
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button className="arrow l" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
          <button className="arrow r" onClick={() => go(1)} aria-label="Next slide">›</button>
          <div className="dots">{slides.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
        </>
      )}
    </div>
  );
}
