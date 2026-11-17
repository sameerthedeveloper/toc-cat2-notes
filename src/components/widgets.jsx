import { useEffect, useRef, useState } from 'react';
import { V, YT } from '../data/videos.js';
import {
  DIAG, WW, backwardChain, entails, eq, forwardChain, goalStack, nb, parseRules, tParse, tStr, truthTable, unifyTerms, wInfer, wPercept,
} from '../engines.js';
import { reduceMotion } from '../lib.js';

const Html = ({ html, className }) => <div className={className} style={className ? undefined : { display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
const Verdict = ({ ok, children }) => <span className={'verdict ' + (ok ? 'ok' : 'bad')}>{children}</span>;

/* ---------- Neso lessons ---------- */
export function Vids({ id }) {
  const y = YT[id];
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = y.v[cur];
  return (
    <div className="wg vids">
      <h4>Video lessons</h4>
      <div className="vplay">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v}?rel=0&autoplay=1`}
            title={V[v][0]}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button className="vposter" type="button" aria-label={`Play ${V[v][0]}`} style={{ backgroundImage: `url(https://i.ytimg.com/vi/${v}/hqdefault.jpg)` }} onClick={() => setPlaying(true)}>
            <span className="vbtn">Play</span>
            <span className="vcap">{V[v][0]}<span className="vcapch">{V[v][2]}</span></span>
          </button>
        )}
      </div>
      <ol className="vlist">
        {y.v.map((vid, i) => (
          <li key={vid}>
            <button type="button" className={i === cur ? 'on' : ''} onClick={() => { setCur(i); setPlaying(false); }}>
              <span className="vt">{V[vid][0]}<span className="vch">{V[vid][2]}</span></span>
              <span className="vd">{V[vid][1]} min</span>
            </button>
          </li>
        ))}
      </ol>
      {y.note && <p className="vnote">{y.note}</p>}
      <p className="vnote">
        {y.pl.map(([label, href]) => (
          <span key={href}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a>{' '}</span>
        ))}
        <a href={`https://www.youtube.com/watch?v=${v}`} target="_blank" rel="noopener noreferrer">Open this lesson on YouTube</a>
      </p>
    </div>
  );
}

export function NoVideo() {
  return (
    <p className="novideo">
      None of the channels used here (Mahesh Huddar, Neso Academy and a few others) has a lesson on this topic. The notes and tools on this page cover it in full.
    </p>
  );
}

/* ---------- static diagrams ---------- */
export const Diag = ({ name }) => <div className="wg"><Html html={DIAG[name]()} /></div>;

/* ---------- Wumpus world ---------- */
const PATH = [[1, 1], [2, 1], [1, 1], [1, 2], [2, 2], [2, 3]];
const key = (x, y) => x + ',' + y;
const tagsOf = (p) => [p.B ? 'Breeze' : '', p.S ? 'Stench' : '', p.G ? 'Glitter' : ''].filter(Boolean).join(', ') || 'no percept';

function newGame() {
  return { pos: [1, 1], V: new Map(), dead: '', won: false, log: [] };
}
function visit(g, x, y, quiet) {
  g.pos = [x, y];
  const k = key(x, y);
  const first = !g.V.has(k);
  const p = wPercept(x, y);
  g.V.set(k, p);
  const before = wInfer(new Map([...g.V].filter(([kk]) => kk !== k)));
  const I = wInfer(g.V);
  if (!quiet || first) {
    let m = `<p><b>[${x},${y}]</b> percept: ${tagsOf(p)}.</p>`;
    const ns = Object.entries(I).filter(([c, o]) => o.safe && !o.visited && !(before[c] && before[c].safe)).map(([c]) => `[${c}]`);
    const np = Object.entries(I).filter(([c, o]) => o.pit && !(before[c] && before[c].pit)).map(([c]) => `[${c}]`);
    const nw = Object.entries(I).filter(([c, o]) => o.wumpus && !(before[c] && before[c].wumpus)).map(([c]) => `[${c}]`);
    if (ns.length) m += `<p>⇒ safe: ${ns.join(' ')}</p>`;
    if (np.length) m += `<p>⇒ pit at ${np.join(' ')}</p>`;
    if (nw.length) m += `<p>⇒ wumpus at ${nw.join(' ')}</p>`;
    if (p.G) { m += '<p><b>Glitter: grab the gold.</b></p>'; g.won = true; }
    g.log.push(m);
  }
  if (WW.pits.some((c) => eq(c, [x, y]))) g.dead = 'Fell into a pit. Game over.';
  if (eq(WW.wumpus, [x, y])) g.dead = 'Eaten by the wumpus. Game over.';
}

export function Wumpus({ auto = false }) {
  const g = useRef(null);
  if (!g.current) { g.current = newGame(); visit(g.current, 1, 1); }
  const [, tick] = useState(0);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  const logRef = useRef(null);
  const redraw = () => tick((t) => t + 1);
  const stop = () => clearInterval(timer.current);
  useEffect(() => stop, []);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = 1e9; });

  /* hero: replay a safe route forever; with reduced motion show the finished state */
  useEffect(() => {
    if (!auto) return;
    let i = 1, hold = 0;
    if (reduceMotion()) {
      while (i < PATH.length) visit(g.current, ...PATH[i++]);
      redraw();
      return;
    }
    timer.current = setInterval(() => {
      if (i < PATH.length) visit(g.current, ...PATH[i++]);
      else if (++hold > 4) { g.current = newGame(); visit(g.current, 1, 1); i = 1; hold = 0; }
      redraw();
    }, 1100);
    return stop;
  }, [auto]);

  const G = g.current;
  const I = wInfer(G.V);
  const cells = [];
  for (let y = 4; y >= 1; y--) {
    for (let x = 1; x <= 4; x++) {
      const o = I[key(x, y)];
      const here = eq(G.pos, [x, y]);
      const adj = nb(...G.pos).some((c) => eq(c, [x, y]));
      let cl = 'wc', tg = '', pc = '';
      if (o.visited) { cl += ' vis'; const p = G.V.get(key(x, y)); pc = (p.S ? 'S' : '') + (p.B ? 'B' : '') + (p.G ? 'G' : ''); }
      else if (o.pit || o.wumpus) { cl += ' danger'; tg = (o.pit ? 'P' : '') + (o.wumpus ? 'W' : ''); }
      else if (o.safe) { cl += ' safe'; tg = 'OK'; }
      else if (o.pitMaybe || o.wMaybe) { cl += ' maybe'; tg = (o.pitMaybe ? 'P?' : '') + (o.wMaybe ? ' W?' : ''); }
      if (here) { cl += ' here'; tg = 'A'; }
      if (reveal) {
        const bits = [];
        if (WW.pits.some((c) => eq(c, [x, y]))) bits.push('P');
        if (eq(WW.wumpus, [x, y])) bits.push('W');
        if (eq(WW.gold, [x, y])) bits.push('$');
        if (bits.length) tg = (here ? 'A ' : '') + bits.join('');
      }
      const canGo = !auto && adj && !G.dead && !G.won;
      if (canGo) cl += ' go';
      cells.push(
        <button key={x + ',' + y} type="button" className={cl} disabled={!canGo} tabIndex={canGo ? 0 : -1} aria-label={`room ${x},${y}`}
          onClick={() => { visit(G, x, y); redraw(); }}>
          <span className="co">{x},{y}</span><span className="tg">{tg}</span><span className="pc">{pc}</span>
        </button>
      );
    }
  }

  const reset = () => { stop(); g.current = newGame(); visit(g.current, 1, 1); redraw(); };
  const script = () => {
    stop();
    g.current = newGame(); visit(g.current, 1, 1); redraw();
    let i = 1;
    timer.current = setInterval(() => {
      if (i >= PATH.length) return stop();
      visit(g.current, ...PATH[i++]);
      redraw();
    }, reduceMotion() ? 1 : 700);
  };
  const p = G.V.get(key(...G.pos)) || {};

  const grid = (
    <div>
      <div className={'wgrid' + (auto ? ' big' : '')} role="group" aria-label="Wumpus world 4 by 4">{cells}</div>
      <div className="key">
        <span><i className="k-vis" />visited (S stench, B breeze, G glitter)</span>
        <span><i className="k-safe" />OK safe</span>
        <span><i className="k-maybe" />P? or W? possible</span>
        <span><i className="k-danger" />P or W certain</span>
      </div>
      {!auto && (
        <>
          <div className="row">
            <label><input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} /> Reveal world</label>
            <button className="btn sm" type="button" onClick={reset}>Reset</button>
            <button className="btn sm" type="button" onClick={script}>Auto-play a route</button>
          </div>
          {G.dead ? <Verdict>{G.dead}</Verdict> : G.won ? <Verdict ok>Gold grabbed. Return along visited safe rooms and Climb.</Verdict> : null}
          <p className="mini">{G.dead || G.won ? '' : 'Click a highlighted adjacent room to move.'}</p>
        </>
      )}
    </div>
  );
  if (auto) return grid;
  return (
    <div className="wg">
      <h4>Wumpus world: inference panel</h4>
      <div className="wlay">
        {grid}
        <div>
          <h5 className="wsub">Agent knowledge at [{G.pos.join(',')}]: {tagsOf(p)}</h5>
          <div className="wlog" ref={logRef}>{G.log.length ? <Html html={G.log.join('')} /> : <p>Move to begin.</p>}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- truth table and entailment ---------- */
const TT_EX = [['P → Q', 'P -> Q'], ['De Morgan', '~(P & Q) <-> (~P | ~Q)'], ['Disjunctive syllogism', '(P | Q) & ~P -> Q'], ['Contradiction', 'P & ~P']];

export function Truth() {
  const [f, setF] = useState('(P -> Q) & (Q -> R) -> (P -> R)');
  const [kb, setKb] = useState('P -> Q; P');
  const [q, setQ] = useState('Q');
  const compute = (fn) => { try { return { r: fn() }; } catch (e) { return { err: e.message }; } };
  const [tt, setTt] = useState(() => compute(() => truthTable('(P -> Q) & (Q -> R) -> (P -> R)')));
  const [en, setEn] = useState(() => compute(() => entails('P -> Q; P', 'Q')));
  const run = (src = f) => setTt(compute(() => truthTable(src)));
  const t = tt.r, r = en.r;
  return (
    <div className="wg">
      <h4>Truth table and entailment</h4>
      <div className="row">
        <input type="text" value={f} aria-label="Formula" onChange={(e) => setF(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} />
        <button className="btn sm pri" type="button" onClick={() => run()}>Build table</button>
      </div>
      <div className="row">
        <span className="mini">Try:</span>
        {TT_EX.map(([label, src]) => <button key={label} className="btn sm" type="button" onClick={() => { setF(src); run(src); }}>{label}</button>)}
      </div>
      <div>
        {tt.err && <Verdict>{tt.err}</Verdict>}
        {t && (
          <>
            <p className="mini">{t.str}</p>
            <div className="tt">
              <table>
                <thead><tr>{t.vars.map((v) => <th key={v}>{v}</th>)}{t.subs.map((s) => <th key={s}>{s}</th>)}</tr></thead>
                <tbody>
                  {t.rows.map((row, i) => (
                    <tr key={i}>{row.vals.map((v, j) => <td key={'v' + j} className={v ? 'T' : 'F'}>{v ? 'T' : 'F'}</td>)}{row.res.map((v, j) => <td key={'r' + j} className={v ? 'T' : 'F'}>{v ? 'T' : 'F'}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Verdict ok={!t.kind.startsWith('Contra')}>{t.kind}</Verdict>
          </>
        )}
      </div>
      <hr className="wsep" />
      <div className="row">
        <label>KB (separate with ;)<input type="text" value={kb} style={{ minWidth: 220 }} onChange={(e) => setKb(e.target.value)} /></label>
        <label>Query<input type="text" value={q} style={{ minWidth: 100, flex: 0 }} onChange={(e) => setQ(e.target.value)} /></label>
        <button className="btn sm pri" type="button" onClick={() => setEn(compute(() => entails(kb, q)))}>Does KB entail query?</button>
      </div>
      <div>
        {en.err && <Verdict>{en.err}</Verdict>}
        {r && (
          <>
            <p className="mini">
              Models of the KB ({r.models.length}):{' '}
              {r.models.length ? r.models.map((m) => '{' + r.vars.map((v) => v + '=' + (m.env[v] ? 'T' : 'F')).join(',') + '} → query ' + (m.qv ? 'T' : 'F')).join('   ') : 'none (KB is inconsistent)'}
            </p>
            <Verdict ok={r.entails}>
              {r.entails ? 'KB ⊨ query: the query is true in every model of the KB.' : 'KB ⊭ query. Counter-model: {' + r.vars.map((v) => v + '=' + (r.counter[v] ? 'T' : 'F')).join(', ') + '}'}
            </Verdict>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- unification ---------- */
const UN_PRE = [['P(x, F(y))', 'P(A, F(B))'], ['Knows(John, x)', 'Knows(y, Mother(y))'], ['Knows(John, x)', 'Knows(x, Elizabeth)'], ['P(x, x)', 'P(F(y), y)'], ['P(F(x), G(A, y))', 'P(F(G(u, v)), G(u, B))'], ['P(A, y, F(y))', 'P(z, z, u)']];
const unify = (a, b) => {
  try { return { r: unifyTerms(tParse(a), tParse(b)) }; } catch (e) { return { err: e.message }; }
};

export function Unify() {
  const [a, setA] = useState(UN_PRE[1][0]);
  const [b, setB] = useState(UN_PRE[1][1]);
  const [res, setRes] = useState(() => unify(UN_PRE[1][0], UN_PRE[1][1]));
  const r = res.r;
  return (
    <div className="wg">
      <h4>Unification with trace</h4>
      <div className="row">
        <input type="text" value={a} aria-label="Expression 1" onChange={(e) => setA(e.target.value)} />
        <input type="text" value={b} aria-label="Expression 2" onChange={(e) => setB(e.target.value)} />
        <button className="btn sm pri" type="button" onClick={() => setRes(unify(a, b))}>Unify</button>
      </div>
      <div className="row">
        <span className="mini">Examples:</span>
        {UN_PRE.map((p, i) => <button key={i} className="btn sm" type="button" aria-label={`Example ${i + 1}: ${p[0]} with ${p[1]}`} onClick={() => { setA(p[0]); setB(p[1]); setRes(unify(p[0], p[1])); }}>{i + 1}</button>)}
      </div>
      <div>
        {res.err && <Verdict>{res.err}</Verdict>}
        {r && (
          <>
            <div className="log2">{r.log.map((l, i) => `${i + 1}. ${l}`).join('\n')}</div>
            <Verdict ok={r.ok}>
              {r.ok ? `MGU θ = { ${Object.entries(r.mgu).map(([k, v]) => k + '/' + tStr(v)).join(', ')} }. Both become ${r.result}` : 'Unification fails. No unifier exists.'}
            </Verdict>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- forward and backward chaining ---------- */
export function Chain() {
  const [rules, setRules] = useState('P -> Q\nL & M -> P\nB & L -> M\nA & P -> L\nA & B -> L');
  const [facts, setFacts] = useState('A, B');
  const [q, setQ] = useState('Q');
  const go = (dir, rs = rules, fs = facts, qq = q) => {
    try {
      const out = (dir === 'f' ? forwardChain : backwardChain)(parseRules(rs), fs.split(/[,\s]+/).filter(Boolean), qq.trim());
      return { out, q: qq.trim() };
    } catch (e) { return { err: e.message }; }
  };
  const [res, setRes] = useState(() => go('f'));
  return (
    <div className="wg">
      <h4>Forward and backward chaining</h4>
      <p className="mini">One rule per line: premises joined with &amp;, then -&gt; conclusion.</p>
      <textarea rows={6} value={rules} aria-label="Rules" onChange={(e) => setRules(e.target.value)} />
      <div className="row">
        <label>Facts<input type="text" value={facts} style={{ minWidth: 120 }} onChange={(e) => setFacts(e.target.value)} /></label>
        <label>Query<input type="text" value={q} style={{ minWidth: 80, flex: 0 }} onChange={(e) => setQ(e.target.value)} /></label>
        <button className="btn sm pri" type="button" onClick={() => setRes(go('f'))}>Forward chain</button>
        <button className="btn sm pri" type="button" onClick={() => setRes(go('b'))}>Backward chain</button>
      </div>
      <div>
        {res.err && <Verdict>{res.err}</Verdict>}
        {res.out && (
          <>
            <div className="log2">{res.out.log.join('\n')}</div>
            <Verdict ok={res.out.ok}>{res.out.ok ? `${res.q} is derived.` : `${res.q} cannot be derived.`}</Verdict>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- blocks world / goal stack ---------- */
function bwDraw(state) {
  const on = {}, tbl = [];
  let hold = null;
  state.forEach((a) => {
    let m;
    if ((m = /^ON\((\w+),(\w+)\)$/.exec(a))) on[m[2]] = m[1];
    else if ((m = /^ONTABLE\((\w+)\)$/.exec(a))) tbl.push(m[1]);
    else if ((m = /^HOLDING\((\w+)\)$/.exec(a))) hold = m[1];
  });
  tbl.sort();
  const bw = 34, bh = 30, base = 150;
  let x = 14, s = '';
  tbl.forEach((b) => {
    let y = base, c = b;
    while (c) {
      s += `<g class="nd"><rect x="${x}" y="${y - bh}" width="${bw}" height="${bh}" rx="2"/><text x="${x + bw / 2}" y="${y - bh / 2 + 4}" text-anchor="middle">${c}</text></g>`;
      y -= bh; c = on[c];
    }
    x += bw + 14;
  });
  if (hold) s += `<g class="nd hi"><rect x="${x + 10}" y="14" width="${bw}" height="${bh}" rx="2"/><text x="${x + 10 + bw / 2}" y="${14 + bh / 2 + 4}" text-anchor="middle">${hold}</text></g><text class="held" x="${x + 10 + bw + 6}" y="34">in hand</text>`;
  const W = Math.max(0, x + 110);
  return `<svg class="net" viewBox="0 0 ${W} ${base + 10}" width="${W}" role="img" aria-label="blocks"><line x1="4" y1="${base}" x2="${W - 4}" y2="${base}"/>${s}</svg>`;
}
const BW_PRE = {
  'Rich and Knight': ['ON(B,A), ONTABLE(A), ONTABLE(C), ONTABLE(D), CLEAR(B), CLEAR(C), CLEAR(D), ARMEMPTY', 'ON(B,D), ON(C,A)'],
  'Sussman anomaly': ['ON(C,A), ONTABLE(A), ONTABLE(B), CLEAR(C), CLEAR(B), ARMEMPTY', 'ON(A,B), ON(B,C)'],
  'Simple stack': ['ONTABLE(A), ONTABLE(B), CLEAR(A), CLEAR(B), ARMEMPTY', 'ON(A,B)'],
  'Reverse a tower': ['ON(A,B), ON(B,C), ONTABLE(C), CLEAR(A), ARMEMPTY', 'ON(C,B), ON(B,A)'],
};

export function BlocksWorld() {
  const [pre, setPre] = useState('Rich and Knight');
  const [init, setInit] = useState(BW_PRE['Rich and Knight'][0]);
  const [goal, setGoal] = useState(BW_PRE['Rich and Knight'][1]);
  const [tr, setTr] = useState(() => goalStack(BW_PRE['Rich and Knight'][0], BW_PRE['Rich and Knight'][1]));
  const [n, setN] = useState(0);
  const timer = useRef(null);
  const stop = () => clearInterval(timer.current);
  useEffect(() => stop, []);

  const run = (i = init, g = goal) => { stop(); setTr(goalStack(i, g)); setN(0); };
  const last = tr.trace.length - 1;
  const s = tr.trace[Math.min(n, last)];
  const play = () => {
    stop();
    let k = 0;
    setN(0);
    timer.current = setInterval(() => {
      if (k >= last) return stop();
      setN(++k);
    }, reduceMotion() ? 1 : 650);
  };
  return (
    <div className="wg">
      <h4>Goal-stack planner (STRIPS, blocks world)</h4>
      <div className="row">
        <label>Example{' '}
          <select value={pre} onChange={(e) => { const k = e.target.value; setPre(k); setInit(BW_PRE[k][0]); setGoal(BW_PRE[k][1]); run(BW_PRE[k][0], BW_PRE[k][1]); }}>
            {Object.keys(BW_PRE).map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
      </div>
      <label className="mini" htmlFor="bw-i">Initial state</label>
      <textarea id="bw-i" rows={2} value={init} onChange={(e) => setInit(e.target.value)} />
      <label className="mini" htmlFor="bw-g">Goal</label>
      <textarea id="bw-g" rows={1} value={goal} onChange={(e) => setGoal(e.target.value)} />
      <div className="row"><button className="btn sm pri" type="button" onClick={() => run()}>Run planner</button></div>
      <div>
        <p><b>Plan ({tr.plan.length} steps):</b> <span className="mini">{tr.plan.join(' → ') || 'none'}</span></p>
        <Verdict ok={tr.ok}>{tr.ok ? 'Goal reached.' : 'Failed: ' + (tr.err || '')}</Verdict>
        <div className="row">
          <button className="btn sm" type="button" onClick={() => { stop(); setN(Math.max(n - 1, 0)); }}>Back</button>
          <button className="btn sm" type="button" onClick={() => { stop(); setN(Math.min(n + 1, last)); }}>Next</button>
          <button className="btn sm" type="button" onClick={play}>Play</button>
          <button className="btn sm" type="button" onClick={() => { stop(); setN(last); }}>Final state</button>
          <span className="mini">{Math.min(n, last) + 1} / {tr.trace.length}</span>
        </div>
        <p className="mini"><b>Step {Math.min(n, last) + 1} of {tr.trace.length}.</b> {s.note}</p>
        <div className="bwbox">
          <div>
            <h5>Goal stack (top first)</h5>
            <div className="stk" style={{ minWidth: 210 }}>{s.stack.length ? s.stack.map((x, i) => <span key={i}>{x}</span>) : <span>(empty)</span>}</div>
          </div>
          <div>
            <h5>World</h5>
            <Html html={bwDraw(s.state)} />
            <p className="mini" style={{ wordBreak: 'break-word' }}>{s.state.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- job-shop Gantt ---------- */
const G_ACTS = [['AddEngine1', 1, 30], ['AddWheels1', 1, 30], ['Inspect1', 1, 10], ['AddEngine2', 2, 60], ['AddWheels2', 2, 15], ['Inspect2', 2, 10]];
const G_SCHED = { 'No resource limit (critical path)': [0, 30, 60, 0, 60, 75], 'One engine hoist (best)': [0, 30, 60, 30, 90, 105], 'Engine2 first on the hoist': [60, 90, 120, 0, 60, 75] };

export function Gantt() {
  const [k, setK] = useState(Object.keys(G_SCHED)[0]);
  const st = G_SCHED[k];
  const sc = 5.2, L = 108, H = G_ACTS.length * 28 + 34;
  const mk = Math.max(...G_ACTS.map((a, i) => st[i] + a[2]));
  let svg = `<svg class="gantt net" viewBox="0 0 ${L + mk * sc + 30} ${H}" width="${L + mk * sc + 30}" role="img" aria-label="Gantt chart">`;
  for (let t = 0; t <= mk + 5; t += 15) svg += `<line class="ax" x1="${L + t * sc}" y1="14" x2="${L + t * sc}" y2="${H - 14}"/><text x="${L + t * sc}" y="${H - 3}" text-anchor="middle">${t}</text>`;
  G_ACTS.forEach((a, i) => {
    const y = 20 + i * 28;
    svg += `<text x="${L - 8}" y="${y + 14}" text-anchor="end">${a[0]}</text><rect class="b j${a[1]}" x="${L + st[i] * sc}" y="${y}" width="${a[2] * sc}" height="20" rx="2"/><text x="${L + st[i] * sc + 4}" y="${y + 14}">${st[i]}–${st[i] + a[2]}</text>`;
  });
  svg += '</svg>';
  return (
    <div className="wg">
      <h4>Job-shop schedule</h4>
      <div className="row">
        <label>Schedule{' '}
          <select value={k} onChange={(e) => setK(e.target.value)}>{Object.keys(G_SCHED).map((x) => <option key={x}>{x}</option>)}</select>
        </label>
      </div>
      <div>
        <Html html={svg} />
        <Verdict ok={mk <= 115}>Makespan = {mk}</Verdict>
        <p className="mini">Violet = Job 1, gold = Job 2. Rows show start and end time of each action.</p>
      </div>
    </div>
  );
}

