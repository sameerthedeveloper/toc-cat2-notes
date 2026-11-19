/* Data mining algorithms, written so each step can be shown the way an exam answer shows it. */

/* ---------- shared data: the buys_computer table used in every textbook ---------- */
export const BUYS = {
  attrs: ['age', 'income', 'student', 'credit'],
  rows: [
    ['youth', 'high', 'no', 'fair', 'no'], ['youth', 'high', 'no', 'excellent', 'no'], ['middle', 'high', 'no', 'fair', 'yes'],
    ['senior', 'medium', 'no', 'fair', 'yes'], ['senior', 'low', 'yes', 'fair', 'yes'], ['senior', 'low', 'yes', 'excellent', 'no'],
    ['middle', 'low', 'yes', 'excellent', 'yes'], ['youth', 'medium', 'no', 'fair', 'no'], ['youth', 'low', 'yes', 'fair', 'yes'],
    ['senior', 'medium', 'yes', 'fair', 'yes'], ['youth', 'medium', 'yes', 'excellent', 'yes'], ['middle', 'medium', 'no', 'excellent', 'yes'],
    ['middle', 'high', 'yes', 'fair', 'yes'], ['senior', 'medium', 'no', 'excellent', 'no'],
  ],
};

const lg = (x) => (x === 0 ? 0 : Math.log2(x));
export const fmt = (x, d = 3) => (Number.isFinite(x) ? String(+x.toFixed(d)) : String(x));

/* ---------- decision tree ---------- */
export const counts = (rows, ci = rows[0] ? rows[0].length - 1 : 0) => {
  const m = {};
  rows.forEach((r) => { m[r[ci]] = (m[r[ci]] || 0) + 1; });
  return m;
};
export const entropy = (rows) => {
  const c = counts(rows), n = rows.length;
  return -Object.values(c).reduce((s, k) => s + (k / n) * lg(k / n), 0);
};
export const gini = (rows) => {
  const c = counts(rows), n = rows.length;
  return 1 - Object.values(c).reduce((s, k) => s + (k / n) ** 2, 0);
};
export function splitInfo(rows, ai) {
  const parts = {};
  rows.forEach((r) => { (parts[r[ai]] ||= []).push(r); });
  const n = rows.length;
  const base = entropy(rows);
  const info = Object.values(parts).reduce((s, p) => s + (p.length / n) * entropy(p), 0);
  const si = -Object.values(parts).reduce((s, p) => s + (p.length / n) * lg(p.length / n), 0);
  const gi = Object.values(parts).reduce((s, p) => s + (p.length / n) * gini(p), 0);
  return { parts, info, gain: base - info, splitInfo: si, ratio: si ? (base - info) / si : 0, giniSplit: gi, giniGain: gini(rows) - gi };
}
export function buildTree(rows, attrs, used = [], crit = 'gain') {
  const c = counts(rows);
  const labels = Object.keys(c);
  if (labels.length === 1) return { leaf: labels[0], n: rows.length };
  const rest = attrs.map((a, i) => i).filter((i) => !used.includes(i));
  if (!rest.length) { const best = labels.sort((a, b) => c[b] - c[a])[0]; return { leaf: best, n: rows.length, majority: true }; }
  const scored = rest.map((i) => ({ i, s: splitInfo(rows, i) }));
  const key = (x) => (crit === 'gini' ? x.s.giniGain : crit === 'ratio' ? x.s.ratio : x.s.gain);
  scored.sort((a, b) => key(b) - key(a));
  const best = scored[0];
  const node = { attr: attrs[best.i], gain: best.s.gain, scores: scored.map((x) => ({ attr: attrs[x.i], gain: x.s.gain, ratio: x.s.ratio, gini: x.s.giniGain })), kids: {} };
  Object.entries(best.s.parts).forEach(([v, part]) => { node.kids[v] = buildTree(part, attrs, [...used, best.i], crit); });
  return node;
}
export function treeText(node, ind = '') {
  if (node.leaf !== undefined) return ` → ${node.leaf} (${node.n})\n`;
  let s = `\n`;
  Object.entries(node.kids).forEach(([v, k]) => { s += `${ind}${node.attr} = ${v}` + treeText(k, ind + '    '); });
  return s;
}

/* ---------- naive Bayes ---------- */
export function bayes(rows, attrs, x, laplace = false) {
  const ci = rows[0].length - 1, cls = counts(rows, ci), n = rows.length;
  const out = Object.keys(cls).sort().map((c) => {
    const sub = rows.filter((r) => r[ci] === c);
    const lik = attrs.map((a, i) => {
      const k = sub.filter((r) => r[i] === x[i]).length;
      const vals = new Set(rows.map((r) => r[i])).size;
      return { attr: a, k, n: sub.length, p: laplace ? (k + 1) / (sub.length + vals) : k / sub.length, vals };
    });
    const prior = cls[c] / n;
    const prod = lik.reduce((p, l) => p * l.p, 1);
    return { c, prior, count: cls[c], n, lik, prod, score: prior * prod };
  });
  const tot = out.reduce((s, o) => s + o.score, 0);
  out.forEach((o) => { o.post = tot ? o.score / tot : 0; });
  return out;
}

/* ---------- k-nearest neighbour ---------- */
export const dist = (a, b, p = 2) => Math.pow(a.reduce((s, v, i) => s + Math.abs(v - b[i]) ** p, 0), 1 / p);
export function knn(train, q, k) {
  const d = train.map((t) => ({ ...t, d: dist(t.x, q) })).sort((a, b) => a.d - b.d);
  const near = d.slice(0, k), votes = {};
  near.forEach((t) => { votes[t.c] = (votes[t.c] || 0) + 1; });
  return { all: d, near, votes, pred: Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0] };
}

/* ---------- evaluation ---------- */
export function metrics(tp, fn, fp, tn) {
  const p = tp + fn, n = fp + tn, t = p + n;
  const acc = (tp + tn) / t, prec = tp / (tp + fp), rec = tp / p, spec = tn / n, f1 = (2 * prec * rec) / (prec + rec);
  const pe = ((tp + fp) * p + (fn + tn) * n) / (t * t);
  return { p, n, t, acc, err: 1 - acc, prec, rec, spec, f1, fb2: (5 * prec * rec) / (4 * prec + rec), kappa: (acc - pe) / (1 - pe) };
}

/* ---------- k-means ---------- */
export function kmeans(pts, cents, maxIter = 20) {
  let c = cents.map((x) => x.slice()), assign = [];
  const rounds = [];
  for (let it = 0; it < maxIter; it++) {
    assign = pts.map((p) => { let b = 0, bd = Infinity; c.forEach((m, i) => { const d = dist(p, m); if (d < bd) { bd = d; b = i; } }); return b; });
    const next = c.map((m, i) => {
      const mem = pts.filter((_, j) => assign[j] === i);
      return mem.length ? m.map((_, d) => mem.reduce((s, p) => s + p[d], 0) / mem.length) : m;
    });
    const sse = pts.reduce((s, p, j) => s + dist(p, next[assign[j]]) ** 2, 0);
    rounds.push({ it: it + 1, cents: c, assign: assign.slice(), next, sse });
    const same = next.every((m, i) => m.every((v, d) => Math.abs(v - c[i][d]) < 1e-9));
    c = next;
    if (same) break;
  }
  return { rounds, cents: c, assign };
}

/* ---------- hierarchical (agglomerative) ---------- */
export function agglo(names, D, link = 'single') {
  let cl = names.map((n, i) => ({ id: [i], label: n }));
  const dd = (a, b) => {
    const v = [];
    a.id.forEach((i) => b.id.forEach((j) => v.push(D[i][j])));
    return link === 'single' ? Math.min(...v) : link === 'complete' ? Math.max(...v) : v.reduce((s, x) => s + x, 0) / v.length;
  };
  const steps = [];
  while (cl.length > 1) {
    let bi = 0, bj = 1, bd = Infinity;
    for (let i = 0; i < cl.length; i++) for (let j = i + 1; j < cl.length; j++) { const d = dd(cl[i], cl[j]); if (d < bd) { bd = d; bi = i; bj = j; } }
    const merged = { id: [...cl[bi].id, ...cl[bj].id], label: `(${cl[bi].label} ${cl[bj].label})` };
    steps.push({ a: cl[bi].label, b: cl[bj].label, d: bd, label: merged.label });
    cl = cl.filter((_, i) => i !== bi && i !== bj).concat(merged);
  }
  return steps;
}
export const distMatrix = (pts) => pts.map((a) => pts.map((b) => dist(a, b)));

/* ---------- DBSCAN ---------- */
export function dbscan(pts, eps, minPts) {
  const n = pts.length, nbr = pts.map((p) => pts.map((q, j) => j).filter((j) => dist(p, pts[j]) <= eps));
  const core = nbr.map((l) => l.length >= minPts);
  const lab = new Array(n).fill(0); // 0 = unvisited, -1 = noise, k = cluster
  let k = 0;
  const log = [];
  for (let i = 0; i < n; i++) {
    if (lab[i] !== 0) continue;
    if (!core[i]) { lab[i] = -1; log.push(`P${i + 1}: ${nbr[i].length} points within ε, fewer than MinPts, mark noise for now`); continue; }
    k++; lab[i] = k;
    log.push(`P${i + 1}: core (${nbr[i].length} within ε), start cluster C${k}`);
    const q = [...nbr[i]];
    while (q.length) {
      const j = q.shift();
      if (lab[j] === -1) { lab[j] = k; log.push(`P${j + 1}: was noise, is a border point of C${k}`); }
      if (lab[j] !== 0) continue;
      lab[j] = k;
      if (core[j]) { log.push(`P${j + 1}: core, joins C${k}, expand`); nbr[j].forEach((m) => { if (lab[m] === 0 || lab[m] === -1) q.push(m); }); }
      else log.push(`P${j + 1}: border point of C${k}`);
    }
  }
  return { nbr, core, lab, clusters: k, log };
}

/* ---------- backpropagation, one hidden layer, sigmoid, no bias unless given ---------- */
export const sig = (x) => 1 / (1 + Math.exp(-x));
export function backprop({ x, w1, b1, w2, b2, t, lr }) {
  const h = w1.map((row, j) => sig(row.reduce((s, w, i) => s + w * x[i], 0) + b1[j]));
  const o = w2.reduce((s, w, j) => s + w * h[j], 0) + b2;
  const out = sig(o);
  const dOut = out * (1 - out) * (t - out);
  const dH = h.map((hj, j) => hj * (1 - hj) * dOut * w2[j]);
  const nw2 = w2.map((w, j) => w + lr * dOut * h[j]);
  const nb2 = b2 + lr * dOut;
  const nw1 = w1.map((row, j) => row.map((w, i) => w + lr * dH[j] * x[i]));
  const nb1 = b1.map((b, j) => b + lr * dH[j]);
  return { h, out, err: t - out, dOut, dH, nw1, nb1, nw2, nb2 };
}

/* ---------- SVM check for a given hyperplane ---------- */
export function svmCheck(w, b, pts) {
  const nw = Math.hypot(...w);
  const rows = pts.map((p) => { const f = w.reduce((s, v, i) => s + v * p.x[i], 0) + b; return { ...p, f, side: f >= 0 ? 1 : -1, ok: (f >= 0 ? 1 : -1) === p.c, dist: Math.abs(f) / nw }; });
  return { rows, margin: 2 / nw, sv: rows.filter((r) => Math.abs(Math.abs(r.f) - 1) < 1e-9) };
}

/* ---------- dissimilarity for mixed data types ---------- */
export function binaryDis(a, b) {
  let q = 0, r = 0, s = 0, t = 0;
  a.forEach((v, i) => { if (v && b[i]) q++; else if (v && !b[i]) r++; else if (!v && b[i]) s++; else t++; });
  return { q, r, s, t, simple: (r + s) / (q + r + s + t), jaccard: (r + s) / (q + r + s) };
}

/* ---------- outlier: z-score and IQR ---------- */
export function outliers(vals) {
  const n = vals.length, mean = vals.reduce((s, v) => s + v, 0) / n;
  const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1));
  const s = [...vals].sort((a, b) => a - b);
  const q = (p) => { const pos = (n - 1) * p, lo = Math.floor(pos); return s[lo] + (s[Math.min(lo + 1, n - 1)] - s[lo]) * (pos - lo); };
  const q1 = q(0.25), q3 = q(0.75), iqr = q3 - q1;
  return { mean, sd, q1, q3, iqr, lo: q1 - 1.5 * iqr, hi: q3 + 1.5 * iqr, z: vals.map((v) => (v - mean) / sd) };
}

/* ---------- diagrams (boxes and arrows) ---------- */
export function netSVG(nodes, edges, W, H, opt = {}) {
  const nw = opt.nw || 118, nh = opt.nh || 34; const N = {}; nodes.forEach((n) => (N[n.id] = n));
  const clip = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y; const aw = (a.w || nw) / 2, ah = (a.h || nh) / 2; const t = Math.min(dx ? aw / Math.abs(dx) : 1e9, dy ? ah / Math.abs(dy) : 1e9); return [a.x + dx * t, a.y + dy * t]; };
  let s = `<svg class="net" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${opt.label || 'diagram'}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>`;
  edges.forEach(([f, t, l, d]) => {
    const a = N[f], b = N[t]; const [x1, y1] = clip(a, b), [x2, y2] = clip(b, a);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${d ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#ar)"/>`;
    if (l) s += `<text class="el" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 5}" text-anchor="middle">${l}</text>`;
  });
  nodes.forEach((n) => { const w = n.w || nw, h = n.h || nh; s += `<g class="nd ${n.c || ''}"><rect x="${n.x - w / 2}" y="${n.y - h / 2}" width="${w}" height="${h}" rx="${n.r ?? 4}"/><text x="${n.x}" y="${n.y + 4}" text-anchor="middle">${n.t}</text></g>`; });
  return s + '</svg>';
}
const hop = (id, x, y, t, c, w) => ({ id, x, y, t, c, w });
export const DIAG = {
  kdd: () => netSVG([hop('d', 70, 40, 'Training data', '', 100), hop('l', 230, 40, 'Learn model', 'hi', 100), hop('m', 390, 40, 'Classifier (model)', 'prop', 130), hop('t', 230, 120, 'Test data', '', 100), hop('e', 390, 120, 'Estimate accuracy', 'hi', 130), hop('u', 560, 80, 'Classify new data', 'hi', 130)],
    [['d', 'l'], ['l', 'm'], ['m', 'e'], ['t', 'e'], ['e', 'u', 'accurate enough']], 650, 160, { label: 'Classification: learning and use' }),
  tree: () => netSVG([hop('a', 300, 28, 'age?', 'hi', 70), hop('y', 100, 100, 'student?', 'hi', 90), hop('m', 300, 100, 'yes', 'prop', 70), hop('s', 500, 100, 'credit_rating?', 'hi', 120), hop('yn', 40, 175, 'no', 'bad', 50), hop('yy', 160, 175, 'yes', 'prop', 50), hop('se', 440, 175, 'excellent: no', 'bad', 110), hop('sf', 580, 175, 'fair: yes', 'prop', 100)],
    [['a', 'y', 'youth'], ['a', 'm', 'middle'], ['a', 's', 'senior'], ['y', 'yn', 'no'], ['y', 'yy', 'yes'], ['s', 'se'], ['s', 'sf']], 660, 205, { label: 'Decision tree for buys_computer' }),
  nn: () => netSVG([hop('x1', 50, 50, 'x₁', '', 44), hop('x2', 50, 130, 'x₂', '', 44), hop('h3', 220, 50, 'h₃', 'hi', 44), hop('h4', 220, 130, 'h₄', 'hi', 44), hop('o', 390, 90, 'o₅', 'prop', 44), hop('t', 530, 90, 'target t', 'bad', 80)],
    [['x1', 'h3', 'w₁₃'], ['x1', 'h4', 'w₁₄'], ['x2', 'h3', 'w₂₃'], ['x2', 'h4', 'w₂₄'], ['h3', 'o', 'w₃₅'], ['h4', 'o', 'w₄₅'], ['o', 't', 'error', 1]], 590, 175, { label: 'Feed-forward network' }),
  grid: () => netSVG([hop('d', 60, 40, 'Data space', '', 90), hop('g', 210, 40, 'Divide into grid cells', 'hi', 150), hop('s', 390, 40, 'Cell statistics', 'prop', 120), hop('k', 550, 40, 'Dense cells', 'hi', 100), hop('c', 550, 120, 'Merge adjacent dense cells', 'hi', 170)],
    [['d', 'g'], ['g', 's'], ['s', 'k', 'threshold'], ['k', 'c']], 650, 150, { label: 'Grid-based clustering' }),
};
