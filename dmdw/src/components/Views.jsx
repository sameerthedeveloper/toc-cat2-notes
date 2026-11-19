import { useState } from 'react';
import { MODS } from '../data/content.js';
import { PAPER } from '../data/paper.js';
import { T } from '../lib.js';
import Html from './Html.jsx';
import { YT } from '../data/videos.js';
import { Bayes, NoVideo, Vids } from './widgets.jsx';

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
  ['Classification and prediction', 'm3-1'], ['Issues in classification', 'm3-2'], ['Decision trees', 'm3-3'], ['Bayesian classification', 'm3-4'], ['Rule-based classification', 'm3-5'],
  ['Backpropagation', 'm3-6'], ['Support vector machines', 'm3-7'], ['Associative classification', 'm3-8'], ['Lazy learners', 'm3-9'], ['Model evaluation', 'm3-10'], ['Accuracy and error measures', 'm3-11'],
  ['Cluster analysis', 'm4-1'], ['Types of data', 'm4-2'], ['Categories of methods', 'm4-3'], ['k-means', 'm4-4'], ['Hierarchical clustering', 'm4-5'],
  ['Density-based clustering', 'm4-6'], ['Grid-based clustering', 'm4-7'], ['Outlier analysis', 'm4-8'], ['Exam comparisons', 'cmp-1'],
];

export function Home() {
  const vh = T.filter((t) => t.pr === 'Very High');
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="meta"><span className="mod">CSD 3104 · CAT-2 · Modules III and IV</span></div>
          <h1>Data mining: classification and cluster analysis</h1>
          <p>{T.length} topics with definition, algorithm, worked numericals and 2-, 5-, 8- and 16-mark answers. Every calculation runs here: information gain and decision trees, naive Bayes, k-nearest neighbour, backpropagation, SVM, confusion-matrix measures, k-means, hierarchical clustering, DBSCAN and outlier tests.</p>
          <div className="row hero-cta">
            <a className="btn pri" href="#m3-3" style={btnLink}>Start with decision trees</a>
            <a className="btn" href="#m4-4" style={btnLink}>Start with k-means</a>
            <a className="btn" href="#paper" style={btnLink}>Last year’s paper</a>
          </div>
        </div>
        <figure className="hero-cave">
          <Bayes />
          <figcaption>Naive Bayes on the buys_computer table, running live. Change any attribute and the priors, the conditional probabilities and the winning class update. Every other calculator sits inside its topic.</figcaption>
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
          <tr><td>Very high</td><td>{vh.map((t, i) => <span key={t.id}>{i ? ', ' : ''}<a href={'#' + t.id}>{t.title}</a></span>)}</td><td>By hand: information gain and the tree, naive Bayes, k-means iterations, single-link merges, DBSCAN point types</td></tr>
          <tr><td>High</td><td>Classification and prediction, SVM, backpropagation, model evaluation, accuracy measures, cluster analysis, categories of methods, grid-based clustering, outlier analysis</td><td>Definition, algorithm steps, formulas, one example</td></tr>
          <tr><td>Important</td><td>Issues in classification, rule-based, associative classification, lazy learners, types of data</td><td>Definition and comparison tables</td></tr>
        </tbody>
      </table>
      <div className="tip"><b>Scoring.</b> For a numerical, write the formula, show each step, and state the result in a sentence. For a 16-mark theory answer give the idea, the algorithm, a diagram or example, then strengths and weaknesses.</div>
      <div className="tip"><b>Paper pattern.</b> October 2025 asked: supervised vs unsupervised, rule-based characteristics, prediction error measures, types of cluster data, outliers; then naive Bayes on a 5-row table, the confusion matrix, a decision tree for a healthcare table, hierarchical and grid-based clustering, outlier techniques; then kNN on height and weight, or SVM for review sentiment. Expect the same topics with different data.</div>
      <div className="tip"><b>Videos.</b> Every topic page opens with video lessons and so do most paper answers. Mahesh Huddar is the main source (solved examples for decision trees, naive Bayes, kNN, backpropagation, SVM, k-means, hierarchical clustering, DBSCAN, outliers); Trouble-Free covers the theory in syllabus order; a few Tamil lessons from 4G Silver Academy and other channels fill gaps, and each video shows its channel.</div>
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
      <div className="meta"><span className="mod">CSD 3104 · CAT-2 · 30 October 2025 · 50 marks · 90 minutes</span></div>
      <h1>Last year’s paper with full answers</h1>
      <p>Every question from the paper, solved the way you should write it. Questions marked OR are alternatives: you answer one of each pair. The marks beside each answer show how the 8 or 16 marks are usually split.</p>
      <div className="tip"><b>What it tells you.</b> Part A is short definitions from both modules. Part B is numerical-heavy: naive Bayes, a decision tree and the confusion matrix from Module III, hierarchical and grid-based clustering and outliers from Module IV. Part C is a classification problem (kNN or SVM). Practise the tables until the arithmetic is automatic.</div>
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
