import { useCallback, useEffect, useRef, useState } from 'react';
import { SYS } from '../data/sys.js';
import { T, esc, renderAI, tex } from '../lib.js';

const INTRO = 'Ask about any CAT-2 topic. The tutor sees the topic you have open. First use asks you to sign in to a free Puter account (the model cost is covered by your Puter account, no API key needed).';
const puterOK = () => typeof puter !== 'undefined' && puter.ai;
let mid = 0;

export const QUICK = {
  'Explain simply': ['Explain this topic simply from first principles, then give the exam-ready definition and the 3 most common mistakes.', 'Explain this topic simply'],
  '5 practice questions': ['Give me 5 practice questions on this topic (mix of 2, 5 and 13 marks). Questions only, no answers. I will reply with my answers.', '5 practice questions'],
  'Fresh solved problem': ['Make a NEW numerical or construction problem on this topic (different from the notes) and solve it fully, every step shown, written as a 13-mark answer with mark split.', 'Fresh solved problem'],
  '13-mark answer': ['Write a model 13-mark university answer for the most likely long question on this topic, with a mark split.', '13-mark answer'],
  'Quick revision': ['Give a one-screen revision sheet for this topic: definitions, formulas/procedures, one worked mini example, exam traps.', 'Quick revision'],
};

/** Tutor state + Puter.js calls. `cur` is the open route id, used as context for the model. */
export function useTutor(cur) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ id: ++mid, cls: 'sys', html: esc(INTRO) }]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('');
  const [acct, setAcct] = useState({ label: 'Sign in with Puter', signedIn: false });
  const hist = useRef([]);
  const curRef = useRef(cur);
  curRef.current = cur;

  const add = (cls, html) => {
    const id = ++mid;
    setMsgs((m) => [...m, { id, cls, html }]);
    return id;
  };
  const patch = (id, p) => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const refreshAcct = useCallback(async () => {
    if (!puterOK()) return setAcct({ label: 'Puter offline', signedIn: false });
    try {
      if (puter.auth.isSignedIn()) {
        const u = await puter.auth.getUser();
        setAcct({ label: u.username + ' · sign out', signedIn: true });
      } else setAcct({ label: 'Sign in with Puter', signedIn: false });
    } catch {
      setAcct({ label: 'Sign in with Puter', signedIn: false });
    }
  }, []);
  useEffect(() => {
    refreshAcct();
  }, [refreshAcct]);

  const ctxText = () => {
    const t = T.find((x) => x.id === curRef.current);
    return t ? `Topic open: ${t.title}.\nNotes:\n${t.text.slice(0, 5500)}` : 'The student is on the home page.';
  };

  const acctClick = async () => {
    if (!puterOK()) {
      add('sys', esc('Puter.js did not load. Open this site in a normal browser tab with internet access (not a sandboxed preview).'));
      setOpen(true);
      return;
    }
    try {
      if (acct.signedIn) await puter.auth.signOut();
      else await puter.auth.signIn();
    } catch {
      add('sys', esc('Sign-in cancelled or blocked. Allow pop-ups for this page and try again.'));
    }
    refreshAcct();
  };

  const ask = async (text, show) => {
    if (busy || !text.trim()) return;
    setOpen(true);
    add('u', esc(tex(show || text)));
    if (!puterOK()) {
      add('sys', esc('Puter.js is not available here. Open the site in a normal browser tab (or host it) with internet access, then sign in with your Puter account.'));
      return;
    }
    setBusy(true);
    const outId = add('a', '<span class="mini">thinking…</span>');
    const msgsToSend = [{ role: 'system', content: SYS + '\n\n' + ctxText() }, ...hist.current.slice(-8), { role: 'user', content: tex(text) }];
    const opt = model ? { model, stream: true } : { stream: true };
    let acc = '';
    try {
      const r = await puter.ai.chat(msgsToSend, opt);
      if (r && typeof r[Symbol.asyncIterator] === 'function') {
        for await (const p of r) {
          if (p && p.text) {
            acc += p.text;
            patch(outId, { html: renderAI(acc) });
          }
        }
      } else {
        const c = r?.message?.content;
        acc = typeof c === 'string' ? c : Array.isArray(c) ? c.map((x) => x.text || '').join('') : String(r);
        patch(outId, { html: renderAI(acc) });
      }
      hist.current.push({ role: 'user', content: text }, { role: 'assistant', content: acc });
    } catch (e) {
      const m = (e && (e.message || e.error?.message || JSON.stringify(e))) || 'unknown error';
      patch(outId, { cls: 'sys', html: esc('AI request failed: ' + m + '. Sign in with Puter, or pick "Default model" and retry.') });
    }
    setBusy(false);
    refreshAcct();
  };

  const practice = (q) => {
    setOpen(true);
    setInput(`Question: ${q}\n\nMy answer:\n`);
    add('sys', esc('Write your answer below the question, then Send. The tutor will mark it against a university scheme and list missing steps.'));
  };
  const clear = () => {
    hist.current = [];
    setMsgs([{ id: ++mid, cls: 'sys', html: 'Chat cleared.' }]);
  };
  const send = () => {
    const v = input;
    setInput('');
    ask(v);
  };

  return { open, setOpen, msgs, busy, input, setInput, model, setModel, acct, acctClick, ask, practice, clear, send };
}

export default function Tutor({ tutor }) {
  const { open, setOpen, msgs, busy, input, setInput, model, setModel, ask, clear, send } = tutor;
  const log = useRef(null);
  const ta = useRef(null);
  useEffect(() => {
    if (log.current) log.current.scrollTop = 1e9;
  }, [msgs]);
  useEffect(() => {
    if (open && input.startsWith('Question: ') && ta.current) {
      ta.current.focus();
      ta.current.setSelectionRange(input.length, input.length);
    }
    // only when a practice prompt is injected
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, input.startsWith('Question: ') && input.length < 600 ? input.slice(0, 12) : '']);

  return (
    <section className={'ai' + (open ? ' open' : '')} aria-label="AI tutor">
      <header>
        <b>AI tutor</b>
        <button className="btn sm acct-in" type="button" onClick={tutor.acctClick}>{tutor.acct.label}</button>
        <button className="btn sm" type="button" onClick={clear}>Clear</button>
        <button className="btn sm" type="button" aria-label="Close tutor" onClick={() => setOpen(false)}>Close</button>
      </header>
      <div className="qk">
        {Object.entries(QUICK).map(([label, [prompt, shown]]) => (
          <button key={label} type="button" onClick={() => ask(prompt, shown)}>{label}</button>
        ))}
      </div>
      <div className="log" ref={log} aria-live="polite">
        {msgs.map((m) => <div key={m.id} className={'msg ' + m.cls} dangerouslySetInnerHTML={{ __html: m.html }} />)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea
          ref={ta}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } }}
          placeholder="Ask a doubt, or paste your answer to be marked. Ctrl+Enter sends."
          aria-label="Message"
        />
        <div className="opts">
          <select value={model} onChange={(e) => setModel(e.target.value)} aria-label="Model">
            <option value="">Default model</option>
            <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
            <option value="gpt-5-nano">GPT-5 nano</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
          </select>
          <span style={{ flex: 1 }} />
          <button className="btn pri" type="submit" disabled={busy}>Send</button>
        </div>
      </form>
    </section>
  );
}
