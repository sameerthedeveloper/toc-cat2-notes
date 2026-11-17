import { useEffect, useState } from 'react';

/* Counts people, not page loads, on the free Abacus service (https://abacus.jasoncameron.dev).
   A browser is counted once, the first time it opens the site (remembered in localStorage);
   every later visit only reads the number. Only the site name is sent, nothing about the person.
   The service can be slow or down, so the last number seen is shown at once and nothing breaks if a request fails. */
const NS = 'sameerthedeveloper-cat2-notes';
const cache = {};

const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } };

async function ask(action, site) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(`https://abacus.jasoncameron.dev/${action}/${NS}/people-${site}`, { signal: ctl.signal });
    const j = r.ok ? await r.json() : null;
    return j && typeof j.value === 'number' ? j.value : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function load(site) {
  if (!cache[site]) {
    cache[site] = (async () => {
      const counted = read('person-' + site);
      const v = await ask(counted ? 'get' : 'hit', site);
      if (v != null && !counted) write('person-' + site, '1');
      return v;
    })();
  }
  return cache[site];
}

export default function Visits({ site, className = 'visits' }) {
  const [n, setN] = useState(() => { const c = read('people-last-' + site); return c ? Number(c) : null; });
  useEffect(() => {
    let live = true;
    load(site).then((v) => {
      if (v == null) return;
      write('people-last-' + site, String(v));
      if (live) setN(v);
    });
    return () => { live = false; };
  }, [site]);
  if (n == null) return null;
  return <p className={className} title="Each browser is counted once">People who have used this site: <b>{n.toLocaleString('en-IN')}</b></p>;
}
