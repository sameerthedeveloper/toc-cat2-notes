import { T } from './data/content.js';

export const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v == null ? d : JSON.parse(v);
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* storage blocked */
    }
  },
};

export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const strip = (h) => {
  const d = document.createElement('div');
  d.innerHTML = h;
  return d.textContent.replace(/\s+/g, ' ').trim();
};

// plain-text copy of each topic, used by search and by the AI tutor context
T.forEach((t) => {
  t.text = strip(t.body) + ' ' + t.qa.map((q) => q.q + ' ' + strip(q.a)).join(' ');
});

export { T };
export const HOME_ORDER = ['m3-1', 'm3-2', 'm3-3', 'm4-1', 'm4-2', 'm4-3', 'm4-4', 'm4-5', 'm4-6', 'm5-1', 'm5-3', 'm5-4', 'm5-5', 'm5-6'];

/* minimal markdown for tutor replies */
export function md(s) {
  return s
    .split(/```/)
    .map((p, i) => {
      if (i % 2) return `<pre><code>${esc(p.replace(/^\w*\n/, ''))}</code></pre>`;
      const h = esc(p).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
      return h
        .split('\n')
        .map((l) =>
          /^#{1,4}\s/.test(l)
            ? `<h4>${l.replace(/^#+\s/, '')}</h4>`
            : /^\s*[-*]\s/.test(l)
            ? `<div>• ${l.replace(/^\s*[-*]\s/, '')}</div>`
            : l.trim() === ''
            ? '<div style="height:.4em"></div>'
            : `<div>${l}</div>`
        )
        .join('');
    })
    .join('');
}
