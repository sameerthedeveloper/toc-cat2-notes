import { useState } from 'react';
import { MODS } from '../data/content.js';
import { PAPER } from '../data/paper.js';
import { YT } from '../data/videos.js';
import { T } from '../lib.js';
import Html from './Html.jsx';
import { NoVideo, Vids, Wumpus } from './widgets.jsx';

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

const SEQ = [
  ['Knowledge representation', 'm3-1'], ['Knowledge-based agents', 'm3-2'], ['Wumpus world', 'm3-3'], ['Propositional logic', 'm3-4'], ['Predicate logic', 'm3-5'],
  ['Unification and lifting', 'm3-6'], ['Inference and resolution', 'm3-10'], ['Rules, networks, frames, reasoning types', 'm3-7'],
  ['Planning problem, agent, state-space search', 'm4-1'], ['Blocks world and goal stack', 'm4-4'], ['Means-ends analysis', 'm4-6'],
  ['Partial-order, planning graphs, non-linear', 'm4-7'], ['Hierarchical, temporal, and the remaining planners', 'm4-9'],
];

export function Home() {
  const vh = T.filter((t) => t.pr === 'Very High');
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="meta"><span className="mod">CSD 3102 · CAT-2 · Modules III and IV</span></div>
          <h1>Artificial Intelligence: knowledge, reasoning and planning</h1>
          <p>{T.length} topics with definition, working, worked examples and 2-, 5- and 13-mark answers, plus last year’s paper solved in full. Every solver runs here: truth tables, unification, chaining, goal-stack planning and a Wumpus world.</p>
          <div className="row hero-cta">
            <a className="btn pri" href="#m3-1" style={btnLink}>Start with knowledge representation</a>
            <a className="btn" href="#paper" style={btnLink}>Last year’s paper</a>
          </div>
        </div>
        <figure className="hero-cave">
          <Wumpus auto />
          <figcaption>The agent only knows what it has sensed. After each move it works out which rooms are certainly safe (green) and where the pits and the wumpus must be. Play it yourself in <a href="#m3-3">Wumpus world</a>.</figcaption>
        </figure>
      </section>

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
          <tr><td>Very high</td><td>{vh.map((t, i) => <span key={t.id}>{i ? ', ' : ''}<a href={'#' + t.id}>{t.title}</a></span>)}</td><td>Solve by hand: truth tables, unification, resolution proof, goal-stack trace, means-ends table</td></tr>
          <tr><td>High</td><td>Knowledge representation, KB agents, semantic nets, frames, reasoning types, planning problem, state-space search, POP, planning graphs, HTN, non-linear, temporal, re-planning, multi-agent, job-shop</td><td>Definition, diagram, example</td></tr>
          <tr><td>Medium</td><td>Conditional, reactive, knowledge-based planning, execution monitoring, continuous planning</td><td>Definition, comparison table, one example</td></tr>
        </tbody>
      </table>
      <div className="tip"><b>Scoring.</b> Write the definition first, then the diagram, then the steps, then one worked example. For logic and planning problems every line of the derivation carries marks, so show the substitution, the clause used or the operator applied.</div>
      <div className="tip"><b>Videos.</b> Most topic pages embed video lessons. Mahesh Huddar is the main source (Wumpus world, logic, chaining, unification, resolution, means-ends analysis); Neso Academy teaches the logic as discrete maths; a few other channels fill the semantic network, frame and planning pages, and each video shows its channel. Conditional, reactive, continuous and multi-agent planning, re-planning, job-shop scheduling and temporal logic have no lesson, and those pages say so.</div>
      <div className="tip"><b>AI tutor.</b> Open "Ask tutor" (top right). It reads the topic you are on, can quiz you, write fresh problems and mark your answer. Sign in with a free Puter account on first use.</div>
      <div className="pager">
        <a className="btn" href="#all" style={btnLink}>All notes on one page and PDF</a>
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
      <div className="meta"><span className="mod">CSD 3102 · CAT-2 · 28 October 2025 · 50 marks · 90 minutes</span></div>
      <h1>Last year’s paper with full answers</h1>
      <p>Every question from the paper, solved the way you should write it. Questions marked OR are alternatives: you answer one of each pair. The marks beside each answer show how the 8 or 16 marks are usually split.</p>
      <div className="tip"><b>What it tells you.</b> The paper tests: knowledge-based agents, forward and backward chaining, predicate logic, the Wumpus world, knowledge representation and semantic networks, the simple planning agent, means-ends analysis, partial-order planning, dynamic environments and job-shop scheduling, continuous planning and the vacuum world. These are the same topics ranked "very high" and "high" in the notes. Expect the same pattern with different questions.</div>
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
      <p>Every topic, worked example and 2/5/13-mark answer in one scroll, then last year’s paper. Use Ctrl+F to find anything.</p>
      <div className="row">
        <a className="btn pri" href={'./AI-CAT2-notes.pdf'} download="AI-CAT2-notes.pdf" style={btnLink}>Download PDF (offline)</a>
        <button className="btn" onClick={() => print()}>Print or save as PDF</button>
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
