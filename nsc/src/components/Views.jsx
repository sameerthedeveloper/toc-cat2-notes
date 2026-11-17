import { useState } from 'react';
import { MODS } from '../data/content.js';
import { PAPER } from '../data/paper.js';
import { T } from '../lib.js';
import Html from './Html.jsx';
import { YT } from '../data/videos.js';
import { NoVideo, Rsa, Vids } from './widgets.jsx';

const qid = (n) => 'q-' + n.replace(/\W/g, '');
const btnLink = { textDecoration: 'none' };
const MOD_NAME = (m) => MODS[m].split(' · ')[1];
const MOD_NUM = (m) => MODS[m].split(' · ')[0];

const Prio = ({ t }) => <span className={'prio' + (t.pr === 'Very High' ? ' vh' : '')}>{t.pr === 'Very High' ? 'Very high priority' : t.pr + ' priority'}</span>;
const Tag = ({ t }) => <span className={'tag' + (t.pr === 'Very High' ? ' vh' : '')}>{t.pr}</span>;
const Meta = ({ t }) => (
  <div className="meta"><span className="mod">{MOD_NUM(t.mod)}: {MOD_NAME(t.mod)}</span><Prio t={t} /></div>
);

const Lessons = ({ id }) => (YT[id] ? <Vids id={id} /> : <NoVideo />);

const FOCUS = [
  ['III', 'Public key cryptography', 'm3-1'], ['III', 'Elliptic curve cryptography', 'm3-6'], ['III', 'Man-in-the-middle attack', 'm3-3'], ['III', 'RSA problem', 'm3-2'], ['III', 'Diffie–Hellman problem', 'm3-3'],
  ['IV', 'Message authentication code (MAC)', 'm4-3'], ['IV', 'MD5', 'm4-5'], ['IV', 'SHA', 'm4-6'], ['IV', 'Digital signature', 'm4-8'], ['IV', 'Hash algorithms', 'm4-4'],
];

const SEQ = [
  ['Public key cryptosystems', 'm3-1'], ['RSA algorithm', 'm3-2'], ['Diffie–Hellman key exchange', 'm3-3'], ['Key management', 'm3-4'],
  ['Elliptic curve arithmetic', 'm3-5'], ['Elliptic Curve Cryptography', 'm3-6'],
  ['Authentication requirements and functions', 'm4-1'], ['Message Authentication Code', 'm4-3'], ['Hash functions', 'm4-4'], ['MD5', 'm4-5'], ['SHA', 'm4-6'],
  ['Security of hash functions and MACs', 'm4-7'], ['Digital signatures', 'm4-8'], ['Authentication protocols', 'm4-9'], ['Digital Signature Standard', 'm4-10'], ['Exam comparisons', 'cmp-1'],
];

export function Home() {
  const vh = T.filter((t) => t.pr === 'Very High');
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="meta"><span className="mod">CSD 3103 · CAT-2 · Modules III and IV</span></div>
          <h1>Network security and cryptography: public keys, MACs and hashes</h1>
          <p>{T.length} topics with definition, working, diagrams, worked numericals and 2-, 5-, 8- and 16-mark answers, plus last year’s paper solved in full. Every calculation runs here: RSA, Diffie–Hellman, elliptic curve points, MD5, SHA and HMAC.</p>
          <div className="row hero-cta">
            <a className="btn pri" href="#m3-2" style={btnLink}>Start with RSA</a>
            <a className="btn" href="#paper" style={btnLink}>Last year’s paper</a>
          </div>
        </div>
        <figure className="hero-cave">
          <Rsa />
          <figcaption>This is the RSA question from last year’s paper, running live. Change any number and every step updates: n, φ(n), d, the square-and-multiply table for C, and the decryption back to M. More calculators sit inside the topics.</figcaption>
        </figure>
      </section>

      <h2>Your focus list</h2>
      <p>The ten topics you flagged, in order. Each link opens the notes, the worked numerical and the exam answers.</p>
      <table>
        <thead><tr><th>Module</th><th>Topic</th><th>Go to</th></tr></thead>
        <tbody>
          {FOCUS.map(([m, name, id]) => <tr key={name}><td>{m}</td><td>{name}</td><td><a href={'#' + id}>{T.find((t) => t.id === id).title}</a></td></tr>)}
        </tbody>
      </table>

      <h2>Study sequence</h2>
      <ol className="order">
        {SEQ.map(([name, id]) => {
          const t = T.find((x) => x.id === id);
          return <li key={id}><a href={'#' + id}>{name}</a><Tag t={t} /></li>;
        })}
      </ol>

      <h2>Where the marks are</h2>
      <table>
        <thead><tr><th>Priority</th><th>Topics</th><th>Drill</th></tr></thead>
        <tbody>
          <tr><td>Very high</td><td>{vh.map((t, i) => <span key={t.id}>{i ? ', ' : ''}<a href={'#' + t.id}>{t.title}</a></span>)}</td><td>By hand: RSA, Diffie–Hellman, EC point addition and doubling, DSA. Write: MAC and hash diagrams, MD5 and SHA steps</td></tr>
          <tr><td>High</td><td>Public key cryptosystems, key management, elliptic curve arithmetic, authentication requirements and functions, security of hash functions and MACs, authentication protocols, DSS</td><td>Definition, diagram, example</td></tr>
        </tbody>
      </table>
      <div className="tip"><b>Scoring.</b> Part A is five 2-mark definitions, Part B is two 16-mark answers (each split 8 + 8, with an OR), Part C is an 8-mark numerical (RSA or Diffie–Hellman). In a numerical, every line carries marks: list the givens, show n, φ(n), d, then each square-and-multiply step, then check by decrypting.</div>
      <div className="tip"><b>Paper pattern.</b> October 2025 asked: integrity vs authentication, applications of asymmetric encryption, MD5 features, DSS, avalanche effect, public key principles, ECC with an example, man-in-the-middle on key exchange, SHA, MAC, types of hash algorithms, RSA with p = 11, q = 13, and Diffie–Hellman with q = 7. Expect the same topics with different numbers.</div>
      <div className="tip"><b>AI tutor.</b> Open "Ask tutor" (top right). It reads the topic you are on, can quiz you, write fresh numericals and mark your answer. Sign in with a free Puter account on first use.</div>
      <div className="pager">
        <a className="btn" href="#all" style={btnLink}>All notes on one page</a>
        <a className="btn pri" href="#paper" style={btnLink}>Last year’s paper with answers</a>
      </div>
    </>
  );
}

export function Topic({ t, done, onToggleDone, onPractice }) {
  const [filter, setFilter] = useState('All');
  const i = T.indexOf(t);
  const prev = T[i - 1], next = T[i + 1];
  const isDone = done.has(t.id);
  return (
    <>
      <Meta t={t} />
      <h1>{t.title}</h1>
      <Lessons id={t.id} />
      <Html html={t.body} />
      <hr className="rule" />
      <h2>Exam questions</h2>
      <div className="tabs" role="group" aria-label="Filter by marks">
        {['All', 2, 5, 8, 16].map((m) => (
          <button key={m} aria-pressed={filter === String(m)} onClick={() => setFilter(String(m))}>{m === 'All' ? 'All' : m + ' marks'}</button>
        ))}
      </div>
      {t.qa.map((q, j) => (
        <details key={j} className="qa" hidden={filter !== 'All' && String(q.m) !== filter}>
          <summary><span className="mk">{q.m} marks</span><span>{q.q}</span></summary>
          <div className="ans">
            <Html html={q.a} />
            <p><button className="btn sm" onClick={() => onPractice(q.q)}>Try answering, then get marked</button></p>
          </div>
        </details>
      ))}
      <div className="pager">
        <button className="btn donebtn" aria-pressed={isDone} onClick={() => onToggleDone(t.id)}>{isDone ? 'Marked done' : 'Mark as done'}</button>
        <span className="pager-links">
          {prev && <a className="btn" style={btnLink} href={'#' + prev.id}>Previous: {prev.title}</a>}
          {next && <a className="btn pri" style={btnLink} href={'#' + next.id}>Next: {next.title}</a>}
        </span>
      </div>
    </>
  );
}

export function PaperView() {
  const all = PAPER.flatMap((p) => p.qs);
  return (
    <>
      <div className="meta"><span className="mod">CSD 3103 · CAT-2 · 29 October 2025 · 50 marks · 90 minutes</span></div>
      <h1>Last year’s paper with full answers</h1>
      <p>Every question from the paper, solved the way you should write it. Questions marked OR are alternatives: you answer one of each pair. The marks beside each answer show how the 8 or 16 marks are usually split.</p>
      <div className="tip"><b>What it tells you.</b> Part A is definitions from both modules. Part B pairs Module III (public key principles, ECC, man in the middle) with Module IV (SHA, MAC, hash types). Part C is always a numerical: RSA or Diffie–Hellman. Practise both until the arithmetic is automatic.</div>
      <Vids id="paper" />
      <ol className="order">
        {all.map((q) => (
          <li key={q.n}><a href={'#' + qid(q.n)}>Q{q.n}</a><span className="tag">{q.m} marks</span></li>
        ))}
      </ol>
      {PAPER.map((p) => (
        <div key={p.part} style={{ display: 'contents' }}>
          <h2>{p.part}</h2>
          {p.qs.map((q) => (
            <details key={q.n} className="qa" id={qid(q.n)} open>
              <summary>
                <span className="mk">Q{q.n} · {q.m}</span>
                <span>{q.or ? 'OR: ' : ''}{q.q} <span className="kl">{q.kl}</span></span>
              </summary>
              <div className="ans"><Html html={q.a} /></div>
            </details>
          ))}
        </div>
      ))}
    </>
  );
}

export function AllView() {
  return (
    <>
      <h1>All notes, one page</h1>
      <p>Every topic, worked example and 2/5/8/16-mark answer in one scroll, then last year’s paper. Use Ctrl+F to find anything.</p>
      <div className="row">
        <button className="btn pri" onClick={() => print()}>Print or save as PDF</button>
      </div>
      <ol className="order">
        {T.map((t) => <li key={t.id}><a href={'#' + t.id}>{t.title}</a><Tag t={t} /></li>)}
      </ol>
      {T.map((t) => (
        <section key={t.id} className="all-sec">
          <Meta t={t} />
          <h1>{t.title}</h1>
          <Lessons id={t.id} />
          <Html html={t.body} />
          <h2>Exam questions</h2>
          {t.qa.map((q, j) => (
            <details key={j} className="qa" open>
              <summary><span className="mk">{q.m} marks</span><span>{q.q}</span></summary>
              <div className="ans"><Html html={q.a} /></div>
            </details>
          ))}
          <hr className="rule" />
        </section>
      ))}
      <section className="all-sec"><PaperView /></section>
    </>
  );
}
