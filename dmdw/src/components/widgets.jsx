import { useState } from 'react';
import {
  BUYS, DIAG, agglo, backprop, bayes, binaryDis, buildTree, counts, dbscan, distMatrix, entropy, fmt, gini, kmeans, knn, metrics, outliers, splitInfo, svmCheck, treeText,
} from '../engines.js';

const Html = ({ html }) => <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
const Verdict = ({ ok, children }) => <span className={'verdict ' + (ok ? 'ok' : 'bad')}>{children}</span>;
export const Diag = ({ name }) => <div className="wg"><Html html={DIAG[name]()} /></div>;

const run = (fn) => { try { return { r: fn() }; } catch (e) { return { err: e.message }; } };
const num = (s) => { const v = Number(String(s).trim()); if (String(s).trim() === '' || !Number.isFinite(v)) throw new Error('"' + s + '" is not a number'); return v; };
const parsePts = (text) => {
  const pts = text.split(/[\n;]+/).map((l) => l.trim()).filter(Boolean).map((l) => l.split(/[\s,]+/).filter(Boolean).map(num));
  if (!pts.length) throw new Error('enter at least one point');
  const d = pts[0].length;
  if (pts.some((p) => p.length !== d)) throw new Error('every point needs the same number of coordinates');
  return pts;
};
const ps = (p) => '(' + p.map((v) => fmt(v, 2)).join(', ') + ')';
const COLORS = ['#2F4BD0', '#C2410C', '#15803D', '#9333EA', '#B45309', '#0E7490'];

function Scatter({ pts, labels, cents, w = 320, h = 220 }) {
  if (!pts.length || pts[0].length !== 2) return null;
  const xs = pts.map((p) => p[0]).concat((cents || []).map((c) => c[0])), ys = pts.map((p) => p[1]).concat((cents || []).map((c) => c[1]));
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), m = 24;
  const X = (v) => m + ((v - x0) / (x1 - x0 || 1)) * (w - 2 * m), Y = (v) => h - m - ((v - y0) / (y1 - y0 || 1)) * (h - 2 * m);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} style={{ maxWidth: '100%', border: '1.5px solid var(--ink)', background: 'var(--paper)', margin: '8px 0' }} role="img" aria-label="Scatter plot of the clusters">
      {pts.map((p, i) => {
        const l = labels ? labels[i] : 1;
        return l === -1
          ? <g key={i}><path d={`M${X(p[0]) - 5},${Y(p[1]) - 5}L${X(p[0]) + 5},${Y(p[1]) + 5}M${X(p[0]) + 5},${Y(p[1]) - 5}L${X(p[0]) - 5},${Y(p[1]) + 5}`} stroke="#B91C1C" strokeWidth="2" /><text x={X(p[0]) + 7} y={Y(p[1]) - 6} fontSize="10" fill="currentColor">P{i + 1}</text></g>
          : <g key={i}><circle cx={X(p[0])} cy={Y(p[1])} r="5" fill={COLORS[(l - 1 + 60) % COLORS.length]} /><text x={X(p[0]) + 7} y={Y(p[1]) - 6} fontSize="10" fill="currentColor">P{i + 1}</text></g>;
      })}
      {(cents || []).map((c, i) => <rect key={'c' + i} x={X(c[0]) - 6} y={Y(c[1]) - 6} width="12" height="12" fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="2.5" />)}
    </svg>
  );
}

/* ---------- decision tree ---------- */
export function Tree() {
  const [crit, setCrit] = useState('gain');
  const rows = BUYS.rows, base = entropy(rows);
  const sc = BUYS.attrs.map((a, i) => ({ a, ...splitInfo(rows, i) }));
  const best = [...sc].sort((x, y) => (crit === 'gini' ? y.giniGain - x.giniGain : crit === 'ratio' ? y.ratio - x.ratio : y.gain - x.gain))[0];
  const tree = buildTree(rows, BUYS.attrs, [], crit);
  const c = counts(rows);
  return (
    <div className="wg">
      <h4>Attribute selection on the buys_computer data</h4>
      <div className="row">
        <label>Measure<select value={crit} onChange={(e) => setCrit(e.target.value)}><option value="gain">Information gain (ID3)</option><option value="ratio">Gain ratio (C4.5)</option><option value="gini">Gini index (CART)</option></select></label>
      </div>
      <pre>{`Class counts: ${Object.entries(c).map(([k, v]) => k + ' = ' + v).join(', ')}
Info(D) = ${fmt(base)} bits      Gini(D) = ${fmt(gini(rows))}`}</pre>
      <div className="tt"><table>
        <thead><tr><th>Attribute</th><th>Info<sub>A</sub>(D)</th><th>Gain</th><th>SplitInfo</th><th>Gain ratio</th><th>Gini reduction</th></tr></thead>
        <tbody>{sc.map((s) => (
          <tr key={s.a} style={s.a === best.a ? { fontWeight: 700 } : undefined}><td>{s.a}{s.a === best.a ? ' ← best' : ''}</td><td>{fmt(s.info)}</td><td>{fmt(s.gain)}</td><td>{fmt(s.splitInfo)}</td><td>{fmt(s.ratio)}</td><td>{fmt(s.giniGain)}</td></tr>
        ))}</tbody>
      </table></div>
      <p className="mini">Exact values are shown. The textbook rounds Info(D) to 0.940 first, so it gets Gain(age) = 0.246 and Gain(student) = 0.151.</p>
      <h4 style={{ marginTop: 12 }}>Resulting tree</h4>
      <pre>{'root: ' + tree.attr + treeText(tree)}</pre>
    </div>
  );
}

/* ---------- naive Bayes ---------- */
export function Bayes() {
  const vals = BUYS.attrs.map((a, i) => [...new Set(BUYS.rows.map((r) => r[i]))]);
  const [x, setX] = useState(['youth', 'medium', 'yes', 'fair']);
  const [lap, setLap] = useState(false);
  const out = bayes(BUYS.rows, BUYS.attrs, x, lap);
  const win = [...out].sort((a, b) => b.score - a.score)[0];
  return (
    <div className="wg">
      <h4>Naive Bayes classifier</h4>
      <div className="row">
        {BUYS.attrs.map((a, i) => (
          <label key={a}>{a}<select value={x[i]} onChange={(e) => setX(x.map((v, j) => (j === i ? e.target.value : v)))}>{vals[i].map((v) => <option key={v}>{v}</option>)}</select></label>
        ))}
        <label><input type="checkbox" checked={lap} onChange={(e) => setLap(e.target.checked)} /> Laplacian correction</label>
      </div>
      <pre>{out.map((o) => `Class ${o.c}:  P(${o.c}) = ${o.count}/${BUYS.rows.length} = ${fmt(o.prior)}
${o.lik.map((l) => `  P(${l.attr} = ${x[BUYS.attrs.indexOf(l.attr)]} | ${o.c}) = ${lap ? `(${l.k}+1)/(${l.n}+${l.vals})` : `${l.k}/${l.n}`} = ${fmt(l.p)}`).join('\n')}
  P(X | ${o.c}) = ${fmt(o.prod, 4)}      P(X | ${o.c}) × P(${o.c}) = ${fmt(o.score, 4)}`).join('\n\n')}</pre>
      <Verdict ok>{`Predicted class: ${win.c}   (posterior ${fmt(win.post * 100, 1)}%)`}</Verdict>
    </div>
  );
}

/* ---------- k-nearest neighbour ---------- */
const KNN_DATA = [
  { n: 'T1', x: [1, 1], c: 'A' }, { n: 'T2', x: [2, 1], c: 'A' }, { n: 'T3', x: [1, 2], c: 'A' }, { n: 'T4', x: [2, 3], c: 'A' },
  { n: 'T5', x: [5, 4], c: 'B' }, { n: 'T6', x: [6, 5], c: 'B' }, { n: 'T7', x: [5, 6], c: 'B' }, { n: 'T8', x: [4, 4], c: 'B' },
];
export function Knn() {
  const [q, setQ] = useState({ x: '3', y: '3', k: '3' });
  const o = run(() => knn(KNN_DATA, [num(q.x), num(q.y)], Math.max(1, Math.min(KNN_DATA.length, Math.round(num(q.k))))));
  const r = o.r;
  return (
    <div className="wg">
      <h4>k-nearest neighbour</h4>
      <p className="mini">Training tuples: class A at (1,1) (2,1) (1,2) (2,3); class B at (5,4) (6,5) (5,6) (4,4).</p>
      <div className="row">
        {[['x', 'x'], ['y', 'y'], ['k', 'k']].map(([key, lab]) => <label key={key}>{lab}<input type="text" inputMode="decimal" value={q[key]} style={{ width: 60, minWidth: 60, flex: 'none' }} onChange={(e) => setQ({ ...q, [key]: e.target.value })} /></label>)}
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <div className="tt"><table><thead><tr><th>Tuple</th><th>Point</th><th>Class</th><th>Distance to ({q.x}, {q.y})</th></tr></thead>
            <tbody>{r.all.map((t, i) => <tr key={t.n} style={i < r.near.length ? { fontWeight: 700 } : undefined}><td>{t.n}</td><td>{ps(t.x)}</td><td>{t.c}</td><td>{fmt(t.d)}</td></tr>)}</tbody></table></div>
          <Verdict ok>{`The ${r.near.length} nearest vote ${Object.entries(r.votes).map(([k, v]) => k + ': ' + v).join(', ')}, so the class is ${r.pred}.`}</Verdict>
        </>
      )}
    </div>
  );
}

/* ---------- evaluation measures ---------- */
export function Metrics() {
  const [f, setF] = useState({ tp: '90', fn: '10', fp: '30', tn: '170' });
  const o = run(() => { const v = ['tp', 'fn', 'fp', 'tn'].map((k) => num(f[k])); if (v.some((n) => n < 0)) throw new Error('counts cannot be negative'); return metrics(...v); });
  const m = o.r;
  return (
    <div className="wg">
      <h4>Confusion matrix calculator</h4>
      <div className="row">
        {[['tp', 'TP'], ['fn', 'FN'], ['fp', 'FP'], ['tn', 'TN']].map(([k, l]) => <label key={k}>{l}<input type="text" inputMode="numeric" value={f[k]} style={{ width: 70, minWidth: 70, flex: 'none' }} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>)}
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {m && (
        <pre>{`P = TP + FN = ${m.p}     N = FP + TN = ${m.n}     total = ${m.t}
Accuracy    = (TP + TN) / total        = ${fmt(m.acc)}
Error rate  = (FP + FN) / total        = ${fmt(m.err)}
Sensitivity = TP / P (recall)          = ${fmt(m.rec)}
Specificity = TN / N                   = ${fmt(m.spec)}
Precision   = TP / (TP + FP)           = ${fmt(m.prec)}
F1          = 2PR / (P + R)            = ${fmt(m.f1)}
F2          = 5PR / (4P + R)           = ${fmt(m.fb2)}
Kappa                                  = ${fmt(m.kappa)}`}</pre>
      )}
    </div>
  );
}

/* ---------- k-means ---------- */
export function Kmeans() {
  const [pts, setPts] = useState('2\n4\n10\n12\n3\n20\n30\n11\n25');
  const [cen, setCen] = useState('2\n4');
  const o = run(() => { const P = parsePts(pts), C = parsePts(cen); if (C[0].length !== P[0].length) throw new Error('centroids need the same dimension as the points'); return { P, km: kmeans(P, C) }; });
  const r = o.r;
  return (
    <div className="wg">
      <h4>k-means step by step</h4>
      <div className="row">
        <label style={{ flex: 2 }}>Points (one per line; x or x,y)<textarea rows={5} value={pts} onChange={(e) => setPts(e.target.value)} /></label>
        <label style={{ flex: 1 }}>Initial centroids (k lines)<textarea rows={5} value={cen} onChange={(e) => setCen(e.target.value)} /></label>
      </div>
      <div className="row"><span className="mini">Try:</span>
        <button className="btn sm" type="button" onClick={() => { setPts('2\n4\n10\n12\n3\n20\n30\n11\n25'); setCen('2\n4'); }}>1-D example (k = 2)</button>
        <button className="btn sm" type="button" onClick={() => { setPts('2,10\n2,5\n8,4\n5,8\n7,5\n6,4\n1,2\n4,9'); setCen('2,10\n5,8\n1,2'); }}>2-D example (k = 3)</button>
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <pre>{r.km.rounds.map((rd) => `Iteration ${rd.it}: centroids ${rd.cents.map(ps).join('  ')}
${rd.cents.map((_, i) => `  C${i + 1} = {${r.P.map((p, j) => (rd.assign[j] === i ? (p.length === 1 ? fmt(p[0], 2) : 'P' + (j + 1)) : null)).filter((x) => x !== null).join(', ')}}`).join('\n')}
  new means ${rd.next.map(ps).join('  ')}     SSE = ${fmt(rd.sse, 2)}${rd.next.every((m, i) => m.every((v, d) => Math.abs(v - rd.cents[i][d]) < 1e-9)) ? '\n  centroids did not change: stop' : ''}`).join('\n\n')}</pre>
          <Scatter pts={r.P} labels={r.km.assign.map((a) => a + 1)} cents={r.km.cents} />
        </>
      )}
    </div>
  );
}

/* ---------- hierarchical ---------- */
export function Hier() {
  const [pts, setPts] = useState('1\n2\n4\n5\n7');
  const [link, setLink] = useState('single');
  const o = run(() => { const P = parsePts(pts); if (P.length < 2 || P.length > 12) throw new Error('use 2 to 12 points'); const names = P.map((_, i) => String.fromCharCode(65 + i)); const D = distMatrix(P); return { P, names, D, steps: agglo(names, D, link) }; });
  const r = o.r;
  return (
    <div className="wg">
      <h4>Agglomerative clustering</h4>
      <div className="row">
        <label style={{ flex: 1 }}>Points (A, B, C … one per line)<textarea rows={5} value={pts} onChange={(e) => setPts(e.target.value)} /></label>
        <label>Linkage<select value={link} onChange={(e) => setLink(e.target.value)}><option value="single">Single (min)</option><option value="complete">Complete (max)</option><option value="average">Average</option></select></label>
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <div className="tt"><table>
            <thead><tr><th></th>{r.names.map((n) => <th key={n}>{n}</th>)}</tr></thead>
            <tbody>{r.D.map((row, i) => <tr key={i}><th>{r.names[i]}</th>{row.map((d, j) => <td key={j}>{j < i ? fmt(d, 2) : ''}</td>)}</tr>)}</tbody>
          </table></div>
          <pre>{r.steps.map((s, i) => `Step ${i + 1}: merge ${s.a} and ${s.b} at distance ${fmt(s.d, 2)}  →  ${s.label}`).join('\n')}</pre>
          <p className="mini">The merge distances are the heights of the dendrogram, in order.</p>
        </>
      )}
    </div>
  );
}

/* ---------- DBSCAN ---------- */
export function Dbscan() {
  const [pts, setPts] = useState('1,1\n1.5,2\n2,1.5\n5,5\n5.5,5\n6,5.5\n10,1');
  const [eps, setEps] = useState('1.2');
  const [mp, setMp] = useState('3');
  const o = run(() => { const P = parsePts(pts); return { P, db: dbscan(P, num(eps), Math.round(num(mp))) }; });
  const r = o.r;
  const noise = r ? r.db.lab.filter((l) => l === -1).length : 0;
  return (
    <div className="wg">
      <h4>DBSCAN</h4>
      <div className="row">
        <label style={{ flex: 1 }}>Points (x,y one per line)<textarea rows={6} value={pts} onChange={(e) => setPts(e.target.value)} /></label>
        <label>ε<input type="text" inputMode="decimal" value={eps} style={{ width: 60, minWidth: 60, flex: 'none' }} onChange={(e) => setEps(e.target.value)} /></label>
        <label>MinPts<input type="text" inputMode="numeric" value={mp} style={{ width: 60, minWidth: 60, flex: 'none' }} onChange={(e) => setMp(e.target.value)} /></label>
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <div className="tt"><table><thead><tr><th>Point</th><th>Coordinates</th><th>Points within ε</th><th>Type</th><th>Cluster</th></tr></thead>
            <tbody>{r.P.map((p, i) => {
              const core = r.db.core[i], lab = r.db.lab[i];
              return <tr key={i}><td>P{i + 1}</td><td>{ps(p)}</td><td>{r.db.nbr[i].length}</td><td>{core ? 'core' : lab === -1 ? 'noise' : 'border'}</td><td>{lab === -1 ? '—' : 'C' + lab}</td></tr>;
            })}</tbody></table></div>
          <pre>{r.db.log.join('\n')}</pre>
          <Verdict ok>{`${r.db.clusters} cluster${r.db.clusters === 1 ? '' : 's'}, ${noise} noise point${noise === 1 ? '' : 's'}`}</Verdict>
          <Scatter pts={r.P} labels={r.db.lab} />
        </>
      )}
    </div>
  );
}

/* ---------- backpropagation ---------- */
export function Bp() {
  const [f, setF] = useState({ x1: '0.35', x2: '0.9', w13: '0.1', w23: '0.8', w14: '0.4', w24: '0.6', w35: '0.3', w45: '0.9', t: '0.5', lr: '1' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const o = run(() => {
    const v = {}; Object.keys(f).forEach((k) => { v[k] = num(f[k]); });
    return { v, r: backprop({ x: [v.x1, v.x2], w1: [[v.w13, v.w23], [v.w14, v.w24]], b1: [0, 0], w2: [v.w35, v.w45], b2: 0, t: v.t, lr: v.lr }) };
  });
  const r = o.r && o.r.r, v = o.r && o.r.v;
  return (
    <div className="wg">
      <h4>One backpropagation step (2-2-1 network, biases 0)</h4>
      <div className="row">
        {Object.keys(f).map((k) => <label key={k}>{k}<input type="text" inputMode="decimal" value={f[k]} style={{ width: 62, minWidth: 62, flex: 'none' }} onChange={set(k)} /></label>)}
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <pre>{`Forward
 I3 = ${v.x1}×${v.w13} + ${v.x2}×${v.w23} = ${fmt(v.x1 * v.w13 + v.x2 * v.w23, 4)}     O3 = ${fmt(r.h[0], 4)}
 I4 = ${v.x1}×${v.w14} + ${v.x2}×${v.w24} = ${fmt(v.x1 * v.w14 + v.x2 * v.w24, 4)}     O4 = ${fmt(r.h[1], 4)}
 I5 = ${fmt(r.h[0], 3)}×${v.w35} + ${fmt(r.h[1], 3)}×${v.w45} = ${fmt(r.h[0] * v.w35 + r.h[1] * v.w45, 4)}     O5 = ${fmt(r.out, 4)}
Error (T − O5) = ${fmt(r.err, 4)}

Backward
 Err5 = O5(1 − O5)(T − O5) = ${fmt(r.dOut, 5)}
 Err3 = O3(1 − O3) Err5 w35 = ${fmt(r.dH[0], 5)}
 Err4 = O4(1 − O4) Err5 w45 = ${fmt(r.dH[1], 5)}

New weights (l = ${v.lr})
 w35 = ${fmt(r.nw2[0], 4)}   w45 = ${fmt(r.nw2[1], 4)}
 w13 = ${fmt(r.nw1[0][0], 4)}   w23 = ${fmt(r.nw1[0][1], 4)}   w14 = ${fmt(r.nw1[1][0], 4)}   w24 = ${fmt(r.nw1[1][1], 4)}`}</pre>
      )}
    </div>
  );
}

/* ---------- SVM check ---------- */
export function Svm() {
  const [w, setW] = useState('1, 0');
  const [b, setB] = useState('-2');
  const [pts, setPts] = useState('3,1,+1\n3,-1,+1\n6,1,+1\n6,-1,+1\n1,0,-1\n0,1,-1\n0,-1,-1\n-1,0,-1');
  const o = run(() => {
    const W = w.split(/[\s,]+/).filter(Boolean).map(num);
    const P = pts.split(/\n+/).map((l) => l.trim()).filter(Boolean).map((l) => { const a = l.split(/[\s,]+/).filter(Boolean).map(num); if (a.length !== W.length + 1) throw new Error('each point needs ' + W.length + ' coordinates and a class (+1 or -1)'); return { x: a.slice(0, -1), c: a[a.length - 1] > 0 ? 1 : -1 }; });
    return { W, ...svmCheck(W, num(b), P) };
  });
  const r = o.r;
  const valid = r && r.rows.every((p) => p.ok && p.c * p.f >= 1 - 1e-9);
  return (
    <div className="wg">
      <h4>Is this hyperplane a maximum marginal hyperplane?</h4>
      <div className="row">
        <label>w<input type="text" value={w} style={{ width: 90, minWidth: 90, flex: 'none' }} onChange={(e) => setW(e.target.value)} /></label>
        <label>b<input type="text" inputMode="decimal" value={b} style={{ width: 60, minWidth: 60, flex: 'none' }} onChange={(e) => setB(e.target.value)} /></label>
      </div>
      <label className="mini" style={{ display: 'block' }}>Points: x, y, class (one per line)<textarea rows={5} value={pts} onChange={(e) => setPts(e.target.value)} /></label>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <div className="tt"><table><thead><tr><th>Point</th><th>Class</th><th>w·x + b</th><th>Side</th><th>Correct</th><th>y(w·x + b)</th></tr></thead>
            <tbody>{r.rows.map((p, i) => <tr key={i}><td>{ps(p.x)}</td><td>{p.c > 0 ? '+1' : '−1'}</td><td>{fmt(p.f, 3)}</td><td>{p.side > 0 ? '+' : '−'}</td><td>{p.ok ? 'yes' : 'NO'}</td><td>{fmt(p.c * p.f, 3)}</td></tr>)}</tbody></table></div>
          <pre>{`Margin = 2/‖w‖ = 2/${fmt(Math.hypot(...r.W), 3)} = ${fmt(r.margin, 3)}
Support vectors (y(w·x + b) = 1): ${r.sv.length ? r.sv.map((p) => ps(p.x)).join(' ') : 'none, so the margin can still be widened'}`}</pre>
          <Verdict ok={valid}>{valid ? 'Every point satisfies y(w·x + b) ≥ 1: a valid separating hyperplane with the margin shown.' : 'Some point violates y(w·x + b) ≥ 1, so this hyperplane does not separate with that margin.'}</Verdict>
        </>
      )}
    </div>
  );
}

/* ---------- binary dissimilarity ---------- */
export function Bin() {
  const [a, setA] = useState('1 0 1 0 0 0');
  const [b, setB] = useState('1 0 1 0 1 1');
  const o = run(() => {
    const A = a.split(/[\s,]+/).filter(Boolean).map(Number), B = b.split(/[\s,]+/).filter(Boolean).map(Number);
    if (A.length !== B.length || !A.length) throw new Error('both objects need the same number of binary values');
    if ([...A, ...B].some((v) => v !== 0 && v !== 1)) throw new Error('use only 0 and 1');
    return binaryDis(A, B);
  });
  const r = o.r;
  return (
    <div className="wg">
      <h4>Binary dissimilarity</h4>
      <div className="row"><label style={{ flex: '1 1 140px' }}>Object i<input type="text" value={a} style={{ minWidth: 0, width: '100%' }} onChange={(e) => setA(e.target.value)} /></label><label style={{ flex: '1 1 140px' }}>Object j<input type="text" value={b} style={{ minWidth: 0, width: '100%' }} onChange={(e) => setB(e.target.value)} /></label></div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <pre>{`q = ${r.q} (both 1)   r = ${r.r} (i 1, j 0)   s = ${r.s} (i 0, j 1)   t = ${r.t} (both 0)
Symmetric (simple matching) d = (r + s)/(q + r + s + t) = ${r.r + r.s}/${r.q + r.r + r.s + r.t} = ${fmt(r.simple, 3)}
Asymmetric (Jaccard)        d = (r + s)/(q + r + s)     = ${r.r + r.s}/${r.q + r.r + r.s} = ${fmt(r.jaccard, 3)}`}</pre>
      )}
    </div>
  );
}

/* ---------- outliers ---------- */
export function Out() {
  const [v, setV] = useState('10, 12, 12, 13, 12, 11, 14, 13, 15, 102');
  const o = run(() => { const vals = v.split(/[\s,;]+/).filter(Boolean).map(num); if (vals.length < 4) throw new Error('enter at least four numbers'); return { vals, s: outliers(vals) }; });
  const r = o.r;
  return (
    <div className="wg">
      <h4>Outlier check: z-score and IQR</h4>
      <div className="row"><label style={{ flex: 1 }}>Values<input type="text" value={v} style={{ minWidth: 0, width: '100%' }} onChange={(e) => setV(e.target.value)} /></label></div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <pre>{`mean = ${fmt(r.s.mean, 2)}   sample SD = ${fmt(r.s.sd, 2)}
Q1 = ${fmt(r.s.q1, 2)}   Q3 = ${fmt(r.s.q3, 2)}   IQR = ${fmt(r.s.iqr, 2)}
IQR fences: ${fmt(r.s.lo, 3)} to ${fmt(r.s.hi, 3)}`}</pre>
          <div className="tt"><table><thead><tr><th>Value</th><th>z-score</th><th>|z| &gt; 3 ?</th><th>Outside IQR fences?</th></tr></thead>
            <tbody>{r.vals.map((x, i) => <tr key={i}><td>{x}</td><td>{fmt(r.s.z[i], 2)}</td><td>{Math.abs(r.s.z[i]) > 3 ? 'OUTLIER' : ''}</td><td>{x < r.s.lo || x > r.s.hi ? 'OUTLIER' : ''}</td></tr>)}</tbody></table></div>
        </>
      )}
    </div>
  );
}
