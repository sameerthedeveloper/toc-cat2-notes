import { BlocksWorld, Chain, Diag, Gantt, Truth, Unify, Vids, Wumpus } from './widgets.jsx';

const RE = /<div data-w="([^"]+)"><\/div>/g;

function widget(key, k) {
  if (key.startsWith('diag:')) return <Diag key={k} name={key.slice(5)} />;
  if (key.startsWith('vids:')) return <Vids key={k} id={key.slice(5)} />;
  if (key === 'wumpus') return <Wumpus key={k} />;
  if (key === 'truth') return <Truth key={k} />;
  if (key === 'unify') return <Unify key={k} />;
  if (key === 'chain') return <Chain key={k} />;
  if (key === 'bw') return <BlocksWorld key={k} />;
  if (key === 'gantt') return <Gantt key={k} />;
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
