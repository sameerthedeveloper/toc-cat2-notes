import { useEffect, useRef, useState } from 'react';
import { MODS } from './data/content.js';
import { T, store } from './lib.js';
import CourseSwitch from './components/CourseSwitch.jsx';
import Visits from './components/Visits.jsx';
import Tutor, { useTutor } from './components/Tutor.jsx';
import { AllView, Home, Topic } from './components/Views.jsx';

const routeOf = () => {
  const id = (location.hash || '#home').slice(1);
  return id === 'all' || T.some((t) => t.id === id) ? id : 'home';
};

export default function App() {
  const [cur, setCur] = useState(routeOf);
  const [done, setDone] = useState(() => new Set(store.get('dmdw-done', [])));
  const [theme, setTheme] = useState(() => store.get('dmdw-theme', 'day'));
  const [query, setQuery] = useState('');
  const [railOpen, setRailOpen] = useState(false);
  const search = useRef(null);
  const tutor = useTutor(cur);
  const topic = T.find((t) => t.id === cur);

  /* hash routing; #q-… links open and scroll to a paper answer without changing the view */
  useEffect(() => {
    const onHash = () => {
      const id = (location.hash || '').slice(1);
      if (id.startsWith('q-')) {
        const el = document.getElementById(id);
        if (el) {
          el.open = true;
          el.scrollIntoView({ block: 'start' });
          return;
        }
      }
      setCur(routeOf());
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    store.set('dmdw-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = (topic ? topic.title + ' · ' : '') + 'DMDW CAT-2 notes';
    setRailOpen(false);
    scrollTo(0, 0);
  }, [cur, topic]);

  /* keys: j next, k previous, / search */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches('input,textarea,select')) return;
      const i = T.findIndex((t) => t.id === cur);
      if (e.key === 'j' && T[i + 1]) location.hash = '#' + T[i + 1].id;
      if (e.key === 'k' && T[i - 1]) location.hash = '#' + T[i - 1].id;
      if (e.key === '/') {
        e.preventDefault();
        search.current?.focus();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [cur]);

  const toggleDone = (id) => {
    const next = new Set(done);
    next.has(id) ? next.delete(id) : next.add(id);
    setDone(next);
    store.set('dmdw-done', [...next]);
  };

  const f = query.trim().toLowerCase();
  const crumb = cur === 'all' ? 'All notes, one page' : topic ? `${MODS[topic.mod]}  /  ${topic.title}` : 'CSD 3104 CAT-2 notes';
  const pct = Math.round((done.size / T.length) * 100);
  const sections = Object.keys(MODS)
    .map((m) => [m, T.filter((t) => t.mod === m && (!f || (t.title + ' ' + t.tags + ' ' + t.text).toLowerCase().includes(f)))])
    .filter(([, items]) => items.length);

  return (
    <>
      <a className="skip" href="#view">Skip to content</a>
      <div className="shell">
        <aside className={'rail' + (railOpen ? ' open' : '')} aria-label="Topics">
          <div className="brand" role="link" tabIndex={0} onClick={() => (location.hash = '#home')} onKeyDown={(e) => e.key === 'Enter' && (location.hash = '#home')}>
            DMDW CAT-2<small>CSD 3104 · Modules III and IV</small>
          </div>
          <div className="prog"><div className="bar"><i style={{ width: pct + '%' }} /></div><span>{done.size} of {T.length} topics done</span></div>
          <input ref={search} type="search" placeholder="Search topics and notes" aria-label="Search notes" value={query} onChange={(e) => setQuery(e.target.value)} />
          <nav className="nav">
            <h4>Revision</h4>
            <a href="#all" aria-current={cur === 'all' ? 'page' : undefined}><span className="ck sq" /><span>All notes, one page</span></a>
            {sections.map(([m, items]) => (
              <div key={m} style={{ display: 'contents' }}>
                <h4>{MODS[m]}</h4>
                {items.map((t) => (
                  <a key={t.id} href={'#' + t.id} className={done.has(t.id) ? 'done' : ''} aria-current={cur === t.id ? 'page' : undefined}>
                    <span className="ck" /><span>{t.title}</span>
                    {t.pr === 'Very High' && <span className="vh" title="Very high priority" />}
                  </a>
                ))}
              </div>
            ))}
            {!sections.length && <p className="hint">No topic matches. Try another word.</p>}
          </nav>
          <p className="hint">Red dot = very high priority. Keys: j next, k previous, / search.</p>
        </aside>
        <div className={'scrim' + (railOpen ? ' on' : '')} onClick={() => setRailOpen(false)} />
        <main>
          <div className="top">
            <button className="btn" id="menu" aria-label="Open topics" onClick={() => setRailOpen(true)}>Topics</button>
            <div className="crumb">{crumb}</div>
            <CourseSwitch current="dmdw" />
            <button className="btn sm" onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}>{theme === 'night' ? 'Day paper' : 'Night paper'}</button>
            <button className="btn sm acct-top" onClick={tutor.acctClick}>{tutor.acct.label}</button>
            <button className="btn pri" onClick={() => tutor.setOpen(!tutor.open)}>Ask tutor</button>
          </div>
          <article className="sheet" id="view" key={cur}>
            {cur === 'all' ? <AllView /> : topic ? <Topic t={topic} done={done} onToggleDone={toggleDone} onPractice={tutor.practice} /> : <Home />}
          </article>
          <footer className="foot"><Visits site="dmdw" /></footer>
        </main>
      </div>
      <Tutor tutor={tutor} />
    </>
  );
}
