import { useState } from 'react';
import { MODS } from '../data/content.js';
import { PAPER } from '../data/paper.js';
import { YT } from '../data/videos.js';
import { HOME_ORDER, T } from '../lib.js';
import Html from './Html.jsx';
import { HeroTape, Vids } from './widgets.jsx';

const Pill = ({ t }) => <span className={'pill pr' + (t.pr === 'Very High' ? ' f' : '')}>{t.pr}</span>;
const qid = (n) => 'q-' + n.replace(/\W/g, '');
const btnLink = { textDecoration: 'none' };

export function Home() {
  return (
    <>
      <div className="hero">
        <div className="meta"><span className="pill f">CSD 3101</span><span className="pill">CAT-2</span><span className="pill">Modules III–V</span></div>
        <h1>Theory of Computation: CAT-2 field notes</h1>
        <p>Every topic has its Neso Academy lessons embedded. Fifteen topics, worked solutions, simulators for PDAs and Turing machines, and 2-, 5- and 13-mark answers. Everything stays inside the CAT-2 syllabus.</p>
      </div>
      <HeroTape />
      <h2>Preparation order</h2>
      <ol className="order">
        {HOME_ORDER.map((id) => T.find((t) => t.id === id)).map((t) => (
          <li key={t.id}><a href={'#' + t.id}>{t.title}</a><Pill t={t} /></li>
        ))}
      </ol>
      <h2>What to practise</h2>
      <table>
        <tbody>
          <tr><th>Priority</th><th>Topics</th><th>Drill</th></tr>
          <tr><td>Very high</td><td>Pumping lemma (regular), state elimination, CNF, GNF, PDA, Turing machine</td><td>Proofs, conversions, constructions with every step written</td></tr>
          <tr><td>High</td><td>Parse trees, ambiguity, CFL pumping lemma, CFG ↔ PDA</td><td>Derivations, two-tree examples, case analysis</td></tr>
        </tbody>
      </table>
      <div className="tip"><b>Scoring.</b> TOC marks go to visible steps. Write the grammar or automaton after each transformation, name the rule you applied, and finish by testing one short string.</div>
      <div className="tip"><b>AI tutor.</b> Open "Ask tutor" (top right). It reads the topic you are on, can quiz you, write fresh problems and mark your answer. Sign in with a free Puter account the first time.</div>
      <div className="tip"><b>Last year’s paper.</b> Solved in full: open “Last year paper + answers” in the sidebar.</div>
      <div className="pager">
        <a className="btn" href="#all" style={btnLink}>All notes on one page + PDF</a>
        <a className="btn pri" href="#m3-1" style={btnLink}>Start with pumping lemma</a>
      </div>
    </>
  );
}

const Meta = ({ t }) => (
  <div className="meta"><span className={'pill' + (t.pr === 'Very High' ? ' f' : '')}>{t.pr} priority</span><span className="pill">{MODS[t.mod]}</span></div>
);

export function Topic({ t, done, onToggleDone, onPractice }) {
  const [filter, setFilter] = useState('All');
  const i = T.indexOf(t);
  const prev = T[i - 1], next = T[i + 1];
  const isDone = done.has(t.id);
  return (
    <>
      <Meta t={t} />
      <h1>{t.title}</h1>
      {YT[t.id] && <Vids id={t.id} />}
      <Html html={t.body} />
      <hr className="rule" />
      <h2>Exam questions</h2>
      <div className="tabs" role="group" aria-label="Filter by marks">
        {['All', 2, 5, 13].map((m) => (
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
        <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {prev && <a className="btn" style={btnLink} href={'#' + prev.id}>← {prev.title}</a>}
          {next && <a className="btn pri" style={btnLink} href={'#' + next.id}>{next.title} →</a>}
        </span>
      </div>
    </>
  );
}

export function PaperView() {
  return (
    <>
      <div className="meta"><span className="pill f">CAT-2 · Oct 2025</span><span className="pill">CSD 3101 · 50 marks · 90 min</span></div>
      <h1>Last year’s paper with full answers</h1>
      <p>Every question from the paper you uploaded, solved the way you should write it. Questions marked OR are alternatives: you answer one of each pair.</p>
      <div className="tip"><b>What it tells you.</b> The paper tests: pumping lemma (regular), GNF, CNF, unambiguous grammar, CFG design, properties of regular languages, CFL pumping lemma, PDA and Turing machine. These are the same topics ranked “very high” in the notes. Expect the same pattern tomorrow with different grammars and languages.</div>
      <ol className="order">
        {PAPER.flatMap((p) => p.qs).map((q) => (
          <li key={q.n}><a href={'#' + qid(q.n)}>Q{q.n}</a><span className="pill pr">{q.m} marks</span></li>
        ))}
      </ol>
      {PAPER.map((p) => (
        <div key={p.part} style={{ display: 'contents' }}>
          <h2>{p.part}</h2>
          {p.qs.map((q) => (
            <details key={q.n} className="qa" id={qid(q.n)} open>
              <summary><span className="mk">Q{q.n} · {q.m}</span><span dangerouslySetInnerHTML={{ __html: q.q }} /></summary>
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
      <p>Every topic, worked example and 2/5/13-mark answer in one scroll. Use Ctrl+F to find anything.</p>
      <div className="row">
        <a className="btn pri" href={'../TOC-CAT2-notes.pdf'} download="TOC-CAT2-notes.pdf" style={btnLink}>Download PDF (offline)</a>
        <button className="btn" onClick={() => print()}>Print / Save as PDF</button>
      </div>
      <ol className="order">
        {T.map((t) => <li key={t.id}><a href={'#' + t.id}>{t.title}</a><Pill t={t} /></li>)}
      </ol>
      {T.map((t) => (
        <section key={t.id} style={{ marginTop: '3.5em' }}>
          <Meta t={t} />
          <h1>{t.title}</h1>
          {YT[t.id] && <Vids id={t.id} />}
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
      <section style={{ marginTop: '3.5em' }}><PaperView /></section>
    </>
  );
}
