// Drives MonthScrubber.astro: crossfades the pictures, counts the numbers
// from one stop to the next, and plays one stop every few seconds while the
// figure is on screen, unless the reader prefers reduced motion or has
// touched a control.

const STEP_MS = 3200;
const COUNT_MS = 700;

interface Words {
  pause: string;
  play: string;
}

export function monthScrubber(root: HTMLElement): void {
  const values = JSON.parse(root.dataset.stops ?? '[]') as number[][];
  const words = JSON.parse(root.dataset.words ?? '{}') as Words;
  const captions = JSON.parse(root.dataset.captions ?? '[]') as [
    string,
    string,
    string,
  ][];
  const locale = root.dataset.lang === 'ru' ? 'ru-RU' : 'en-US';
  const imgs = [...root.querySelectorAll<HTMLImageElement>('.month-frame img')];
  const cells = [...root.querySelectorAll<HTMLElement>('.month-stats dd')];
  const when = root.querySelector<HTMLElement>('.month-when');
  const caption = root.querySelector<HTMLElement>('.month-caption');
  const scrub = root.querySelector<HTMLInputElement>('[data-act="scrub"]');
  const playBtn = root.querySelector<HTMLButtonElement>('[data-act="play"]');
  const prev = root.querySelector<HTMLButtonElement>('[data-act="prev"]');
  const next = root.querySelector<HTMLButtonElement>('[data-act="next"]');
  if (
    !values.length ||
    !when ||
    !caption ||
    !scrub ||
    !playBtn ||
    !prev ||
    !next
  ) {
    console.error('month-scrubber: the figure is missing a part', root);
    return;
  }

  let at = 0;
  let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false;
  let timer = 0;
  let raf = 0;
  const fmt = (n: number) => Math.round(n).toLocaleString(locale);

  function show(i: number) {
    const from = values[at];
    at = (i + values.length) % values.length;
    const to = values[at];
    imgs.forEach((img, k) => img.classList.toggle('on', k === at));
    const [w, l, c] = captions[at] ?? ['', '', ''];
    when!.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = w;
    when!.append(strong, ` · ${l}`);
    caption!.textContent = c;
    scrub!.value = String(at);
    // Preload the next picture so the crossfade never shows an empty frame.
    const after = imgs[(at + 1) % imgs.length];
    if (after) after.loading = 'eager';
    cancelAnimationFrame(raf);
    const start = performance.now();
    const count = (now: number) => {
      const f = Math.min(1, (now - start) / COUNT_MS);
      const e = 1 - (1 - f) ** 3;
      cells.forEach((cell, k) => {
        cell.textContent = fmt(from[k] + (to[k] - from[k]) * e);
      });
      if (f < 1) raf = requestAnimationFrame(count);
    };
    raf = requestAnimationFrame(count);
  }

  function sync() {
    window.clearInterval(timer);
    if (playing && visible)
      timer = window.setInterval(() => show(at + 1), STEP_MS);
    playBtn!.textContent = playing ? words.pause : words.play;
  }

  const stop = () => {
    playing = false;
    sync();
  };
  prev.addEventListener('click', () => {
    stop();
    show(at - 1);
  });
  next.addEventListener('click', () => {
    stop();
    show(at + 1);
  });
  scrub.addEventListener('input', () => {
    stop();
    show(Number(scrub.value));
  });
  playBtn.addEventListener('click', () => {
    playing = !playing;
    sync();
  });
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(root);
  window.addEventListener('pagehide', () => {
    window.clearInterval(timer);
    cancelAnimationFrame(raf);
  });
}
