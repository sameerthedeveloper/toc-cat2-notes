/* Video lessons. Every ID was read from the channel's own pages or search and checked against
   YouTube oEmbed (title and channel). Mahesh Huddar is the primary source; Neso Academy teaches
   the logic topics as discrete maths; other channels fill topics the first two do not cover.
   Nothing found covers conditional/reactive/continuous/multi-agent planning, re-planning, execution
   monitoring, temporal logic or job-shop scheduling, so those pages say so. */
const MH = 'Mahesh Huddar';
const NESO = 'Neso Academy';
const DS = 'D Sumathi';
const VR = 'CS & IT Tutorials by Vrushali';
const SA = 'Sudhakar Atchala';
const CP = 'CSE concepts with Parinita';
const EE = 'Easy Engineering Classes';
const GS = 'Gate Smashers';

export const PL_PROP = ['Neso: Propositional Logic playlist', 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRjZU477sHY1rUFlNZO0_Q9x'];
export const PL_FOL = ['Neso: First Order Logic playlist', 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiX5hfcHZ6NjGBgnnaC1IFP'];
export const MH_LINK = ['Mahesh Huddar channel', 'https://www.youtube.com/@MaheshHuddar'];

/* id: [title, minutes, channel] */
export const V = {
  /* Mahesh Huddar */
  tFYngFwDuJQ: ['Represent facts and knowledge as well-formed formulas in predicate logic', '7', MH],
  bA7E_r6LM88: ['Represent statements as well-formed formulas in predicate logic', '7', MH],
  rOE9zkLgSt8: ['Syntax, semantics, model and logical entailment', '12', MH],
  ESfKzSBO6f4: ['Given a knowledge base, prove a statement using inference rules', '4', MH],
  xSy2nwae2no: ['Wumpus world example: PEAS description', '8', MH],
  HjuauhCsXBg: ['Wumpus world: path from [1,1] to the gold at [2,3]', '8', MH],
  DZXTVoSQzFo: ['Inference rules: modus ponens and modus tollens', '9', MH],
  u6AaNfsrMYg: ['Prove a statement using inference rules, propositional logic', '5', MH],
  PW9vadATxW8: ['Knowledge base proof by resolution refutation, propositional logic', '6', MH],
  'MbAsMEpJL-k': ['Unification in first-order logic', '8', MH],
  JEWtrRUa1g0: ['Unification in first-order logic: solved examples', '6', MH],
  Dt2pNoTIcMc: ['Proof by forward chaining, propositional logic', '4', MH],
  'OYqz-_YbWbU': ['Proof by backward chaining, propositional logic', '5', MH],
  rbtr4VnjA2c: ['Proof by forward chaining, first-order logic', '5', MH],
  '2UJV1nmjNGw': ['Backward chaining, first-order logic: solved example', '8', MH],
  'CbI-Q2a5rUU': ['Resolution to prove predicate facts, first-order logic', '6', MH],
  nEEyPdYxBFY: ['Proof by resolution in first-order logic, part 1', '9', MH],
  '7g6cB3kIHJI': ['Convert first-order logic to CNF and prove using a resolution tree', '9', MH],
  HahoNumgTCU: ['Means-ends analysis: solved example', '8', MH],
  ZBiHAUTYWVc: ['Well-defined problems and toy problems: vacuum world', '9', MH],
  te84Cbggl7g: ['Simple reflex agent and types of agents', '6', MH],

  /* Neso Academy */
  IZpvlR5J7FQ: ['Motivation and introduction to propositional logic', '8', NESO],
  Ib5njCwNMdk: ['Propositional variables and compound propositions', '6', NESO],
  '6kYngPvoGxU': ['Negation, conjunction and disjunction', '6', NESO],
  tACXuzfXzSI: ['Implication, part 1', '10', NESO],
  ehKd3KmIRSw: ['Biconditional operator', '6', NESO],
  '8octtUkdv4Y': ['Precedence of logical operators', '6', NESO],
  yo7aULLUz_0: ['Tautology, contradiction, contingency and satisfiability', '5', NESO],
  tDH67yRNXzI: ['Logical equivalences', '17', NESO],
  'SBBq-PUvh2c': ['Propositional logic, solved problem 1', '6', NESO],
  ARywou8HLQk: ['Introduction to first order logic', '5', NESO],
  '2GuRhc0ZzGc': ['The limitation of propositional logic', '5', NESO],
  UN6Hd4UlrnM: ['Quantifiers', '5', NESO],
  pPYkNkuo8nU: ['Universal quantifier', '4', NESO],
  OzLorUzIQ1U: ['Existential quantifier', '4', NESO],
  DYsSr7fk_4A: ['Negating quantified expressions, part 1', '4', NESO],
  'd87-HuxQaTY': ['Translating English sentences to logical expressions', '11', NESO],
  '1bpXqRL2dl8': ['First order logic, solved problems part 1', '5', NESO],
  akiBw21opuw: ['Rules of inference for quantified statements, part 1', '5', NESO],
  mywP1lqVkXs: ['Rules of inference for quantified statements, part 2', '3', NESO],
  '5TeDFX7whck': ['Universal modus ponens rule', '3', NESO],
  '4iKahGOKmhY': ['Rules of inference: basic terminology', '6', NESO],
  HcS4lqXxrV4: ['Rules of inference: definition and types', '8', NESO],
  '28lebQ60TCc': ['Building arguments with rules of inference, part 1', '6', NESO],
  z205Y7D40Lk: ['Rules of inference, solved problem 1', '3', NESO],
  SjEQNOV5FMk: ['The resolution principle: preliminaries', '5', NESO],
  TTImfNmhwsQ: ['The resolution principle: proof of the theorem', '4', NESO],
  ikpJqINGPX4: ['The resolution principle: proving an argument valid', '3', NESO],
  Bm05eNcIg1c: ['The resolution principle: solved problems', '7', NESO],

  /* other channels, only where Mahesh Huddar and Neso have no lesson */
  '9iN3O_oL2ac': ['Knowledge representation and reasoning: logic, semantic nets, frames, rules', '8', GS],
  '03cZx-YW7XI': ['Semantic networks with examples', '10', SA],
  '1jyLrS6U3hA': ['Semantic networks: components and examples', '6', EE],
  '5iHBv_74Ces': ['Frames for knowledge representation', '10', EE],
  JVclXaq00Pk: ['Monotonic vs non-monotonic reasoning', '7', EE],
  TK7ORfbT5UI: ['Planning introduction', '2', DS],
  '1TgUb_FEeew': ['The planning problem', '8', DS],
  '9UKAkyNpgDE': ['STRIPS: the Stanford Research Institute Problem Solver', '10', DS],
  '_xQ0Jt-kbjo': ['Forward and backward state-space search', '12', DS],
  CfxqP8JRa2c: ['Goal stack planning: blocks world problem', '17', CP],
  'k-Owb2x7-3M': ['Goal stack planning: step-by-step example', '9', VR],
  _7KvRcRB_Y4: ['Goal stack planning: pickup, putdown, stack, unstack', '13', SA],
  '-f6-ycJG_jk': ['Means-ends analysis: algorithm', '7', SA],
  '-rYpkxm3J3A': ['Partial-order planning (POP)', '8', DS],
  BaVxTkfindg: ['Partial-order planning: change a flat tire', '6', DS],
  JGrU9Bcf4wA: ['Planning graphs', '13', DS],
  '7YIFEs-42hA': ['Hierarchical planning: step-by-step example', '7', VR],
  S6WmE5gW1Zw: ['Nonlinear planning using constraint posting', '7', VR],
};

const NOTE_OTHER = 'Mahesh Huddar and Neso Academy have no lesson on this topic, so these come from other channels.';

export const YT = {
  'm3-1': { pl: [MH_LINK], v: ['tFYngFwDuJQ', 'rOE9zkLgSt8', '9iN3O_oL2ac'], note: 'The Gate Smashers lecture covers the techniques (logic, semantic nets, frames, rules) in one sitting.' },
  'm3-2': { pl: [MH_LINK], v: ['rOE9zkLgSt8', 'ESfKzSBO6f4'] },
  'm3-3': { pl: [MH_LINK], v: ['xSy2nwae2no', 'HjuauhCsXBg'], note: 'The second video walks the same route as the worked walkthrough below: [1,1] to the gold at [2,3].' },
  'm3-4': { pl: [MH_LINK, PL_PROP], v: ['rOE9zkLgSt8', 'DZXTVoSQzFo', 'u6AaNfsrMYg', 'IZpvlR5J7FQ', 'Ib5njCwNMdk', '6kYngPvoGxU', 'tACXuzfXzSI', 'ehKd3KmIRSw', '8octtUkdv4Y', 'yo7aULLUz_0', 'tDH67yRNXzI', 'SBBq-PUvh2c'] },
  'm3-5': { pl: [MH_LINK, PL_FOL], v: ['tFYngFwDuJQ', 'bA7E_r6LM88', 'ARywou8HLQk', '2GuRhc0ZzGc', 'UN6Hd4UlrnM', 'pPYkNkuo8nU', 'OzLorUzIQ1U', 'DYsSr7fk_4A', 'd87-HuxQaTY', '1bpXqRL2dl8'] },
  'm3-6': { pl: [MH_LINK, PL_FOL], v: ['MbAsMEpJL-k', 'JEWtrRUa1g0', 'akiBw21opuw', 'mywP1lqVkXs', '5TeDFX7whck'], note: 'The Neso lessons at the end cover the quantified inference rules that lifting builds on.' },
  'm3-7': { pl: [MH_LINK], v: ['Dt2pNoTIcMc', 'OYqz-_YbWbU', 'rbtr4VnjA2c', '2UJV1nmjNGw'] },
  'm3-8': { pl: [], v: ['03cZx-YW7XI', '1jyLrS6U3hA'], note: NOTE_OTHER },
  'm3-9': { pl: [], v: ['5iHBv_74Ces'], note: NOTE_OTHER },
  'm3-10': { pl: [MH_LINK, PL_PROP, PL_FOL], v: ['DZXTVoSQzFo', 'u6AaNfsrMYg', 'PW9vadATxW8', 'CbI-Q2a5rUU', 'nEEyPdYxBFY', '7g6cB3kIHJI', '4iKahGOKmhY', 'HcS4lqXxrV4', '28lebQ60TCc', 'z205Y7D40Lk', 'akiBw21opuw', 'SjEQNOV5FMk', 'TTImfNmhwsQ', 'ikpJqINGPX4', 'Bm05eNcIg1c'] },
  'm3-11': { pl: [], v: ['JVclXaq00Pk'], note: 'This covers monotonic and non-monotonic reasoning only. Deductive, inductive and abductive reasoning are in the notes above.' },
  'm4-1': { pl: [], v: ['TK7ORfbT5UI', '1TgUb_FEeew', '9UKAkyNpgDE'], note: NOTE_OTHER },
  'm4-3': { pl: [], v: ['_xQ0Jt-kbjo'], note: NOTE_OTHER },
  'm4-4': { pl: [], v: ['CfxqP8JRa2c'], note: NOTE_OTHER },
  'm4-5': { pl: [], v: ['CfxqP8JRa2c', 'k-Owb2x7-3M', '_7KvRcRB_Y4'], note: NOTE_OTHER },
  'm4-6': { pl: [MH_LINK], v: ['HahoNumgTCU', '-f6-ycJG_jk'] },
  'm4-7': { pl: [], v: ['-rYpkxm3J3A', 'BaVxTkfindg'], note: NOTE_OTHER },
  'm4-8': { pl: [], v: ['JGrU9Bcf4wA'], note: NOTE_OTHER },
  'm4-9': { pl: [], v: ['7YIFEs-42hA'], note: NOTE_OTHER },
  'm4-10': { pl: [], v: ['S6WmE5gW1Zw'], note: NOTE_OTHER },
  /* paper answers */
  'q-6a': { pl: [MH_LINK], v: ['xSy2nwae2no', 'HjuauhCsXBg'] },
  'q-8b': { pl: [MH_LINK], v: ['ZBiHAUTYWVc', 'te84Cbggl7g'] },
};
