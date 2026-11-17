import { useEffect, useState } from 'react';
import { NOEMBED, V, YT } from '../data/videos.js';
import { DIAG, bitDiff, dh, ecAdd, ecMul, ecPoints, hmac, inv, md5, onCurve, ptStr, rsa, sha } from '../engines.js';

const Html = ({ html }) => <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
const Verdict = ({ ok, children }) => <span className={'verdict ' + (ok ? 'ok' : 'bad')}>{children}</span>;
export const Diag = ({ name }) => <div className="wg"><Html html={DIAG[name]()} /></div>;

const big = (s) => { if (!/^-?\d+$/.test(String(s).trim())) throw new Error('"' + s + '" is not a whole number'); return BigInt(String(s).trim()); };
const Num = ({ label, value, onChange, w = 90 }) => (
  <label>{label}<input type="text" inputMode="numeric" value={value} style={{ minWidth: w, width: w, flex: 'none' }} onChange={(e) => onChange(e.target.value)} /></label>
);
const run = (fn) => { try { return { r: fn() }; } catch (e) { return { err: e.message }; } };
const trace = (t, mod) => t.steps.map((s) => `bit ${s.i} = ${s.bit}   base = ${s.base}${s.bit ? `   result × base mod ${mod} = ${s.r}` : '   (skip)'}`).join('\n');

/* ---------- video lessons ---------- */
export function Vids({ id }) {
  const y = YT[id];
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = y.v[cur];
  const out = NOEMBED.has(v);
  const poster = { backgroundImage: `url(https://i.ytimg.com/vi/${v}/hqdefault.jpg)` };
  const cap = <span className="vcap">{V[v][0]}<span className="vcapch">{V[v][2]}</span></span>;
  return (
    <div className="wg vids">
      <h4>Video lessons</h4>
      <div className="vplay">
        {playing && !out ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v}?rel=0&autoplay=1`}
            title={V[v][0]}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : out ? (
          <a className="vposter" href={`https://www.youtube.com/watch?v=${v}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${V[v][0]} on YouTube`} style={{ ...poster, textDecoration: 'none' }}>
            <span className="vbtn">Open on YouTube</span>{cap}
          </a>
        ) : (
          <button className="vposter" type="button" aria-label={`Play ${V[v][0]}`} style={poster} onClick={() => setPlaying(true)}>
            <span className="vbtn">Play</span>{cap}
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
      {out && <p className="vnote">The uploader has switched off embedding for this video, so it opens on YouTube.</p>}
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
      Neither Neso Academy nor 4G Silver Academy has a lesson on this topic. The notes and tools on this page cover it in full.
    </p>
  );
}

/* ---------- RSA ---------- */
export function Rsa() {
  const [f, setF] = useState({ p: '11', q: '13', e: '11', M: '7' });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const o = run(() => rsa(big(f.p), big(f.q), big(f.e), big(f.M)));
  const r = o.r;
  return (
    <div className="wg">
      <h4>RSA calculator: key generation, encryption, decryption</h4>
      <div className="row">
        <Num label="p" value={f.p} onChange={set('p')} w={70} /><Num label="q" value={f.q} onChange={set('q')} w={70} />
        <Num label="e" value={f.e} onChange={set('e')} w={70} /><Num label="M" value={f.M} onChange={set('M')} w={70} />
      </div>
      <div className="row"><span className="mini">Try:</span>
        {[['11, 13, e 11, M 7 (CAT-2)', ['11', '13', '11', '7']], ['3, 11, e 7, M 5', ['3', '11', '7', '5']], ['17, 11, e 7, M 88', ['17', '11', '7', '88']], ['5, 7, e 5, M 5 (C = 10)', ['5', '7', '5', '5']], ['5, 11, e 3, M 9', ['5', '11', '3', '9']]].map(([l, v]) => (
          <button key={l} className="btn sm" type="button" onClick={() => setF({ p: v[0], q: v[1], e: v[2], M: v[3] })}>{l}</button>))}
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <pre>{`n = p × q = ${f.p} × ${f.q} = ${r.n}
φ(n) = (p − 1)(q − 1) = ${r.phi}
d = e⁻¹ mod φ(n):  ${r.eg.rows.map((x) => `${x.q}`).join(', ') ? `extended Euclid gives d = ${r.d}  (check: ${f.e} × ${r.d} = ${BigInt(f.e) * r.d} ≡ 1 mod ${r.phi})` : ''}
Public key KU = {${f.e}, ${r.n}}     Private key KR = {${r.d}, ${r.n}}

Encrypt  C = M^e mod n = ${f.M}^${f.e} mod ${r.n}
${trace(r.enc, r.n)}
C = ${r.C}

Decrypt  M = C^d mod n = ${r.C}^${r.d} mod ${r.n}
${trace(r.dec, r.n)}
M = ${r.M2}`}</pre>
          <Verdict ok={r.M2 === BigInt(f.M)}>{r.M2 === BigInt(f.M) ? `Recovered M = ${r.M2}: it matches the original message.` : 'Decryption did not match.'}</Verdict>
        </>
      )}
    </div>
  );
}

/* ---------- Diffie-Hellman ---------- */
export function Dh() {
  const [f, setF] = useState({ q: '7', a: '5', xa: '3', xb: '6' });
  const [mitm, setMitm] = useState(false);
  const [xm, setXm] = useState('4');
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const o = run(() => dh(big(f.q), big(f.a), big(f.xa), big(f.xb)));
  const r = o.r;
  const q = o.r ? big(f.q) : 0n;
  const m = mitm && r && run(() => {
    const x = big(xm), a = big(f.a);
    const ym = (a ** x) % q;
    const pw = (b, e) => { let res = 1n; for (let i = 0n; i < e; i++) res = (res * b) % q; return res; };
    return { ym, ka: pw(ym, big(f.xa)), kb: pw(ym, big(f.xb)), km_a: pw(r.ya, x), km_b: pw(r.yb, x) };
  });
  return (
    <div className="wg">
      <h4>Diffie–Hellman calculator, with an attacker switch</h4>
      <div className="row">
        <Num label="q (prime)" value={f.q} onChange={set('q')} w={70} /><Num label="α" value={f.a} onChange={set('a')} w={60} />
        <Num label="X_A" value={f.xa} onChange={set('xa')} w={60} /><Num label="X_B" value={f.xb} onChange={set('xb')} w={60} />
      </div>
      <div className="row"><span className="mini">Try:</span>
        {[['q 7, α 5, X_A 3, X_B 6 (CAT-2)', ['7', '5', '3', '6']], ['q 353, α 3, 97, 233', ['353', '3', '97', '233']], ['q 23, α 5, 6, 15', ['23', '5', '6', '15']]].map(([l, v]) => (
          <button key={l} className="btn sm" type="button" onClick={() => setF({ q: v[0], a: v[1], xa: v[2], xb: v[3] })}>{l}</button>))}
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <pre>{`α = ${f.a} is ${r.root ? '' : 'NOT '}a primitive root of ${f.q}${r.roots.length && r.roots.length < 30 ? `  (primitive roots: ${r.roots.join(', ')})` : ''}
Y_A = α^X_A mod q = ${f.a}^${f.xa} mod ${f.q} = ${r.ya}
Y_B = α^X_B mod q = ${f.a}^${f.xb} mod ${f.q} = ${r.yb}
Alice: K = Y_B^X_A mod q = ${r.yb}^${f.xa} mod ${f.q} = ${r.ka}
Bob:   K = Y_A^X_B mod q = ${r.ya}^${f.xb} mod ${f.q} = ${r.kb}`}</pre>
          <Verdict ok={r.ka === r.kb && r.root}>{r.ka === r.kb ? `Shared secret K = ${r.ka}` : 'Keys differ'}{r.root ? '' : ' (α is not a primitive root, so the key space is small)'}</Verdict>
          <label className="mini" style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
            <input type="checkbox" checked={mitm} onChange={(e) => setMitm(e.target.checked)} /> Add Mallory (man in the middle) with private value
            <input type="text" value={xm} style={{ width: 50, minWidth: 50, flex: 'none' }} onChange={(e) => setXm(e.target.value)} />
          </label>
          {m && m.err && <Verdict>{m.err}</Verdict>}
          {m && m.r && (
            <>
              <pre>{`Mallory sends Y_M = α^X_M = ${m.r.ym} to BOTH sides.
Alice computes K_A = Y_M^X_A = ${m.r.ka}.   Mallory computes the same K = Y_A^X_M = ${m.r.km_a}.
Bob   computes K_B = Y_M^X_B = ${m.r.kb}.   Mallory computes the same K = Y_B^X_M = ${m.r.km_b}.`}</pre>
              <Verdict>{m.r.ka === m.r.kb ? `Alice and Bob end up with the same key ${m.r.ka}, which Mallory also knows.` : `Alice holds ${m.r.ka}, Bob holds ${m.r.kb}: two different keys, both known to Mallory, who relays and reads every message.`}</Verdict>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Elliptic curve ---------- */
export function Ecc() {
  const [c, setC] = useState({ p: '17', a: '2', b: '2' });
  const [P, setP] = useState({ x: '5', y: '1' });
  const [Q, setQ] = useState({ x: '10', y: '6' });
  const [k, setK] = useState('3');
  const o = run(() => {
    const cv = { p: big(c.p), a: big(c.a), b: big(c.b) };
    const disc = (4n * cv.a ** 3n + 27n * cv.b ** 2n) % cv.p;
    if (disc === 0n) throw new Error('4a³ + 27b² ≡ 0 (mod p): not a valid curve');
    const p1 = [big(P.x), big(P.y)], q1 = [big(Q.x), big(Q.y)];
    if (!onCurve(p1, cv)) throw new Error('P is not on the curve');
    if (!onCurve(q1, cv)) throw new Error('Q is not on the curve');
    const kk = big(k);
    if (kk < 1n || kk > 60n) throw new Error('k must be between 1 and 60');
    return { cv, p1, q1, add: ecAdd(p1, q1, cv), dbl: ecAdd(p1, p1, cv), mul: ecMul(kk, p1, cv), pts: cv.p <= 31n ? ecPoints(cv) : null, kk };
  });
  const r = o.r;
  const f = (ob, ks) => (kk) => ob({ ...ks, ...kk });
  return (
    <div className="wg">
      <h4>Elliptic curve calculator: y² = x³ + ax + b (mod p)</h4>
      <div className="row">
        <Num label="p" value={c.p} onChange={(v) => setC({ ...c, p: v })} w={60} /><Num label="a" value={c.a} onChange={(v) => setC({ ...c, a: v })} w={50} /><Num label="b" value={c.b} onChange={(v) => setC({ ...c, b: v })} w={50} />
      </div>
      <div className="row">
        <Num label="P x" value={P.x} onChange={(v) => f(setP, P)({ x: v })} w={50} /><Num label="P y" value={P.y} onChange={(v) => f(setP, P)({ y: v })} w={50} />
        <Num label="Q x" value={Q.x} onChange={(v) => f(setQ, Q)({ x: v })} w={50} /><Num label="Q y" value={Q.y} onChange={(v) => f(setQ, Q)({ y: v })} w={50} />
        <Num label="k" value={k} onChange={setK} w={50} />
      </div>
      <div className="row"><span className="mini">Try:</span>
        <button className="btn sm" type="button" onClick={() => { setC({ p: '17', a: '2', b: '2' }); setP({ x: '5', y: '1' }); setQ({ x: '10', y: '6' }); setK('3'); }}>y² = x³+2x+2 mod 17, G = (5,1)</button>
        <button className="btn sm" type="button" onClick={() => { setC({ p: '23', a: '1', b: '1' }); setP({ x: '3', y: '10' }); setQ({ x: '9', y: '7' }); setK('5'); }}>y² = x³+x+1 mod 23 (CAT-2 style)</button>
      </div>
      {o.err && <Verdict>{o.err}</Verdict>}
      {r && (
        <>
          <p className="mini">{r.pts ? `The curve has ${r.pts.length + 1} points including O: ${r.pts.map(ptStr).join(' ')}` : ''}</p>
          <pre>{`P + Q\n${r.add.note}\nP + Q = ${ptStr(r.add.R)}\n\nDoubling 2P\n${r.dbl.note}\n2P = ${ptStr(r.dbl.R)}\n\nMultiples of P (repeated addition)\n${r.mul.list.map((x, i) => `${i + 1}P = ${ptStr(x)}`).join('\n')}\n${r.kk}P = ${ptStr(r.mul.R)}`}</pre>
        </>
      )}
    </div>
  );
}

/* ---------- Hash lab ---------- */
const ALGS = [['MD5', 128], ['SHA-1', 160], ['SHA-256', 256], ['SHA-512', 512]];
const digest = (a, s) => (a === 'MD5' ? Promise.resolve(md5(s)) : sha(a, s));
export function HashLab() {
  const [m, setM] = useState('Hello, CAT-2');
  const [m2, setM2] = useState('Hello, CAT-3');
  const [res, setRes] = useState(null);
  useEffect(() => {
    let live = true;
    (async () => {
      const out = [];
      for (const [a, bits] of ALGS) { const h1 = await digest(a, m), h2 = await digest(a, m2); out.push({ a, bits, h1, h2, d: bitDiff(h1, h2) }); }
      if (live) setRes(out);
    })();
    return () => { live = false; };
  }, [m, m2]);
  return (
    <div className="wg">
      <h4>Hash lab and avalanche effect</h4>
      <p className="mini">Change one character of the second message. About half of the output bits flip, whichever algorithm you pick.</p>
      <div className="row"><label style={{ flex: 1 }}>Message 1<input type="text" value={m} onChange={(e) => setM(e.target.value)} /></label></div>
      <div className="row"><label style={{ flex: 1 }}>Message 2<input type="text" value={m2} onChange={(e) => setM2(e.target.value)} /></label></div>
      {res && (
        <div className="tt"><table>
          <thead><tr><th>Algorithm</th><th>Digest of message 1</th><th>Digest of message 2</th><th>Bits changed</th></tr></thead>
          <tbody>{res.map((x) => (
            <tr key={x.a}><td>{x.a} ({x.bits} bit)</td><td style={{ wordBreak: 'break-all' }}>{x.h1}</td><td style={{ wordBreak: 'break-all' }}>{x.h2}</td><td>{x.d} of {x.bits} ({Math.round((100 * x.d) / x.bits)}%)</td></tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}

/* ---------- HMAC ---------- */
export function MacLab() {
  const [key, setKey] = useState('shared-secret');
  const [msg, setMsg] = useState('Pay Bob 100 rupees');
  const [tamper, setTamper] = useState('Pay Bob 900 rupees');
  const [alg, setAlg] = useState('SHA-256');
  const [out, setOut] = useState(null);
  useEffect(() => {
    let live = true;
    (async () => {
      const t = await hmac(alg, key, msg), t2 = await hmac(alg, key, tamper), t3 = await hmac(alg, 'wrong-key', msg);
      if (live) setOut({ t, t2, t3, plain: await sha(alg, msg) });
    })();
    return () => { live = false; };
  }, [key, msg, tamper, alg]);
  return (
    <div className="wg">
      <h4>HMAC: generate and verify a tag</h4>
      <div className="row">
        <label style={{ flex: 1 }}>Shared key K<input type="text" value={key} onChange={(e) => setKey(e.target.value)} /></label>
        <label>Hash<select value={alg} onChange={(e) => setAlg(e.target.value)}><option>SHA-256</option><option>SHA-1</option><option>SHA-512</option></select></label>
      </div>
      <div className="row"><label style={{ flex: 1 }}>Message M sent<input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} /></label></div>
      <div className="row"><label style={{ flex: 1 }}>Message M′ the attacker delivers<input type="text" value={tamper} onChange={(e) => setTamper(e.target.value)} /></label></div>
      {out && (
        <>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{`Tag T = HMAC(K, M)  = ${out.t}\nHMAC(K, M′)        = ${out.t2}\nHMAC(wrong key, M) = ${out.t3}\nPlain hash H(M)    = ${out.plain}   (anyone can compute this, so it proves nothing)`}</pre>
          <Verdict ok={out.t !== out.t2}>{out.t === out.t2 ? 'Same tag: M′ equals M' : 'Tags differ, so the receiver rejects M′ (integrity and authenticity).'}</Verdict>{' '}
          <Verdict ok={out.t !== out.t3}>{out.t !== out.t3 ? 'An attacker without K cannot produce the tag.' : ''}</Verdict>
        </>
      )}
    </div>
  );
}

/* ---------- modular inverse helper (used in answers) ---------- */
export function Inverse() {
  const [a, setA] = useState('11');
  const [m, setM] = useState('120');
  const o = run(() => ({ r: inv(big(a), big(m)) }));
  return (
    <div className="wg">
      <h4>Modular inverse (finds d from e)</h4>
      <div className="row"><Num label="a" value={a} onChange={setA} w={70} /><Num label="mod m" value={m} onChange={setM} w={80} /></div>
      {o.err ? <Verdict>{o.err}</Verdict> : <Verdict ok>{a}⁻¹ mod {m} = {String(o.r.r)} (check: {a} × {String(o.r.r)} ≡ {String((big(a) * o.r.r) % big(m))} mod {m})</Verdict>}
    </div>
  );
}
