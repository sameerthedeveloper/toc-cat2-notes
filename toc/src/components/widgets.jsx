import { useEffect, useRef, useState } from 'react';
import { NESO_PL, V, YT } from '../data/videos.js';
import { PDAS, PLL, TMS, TREES, AMB, pdaRun, plSplits, tmInit, tmStep, treeSVG } from '../engines.js';
import { reduceMotion } from '../lib.js';

/* ---------- Neso videos ---------- */
export function Vids({ id }) {
  const y = YT[id];
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = y.v[cur];
  const pick = (i) => {
    setCur(i);
    setPlaying(false);
  };
  return (
    <div className="wg vids">
      <h4>Neso Academy lessons for this topic</h4>
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
            <span className="vcap">{V[v][0]}</span>
          </button>
        )}
      </div>
      <ol className="vlist">
        {y.v.map((vid, i) => (
          <li key={vid + i}>
            <button type="button" className={i === cur ? 'on' : ''} onClick={() => pick(i)}>
              <span className="vt">{V[vid][0]}</span>
              <span className="vd">{V[vid][1]} min</span>
            </button>
          </li>
        ))}
      </ol>
      {y.note && <p className="mini" style={{ margin: '8px 0 0' }} dangerouslySetInnerHTML={{ __html: y.note }} />}
      <p className="mini" style={{ margin: '8px 0 0' }}>
        <a href={NESO_PL} target="_blank" rel="noopener noreferrer">Full Neso TOC playlist</a> ·{' '}
        <a href={`https://www.youtube.com/watch?v=${v}&list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOIev`} target="_blank" rel="noopener noreferrer">Open this lesson on YouTube</a>
      </p>
    </div>
  );
}

/* ---------- step-by-step worked example ---------- */
export function Stepper({ steps }) {
  const [n, setN] = useState(0);
  const last = steps.length - 1;
  return (
    <div className="wg steps">
      <div className="row">
        <button className="btn sm" disabled={n === 0} onClick={() => setN(Math.max(n - 1, 0))}>Back</button>
        <button className="btn sm pri" disabled={n >= last} onClick={() => setN(Math.min(n + 1, last))}>Next step</button>
        <button className="btn sm" onClick={() => setN(last)}>Show all</button>
        <span className="mini">step {Math.min(n, last) + 1} of {steps.length}</span>
      </div>
      {steps.map((s, i) => (
        <div key={i} className={'step' + (i <= n ? ' on' : '')}>
          <h5 dangerouslySetInnerHTML={{ __html: s[0] }} />
          <div dangerouslySetInnerHTML={{ __html: s[1] }} />
        </div>
      ))}
    </div>
  );
}

/* ---------- parse trees ---------- */
export function Tree({ name }) {
  const t = TREES[name];
  return (
    <div className="wg">
      <h4>{t.cap}</h4>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: treeSVG(t.root()) }} />
    </div>
  );
}

export function Amb() {
  const [n, setN] = useState(0);
  const a = AMB[n];
  return (
    <div className="wg">
      <h4>Two parse trees for id+id*id (id values 2, 3, 4)</h4>
      <div className="tabs">
        {AMB.map((x, i) => (
          <button key={i} aria-pressed={i === n} onClick={() => setN(i)}>{x.name}</button>
        ))}
      </div>
      <div>
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: treeSVG(a.root()) }} />
        <p className="mini">{a.lmd}</p>
        <span className="verdict bad">Value = {a.val}. The grammar cannot tell which is meant.</span>
      </div>
    </div>
  );
}

/* ---------- pumping lemma game ---------- */
export function PlGame() {
  const [L, setL] = useState(Object.keys(PLL)[0]);
  const [p, setP] = useState(4);
  const [sRaw, setS] = useState(0);
  const [kRaw, setK] = useState(1);
  const [i, setI] = useState(2);
  const [res, setRes] = useState(null);

  const w = PLL[L].w(p);
  const s = Math.max(0, Math.min(p - 1, sRaw || 0));
  const k = Math.max(1, Math.min(p - s, kRaw || 1));
  const x = w.slice(0, s), y = w.slice(s, s + k), z = w.slice(s + k);
  const r = x + y.repeat(i) + z;
  const ok = PLL[L].mem(r);

  const testAll = () => setRes({ L, p, rows: plSplits(L, p) });
  const bad = res ? res.rows.filter((q) => q.bad !== null).length : 0;

  return (
    <div className="wg">
      <h4>Pumping lemma adversary game</h4>
      <div className="row">
        <label>Language{' '}
          <select value={L} onChange={(e) => setL(e.target.value)}>
            {Object.entries(PLL).map(([key, v]) => <option key={key} value={key}>{v.name}</option>)}
          </select>
        </label>
        <label>p <input type="range" min="2" max="7" value={p} onChange={(e) => setP(+e.target.value)} /><b>{p}</b></label>
      </div>
      <div className="mini">w (you choose it): <span className="str">{w.slice(0, p)}<span style={{ opacity: 0.55 }}>{w.slice(p)}</span></span></div>
      <p className="mini" style={{ margin: '6px 0' }}>Adversary picks y inside the first p symbols (|xy| ≤ p, |y| ≥ 1). Then you pick i.</p>
      <div className="row">
        <label>start of y <input type="number" min="0" max={p - 1} value={sRaw} style={{ width: 62 }} onChange={(e) => setS(+e.target.value)} /></label>
        <label>length of y <input type="number" min="1" max={p - s} value={kRaw} style={{ width: 62 }} onChange={(e) => setK(+e.target.value)} /></label>
        <label>i <input type="range" min="0" max="5" value={i} onChange={(e) => setI(+e.target.value)} /><b>{i}</b></label>
      </div>
      <div className="str">
        <span className="x">{x}</span><span className="y">{y}</span><span className="z">{z}</span>
        {'  '}→ pumped {i}×: {(r.length > 60 ? r.slice(0, 60) + '…' : r) || 'ε'}
      </div>
      <div>
        {ok
          ? <span className="verdict ok">xyⁱz ∈ L. This i does not break it, try another i.</span>
          : <span className="verdict bad">xyⁱz ∉ L. Contradiction: this split cannot be pumped.</span>}
      </div>
      <div className="row"><button className="btn sm pri" onClick={testAll}>Test every split of y</button></div>
      <div className="mini">
        {res && (
          <>
            <p><b>{bad} of {res.rows.length}</b> allowed splits are broken by some i. {bad === res.rows.length ? 'Every split fails, so the language is not regular.' : 'Some splits survive here, so choose a different w.'}</p>
            <table>
              <thead><tr><th>y at</th><th>|y|</th><th>y</th><th>breaks at i</th></tr></thead>
              <tbody>
                {res.rows.slice(0, 24).map((q, j) => (
                  <tr key={j}><td>{q.s}</td><td>{q.k}</td><td>{q.y}</td><td>{q.bad === null ? 'none' : q.bad}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- PDA simulator ---------- */
export function Pda() {
  const first = Object.keys(PDAS)[0];
  const [mk, setMk] = useState(first);
  const [w, setW] = useState(PDAS[first].def);
  const [path, setPath] = useState(null);
  const [n, setN] = useState(0);
  const [shown, setShown] = useState(false);
  const m = PDAS[mk];

  const changeMachine = (key) => {
    setMk(key);
    setW(PDAS[key].def);
    setPath(null);
    setN(0);
    setShown(false);
  };
  const run = () => {
    const p = pdaRun(m, w.trim());
    setPath(p);
    setN(p ? p.length - 1 : 0);
    setShown(true);
  };
  const step = () => {
    if (!path || !shown) {
      setPath(pdaRun(m, w.trim()));
      setN(0);
    } else if (n < path.length - 1) setN(n + 1);
    setShown(true);
  };

  let out = null;
  if (shown) {
    out = !path ? (
      <span className="verdict bad">No accepting computation for "{w.trim()}". Rejected.</span>
    ) : (
      <>
        <table>
          <thead><tr><th>step</th><th>state</th><th>input left</th><th>stack (top first)</th></tr></thead>
          <tbody>
            {path.slice(0, n + 1).map((st, i) => (
              <tr key={i}>
                <td>{i}</td><td>{st.q}</td><td>{st.rest || 'ε'}</td>
                <td><span className="stk">{[...st.st].map((c, j) => <span key={j}>{c}</span>)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {n >= path.length - 1 && <span className="verdict ok">Accepted in {path.length - 1} moves.</span>}
      </>
    );
  }

  return (
    <div className="wg">
      <h4>PDA simulator</h4>
      <div className="row">
        <label>Machine{' '}
          <select value={mk} onChange={(e) => changeMachine(e.target.value)}>
            {Object.entries(PDAS).map(([key, v]) => <option key={key} value={key}>{v.name}</option>)}
          </select>
        </label>
        <label>Input{' '}
          <input type="text" size="14" spellCheck="false" value={w} onChange={(e) => { setW(e.target.value); setPath(null); setShown(false); }} />
        </label>
        <button className="btn sm pri" onClick={run}>Run</button>
        <button className="btn sm" onClick={step}>Step</button>
      </div>
      <div>{out}</div>
      <details style={{ marginTop: 10 }}>
        <summary className="mini" style={{ cursor: 'pointer' }}>Transition table</summary>
        <pre>{m.d.map(([a, b, c, d, e]) => `δ(${a}, ${b || 'ε'}, ${c}) → (${d}, ${e || 'ε'})`).join('\n')}</pre>
      </details>
    </div>
  );
}

/* ---------- Turing machine simulator ---------- */
function tmTable(m) {
  return (
    Object.entries(m.t)
      .map(([k, v]) => {
        const [a, b] = k.split(',');
        return `δ(${a}, ${b === '_' ? 'B' : b}) = (${v[0]}, ${v[1] === '_' ? 'B' : v[1]}, ${v[2]})`;
      })
      .join('\n') + `\nstart ${m.start}, final ${m.final.join(',')}`
  );
}

export function Tm() {
  const first = Object.keys(TMS)[0];
  const [mk, setMk] = useState(first);
  const [w, setW] = useState(TMS[first].def);
  const [, tick] = useState(0);
  const sRef = useRef(tmInit(TMS[first], TMS[first].def));
  const timer = useRef(null);
  const m = TMS[mk];
  const s = sRef.current;
  const redraw = () => tick((t) => t + 1);
  const stop = () => clearInterval(timer.current);
  useEffect(() => stop, []);

  const load = (mach = m, input = w) => {
    stop();
    sRef.current = tmInit(mach, input.trim());
    redraw();
  };
  const changeMachine = (key) => {
    setMk(key);
    setW(TMS[key].def);
    load(TMS[key], TMS[key].def);
  };
  const step = () => {
    stop();
    tmStep(m, sRef.current);
    redraw();
  };
  const run = () => {
    stop();
    if (sRef.current.status === 'accept' || sRef.current.status === 'reject') load();
    timer.current = setInterval(() => {
      const cur = sRef.current;
      tmStep(m, cur);
      redraw();
      if (cur.status === 'accept' || cur.status === 'reject' || cur.steps > 3000) stop();
    }, reduceMotion() ? 0 : 160);
  };

  const cells = [];
  for (let i = s.head - 8; i <= s.head + 8; i++) {
    const c = s.tape[i] ?? '_';
    cells.push(<div key={i} className={'cell' + (i === s.head ? ' hd' : '')} data-q={i === s.head ? s.q : undefined}>{c === '_' ? '' : c}</div>);
  }

  return (
    <div className="wg">
      <h4>Turing machine simulator</h4>
      <div className="row">
        <label>Machine{' '}
          <select value={mk} onChange={(e) => changeMachine(e.target.value)}>
            {Object.entries(TMS).map(([key, v]) => <option key={key} value={key}>{v.name}</option>)}
          </select>
        </label>
        <label>Input{' '}
          <input type="text" size="14" spellCheck="false" value={w} onChange={(e) => setW(e.target.value)} />
        </label>
      </div>
      <div className="row">
        <button className="btn sm" onClick={() => load()}>Load</button>
        <button className="btn sm" onClick={step}>Step</button>
        <button className="btn sm pri" onClick={run}>Run</button>
        <button className="btn sm" onClick={stop}>Pause</button>
        <span className="mini">
          state <b>{s.q}</b> · steps {s.steps} ·{' '}
          {s.status === 'accept' ? <b style={{ color: 'var(--ok)' }}>ACCEPT</b> : s.status === 'reject' ? <b style={{ color: 'var(--bad)' }}>REJECT (no move)</b> : 'running'}
        </span>
      </div>
      <div className="tapewrap" style={{ margin: '10px 0' }}>
        <div className="tape">{cells}</div>
        <div className="tapecap">&nbsp;</div>
      </div>
      <details>
        <summary className="mini" style={{ cursor: 'pointer' }}>Transitions</summary>
        <pre>{tmTable(m)}</pre>
      </details>
    </div>
  );
}

/* ---------- home page tape: a real TM run ---------- */
export function HeroTape() {
  const [, tick] = useState(0);
  const st = useRef(null);
  const m = TMS['0n1n'];
  if (!st.current) st.current = tmInit(m, '000111');
  useEffect(() => {
    let hold = 0;
    if (reduceMotion()) {
      while (st.current.status !== 'accept' && st.current.status !== 'reject') tmStep(m, st.current);
      tick((t) => t + 1);
      return;
    }
    const id = setInterval(() => {
      const s = st.current;
      if (s.status === 'accept' || s.status === 'reject') {
        if (++hold > 5) {
          st.current = tmInit(m, '000111');
          hold = 0;
        }
      } else tmStep(m, s);
      tick((t) => t + 1);
    }, 520);
    return () => clearInterval(id);
  }, [m]);

  const s = st.current;
  const cells = [];
  for (let i = -3; i <= 10; i++) {
    const c = s.tape[i] ?? '_';
    cells.push(<div key={i} className={'cell' + (i === s.head ? ' hd' : '')} data-q={i === s.head ? s.q : undefined}>{c === '_' ? '' : c}</div>);
  }
  const cap = s.status === 'accept' ? 'Accepted: 000111 is in 0ⁿ1ⁿ' : s.status === 'reject' ? 'Rejected' : 'Turing machine checking 0ⁿ1ⁿ, one step at a time (X and Y mark matched symbols)';
  return (
    <div className="tapewrap">
      <div className="tape" aria-hidden="true">{cells}</div>
      <div className="tapecap">{cap}</div>
    </div>
  );
}

