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

/* LaTeX -> unicode, for when a model ignores "no LaTeX". Unknown commands are left untouched. */
const TEX = {
  Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔', rightarrow: '→', leftarrow: '←', to: '→', implies: '⇒', iff: '⇔',
  varepsilon: 'ε', epsilon: 'ε', cdots: '⋯', ldots: '…', dots: '…', ge: '≥', geq: '≥', le: '≤', leq: '≤', neq: '≠', ne: '≠',
  mid: '|', in: '∈', notin: '∉', cup: '∪', cap: '∩', subseteq: '⊆', times: '×', cdot: '·', circ: '∘', emptyset: '∅', infty: '∞',
  Sigma: 'Σ', sigma: 'σ', delta: 'δ', Delta: 'Δ', gamma: 'γ', Gamma: 'Γ', alpha: 'α', beta: 'β', lambda: 'λ', omega: 'ω', pi: 'π',
  vdash: '⊢', forall: '∀', exists: '∃', land: '∧', lor: '∨', neg: '¬', star: '*', ast: '*', langle: '⟨', rangle: '⟩',
  quad: '  ', qquad: '    ',
};
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', n: 'ⁿ', i: 'ⁱ', '+': '⁺', '-': '⁻' };
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
const script = (s, map, mark) => (s.length && [...s].every((c) => map[c]) ? [...s].map((c) => map[c]).join('') : mark + (s.length > 1 ? '(' + s + ')' : s));

export function tex(s) {
  if (!s.includes('\\')) return s;
  return s
    .replace(/\\\[|\\\]|\\\(|\\\)/g, '')
    .replace(/\\(?:text|mathrm|mathit|textbf|mathbf|operatorname)\{([^{}]*)\}/g, '$1')
    .replace(/\\\{/g, '\u0001').replace(/\\\}/g, '\u0002')
    .replace(/\^\{([^{}]*)\}|\^([A-Za-z0-9+-])/g, (_, a, b) => script(a ?? b, SUP, '^'))
    .replace(/_\{([^{}]*)\}|_([0-9])/g, (_, a, b) => script(a ?? b, SUB, '_'))
    .replace(/\\([A-Za-z]+)/g, (m, c) => TEX[c] ?? m)
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\u0001/g, '{').replace(/\u0002/g, '}');
}

/* minimal markdown for tutor replies */
export function md(s) {
  return s
    .split(/```/)
    .map((p, i) => {
      if (i % 2) return `<pre><code>${esc(p.replace(/^\w*\n/, ''))}</code></pre>`;
      const h = esc(tex(p)).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
      return h
        .split('\n')
        .map((l) =>
          /^\s*([-*_]){3,}\s*$/.test(l)
            ? '<hr class="rule">'
            : /^#{1,4}\s/.test(l)
            ? `<h4>${l.replace(/^#+\s/, '')}</h4>`
            : /^\s*[-*•]\s/.test(l)
            ? `<div>• ${l.replace(/^\s*[-*•]\s/, '')}</div>`
            : l.trim() === ''
            ? '<div style="height:.4em"></div>'
            : `<div>${l}</div>`
        )
        .join('');
    })
    .join('');
}

/* ---- tutor replies: HTML from the model, sanitised with an allowlist ---- */
const OK_TAGS = new Set(['P', 'H3', 'H4', 'UL', 'OL', 'LI', 'B', 'STRONG', 'I', 'EM', 'CODE', 'PRE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'SUB', 'SUP', 'BR', 'HR', 'DIV', 'SPAN']);
const DROP_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'TEMPLATE']);

function clean(node) {
  for (const c of [...node.childNodes]) {
    if (c.nodeType === 3) {
      if (!node.closest || !node.closest('pre')) c.nodeValue = tex(c.nodeValue);
    } else if (c.nodeType === 1) {
      if (DROP_TAGS.has(c.tagName)) c.remove();
      else {
        clean(c);
        if (OK_TAGS.has(c.tagName)) [...c.attributes].forEach((a) => c.removeAttribute(a.name));
        else c.replaceWith(...c.childNodes);
      }
    } else c.remove();
  }
}

export function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString('<body>' + html, 'text/html');
  clean(doc.body);
  return doc.body.innerHTML;
}

/** HTML reply -> sanitised HTML; anything that is not HTML falls back to the Markdown renderer. */
export function renderAI(s) {
  const t = s.replace(/^\s*```(?:html)?\s*\n?/i, '').replace(/\n?```\s*$/, '');
  return /<\/?(p|div|h[1-6]|ul|ol|li|b|strong|table|pre|code|br)\b/i.test(t) ? sanitizeHtml(t) : md(s);
}
