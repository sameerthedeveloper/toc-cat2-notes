import { useState } from 'react';
import { MODS } from '../data/content.js';
import { T } from '../lib.js';
import Html from './Html.jsx';
import { Overhead } from './widgets.jsx';

const btnLink = { textDecoration: 'none' };
const MOD_NAME = (m) => MODS[m].split(' · ')[1];
const MOD_NUM = (m) => MODS[m].split(' · ')[0];

const Prio = ({ t }) => <span className={'prio' + (t.pr === 'Very High' ? ' vh' : '')}>{t.pr === 'Very High' ? 'Very high priority' : t.pr + ' priority'}</span>;
const Tag = ({ t }) => <span className={'tag' + (t.pr === 'Very High' ? ' vh' : '')}>{t.pr}</span>;
const Meta = ({ t }) => (
  <div className="meta"><span className="mod">{MOD_NUM(t.mod)}: {MOD_NAME(t.mod)}</span><Prio t={t} /></div>
);

const SEQ = [
  ['CPU virtualization', 'm4-1'], ['VM CPU options', 'm4-2'], ['CPU tuning', 'm4-3'], ['Choosing multiple CPUs', 'm4-4'], ['Hyper-Threading', 'm4-5'],
  ['Memory virtualization', 'm4-6'], ['VM memory options', 'm4-7'], ['Memory tuning', 'm4-8'], ['Memory overhead', 'm4-9'], ['Memory optimizations', 'm4-10'],
  ['Storage virtualization', 'm5-1'], ['VM storage options', 'm5-2'], ['Storage tuning', 'm5-3'], ['Network virtualization', 'm5-4'], ['VM network options', 'm5-5'],
  ['Network tuning', 'm5-6'], ['Deploying applications', 'm5-7'], ['Secure virtual networks', 'm5-8'], ['Securing the hypervisor', 'm5-9'], ['Exam comparisons', 'cmp-1'],
];

export function Home() {
  const vh = T.filter((t) => t.pr === 'Very High');
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="meta"><span className="mod">Virtualization Technology · Modules IV and V</span></div>
          <h1>Virtualization: CPU, memory, storage and networks for a VM</h1>
          <p>{T.length} topics from your study material, with definitions, comparison tables, diagrams and the 2-, 5- and 13-mark practice questions with their model answers. VMware, Hyper-V and KVM terms side by side. Calculators for memory overhead, CPU shares, vCPU ratios, thin provisioning and storage latency.</p>
          <div className="row hero-cta">
            <a className="btn pri" href="#m4-1" style={btnLink}>Start with CPU virtualization</a>
            <a className="btn" href="#m4-9" style={btnLink}>Memory overhead problems</a>
          </div>
        </div>
        <figure className="hero-cave">
          <Overhead />
          <figcaption>The memory overhead problems from Module IV, running live. Change the VMs, vCPUs, RAM or host size and every step updates. The formula is the teaching model from your notes, not a VMware formula.</figcaption>
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
          <tr><td>Very high</td><td>{vh.map((t, i) => <span key={t.id}>{i ? ', ' : ''}<a href={'#' + t.id}>{t.title}</a></span>)}</td><td>The material's 13-mark questions fall here: write Definition, Techniques, Configuration, Tuning, Conclusion</td></tr>
          <tr><td>High</td><td>VM CPU, memory and storage options, tuning practices, choosing multiple CPUs, Hyper-Threading, VM network options, deploying applications</td><td>Option lists, tuning bullets, one example</td></tr>
        </tbody>
      </table>
      <div className="tip"><b>About the priorities.</b> The study material does not rank topics. "Very high" marks the topics that carry a 13-mark practice question there, and "High" the rest. The material says its questions are probable practice questions, not real previous-year questions.</div>
      <div className="tip"><b>Numbers to remember.</b> Shares per vCPU: Low 500, Normal 1000, High 2000. Memory shares per MB: Low 5, Normal 10, High 20. CPU Ready above about 5% per vCPU deserves a look. VHD 2 TB, VHDX 64 TB. GAVG = DAVG + KAVG, warning above roughly 20 to 30 ms. Hyper-V Dynamic Memory buffer defaults to 20%.</div>
      <div className="tip"><b>AI tutor.</b> Open "Ask tutor" (top right). It reads the topic you are on, can quiz you, write fresh overhead and shares problems and mark your answer. Sign in with a free Puter account on first use.</div>
      <div className="pager">
        <a className="btn pri" href="#all" style={btnLink}>All notes on one page</a>
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
            <Html html={q.a.startsWith('<') ? q.a : '<p>' + q.a + '</p>'} />
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

export function AllView() {
  return (
    <>
      <h1>All notes, one page</h1>
      <p>Every topic, comparison and practice answer in one scroll. Use Ctrl+F to find anything.</p>
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
          <Html html={t.body} />
          <h2>Exam questions</h2>
          {t.qa.map((q, j) => (
            <details key={j} className="qa" open>
              <summary><span className="mk">{q.m} marks</span><span>{q.q}</span></summary>
              <div className="ans"><Html html={q.a.startsWith('<') ? q.a : '<p>' + q.a + '</p>'} /></div>
            </details>
          ))}
          <hr className="rule" />
        </section>
      ))}
    </>
  );
}
