import { Vids, Stepper, PlGame, Amb, Pda, Tm, Tree } from './widgets.jsx';
import { STEPS } from '../data/content.js';

const RE = /<div data-w="([^"]+)"><\/div>/g;

function widget(key, k) {
  if (key.startsWith('vids:')) return <Vids key={k} id={key.slice(5)} />;
  if (key.startsWith('steps:')) return <Stepper key={k} steps={STEPS[key.slice(6)]} />;
  if (key.startsWith('tree:')) return <Tree key={k} name={key.slice(5)} />;
  if (key === 'plgame') return <PlGame key={k} />;
  if (key === 'pda') return <Pda key={k} />;
  if (key === 'tm') return <Tm key={k} />;
  if (key === 'ambig') return <Amb key={k} />;
  return null;
}

/** Renders authored HTML and swaps each <div data-w="..."> placeholder for its React widget. */
export default function Html({ html }) {
  const out = [];
  let last = 0;
  let m;
  RE.lastIndex = 0;
  while ((m = RE.exec(html))) {
    if (m.index > last) out.push(<div key={'h' + last} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html.slice(last, m.index) }} />);
    out.push(widget(m[1], 'w' + m.index));
    last = m.index + m[0].length;
  }
  if (last < html.length) out.push(<div key={'h' + last} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html.slice(last) }} />);
  return <>{out}</>;
}
