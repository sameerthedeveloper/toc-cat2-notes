const MODS={m3:'Module III · Knowledge and reasoning',m4:'Module IV · Planning'};
const Q=(m,q,a)=>({m,q,a});
const T3=[
{id:'m3-1',mod:'m3',title:'Knowledge representation',pr:'High',tags:'knowledge representation kr types properties techniques',
body:`
<div class="def"><b>Definition.</b> Knowledge representation (KR) is the study of how to encode facts, rules and relationships about the world in a form that a computer can store, reason with and use to decide what to do.</div>
<h2>Purpose</h2>
<p>An intelligent agent needs more than raw data. It must store what it knows, derive new facts, and act on them. KR gives a formal language for the knowledge and a way to reason over it.</p>
<h2>Types of knowledge</h2>
<table><tr><th>Type</th><th>Meaning</th><th>Example</th></tr>
<tr><td>Declarative</td><td>Facts, what is true</td><td>Delhi is the capital of India</td></tr>
<tr><td>Procedural</td><td>How to do something</td><td>Steps to solve a quadratic equation</td></tr>
<tr><td>Meta-knowledge</td><td>Knowledge about knowledge</td><td>Which rule is more reliable</td></tr>
<tr><td>Heuristic</td><td>Rules of thumb from experience</td><td>Check the fuel first when a car will not start</td></tr>
<tr><td>Structural</td><td>Relations between concepts</td><td>A dog is a mammal and has four legs</td></tr></table>
<h2>Properties of a good representation</h2>
<ul><li><b>Representational adequacy:</b> can express all the knowledge needed.</li><li><b>Inferential adequacy:</b> can derive new knowledge from old.</li><li><b>Inferential efficiency:</b> can direct inference toward promising paths.</li><li><b>Acquisitional efficiency:</b> new knowledge is easy to add.</li></ul>
<h2>Techniques</h2>
<table><tr><th>Technique</th><th>Idea</th><th>Strength</th></tr>
<tr><td>Logical (propositional, predicate)</td><td>Sentences with formal semantics</td><td>Precise, sound inference</td></tr>
<tr><td>Semantic networks</td><td>Graph of concepts and links</td><td>Visual, inheritance</td></tr>
<tr><td>Frames</td><td>Structured records with slots</td><td>Defaults, grouped knowledge</td></tr>
<tr><td>Production rules</td><td>IF condition THEN action</td><td>Modular, easy to explain</td></tr></table>
<h2>Issues</h2>
<p>Choosing the level of detail, representing uncertainty and defaults, the frame problem, and keeping the knowledge base consistent as it grows.</p>
<div class="tip"><b>Exam tip.</b> A 5-mark answer needs: definition, types of knowledge, four properties of a good scheme, and the four techniques with one line each.</div>`,
qa:[
Q(2,`Define knowledge representation.`,`Encoding knowledge about the world in a formal form so that a program can store it, reason with it and derive new knowledge.`),
Q(2,`Differentiate declarative and procedural knowledge.`,`Declarative knowledge states facts (what is true), for example "Paris is in France". Procedural knowledge describes how to perform a task, for example the steps of an algorithm.`),
Q(5,`List and explain the properties of a good knowledge representation scheme.`,`<p><b>Representational adequacy:</b> can represent all kinds of knowledge in the domain.<br><b>Inferential adequacy:</b> can manipulate structures to produce new knowledge.<br><b>Inferential efficiency:</b> can add heuristic guidance so inference is fast.<br><b>Acquisitional efficiency:</b> new knowledge can be added easily, ideally automatically.</p>`),
Q(13,`Explain the different techniques of knowledge representation with examples. Compare them.`,`<p><b>1. Logical representation (3 marks).</b> Knowledge as sentences of a logic. Propositional: P → Q. Predicate: ∀x Man(x) → Mortal(x). Sound inference, but can be verbose.</p><p><b>2. Semantic networks (3).</b> Nodes are concepts, labelled arcs are relations: Tweety –instance→ Canary –isa→ Bird. Easy inheritance, no quantifiers.</p><p><b>3. Frames (3).</b> Frame Bird: slots legs = 2, can_fly = true (default). Children inherit and override defaults.</p><p><b>4. Production rules (3).</b> IF temperature &gt; 38 AND cough THEN suspect flu. Used in expert systems with forward or backward chaining.</p><p><b>5. Comparison (1).</b> Logic is the most precise, networks and frames are the most readable, rules are the most modular.</p>`)
]},

{id:'m3-2',mod:'m3',title:'Knowledge-based agents',pr:'High',tags:'knowledge based agent kb tell ask inference engine architecture',
body:`
<div class="def"><b>Definition.</b> A knowledge-based agent keeps an explicit knowledge base (KB), a set of sentences in a formal language, and uses an inference engine to decide what to do. It is told what it perceives and asked what to do.</div>
<h2>Architecture</h2>
<div class="wg" data-w="diag:kbagent"></div>
<ul><li><b>Knowledge base:</b> domain-specific content.</li><li><b>Inference engine:</b> domain-independent reasoning that derives new sentences.</li><li><b>TELL(KB, s):</b> add a sentence. <b>ASK(KB, q):</b> query what follows from the KB.</li></ul>
<h2>Generic agent program</h2>
<pre><code>function KB-AGENT(percept) returns an action
  static: KB, t = 0
  TELL(KB, MAKE-PERCEPT-SENTENCE(percept, t))
  action ← ASK(KB, MAKE-ACTION-QUERY(t))
  TELL(KB, MAKE-ACTION-SENTENCE(action, t))
  t ← t + 1
  return action</code></pre>
<h2>Three levels of description</h2>
<table><tr><th>Level</th><th>Question answered</th></tr><tr><td>Knowledge level</td><td>What does the agent know and what are its goals?</td></tr><tr><td>Logical level</td><td>In which logic is the knowledge written?</td></tr><tr><td>Implementation level</td><td>What data structures and algorithms are used?</td></tr></table>
<h2>Declarative vs procedural</h2>
<p>A knowledge-based agent is built declaratively: tell it what it needs to know, and it derives the rest. This makes it flexible, since changing the KB changes behaviour without rewriting code.</p>
<h2>Advantages and limits</h2>
<p>Advantages: modular, reusable inference engine, easy to extend, can explain conclusions. Limits: inference can be slow, knowledge acquisition is hard, and logic handles uncertainty poorly.</p>`,
qa:[
Q(2,`What are TELL and ASK?`,`TELL adds a new sentence (such as a percept) to the knowledge base. ASK queries the KB and returns what follows from it, for example the best action.`),
Q(2,`Name the components of a knowledge-based agent.`,`A knowledge base (stored sentences) and an inference engine (derives new sentences), connected to sensors and actuators.`),
Q(5,`Explain the architecture and working of a knowledge-based agent.`,`<p>The agent receives a percept, converts it to a sentence, and TELLs the KB. It then ASKs the KB which action is best. The inference engine derives the answer from the KB. The chosen action is TELLed back to the KB and executed, and the time step t increases. Pseudocode: TELL percept, ASK action, TELL action, t = t + 1. The KB is domain specific while the inference engine is general.</p>`),
Q(13,`Describe a knowledge-based agent: architecture, the generic algorithm, the three levels of description, and its advantages and limitations.`,`<p><b>Architecture (3).</b> Diagram: Environment → percept → inference engine ↔ KB (TELL/ASK) → action.</p><p><b>Algorithm (4).</b> MAKE-PERCEPT-SENTENCE, TELL, ASK with MAKE-ACTION-QUERY, TELL the action, increment t, return action.</p><p><b>Levels (3).</b> Knowledge level (what it knows, goals), logical level (the formal language), implementation level (data structures).</p><p><b>Advantages (2).</b> Modular, declarative, easily updated, explainable.</p><p><b>Limitations (1).</b> Slow inference, hard knowledge acquisition, weak with uncertainty.</p>`)
]},

{id:'m3-3',mod:'m3',title:'Wumpus world',pr:'Very High',tags:'wumpus world peas percept pit gold agent logic grid',
body:`
<div class="def"><b>Wumpus world.</b> A 4×4 cave of rooms. A monster (the wumpus) sits in one room, some rooms hold bottomless pits, and one room holds gold. The agent starts at [1,1], must find the gold and climb out alive. It is the standard testbed for knowledge-based agents.</div>
<h2>PEAS description</h2>
<table><tr><th>Part</th><th>Wumpus world</th></tr>
<tr><td>Performance</td><td>+1000 for climbing out with gold, −1000 for death, −1 for each action, −10 for using the arrow</td></tr>
<tr><td>Environment</td><td>4×4 grid, agent starts at [1,1] facing right; wumpus, gold and pits placed at random (not at start)</td></tr>
<tr><td>Actuators</td><td>Forward, TurnLeft, TurnRight, Grab, Shoot (one arrow), Climb</td></tr>
<tr><td>Sensors</td><td>Stench, Breeze, Glitter, Bump, Scream</td></tr></table>
<h2>Percepts</h2>
<ul><li><b>Stench:</b> in the wumpus room and the rooms directly adjacent to it.</li><li><b>Breeze:</b> in rooms directly adjacent to a pit.</li><li><b>Glitter:</b> in the room with the gold.</li><li><b>Bump:</b> the agent walks into a wall.</li><li><b>Scream:</b> the wumpus is killed.</li></ul>
<p>A percept is a 5-tuple [Stench, Breeze, Glitter, Bump, Scream], for example [None, Breeze, None, None, None].</p>
<h2>Environment properties</h2>
<p>Discrete, static, sequential, single agent, <b>partially observable</b> (the agent cannot see the whole cave) and deterministic.</p>
<h2>Play it: logical inference on the grid</h2>
<p>Click an adjacent room to move. The agent records percepts and derives which rooms are safe, using the rules below. Turn on "Reveal world" to check.</p>
<div data-w="wumpus"></div>
<h2>Logic of the world</h2>
<p>For every square [x,y] the KB contains:</p>
<pre><code>B[x,y] ⇔ P[x+1,y] ∨ P[x−1,y] ∨ P[x,y+1] ∨ P[x,y−1]      (breeze iff a neighbour has a pit)
S[x,y] ⇔ W[x+1,y] ∨ W[x−1,y] ∨ W[x,y+1] ∨ W[x,y−1]      (stench iff a neighbour has the wumpus)
¬P[1,1], ¬W[1,1]                                          (start is safe)
exactly one wumpus: W[1,1] ∨ W[1,2] ∨ … ∨ W[4,4], and ¬W[a] ∨ ¬W[b] for all a ≠ b</code></pre>
<p><b>Safe room:</b> OK[x,y] ⇔ ¬P[x,y] ∧ ¬W[x,y].</p>
<h2>Worked walkthrough (the grid above)</h2>
<table><tr><th>Step</th><th>At</th><th>Percept</th><th>Deduction</th></tr>
<tr><td>1</td><td>[1,1]</td><td>None</td><td>¬B[1,1] ⇒ no pit at [1,2], [2,1]. ¬S[1,1] ⇒ no wumpus there. Both are safe.</td></tr>
<tr><td>2</td><td>[2,1]</td><td>Breeze</td><td>A pit is at [2,2] or [3,1]. Not safe to go on. Return to [1,1].</td></tr>
<tr><td>3</td><td>[1,2]</td><td>Stench</td><td>Wumpus at [1,3] or [2,2]. ¬S[2,1] earlier ⇒ [2,2] has no wumpus. So the wumpus is at [1,3]. ¬B[1,2] ⇒ no pit at [2,2], so the pit is at [3,1].</td></tr>
<tr><td>4</td><td>[2,2]</td><td>None</td><td>[2,3] and [3,2] are safe.</td></tr>
<tr><td>5</td><td>[2,3]</td><td>Glitter, Breeze, Stench</td><td>Grab the gold, then return along safe rooms and Climb.</td></tr></table>
<div class="tip"><b>Key idea.</b> Absence of a percept is as useful as a percept. "No breeze here" proves all four neighbours are pit-free.</div>
<h2>Limits</h2>
<p>Propositional logic needs one rule per square (very many sentences), and cannot say "a stench means a wumpus nearby" in a single rule. First-order logic is more compact. Logic also cannot decide between two equally uncertain rooms; probability is needed.</p>`,
qa:[
Q(2,`What percepts does the agent receive in the wumpus world?`,`A 5-tuple [Stench, Breeze, Glitter, Bump, Scream]: stench near the wumpus, breeze near pits, glitter at gold, bump on hitting a wall, scream when the wumpus dies.`),
Q(2,`Give the PEAS description of the wumpus world (performance measure).`,`+1000 for climbing out with the gold, −1000 for falling in a pit or being eaten, −1 per action, −10 for using the arrow.`),
Q(5,`State the properties of the wumpus world environment and write the logical rule for a breeze.`,`<p>The environment is discrete, static, sequential, single-agent, deterministic and partially observable. Breeze rule: B[x,y] ⇔ P[x+1,y] ∨ P[x−1,y] ∨ P[x,y+1] ∨ P[x,y−1], so a square has a breeze exactly when a neighbouring square has a pit.</p>`),
Q(13,`Explain the wumpus world with PEAS, percepts, and show how a logical agent reaches the gold. Draw a sample grid.`,`<p><b>PEAS (3).</b> Performance +1000 gold, −1000 death, −1 per move, −10 arrow. Environment 4×4 cave. Actuators Forward, Turn, Grab, Shoot, Climb. Sensors Stench, Breeze, Glitter, Bump, Scream.</p><p><b>Grid (2).</b> Draw a 4×4 grid with A at [1,1], wumpus [1,3], pits [3,1] [3,3] [4,4], gold [2,3].</p><p><b>Rules (2).</b> B ⇔ pit in a neighbour; S ⇔ wumpus in a neighbour; start is safe.</p><p><b>Reasoning (5).</b> [1,1] no percept ⇒ [1,2], [2,1] safe. At [2,1] a breeze ⇒ pit at [2,2] or [3,1]. Back to [1,1], then [1,2]: stench ⇒ wumpus at [1,3] (since [2,2] cannot hold it); no breeze ⇒ [2,2] pit-free, so pit at [3,1]. Move to [2,2] (none) ⇒ [2,3], [3,2] safe. At [2,3] glitter: Grab, return by safe squares, Climb.</p><p><b>Conclusion (1).</b> Logic gives certain conclusions from percepts, but the agent can be stuck when no square is provably safe.</p>`)
]},

{id:'m3-4',mod:'m3',title:'Propositional logic',pr:'Very High',tags:'propositional logic truth table tautology entailment connectives cnf resolution',
body:`
<div class="def"><b>Propositional logic.</b> A logic whose basic units are propositions, statements that are either true or false, combined with logical connectives. It is the simplest logic for a knowledge base.</div>
<h2>Syntax</h2>
<p>Atoms: P, Q, R. Sentences: an atom; ¬S; S₁ ∧ S₂; S₁ ∨ S₂; S₁ → S₂; S₁ ↔ S₂. Precedence from highest: ¬, ∧, ∨, →, ↔.</p>
<h2>Connectives</h2>
<table><tr><th>P</th><th>Q</th><th>¬P</th><th>P ∧ Q</th><th>P ∨ Q</th><th>P → Q</th><th>P ↔ Q</th></tr>
<tr><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td></tr>
<tr><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td></tr>
<tr><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>F</td></tr>
<tr><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td></tr></table>
<p>P → Q is false only when P is true and Q is false.</p>
<h2>Key terms</h2>
<ul><li><b>Model:</b> an assignment of true/false to every symbol.</li><li><b>Valid (tautology):</b> true in all models.</li><li><b>Satisfiable:</b> true in at least one model. <b>Unsatisfiable (contradiction):</b> true in none.</li><li><b>Entailment KB ⊨ α:</b> α is true in every model in which KB is true.</li></ul>
<h2>Equivalences</h2>
<table><tr><th>Law</th><th>Equivalence</th></tr>
<tr><td>De Morgan</td><td>¬(P ∧ Q) ≡ ¬P ∨ ¬Q ; ¬(P ∨ Q) ≡ ¬P ∧ ¬Q</td></tr>
<tr><td>Implication elimination</td><td>P → Q ≡ ¬P ∨ Q</td></tr>
<tr><td>Contrapositive</td><td>P → Q ≡ ¬Q → ¬P</td></tr>
<tr><td>Biconditional elimination</td><td>P ↔ Q ≡ (P → Q) ∧ (Q → P)</td></tr>
<tr><td>Double negation</td><td>¬¬P ≡ P</td></tr>
<tr><td>Distributivity</td><td>P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R) ; P ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R)</td></tr></table>
<h2>Truth-table tool</h2>
<p>Type a formula with <code>~</code> (not), <code>&amp;</code> (and), <code>|</code> (or), <code>-&gt;</code> (implies), <code>&lt;-&gt;</code> (iff). It builds the full table and classifies the formula. The second box tests entailment KB ⊨ α.</p>
<div data-w="truth"></div>
<h2>Worked problem</h2>
<div class="ex"><b>Show that ((P → Q) ∧ (Q → R)) → (P → R) is valid.</b>
<table><tr><th>P</th><th>Q</th><th>R</th><th>P→Q</th><th>Q→R</th><th>(P→Q)∧(Q→R)</th><th>P→R</th><th>whole</th></tr>
<tr><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr>
<tr><td>T</td><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td></tr>
<tr><td>T</td><td>F</td><td>T</td><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td></tr>
<tr><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td></tr>
<tr><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr>
<tr><td>F</td><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td></tr>
<tr><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr>
<tr><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr></table>
Every row is true, so the formula is a tautology (hypothetical syllogism).</div>
<h2>Normal forms</h2>
<p><b>CNF:</b> conjunction of clauses (disjunctions of literals). Conversion: eliminate ↔ and →, move ¬ inward (De Morgan), distribute ∨ over ∧. Example: P → Q ∧ R becomes (¬P ∨ Q) ∧ (¬P ∨ R).</p>
<h2>Advantages and limitations</h2>
<p>Simple, declarative, decidable by truth tables (2ⁿ rows). It cannot express objects and relations: "all squares next to a pit have a breeze" needs one sentence per square. That is why predicate logic is needed.</p>`,
qa:[
Q(2,`Define tautology and contradiction.`,`A tautology is a formula true in every model (for example P ∨ ¬P). A contradiction is false in every model (for example P ∧ ¬P).`),
Q(2,`When is P → Q false?`,`Only when P is true and Q is false. In every other case it is true.`),
Q(5,`Using a truth table, prove De Morgan's law ¬(P ∧ Q) ≡ ¬P ∨ ¬Q.`,`<p>Rows (P,Q): TT: P∧Q = T, ¬(P∧Q) = F; ¬P∨¬Q = F∨F = F. TF: P∧Q = F, ¬(P∧Q) = T; ¬P∨¬Q = F∨T = T. FT: F, so T; T∨F = T. FF: F, so T; T∨T = T. The two columns are identical in all four rows, so the formulas are equivalent. ∎</p>`),
Q(5,`Convert (P ↔ Q) to CNF.`,`<p>P ↔ Q ≡ (P → Q) ∧ (Q → P) ≡ (¬P ∨ Q) ∧ (¬Q ∨ P). This is in CNF with two clauses.</p>`),
Q(13,`Explain propositional logic: syntax, semantics, equivalences and entailment. Show by truth table that KB = {P → Q, P} entails Q. Mention its limitations.`,`<p><b>Syntax (2).</b> Atoms, ¬, ∧, ∨, →, ↔ with precedence ¬ ∧ ∨ → ↔.</p><p><b>Semantics (3).</b> A model assigns T/F to symbols; connectives follow the truth table. Valid, satisfiable, unsatisfiable defined by models.</p><p><b>Equivalences (2).</b> De Morgan, P → Q ≡ ¬P ∨ Q, contrapositive, double negation, distribution.</p><p><b>Entailment (4).</b> Table (P,Q): TT: P→Q = T, P = T, so KB true, Q = T. TF: P→Q = F, KB false. FT: P = F, KB false. FF: P = F, KB false. The only model of the KB is TT, and Q is true there, so KB ⊨ Q (modus ponens).</p><p><b>Limitations (2).</b> No objects or quantifiers; sentences multiply with the size of the world; 2ⁿ model checking is exponential.</p>`)
]},

{id:'m3-5',mod:'m3',title:'Predicate (first-order) logic',pr:'Very High',tags:'predicate logic first order quantifier forall exists translate',
body:`
<div class="def"><b>First-order (predicate) logic.</b> A logic that adds objects, relations, functions and quantifiers to propositional logic, so that it can say things about all or some objects.</div>
<h2>Syntax</h2>
<table><tr><th>Element</th><th>Meaning</th><th>Example</th></tr>
<tr><td>Constants</td><td>Names of objects</td><td>John, Delhi</td></tr>
<tr><td>Variables</td><td>Stand for any object</td><td>x, y</td></tr>
<tr><td>Predicates</td><td>Relations, true or false</td><td>Brother(John, Richard)</td></tr>
<tr><td>Functions</td><td>Map objects to objects</td><td>LeftLegOf(John)</td></tr>
<tr><td>Connectives</td><td>As in propositional logic</td><td>∧ ∨ ¬ → ↔</td></tr>
<tr><td>Quantifiers</td><td>Universal and existential</td><td>∀x, ∃x</td></tr>
<tr><td>Equality</td><td>Same object</td><td>Father(John) = Henry</td></tr></table>
<h2>Quantifiers</h2>
<ul><li><b>∀x P(x)</b>: P holds for every object. Natural connective: <b>→</b>.</li><li><b>∃x P(x)</b>: P holds for at least one object. Natural connective: <b>∧</b>.</li></ul>
<div class="warn"><b>Two classic mistakes.</b> ∀x Student(x) ∧ Smart(x) says everything is a smart student (too strong). ∃x Student(x) → Smart(x) is true if anything is not a student (too weak). Use ∀ with → and ∃ with ∧.</div>
<h2>Properties</h2>
<ul><li><b>Duality:</b> ¬∀x P ≡ ∃x ¬P ; ¬∃x P ≡ ∀x ¬P ; ∀x P ≡ ¬∃x ¬P.</li><li><b>Order matters</b> for mixed quantifiers: ∀x∃y Loves(x,y) means everybody loves someone; ∃y∀x Loves(x,y) means someone is loved by everybody.</li><li>Same-type quantifiers can swap: ∀x∀y ≡ ∀y∀x.</li></ul>
<h2>Translating English</h2>
<table><tr><th>English</th><th>Predicate logic</th></tr>
<tr><td>All men are mortal.</td><td>∀x Man(x) → Mortal(x)</td></tr>
<tr><td>Some students are intelligent.</td><td>∃x Student(x) ∧ Intelligent(x)</td></tr>
<tr><td>No student fails.</td><td>∀x Student(x) → ¬Fails(x)</td></tr>
<tr><td>Every student loves some teacher.</td><td>∀x (Student(x) → ∃y (Teacher(y) ∧ Loves(x,y)))</td></tr>
<tr><td>Not all birds can fly.</td><td>¬∀x (Bird(x) → Fly(x)) ≡ ∃x (Bird(x) ∧ ¬Fly(x))</td></tr>
<tr><td>Brothers are siblings.</td><td>∀x∀y Brother(x,y) → Sibling(x,y)</td></tr>
<tr><td>Everyone who studies passes.</td><td>∀x Studies(x) → Passes(x)</td></tr>
<tr><td>There is a king who is greedy.</td><td>∃x King(x) ∧ Greedy(x)</td></tr></table>
<h2>Propositional vs predicate logic</h2>
<table><tr><th></th><th>Propositional</th><th>Predicate</th></tr><tr><td>Expresses</td><td>Facts only</td><td>Objects, relations, functions</td></tr><tr><td>Quantifiers</td><td>None</td><td>∀ and ∃</td></tr><tr><td>Power</td><td>Limited</td><td>Much greater</td></tr><tr><td>Decidable</td><td>Yes</td><td>Semi-decidable</td></tr></table>
<h2>Wumpus rule in first-order logic</h2>
<p>∀x,y Breezy(x,y) ⇔ ∃a,b Adjacent([x,y],[a,b]) ∧ Pit([a,b]). One sentence replaces 16 propositional ones.</p>`,
qa:[
Q(2,`Write in predicate logic: "All men are mortal."`,`∀x Man(x) → Mortal(x).`),
Q(2,`Why is ∃x Student(x) → Smart(x) a wrong translation of "Some student is smart"?`,`The implication is true whenever some object is not a student (the premise is false), so it holds even if no student is smart. The correct form is ∃x Student(x) ∧ Smart(x).`),
Q(5,`Represent in first-order logic: (a) Every student loves some teacher. (b) Not all birds can fly. (c) Everyone loves someone. Explain the effect of quantifier order.`,`<p>(a) ∀x (Student(x) → ∃y (Teacher(y) ∧ Loves(x,y))).<br>(b) ¬∀x (Bird(x) → Fly(x)) ≡ ∃x (Bird(x) ∧ ¬Fly(x)).<br>(c) ∀x ∃y Loves(x,y).<br>Order: ∃y ∀x Loves(x,y) says one person is loved by everyone, which is much stronger than (c), so mixed quantifiers cannot be swapped.</p>`),
Q(13,`Explain first-order logic with syntax, semantics of quantifiers and examples. Compare it with propositional logic.`,`<p><b>Syntax (3).</b> Constants, variables, predicates, functions, connectives, quantifiers, equality. Term and atomic sentence defined.</p><p><b>Quantifiers (4).</b> ∀ is a conjunction over all objects, ∃ a disjunction. Use ∀ with → and ∃ with ∧. Duality laws. Order of mixed quantifiers.</p><p><b>Examples (3).</b> Three translations from the table: all men mortal, some students intelligent, every student loves some teacher.</p><p><b>Comparison (3).</b> Propositional logic has only facts and needs one sentence per object; first-order logic has objects, relations and quantifiers, so one rule covers all squares of the wumpus world.</p>`)
]},

{id:'m3-6',mod:'m3',title:'Unification and lifting',pr:'Very High',tags:'unification lifting mgu substitution occurs check generalized modus ponens',
body:`
<div class="def"><b>Unification.</b> Finding a substitution θ that makes two logical expressions identical: UNIFY(p, q) = θ where SUBST(θ, p) = SUBST(θ, q). The <b>most general unifier (MGU)</b> is the unifier that commits to the fewest bindings; every other unifier is an instance of it.</div>
<h2>Purpose</h2>
<p>Inference in first-order logic must match a rule's premises against facts that have different variables or constants. Unification does that matching automatically.</p>
<h2>Rules</h2>
<ul><li>Constants and function symbols must be identical (same name, same number of arguments).</li><li>A variable can be bound to any term (constant, variable, function term).</li><li><b>Occurs check:</b> a variable cannot be bound to a term that contains it (x with F(x) fails).</li><li><b>Standardize apart:</b> rename variables so two sentences share none. Knows(John,x) and Knows(x,Elizabeth) fail only because both use x; renaming the second to Knows(z,Elizabeth) gives {z/John, x/Elizabeth}.</li></ul>
<h2>Algorithm (Robinson)</h2>
<pre><code>UNIFY(x, y, θ)
  if θ = failure          return failure
  if x = y                return θ
  if VARIABLE(x)          return UNIFY-VAR(x, y, θ)
  if VARIABLE(y)          return UNIFY-VAR(y, x, θ)
  if COMPOUND(x) and COMPOUND(y)
      return UNIFY(args(x), args(y), UNIFY(op(x), op(y), θ))
  else return failure

UNIFY-VAR(v, t, θ)
  if v/val in θ           return UNIFY(val, t, θ)
  if t is a variable bound in θ  return UNIFY(v, binding, θ)
  if OCCURS-CHECK(v, t)   return failure
  return θ ∪ {v/t}</code></pre>
<h2>Try it</h2>
<p>Variables start with a lowercase letter. Constants, functions and predicates start with a capital.</p>
<div data-w="unify"></div>
<h2>Worked problems</h2>
<table><tr><th>Expression 1</th><th>Expression 2</th><th>Result</th></tr>
<tr><td>P(x, F(y))</td><td>P(A, F(B))</td><td>{x/A, y/B}</td></tr>
<tr><td>Knows(John, x)</td><td>Knows(y, Mother(y))</td><td>{y/John, x/Mother(John)}</td></tr>
<tr><td>Knows(John, x)</td><td>Knows(x, Elizabeth)</td><td>Fails (same variable x). After renaming: {z/John, x/Elizabeth}</td></tr>
<tr><td>P(x, x)</td><td>P(F(y), y)</td><td>Fails: x/F(y) then y must equal F(y), occurs check</td></tr>
<tr><td>P(A, y, F(y))</td><td>P(z, z, u)</td><td>{z/A, y/A, u/F(A)}</td></tr>
<tr><td>P(F(x), G(A, y))</td><td>P(F(G(u, v)), G(u, B))</td><td>{x/G(A, v), u/A, y/B}</td></tr>
<tr><td>P(x)</td><td>Q(x)</td><td>Fails: different predicates</td></tr></table>
<div class="ex"><b>Step-by-step: UNIFY(P(x, F(y)), P(A, F(B))).</b> Same predicate P, so unify the arguments in order. (1) x with A: x is a variable, bind x/A. (2) F(y) with F(B): same function F, unify arguments: y with B, bind y/B. Result θ = {x/A, y/B}. Check: both become P(A, F(B)).</div>
<h2>Lifting</h2>
<div class="def"><b>Lifted inference</b> applies inference rules directly to sentences with variables, using unification, instead of first replacing the variables with every possible constant (propositionalization).</div>
<p><b>Generalized Modus Ponens:</b> given atomic sentences p₁′, …, pₙ′ and a rule (p₁ ∧ … ∧ pₙ → q), if UNIFY(pᵢ′, pᵢ) = θ for all i, then infer SUBST(θ, q).</p>
<div class="ex">King(John), Greedy(John), ∀x King(x) ∧ Greedy(x) → Evil(x). Unify King(John) with King(x): θ = {x/John}. Both premises match, so infer Evil(John). No need to generate Evil(Richard), Evil(Father(John)) and so on.</div>
<p><b>Why lift:</b> propositionalization produces infinitely many ground sentences when function symbols exist, and most are irrelevant. Lifting uses only the bindings that matter.</p>`,
qa:[
Q(2,`Define the most general unifier.`,`The unifier that makes two expressions identical while imposing the fewest restrictions on the variables. Every other unifier is an instance of the MGU.`),
Q(2,`What is the occurs check?`,`A test that rejects binding a variable to a term that contains that variable, for example x/F(x), which would create an infinite term.`),
Q(5,`Unify P(x, F(y), B) with P(A, F(G(z)), u). Show the steps.`,`<p>Same predicate P, three argument pairs.<br>1. x with A: bind x/A.<br>2. F(y) with F(G(z)): same function, so y with G(z): y does not occur in G(z), bind y/G(z).<br>3. B with u: u is a variable, bind u/B.<br>MGU = {x/A, y/G(z), u/B}. Both expressions become P(A, F(G(z)), B). ∎</p>`),
Q(5,`Explain Generalized Modus Ponens with an example. How does it differ from propositional Modus Ponens?`,`<p>GMP: from p₁′…pₙ′ and (p₁ ∧ … ∧ pₙ → q) with a substitution θ such that SUBST(θ, pᵢ′) = SUBST(θ, pᵢ), infer SUBST(θ, q). Example: King(John), Greedy(John), ∀x King(x) ∧ Greedy(x) → Evil(x). θ = {x/John} gives Evil(John). Propositional modus ponens needs identical sentences, so it requires the rule to be instantiated for every object first; GMP lifts the rule using unification.</p>`),
Q(13,`Explain the unification algorithm. Unify (i) P(f(x), g(A, y)) and P(f(g(u, v)), g(u, B)) and (ii) P(x, x) and P(f(y), y). Explain lifting.`,`<p><b>Algorithm (3).</b> UNIFY and UNIFY-VAR as above: handle equal terms, variables, compound terms argument by argument, occurs check.</p><p><b>(i) (4).</b> P matches. f(x) with f(g(u,v)): x with g(u,v), bind x/g(u,v). g(A,y) with g(u,B): A with u, bind u/A; y with B, bind y/B. Apply u/A to x: x/g(A,v). MGU = {x/g(A,v), u/A, y/B}.</p><p><b>(ii) (3).</b> x with f(y): bind x/f(y). Then x with y becomes f(y) with y: y occurs in f(y), occurs check fails. No unifier.</p><p><b>Lifting (3).</b> Applying rules to first-order sentences directly using unification (Generalized Modus Ponens) rather than propositionalizing; avoids infinitely many ground instances.</p>`)
]},

{id:'m3-7',mod:'m3',title:'Rule-based knowledge representation',pr:'High',tags:'rule based production system expert system conflict resolution working memory',
body:`
<div class="def"><b>Rule-based (production) system.</b> Knowledge is stored as IF-THEN rules. The system matches rules against a working memory of facts and fires rules to add or change facts.</div>
<h2>Components</h2>
<div class="wg"><table><tr><th>Component</th><th>Role</th></tr>
<tr><td>Rule base (production memory)</td><td>IF condition THEN action rules</td></tr>
<tr><td>Working memory</td><td>Current facts</td></tr>
<tr><td>Inference engine</td><td>Match, choose, fire</td></tr>
<tr><td>Conflict resolution</td><td>Pick one rule when several match</td></tr>
<tr><td>Explanation, interface</td><td>Show why a conclusion was reached</td></tr></table></div>
<h2>Recognize-act cycle</h2>
<ol><li><b>Match:</b> find all rules whose conditions are true in working memory (the conflict set).</li><li><b>Select:</b> choose one by conflict resolution.</li><li><b>Act:</b> fire it; update working memory.</li><li>Repeat until no rule matches or the goal is reached.</li></ol>
<h2>Conflict resolution strategies</h2>
<ul><li><b>Specificity:</b> prefer the rule with the most conditions.</li><li><b>Recency:</b> prefer rules using the newest facts.</li><li><b>Priority/ordering:</b> fixed rule order.</li><li><b>Refractoriness:</b> do not fire the same rule on the same data twice.</li></ul>
<h2>Example: identifying an animal</h2>
<pre><code>R1: IF has(hair) THEN mammal
R2: IF mammal AND eats(meat) THEN carnivore
R3: IF carnivore AND has(tawny colour) AND has(black stripes) THEN tiger
Facts: has(hair), eats(meat), has(tawny colour), has(black stripes)
Forward: R1 gives mammal, R2 gives carnivore, R3 gives tiger.</code></pre>
<h2>Chaining directions</h2>
<p><b>Forward chaining</b> starts from facts and fires rules (data-driven). <b>Backward chaining</b> starts from a goal and looks for rules that conclude it (goal-driven). Try both below.</p>
<div data-w="chain"></div>
<h2>Advantages and limitations</h2>
<table><tr><th>Advantages</th><th>Limitations</th></tr><tr><td>Modular, easy to add rules; natural to read; can explain reasoning; used in expert systems (MYCIN, XCON)</td><td>Large rule bases are slow and hard to maintain; rule interactions are unclear; no learning; brittle outside its domain</td></tr></table>`,
qa:[
Q(2,`What is a production rule?`,`A rule of the form IF condition THEN action (or conclusion). When the condition matches working memory, the rule can fire.`),
Q(2,`What is conflict resolution?`,`Choosing one rule to fire when several rules match at once. Common strategies are specificity, recency, priority and refractoriness.`),
Q(5,`Explain the structure and working of a rule-based system.`,`<p>Structure: rule base, working memory, inference engine (with conflict resolution), explanation facility. Working: the engine repeatedly matches rule conditions against working memory, builds the conflict set, selects one rule by a strategy, fires it (adding or deleting facts) and repeats until the goal is found or no rule matches. Example: IF has(hair) THEN mammal.</p>`),
Q(13,`Explain rule-based knowledge representation. Describe forward and backward chaining with an example, and list advantages and limitations.`,`<p><b>Representation (3).</b> IF-THEN rules, working memory, inference engine, recognize-act cycle.</p><p><b>Forward chaining (3).</b> Data-driven. Facts A, B; rules A∧B→L, B∧L→M, L∧M→P, P→Q. Fire A∧B→L, then B∧L→M, then L∧M→P, then P→Q: Q derived.</p><p><b>Backward chaining (3).</b> Goal-driven. To prove Q find P→Q, subgoal P, then L∧M, then L from A∧B, M from B∧L, all facts true: Q proved.</p><p><b>Conflict resolution (1).</b> Specificity, recency, priority.</p><p><b>Advantages (1), limitations (2).</b> Modular, explainable; slow and brittle with large bases.</p>`)
]},

{id:'m3-8',mod:'m3',title:'Semantic networks',pr:'High',tags:'semantic network isa inheritance graph nodes arcs',
body:`
<div class="def"><b>Semantic network.</b> A graph in which nodes represent concepts or objects and labelled directed arcs represent relations between them. It represents structured knowledge in a way that is easy to see.</div>
<h2>Key links</h2>
<ul><li><b>isa / AKO (a kind of):</b> a class is a subclass of another (Bird isa Animal).</li><li><b>instance:</b> an object is a member of a class (Tweety instance Canary).</li><li><b>property links:</b> has, can, colour, part-of.</li></ul>
<h2>Example network</h2>
<div class="wg" data-w="diag:semnet"></div>
<h2>Inheritance</h2>
<p>Properties flow down isa and instance links. Tweety can fly because Tweety → Canary → Bird, and Bird can fly. Tweety has skin because Bird isa Animal and Animal has skin. Query answering is graph traversal: follow links upward until a value is found.</p>
<p><b>Exceptions:</b> store the exception lower in the hierarchy. Penguin isa Bird, but Penguin cannot fly overrides the Bird default, and the lowest value found wins.</p>
<h2>Advantages and limitations</h2>
<table><tr><th>Advantages</th><th>Limitations</th></tr><tr><td>Natural and visual; efficient inheritance; easy to extend; groups related facts</td><td>No standard semantics for links; cannot express negation, disjunction or quantifiers well; large networks become tangled; exceptions need care</td></tr></table>
<p><b>Conversion to logic:</b> Tweety instance Canary ⇒ Canary(Tweety); Canary isa Bird ⇒ ∀x Canary(x) → Bird(x).</p>
<div class="tip"><b>Exam.</b> Always draw the network. Label every arc (isa, instance, has, can). Marks are given for the diagram and for explaining one inheritance query.</div>`,
qa:[
Q(2,`What is a semantic network?`,`A graph representation of knowledge: nodes are concepts or objects, labelled arcs (isa, instance, has) are relations between them.`),
Q(2,`How does inheritance work in a semantic network?`,`An object or subclass inherits properties of its ancestors by following isa and instance links upward, until the property is found. A more specific value overrides a general one.`),
Q(5,`Represent the following in a semantic network and answer: "Does Tweety have skin?" Tweety is a canary. A canary is a bird. A bird is an animal. Animals have skin. Birds can fly.`,`<p>Nodes: Tweety, Canary, Bird, Animal, Skin, Fly. Arcs: Tweety –instance→ Canary; Canary –isa→ Bird; Bird –isa→ Animal; Animal –has→ Skin; Bird –can→ Fly. Query: start at Tweety, climb instance, isa and isa to Animal, where "has Skin" is stored. So yes, Tweety has skin by inheritance. Tweety also can fly (from Bird).</p>`),
Q(13,`Explain semantic networks with a diagram, inheritance, advantages and limitations. Show how a semantic network is converted to predicate logic.`,`<p><b>Definition and links (3).</b> Nodes, arcs, isa, instance, property links.</p><p><b>Diagram (3).</b> Animal ← Bird ← Canary ← Tweety, with Animal –has→ Skin, Bird –can→ Fly, Mammal ← Dog ← Rex.</p><p><b>Inheritance (3).</b> Traverse upward; exceptions override defaults (Penguin cannot fly).</p><p><b>Logic conversion (2).</b> Instance: Canary(Tweety). Isa: ∀x Canary(x) → Bird(x). Property: ∀x Bird(x) → CanFly(x).</p><p><b>Advantages (1), limitations (1).</b> Visual, efficient inheritance; no negation or quantifiers, informal semantics.</p>`)
]},

{id:'m3-9',mod:'m3',title:'Frame systems',pr:'High',tags:'frames slots facets default inheritance minsky',
body:`
<div class="def"><b>Frame.</b> A data structure (introduced by Minsky, 1975) that represents a stereotyped object or situation as a set of <b>slots</b> (attributes) with values, defaults, and attached procedures. Related frames form a hierarchy with inheritance.</div>
<h2>Structure of a frame</h2>
<table><tr><th>Part</th><th>Meaning</th></tr>
<tr><td>Frame name</td><td>The object or class</td></tr>
<tr><td>Slot</td><td>An attribute (age, colour)</td></tr>
<tr><td>Facet</td><td>Information about a slot: <b>value</b>, <b>default</b>, <b>range</b>, <b>if-needed</b> (compute when asked), <b>if-added</b> (trigger when set), <b>if-removed</b></td></tr>
<tr><td>Link</td><td>isa (class) and instance-of (member)</td></tr></table>
<h2>Example: a frame hierarchy</h2>
<table><tr><th>Frame</th><th>Slots</th></tr>
<tr><td><b>Bird</b> (isa Animal)</td><td>legs: 2 · covering: feathers · can_fly: true (default)</td></tr>
<tr><td><b>Penguin</b> (isa Bird)</td><td>can_fly: false · lives_in: Antarctica</td></tr>
<tr><td><b>Tweety</b> (instance of Canary, isa Bird)</td><td>colour: yellow · age: if-needed [current year − birth year]</td></tr></table>
<p>Query: Tweety.legs finds nothing in Tweety, goes to Canary, then Bird: 2. Query: Penguin.can_fly finds false locally, so the default in Bird is overridden.</p>
<h2>Student frame</h2>
<pre><code>Frame: Student
  isa: Person
  name:        [value: ___]
  department:  [value: CSE]
  semester:    [range: 1-8]
  cgpa:        [if-needed: compute from marks]
  status:      [default: active, if-added: notify office]</code></pre>
<h2>Frames vs semantic networks vs logic</h2>
<table><tr><th></th><th>Semantic network</th><th>Frames</th><th>Logic</th></tr>
<tr><td>Form</td><td>Graph</td><td>Structured record</td><td>Sentences</td></tr>
<tr><td>Defaults</td><td>Awkward</td><td>Built in</td><td>Needs non-monotonic logic</td></tr>
<tr><td>Procedures</td><td>No</td><td>Yes (demons)</td><td>No</td></tr>
<tr><td>Semantics</td><td>Informal</td><td>Informal</td><td>Formal</td></tr></table>
<h2>Advantages and limitations</h2>
<p>Advantages: organizes knowledge naturally, supports defaults, inheritance and procedures. Limitations: no formal semantics, hard to represent negation and relations among several frames, exceptions can make inheritance ambiguous.</p>`,
qa:[
Q(2,`What is a frame?`,`A structure with a name and slots (attributes), each with values or defaults and optional attached procedures, arranged in an isa hierarchy so slots can be inherited.`),
Q(2,`Name the facets of a slot.`,`Value, default, range, if-needed, if-added and if-removed.`),
Q(5,`Explain the frame representation with an example showing default values and inheritance.`,`<p>Frame Bird: legs = 2, can_fly = true (default). Frame Penguin isa Bird: can_fly = false. Frame Tweety instance-of Bird: colour = yellow. Query Tweety.can_fly: not in Tweety, found in Bird, so true. Query Penguin.can_fly: found false in Penguin, overriding the default. Attached procedures (if-needed, if-added) compute or trigger on slot access.</p>`),
Q(13,`Explain frame systems: structure, facets, inheritance with an example hierarchy, and compare frames with semantic networks.`,`<p><b>Structure (3).</b> Frame name, slots, facets (value, default, range, if-needed, if-added), isa and instance links.</p><p><b>Example (4).</b> Animal → Bird (legs 2, can_fly true) → Penguin (can_fly false) and Canary → Tweety (colour yellow). Show a query and an override.</p><p><b>Inheritance (2).</b> Slots flow down; local values override defaults.</p><p><b>Comparison (3).</b> Frames group all attributes in one record with defaults and procedures; semantic networks are graphs with links as first-class items; both lack formal semantics.</p><p><b>Limits (1).</b> Negation, multiple inheritance conflicts.</p>`)
]},

{id:'m3-10',mod:'m3',title:'Inference',pr:'Very High',tags:'inference entailment modus ponens resolution forward chaining backward chaining sound complete cnf',
body:`
<div class="def"><b>Inference.</b> The process of deriving new sentences from the sentences in the KB. If an algorithm derives α from KB, we write KB ⊢ α. A good algorithm is <b>sound</b> (derives only entailed sentences) and <b>complete</b> (derives every entailed sentence).</div>
<h2>Inference rules</h2>
<table><tr><th>Rule</th><th>Form</th><th>Example</th></tr>
<tr><td>Modus Ponens</td><td>P, P → Q ⊢ Q</td><td>Rain, Rain → Wet ⊢ Wet</td></tr>
<tr><td>Modus Tollens</td><td>P → Q, ¬Q ⊢ ¬P</td><td>Rain → Wet, ¬Wet ⊢ ¬Rain</td></tr>
<tr><td>And-elimination</td><td>P ∧ Q ⊢ P</td><td></td></tr>
<tr><td>And-introduction</td><td>P, Q ⊢ P ∧ Q</td><td></td></tr>
<tr><td>Hypothetical syllogism</td><td>P → Q, Q → R ⊢ P → R</td><td></td></tr>
<tr><td>Universal instantiation</td><td>∀x P(x) ⊢ P(A)</td><td>All men mortal ⊢ Socrates mortal if man</td></tr>
<tr><td>Resolution</td><td>A ∨ B, ¬B ∨ C ⊢ A ∨ C</td><td></td></tr></table>
<h2>Forward chaining (data-driven)</h2>
<p>Start with known facts; fire every rule whose premises are all known; add its conclusion; repeat until the goal is derived or nothing new appears. Complete for Horn clauses and runs in linear time (propositional).</p>
<h2>Backward chaining (goal-driven)</h2>
<p>Start with the goal; find rules that conclude it; make their premises new subgoals; recurse until the subgoals are facts. Only explores relevant rules (it is the basis of Prolog).</p>
<table><tr><th></th><th>Forward chaining</th><th>Backward chaining</th></tr>
<tr><td>Direction</td><td>Facts to goal</td><td>Goal to facts</td></tr>
<tr><td>Driven by</td><td>Data</td><td>Goal</td></tr>
<tr><td>Explores</td><td>All derivable facts</td><td>Only relevant rules</td></tr>
<tr><td>Best for</td><td>Monitoring, many goals</td><td>Diagnosis, answering one query</td></tr>
<tr><td>Risk</td><td>Derives irrelevant facts</td><td>Loops, repeated subgoals</td></tr></table>
<h2>Worked trace (use the tool in Rule-based KR for any KB)</h2>
<div class="ex"><b>KB:</b> P → Q ; L ∧ M → P ; B ∧ L → M ; A ∧ P → L ; A ∧ B → L ; facts A, B. <b>Query Q.</b><br>
<b>Forward:</b> A∧B→L gives L. B∧L→M gives M. L∧M→P gives P. P→Q gives Q ✓.<br>
<b>Backward:</b> Q needs P. P needs L and M. L needs A and P (loop on P) or A and B ✓. M needs B and L ✓. So P ✓, Q ✓.</div>
<h2>Resolution</h2>
<p>A single inference rule, used with <b>refutation</b>: to prove KB ⊨ α, add ¬α to KB (in clause form) and derive the empty clause ⊥. Resolution is sound and refutation-complete.</p>
<h3>Converting FOL to clause form (CNF)</h3>
<ol><li>Eliminate ↔ and →.</li><li>Move ¬ inward (De Morgan, quantifier duality).</li><li>Standardize variables apart.</li><li>Skolemize: replace each ∃ by a Skolem constant or function of the enclosing ∀ variables.</li><li>Drop ∀ (all variables are universal).</li><li>Distribute ∨ over ∧ to get CNF.</li><li>Write each conjunct as a clause.</li></ol>
<div class="ex"><b>Propositional resolution.</b> KB: (P ∨ Q), (¬P ∨ R), (¬Q ∨ R). Prove R. Add ¬R.<br>1. P ∨ Q &nbsp; 2. ¬P ∨ R &nbsp; 3. ¬Q ∨ R &nbsp; 4. ¬R (negated goal)<br>5. Q ∨ R (1, 2 on P) &nbsp; 6. R (5, 3 on Q) &nbsp; 7. ⊥ (6, 4). Contradiction, so R is entailed.</div>
<div class="ex"><b>First-order resolution (classic exam problem).</b><br>
Facts: (1) John likes all food. (2) Apple and chicken are food. (3) Anything anyone eats and is not killed by is food. (4) Bill eats peanuts and is still alive. (5) Sue eats everything Bill eats. <b>Prove: John likes peanuts.</b><br>
<b>FOL:</b> ∀x food(x) → likes(John,x) · food(Apple) · food(Chicken) · ∀x∀y eats(x,y) ∧ ¬killed(x) → food(y) · eats(Bill,Peanuts) ∧ alive(Bill) · ∀x eats(Bill,x) → eats(Sue,x) · ∀x alive(x) → ¬killed(x).<br>
<b>Clauses:</b> C1 ¬food(x) ∨ likes(John,x) · C2 food(Apple) · C3 food(Chicken) · C4 ¬eats(x,y) ∨ killed(x) ∨ food(y) · C5 eats(Bill,Peanuts) · C6 alive(Bill) · C7 ¬eats(Bill,x) ∨ eats(Sue,x) · C8 ¬alive(x) ∨ ¬killed(x) · <b>C9 ¬likes(John,Peanuts)</b> (negated goal).<br>
<b>Resolution:</b> C9 + C1 {x/Peanuts} → ¬food(Peanuts). With C4 {y/Peanuts} → ¬eats(x,Peanuts) ∨ killed(x). With C5 {x/Bill} → killed(Bill). With C8 {x/Bill} → ¬alive(Bill). With C6 → ⊥. Proved.</div>
<h2>Comparison</h2>
<table><tr><th>Method</th><th>Complete for</th><th>Note</th></tr><tr><td>Model checking (truth tables)</td><td>Propositional</td><td>2ⁿ cost</td></tr><tr><td>Forward / backward chaining</td><td>Horn clauses</td><td>Linear (propositional)</td></tr><tr><td>Resolution</td><td>Full propositional and first-order logic</td><td>Needs CNF</td></tr></table>`,
qa:[
Q(2,`Define soundness and completeness of an inference algorithm.`,`Sound: it derives only sentences that are entailed by the KB. Complete: it can derive every sentence that is entailed.`),
Q(2,`State Modus Ponens and Modus Tollens.`,`Modus Ponens: from P and P → Q infer Q. Modus Tollens: from P → Q and ¬Q infer ¬P.`),
Q(2,`Differentiate forward and backward chaining.`,`Forward chaining is data-driven: facts are used to fire rules until the goal appears. Backward chaining is goal-driven: it starts with the goal and finds rules and subgoals until facts are reached.`),
Q(5,`Explain resolution refutation with a propositional example.`,`<p>To prove α, add ¬α to the clause form of the KB and resolve pairs of clauses until the empty clause appears. Example: KB (P ∨ Q), (¬P ∨ R), (¬Q ∨ R), prove R. Add ¬R. Resolve (P ∨ Q) with (¬P ∨ R) on P: (Q ∨ R). Resolve with (¬Q ∨ R) on Q: R. Resolve R with ¬R: ⊥. The contradiction proves R. Resolution is sound and refutation-complete.</p>`),
Q(5,`Convert ∀x (Dog(x) → ∃y (Owner(y,x))) to clause form.`,`<p>1. Eliminate →: ∀x (¬Dog(x) ∨ ∃y Owner(y,x)). 2. Skolemize ∃y with a function of x: ∀x (¬Dog(x) ∨ Owner(F(x),x)). 3. Drop ∀. Clause: ¬Dog(x) ∨ Owner(F(x), x).</p>`),
Q(13,`Given: John likes all food. Apple and chicken are food. Anything anyone eats and is not killed by is food. Bill eats peanuts and is still alive. Sue eats everything Bill eats. Prove using resolution that John likes peanuts.`,`<p><b>FOL (3).</b> ∀x food(x) → likes(John,x); food(Apple); food(Chicken); ∀x∀y eats(x,y) ∧ ¬killed(x) → food(y); eats(Bill,Peanuts) ∧ alive(Bill); ∀x eats(Bill,x) → eats(Sue,x); background ∀x alive(x) → ¬killed(x). Goal likes(John,Peanuts).</p><p><b>Clauses (3).</b> ¬food(x) ∨ likes(John,x); food(Apple); food(Chicken); ¬eats(x,y) ∨ killed(x) ∨ food(y); eats(Bill,Peanuts); alive(Bill); ¬eats(Bill,x) ∨ eats(Sue,x); ¬alive(x) ∨ ¬killed(x); negated goal ¬likes(John,Peanuts).</p><p><b>Resolution (6).</b> ¬likes(John,Peanuts) + clause 1 {x/Peanuts} → ¬food(Peanuts). + clause 4 {y/Peanuts} → ¬eats(x,Peanuts) ∨ killed(x). + eats(Bill,Peanuts) {x/Bill} → killed(Bill). + ¬alive(x) ∨ ¬killed(x) {x/Bill} → ¬alive(Bill). + alive(Bill) → ⊥.</p><p><b>Conclusion (1).</b> Contradiction, so John likes peanuts. ∎</p>`),
Q(13,`Explain forward chaining and backward chaining with algorithms and a worked example. Compare them.`,`<p><b>Forward chaining (3).</b> Data-driven: loop, fire rules whose premises are all known, add conclusions, stop when goal derived or no change.</p><p><b>Backward chaining (3).</b> Goal-driven: to prove q, find rules p₁∧…∧pₙ → q and prove each pᵢ recursively; facts end the recursion; keep a stack to avoid loops.</p><p><b>Example (4).</b> Rules P→Q, L∧M→P, B∧L→M, A∧P→L, A∧B→L; facts A, B; query Q. Forward: L, M, P, Q. Backward: Q ← P ← L, M; L ← A, B ✓; M ← B, L ✓.</p><p><b>Comparison (3).</b> Direction, driver, efficiency (backward touches only relevant rules), use cases (monitoring vs diagnosis).</p>`)
]},

{id:'m3-11',mod:'m3',title:'Types of reasoning',pr:'High',tags:'deductive inductive abductive reasoning analogical monotonic non-monotonic common sense',
body:`
<div class="def"><b>Reasoning.</b> The process of drawing conclusions from knowledge, facts and beliefs.</div>
<table><tr><th>Type</th><th>Direction</th><th>Example</th><th>Conclusion is</th></tr>
<tr><td><b>Deductive</b></td><td>General → specific</td><td>All men are mortal. Socrates is a man. So Socrates is mortal.</td><td>Certain, if premises are true</td></tr>
<tr><td><b>Inductive</b></td><td>Specific → general</td><td>Every swan seen so far is white. So all swans are white.</td><td>Probable, can be wrong</td></tr>
<tr><td><b>Abductive</b></td><td>Effect → best explanation</td><td>The grass is wet. If it rained, the grass is wet. So it probably rained.</td><td>Plausible, one of several</td></tr>
<tr><td><b>Analogical</b></td><td>Similar case → this case</td><td>Drug worked on mice, so it may work on humans</td><td>Tentative</td></tr>
<tr><td><b>Common-sense</b></td><td>Everyday knowledge</td><td>An unsupported cup falls</td><td>Usually true</td></tr></table>
<h2>Monotonic vs non-monotonic</h2>
<table><tr><th>Monotonic</th><th>Non-monotonic</th></tr><tr><td>Adding facts never removes a conclusion (classical logic).</td><td>New facts can retract earlier conclusions. "Tweety is a bird, so Tweety flies" is withdrawn on learning Tweety is a penguin.</td></tr></table>
<p>Non-monotonic reasoning handles defaults and incomplete knowledge: default logic, circumscription, truth-maintenance systems.</p>
<h2>Other kinds</h2>
<ul><li><b>Probabilistic reasoning:</b> uses probabilities (Bayes' rule) for uncertain facts.</li><li><b>Fuzzy reasoning:</b> degrees of truth ("fairly hot").</li><li><b>Reasoning by cases / default reasoning</b> for incomplete knowledge.</li></ul>
<h2>Where used</h2>
<p>Deduction in theorem provers, induction in machine learning, abduction in medical diagnosis and fault finding.</p>
<div class="tip"><b>Memory aid.</b> Deduction preserves truth. Induction expands knowledge. Abduction explains observations.</div>`,
qa:[
Q(2,`Differentiate deductive and inductive reasoning.`,`Deductive reasoning goes from general rules to a specific conclusion and is certain if the premises are true. Inductive reasoning goes from specific observations to a general conclusion and is only probable.`),
Q(2,`What is abductive reasoning?`,`Inferring the most likely explanation of an observation: from "B" and "A → B" conclude "A" as a plausible cause. Used in diagnosis.`),
Q(5,`Explain deductive, inductive and abductive reasoning with examples.`,`<p><b>Deductive:</b> All men are mortal; Socrates is a man; so Socrates is mortal (certain). <b>Inductive:</b> every crow observed is black, so all crows are black (probable, may fail). <b>Abductive:</b> the road is wet and rain makes roads wet, so it probably rained (best explanation, not certain). Deduction preserves truth, induction generalizes, abduction explains.</p>`),
Q(5,`What is non-monotonic reasoning? Give an example.`,`<p>Reasoning in which a conclusion can be withdrawn when new information arrives. Classical logic is monotonic: adding facts never removes conclusions. Example: from "Tweety is a bird" conclude "Tweety flies" by default; on learning "Tweety is a penguin" the conclusion is retracted. Used for defaults and incomplete knowledge.</p>`)
]}
];
const T4=[
{id:'m4-1',mod:'m4',title:'The planning problem',pr:'High',tags:'planning problem strips pddl states actions goals operators frame problem',
body:`
<div class="def"><b>Planning.</b> Finding a sequence of actions that transforms the initial state into a state satisfying the goal. A planning problem is defined by: initial state, set of actions (operators), and goal.</div>
<h2>Purpose</h2>
<p>Search-based problem solvers on huge state spaces fail because they have no structure: the goal test is a black box and the heuristic is hard to find. Planning uses an explicit logical description of states, actions and goals so the planner can see which actions are relevant to the goal.</p>
<h2>STRIPS representation</h2>
<ul><li><b>State:</b> conjunction of ground positive literals, e.g. At(Home) ∧ Have(Milk). Anything not listed is false (closed-world assumption).</li><li><b>Goal:</b> conjunction of literals, e.g. At(Home) ∧ Have(Milk).</li><li><b>Action schema:</b> name, preconditions (PRE), effects as ADD list and DELETE list.</li></ul>
<pre><code>Action(Fly(p, from, to),
  PRECOND: At(p, from) ∧ Plane(p) ∧ Airport(from) ∧ Airport(to)
  EFFECT:  ¬At(p, from) ∧ At(p, to))        // delete At(p,from), add At(p,to)</code></pre>
<p>An action is <b>applicable</b> in state s if its preconditions hold in s. The result is (s − DEL) ∪ ADD.</p>
<h2>Example: air cargo</h2>
<pre><code>Init: At(C1,SFO) ∧ At(C2,JFK) ∧ At(P1,SFO) ∧ At(P2,JFK) ∧ Cargo(C1) ∧ Cargo(C2) ∧ Plane(P1) ∧ Plane(P2)
Goal: At(C1,JFK) ∧ At(C2,SFO)
Plan: Load(C1,P1,SFO), Fly(P1,SFO,JFK), Unload(C1,P1,JFK),
      Load(C2,P2,JFK), Fly(P2,JFK,SFO), Unload(C2,P2,SFO)</code></pre>
<h2>Planning vs search, and the frame problem</h2>
<table><tr><th></th><th>Plain search</th><th>Planning</th></tr><tr><td>States</td><td>Atomic (black box)</td><td>Factored (logical literals)</td></tr><tr><td>Goal test</td><td>Function</td><td>Explicit conjunction, can be decomposed</td></tr><tr><td>Heuristics</td><td>Hand-made</td><td>Derived from the description</td></tr><tr><td>Subgoals</td><td>Hidden</td><td>Visible, can be solved independently</td></tr></table>
<p><b>Frame problem:</b> stating what does <i>not</i> change after an action. STRIPS solves it implicitly: only the ADD and DELETE lists change, everything else persists.</p>
<h2>Assumptions of classical planning</h2>
<p>Fully observable, deterministic, static, discrete, single agent, finite. Relaxing these gives the conditional, reactive, continuous and multi-agent planners later in this module.</p>
<h2>PDDL</h2>
<p>Planning Domain Definition Language: a standard syntax for actions, init and goal that extends STRIPS (typing, negative preconditions, quantifiers, conditional effects).</p>`,
qa:[
Q(2,`Define a planning problem.`,`Given an initial state, a set of actions and a goal, find a sequence of actions that leads from the initial state to a state satisfying the goal.`),
Q(2,`What is an action schema in STRIPS?`,`An action with a name, preconditions (what must be true to apply it), and effects given as an add list and a delete list.`),
Q(2,`What is the frame problem?`,`Specifying what stays unchanged when an action is performed. STRIPS handles it by changing only the literals in the add and delete lists.`),
Q(5,`Explain the STRIPS representation of states, goals and actions with an example.`,`<p>State: conjunction of ground positive literals under the closed-world assumption. Goal: conjunction of literals, satisfied if all appear in the state. Action: PRECOND, ADD, DELETE. Example Fly(p,from,to): PRE At(p,from); DEL At(p,from); ADD At(p,to). Applicable if PRE ⊆ state; new state = (state − DEL) ∪ ADD. Air-cargo plan: Load(C1,P1,SFO), Fly(P1,SFO,JFK), Unload(C1,P1,JFK).</p>`),
Q(13,`Define the planning problem. Explain how planning differs from search, give the STRIPS formulation and solve an air-cargo example.`,`<p><b>Definition (2).</b> Initial state, actions, goal; output a sequence of actions.</p><p><b>Planning vs search (3).</b> Factored states, explicit goal, derived heuristics, subgoals visible, frame problem handled.</p><p><b>STRIPS (3).</b> State, goal, action schema with PRE/ADD/DEL, applicability and result.</p><p><b>Example (4).</b> Init At(C1,SFO), At(C2,JFK), planes P1 at SFO and P2 at JFK. Goal swap cargo. Plan of six actions as above, check each precondition.</p><p><b>Assumptions (1).</b> Fully observable, deterministic, static, single agent.</p>`)
]},

{id:'m4-2',mod:'m4',title:'Simple planning agent',pr:'High',tags:'simple planning agent algorithm percept goal plan sequence',
body:`
<div class="def"><b>Simple planning agent.</b> An agent that perceives the world, builds a state description, formulates a goal, runs a planner to get a sequence of actions, then executes the plan one action at a time.</div>
<h2>Architecture</h2>
<div class="wg" data-w="diag:agent"></div>
<h2>Algorithm</h2>
<pre><code>function SIMPLE-PLANNING-AGENT(percept) returns an action
  static: KB, plan (initially empty), t = 0
  TELL(KB, MAKE-PERCEPT-SENTENCE(percept, t))
  current ← STATE-DESCRIPTION(KB, t)
  if plan is empty then
      G ← ASK(KB, MAKE-GOAL-QUERY(t))
      plan ← IDEAL-PLANNER(current, G, KB)
  if plan is empty or G is empty then action ← NoOp
  else action ← FIRST(plan); plan ← REST(plan)
  TELL(KB, MAKE-ACTION-SENTENCE(action, t))
  t ← t + 1
  return action</code></pre>
<h2>Working principle</h2>
<ol><li>Perceive and record the percept in the KB.</li><li>Compute the current state description.</li><li>If no plan exists, ask the KB for the goal, then call the planner.</li><li>Execute the first action of the plan, keep the rest.</li><li>On later steps keep executing the stored plan.</li></ol>
<h2>Properties and limits</h2>
<p>Assumes the world is deterministic and static, so the plan stays valid. If an action fails or the world changes, the stored plan is wrong: this motivates execution monitoring and re-planning. Unlike a reflex agent it looks ahead; unlike a search agent it uses logic.</p>`,
qa:[
Q(2,`What does a simple planning agent do on each step?`,`Records the percept, builds the current state, plans if no plan exists, then executes the first action of the plan.`),
Q(5,`Write and explain the simple planning agent algorithm.`,`<p>Show the pseudocode above. Explanation: TELL the percept; get the state description; if the plan is empty ASK the KB for the goal and call the planner; take the first action of the plan, keep the rest; TELL the action; increment t. Limitation: assumes a static deterministic world, so it cannot handle failure without re-planning.</p>`),
Q(13,`Explain the architecture and working of a simple planning agent. Discuss its limitations and how they are overcome.`,`<p><b>Architecture (3).</b> Percept → state description → goal from KB → planner → action sequence.</p><p><b>Algorithm (4).</b> The pseudocode.</p><p><b>Working (3).</b> Plan once, execute step by step, store remaining plan.</p><p><b>Limitations (3).</b> Static deterministic assumption; no check that actions worked; plan breaks if world changes. Solutions: execution monitoring, re-planning, conditional and reactive planning.</p>`)
]},

{id:'m4-3',mod:'m4',title:'Planning as state-space search',pr:'High',tags:'state space search forward progression backward regression heuristics',
body:`
<div class="def"><b>State-space planning.</b> Planning formulated as search where each node is a world state and each edge is an action. It can search <b>forward</b> from the initial state or <b>backward</b> from the goal.</div>
<h2>Forward (progression) search</h2>
<p>Start at the initial state. Expand by applying every applicable action. Stop when a state satisfies the goal. Problem: many irrelevant actions, large branching factor.</p>
<h2>Backward (regression) search</h2>
<p>Start from the goal description. Consider only <b>relevant</b> actions (those that add a goal literal and do not delete another goal literal). The predecessor goal is:</p>
<pre><code>g′ = (g − ADD(a)) ∪ PRE(a)         // regression of goal g through action a</code></pre>
<p>Stop when g′ is true in the initial state.</p>
<div class="ex"><b>Regression example.</b> Goal g = At(C1,JFK). Relevant action: Unload(C1,P1,JFK) with ADD At(C1,JFK), PRE In(C1,P1) ∧ At(P1,JFK). g′ = (g − At(C1,JFK)) ∪ PRE = In(C1,P1) ∧ At(P1,JFK). Next, relevant actions add In(C1,P1): Load(C1,P1,SFO), giving At(C1,SFO) ∧ At(P1,SFO) ∧ At(P1,JFK), and so on until g′ ⊆ Init.</div>
<table><tr><th></th><th>Forward</th><th>Backward</th></tr><tr><td>Starts at</td><td>Initial state</td><td>Goal</td></tr><tr><td>Considers</td><td>All applicable actions</td><td>Only relevant, consistent actions</td></tr><tr><td>Branching</td><td>Large</td><td>Usually smaller</td></tr><tr><td>Node is</td><td>A complete state</td><td>A set of subgoals</td></tr><tr><td>Drawback</td><td>Irrelevant actions</td><td>Hard to find heuristics, partial states</td></tr></table>
<h2>Heuristics</h2>
<p><b>Ignore preconditions:</b> each action achieves any goal literal; count unsatisfied goals. <b>Ignore delete lists</b> (relaxed problem): never remove a literal, solve the easier problem, use its length as an admissible estimate. Used with A* or in FF planner.</p>
<h2>Algorithms</h2>
<p>BFS, DFS, A*; for progression, A* with the delete-relaxation heuristic is a strong baseline.</p>`,
qa:[
Q(2,`Differentiate progression and regression planning.`,`Progression searches forward from the initial state using applicable actions. Regression searches backward from the goal using relevant actions, computing predecessor goals.`),
Q(2,`Give the regression formula.`,`g′ = (g − ADD(a)) ∪ PRE(a), where a is relevant to g and does not delete any literal of g.`),
Q(5,`Explain forward and backward state-space search with an example of regression.`,`<p>Forward search expands applicable actions from the initial state until the goal is met. Backward search starts at the goal and only uses relevant actions. Example: g = At(C1,JFK); action Unload(C1,P1,JFK) adds the goal. g′ = In(C1,P1) ∧ At(P1,JFK). Continue with Load and Fly until g′ holds in the initial state. Backward search has a lower branching factor, forward search is easier to give heuristics.</p>`),
Q(13,`Explain planning as state-space search. Compare forward and backward search, show regression, and describe heuristics.`,`<p><b>Formulation (2).</b> Nodes states, edges actions.</p><p><b>Forward (3).</b> Applicable actions, goal test; large branching.</p><p><b>Backward (4).</b> Relevant and consistent actions; formula g′ = (g − ADD) ∪ PRE; worked example.</p><p><b>Comparison (2).</b> Table.</p><p><b>Heuristics (2).</b> Ignore preconditions; ignore delete lists; A*.</p>`)
]},

{id:'m4-4',mod:'m4',title:'Blocks world',pr:'Very High',tags:'blocks world strips operators stack unstack pickup putdown on clear holding armempty',
body:`
<div class="def"><b>Blocks world.</b> A classic planning domain: a table, a set of identical cubic blocks, and a robot arm that can hold one block at a time. The task is to rearrange the blocks into a goal configuration.</div>
<h2>Predicates</h2>
<table><tr><th>Predicate</th><th>Meaning</th></tr><tr><td>ON(x,y)</td><td>block x is directly on block y</td></tr><tr><td>ONTABLE(x)</td><td>x is on the table</td></tr><tr><td>CLEAR(x)</td><td>nothing is on top of x</td></tr><tr><td>HOLDING(x)</td><td>arm holds x</td></tr><tr><td>ARMEMPTY</td><td>arm holds nothing</td></tr></table>
<h2>Four operators (learn these exactly)</h2>
<table><tr><th>Operator</th><th>PRECONDITION</th><th>DELETE</th><th>ADD</th></tr>
<tr><td><b>STACK(x,y)</b></td><td>CLEAR(y) ∧ HOLDING(x)</td><td>CLEAR(y), HOLDING(x)</td><td>ARMEMPTY, ON(x,y), CLEAR(x)</td></tr>
<tr><td><b>UNSTACK(x,y)</b></td><td>ON(x,y) ∧ CLEAR(x) ∧ ARMEMPTY</td><td>ON(x,y), ARMEMPTY, CLEAR(x)</td><td>HOLDING(x), CLEAR(y)</td></tr>
<tr><td><b>PICKUP(x)</b></td><td>ONTABLE(x) ∧ CLEAR(x) ∧ ARMEMPTY</td><td>ONTABLE(x), CLEAR(x), ARMEMPTY</td><td>HOLDING(x)</td></tr>
<tr><td><b>PUTDOWN(x)</b></td><td>HOLDING(x)</td><td>HOLDING(x)</td><td>ONTABLE(x), ARMEMPTY, CLEAR(x)</td></tr></table>
<div class="tip"><b>Memory aid.</b> Pickup/Putdown deal with the <i>table</i>. Stack/Unstack deal with <i>another block</i>. Every operator needs the arm to be free (or holding x).</div>
<h2>Example state</h2>
<pre><code>Initial:  C       Goal:   A
          A  B            B
        ------          ------
ON(C,A) ONTABLE(A) ONTABLE(B) CLEAR(C) CLEAR(B) ARMEMPTY</code></pre>
<h2>Solve it with the goal-stack planner</h2>
<p>Pick an example, edit the states if you like, and step through the stack, plan and state.</p>
<div data-w="bw"></div>
<h2>Hand-solved example (Rich and Knight)</h2>
<div class="ex"><b>Start:</b> ON(B,A), ONTABLE(A), ONTABLE(C), ONTABLE(D), CLEAR(B), CLEAR(C), CLEAR(D), ARMEMPTY.<br><b>Goal:</b> ON(C,A) ∧ ON(B,D).<br>
Needed: B off A, C on A, B on D. Plan: <b>UNSTACK(B,A)</b> (B in hand, A clear) → <b>STACK(B,D)</b> (B on D) → <b>PICKUP(C)</b> → <b>STACK(C,A)</b>. Four steps, shortest. The basic goal-stack planner may instead putdown B then pickup it again (6 steps); both are valid.</div>
<h2>Complexity and issues</h2>
<p>Optimal blocks-world planning is NP-hard. Sussman anomaly (see Goal stack and Non-linear planning) shows that simple strategies can fail to find short plans.</p>`,
qa:[
Q(2,`List the predicates used in blocks world.`,`ON(x,y), ONTABLE(x), CLEAR(x), HOLDING(x) and ARMEMPTY.`),
Q(2,`Write the STACK(x,y) operator.`,`PRE: CLEAR(y) ∧ HOLDING(x). DELETE: CLEAR(y), HOLDING(x). ADD: ARMEMPTY, ON(x,y), CLEAR(x).`),
Q(2,`Write the UNSTACK(x,y) operator.`,`PRE: ON(x,y) ∧ CLEAR(x) ∧ ARMEMPTY. DELETE: ON(x,y), ARMEMPTY, CLEAR(x). ADD: HOLDING(x), CLEAR(y).`),
Q(5,`Describe the blocks-world domain and write the four operators with their precondition, add and delete lists.`,`<p>Table of blocks and one robot arm. Predicates ON, ONTABLE, CLEAR, HOLDING, ARMEMPTY. Operators: STACK(x,y), UNSTACK(x,y), PICKUP(x), PUTDOWN(x), each with PRE/DEL/ADD as in the table above. Pickup and putdown involve the table; stack and unstack involve another block.</p>`),
Q(13,`Initial state: ON(B,A), ONTABLE(A), ONTABLE(C), ONTABLE(D), CLEAR(B), CLEAR(C), CLEAR(D), ARMEMPTY. Goal: ON(C,A) ∧ ON(B,D). Find a plan, showing the state after each action.`,`<p><b>Operators (3).</b> Write the four with PRE/ADD/DEL.</p><p><b>Analysis (2).</b> A is covered by B, so B must move; B must reach D; C must reach A.</p><p><b>Plan (4).</b> 1 UNSTACK(B,A): holding B, CLEAR(A). 2 STACK(B,D): ON(B,D), arm empty. 3 PICKUP(C): holding C. 4 STACK(C,A): ON(C,A), arm empty.</p><p><b>States (3).</b> After step 4: ON(B,D), ON(C,A), ONTABLE(A), ONTABLE(D), CLEAR(B), CLEAR(C), ARMEMPTY. Goal satisfied.</p><p><b>Check (1).</b> Each precondition was true when applied.</p>`)
]},

{id:'m4-5',mod:'m4',title:'Goal stack planning',pr:'Very High',tags:'goal stack planning strips stack algorithm sussman anomaly blocks',
body:`
<div class="def"><b>Goal stack planning.</b> A STRIPS planner that keeps a stack of goals and operators. It pops the top item: if it is a goal that is not true, it pushes an operator that achieves it together with that operator's preconditions as new subgoals; if it is an operator, it applies it to the current state and records it in the plan.</div>
<h2>Algorithm</h2>
<pre><code>Push the goal G (compound) on the STACK. Push each conjunct of G above it.
STATE = initial state; PLAN = ()
while STACK is not empty:
  top = pop(STACK)
  if top is an operator:
        apply it to STATE (delete DEL, add ADD); append to PLAN
  else if top is a compound goal:
        if all its parts are true in STATE: discard it
        else: push it back, then push each unsatisfied part
  else (single goal literal g):
        if g is true in STATE: discard it
        else: choose an operator O whose ADD list contains g
              push O, push compound PRE(O), push each literal of PRE(O)</code></pre>
<h2>Operator choice for blocks world</h2>
<table><tr><th>Goal</th><th>Operator to push</th></tr><tr><td>ON(x,y)</td><td>STACK(x,y)</td></tr><tr><td>ONTABLE(x)</td><td>PUTDOWN(x)</td></tr><tr><td>CLEAR(x) with ON(y,x)</td><td>UNSTACK(y,x)</td></tr><tr><td>HOLDING(x)</td><td>PICKUP(x) if on table, else UNSTACK(x,y)</td></tr><tr><td>ARMEMPTY</td><td>PUTDOWN(held block)</td></tr></table>
<h2>Run the planner</h2>
<div data-w="bw"></div>
<div class="tip"><b>Goal order matters.</b> The planner works on the first listed goal first. For the Rich and Knight problem, listing ON(B,D) before ON(C,A) gives the 4-step plan; the reverse order gives a 6-step plan (B is put down and picked up again). Try both above.</div>
<h2>Hand trace: ON(A,B) with A, B on the table</h2>
<table><tr><th>Step</th><th>Stack (top first)</th><th>Action</th></tr>
<tr><td>1</td><td>[ON(A,B)] , ON(A,B)</td><td>Goal not true. Choose STACK(A,B).</td></tr>
<tr><td>2</td><td>STACK(A,B), [CLEAR(B) ∧ HOLDING(A)], HOLDING(A), CLEAR(B)…</td><td>Push precondition goals.</td></tr>
<tr><td>3</td><td>CLEAR(B) is true: pop. HOLDING(A): choose PICKUP(A).</td><td>Push PICKUP(A) and its preconditions ONTABLE(A), CLEAR(A), ARMEMPTY, all true.</td></tr>
<tr><td>4</td><td>Apply PICKUP(A), then STACK(A,B).</td><td><b>Plan: PICKUP(A), STACK(A,B).</b></td></tr></table>
<h2>Sussman anomaly</h2>
<div class="warn"><b>Initial:</b> C on A; A and B on table. <b>Goal:</b> ON(A,B) ∧ ON(B,C).<br>Goal-stack handles goals <i>one at a time</i>. If it achieves ON(A,B) first it must unstack C, put down C, pick up A and stack it on B; then to achieve ON(B,C) it has to unstack A again, undoing the first goal. Result (run it above): UNSTACK(C,A), PUTDOWN(C), PICKUP(A), STACK(A,B), UNSTACK(A,B), PUTDOWN(A), PICKUP(B), STACK(B,C), PICKUP(A), STACK(A,B). Ten steps, valid but wasteful. Shortest plan: UNSTACK(C,A), PUTDOWN(C), PICKUP(B), STACK(B,C), PICKUP(A), STACK(A,B). Needs interleaving of the two goals, which is what non-linear planning does.</div>
<h2>Advantages and limitations</h2>
<table><tr><th>Advantages</th><th>Limitations</th></tr><tr><td>Simple; works backward from goals so only relevant operators are tried; easy to trace</td><td>Treats goals as independent (linear), so produces non-optimal plans and fails on interacting goals; no backtracking in the basic version; goal can be undone by later steps</td></tr></table>`,
qa:[
Q(2,`What does goal stack planning use as its data structure?`,`A stack holding goals, compound goals and operators; the plan is built from the operators as they are popped and applied.`),
Q(2,`What is the Sussman anomaly?`,`A blocks-world problem (C on A; goal ON(A,B) ∧ ON(B,C)) where achieving the goals one after another undoes earlier work, showing linear planners give non-optimal plans.`),
Q(5,`Explain the goal-stack planning algorithm.`,`<p>Push the compound goal and its parts. Loop: pop the top. Operator → apply to the state and add to the plan. Compound goal → if all true discard, else push back and push unsatisfied parts. Single goal → if true discard, else choose an operator whose add list has it; push the operator, its precondition conjunction and each precondition. Stop when the stack is empty. The plan is the list of applied operators.</p>`),
Q(13,`Use goal stack planning to solve: Initial ON(B,A), ONTABLE(A), ONTABLE(C), ONTABLE(D), CLEAR(B), CLEAR(C), CLEAR(D), ARMEMPTY. Goal ON(C,A) ∧ ON(B,D).`,`<p><b>Algorithm (2).</b> State it briefly.</p><p><b>Initial stack (1).</b> [ON(C,A) ∧ ON(B,D)], ON(C,A), ON(B,D).</p><p><b>Trace (7).</b> Take ON(B,D) first: push STACK(B,D), preconditions CLEAR(D) (true), HOLDING(B). HOLDING(B): choose UNSTACK(B,A), preconditions ON(B,A), CLEAR(B), ARMEMPTY all true. Apply UNSTACK(B,A), STACK(B,D). Now ON(C,A): STACK(C,A), CLEAR(A) true after unstack, HOLDING(C): PICKUP(C) preconditions true. Apply PICKUP(C), STACK(C,A). Compound goal now true.</p><p><b>Plan (2).</b> UNSTACK(B,A), STACK(B,D), PICKUP(C), STACK(C,A).</p><p><b>Check (1).</b> Final state contains ON(C,A) and ON(B,D).</p>`),
Q(13,`Explain the Sussman anomaly. Why does goal stack planning fail to give the optimal plan? How is it solved?`,`<p><b>Problem (3).</b> Initial ON(C,A), A and B on the table; goal ON(A,B) ∧ ON(B,C). Draw the states.</p><p><b>Goal stack run (4).</b> Achieve ON(A,B) first: UNSTACK(C,A), PUTDOWN(C), PICKUP(A), STACK(A,B). Then ON(B,C): A blocks B, so UNSTACK(A,B), PUTDOWN(A), PICKUP(B), STACK(B,C), and finally PICKUP(A), STACK(A,B) again. Ten steps with undone work.</p><p><b>Reason (2).</b> Goals are treated as independent; solving one destroys the other (goal protection missing).</p><p><b>Solution (4).</b> Interleave the subgoals (non-linear / partial-order planning): UNSTACK(C,A), PUTDOWN(C), PICKUP(B), STACK(B,C), PICKUP(A), STACK(A,B). Six steps.</p>`)
]},

{id:'m4-6',mod:'m4',title:'Means-ends analysis',pr:'Very High',tags:'means ends analysis gps difference table operator subgoal general problem solver',
body:`
<div class="def"><b>Means-ends analysis (MEA).</b> A problem-solving strategy used in GPS (General Problem Solver, Newell and Simon). It repeatedly finds the <b>difference</b> between the current state and the goal state, picks an operator that reduces that difference, and recursively solves the subproblems of satisfying the operator's preconditions and reaching the goal after it.</div>
<h2>Algorithm</h2>
<pre><code>MEA(current, goal):
  if current = goal: return success
  D ← most important difference between current and goal
  O ← operator relevant to reducing D          (from the difference table)
  if O's preconditions not true in current:
        MEA(current, preconditions of O)       // subproblem 1: make O applicable
  apply O → new state
  MEA(new state, goal)                         // subproblem 2: continue to goal</code></pre>
<p>Two subproblems per operator: <b>(1)</b> get from the current state to a state where O applies, <b>(2)</b> get from the result of O to the goal.</p>
<h2>Example: moving a desk (Rich and Knight)</h2>
<table><tr><th>Operator</th><th>Preconditions</th><th>Reduces difference</th></tr>
<tr><td>PUSH(obj, loc)</td><td>at(robot, obj) ∧ large(obj) ∧ clear(obj) ∧ armempty</td><td>object location</td></tr>
<tr><td>CARRY(obj, loc)</td><td>at(robot, obj) ∧ small(obj)</td><td>object location</td></tr>
<tr><td>WALK(loc)</td><td>none</td><td>robot location</td></tr>
<tr><td>PICKUP(obj)</td><td>at(robot, obj)</td><td>holding</td></tr>
<tr><td>PUTDOWN(obj)</td><td>holding(obj)</td><td>holding</td></tr>
<tr><td>PLACE(obj1, obj2)</td><td>at(robot, obj2) ∧ holding(obj1)</td><td>on relation</td></tr></table>
<div class="ex"><b>Problem:</b> move a desk with two things on it from room A to room B. Difference: desk location. Operator PUSH(desk, B) reduces it. Preconditions fail: robot not at the desk, objects on it (not clear). Subproblems: WALK(desk) to be at the desk; CARRY the objects off (PICKUP then PUTDOWN elsewhere, or CARRY to B). Then PUSH(desk, B). Finally put the objects back with PLACE. The plan is built from the difference table, and each unsatisfied precondition is a new <i>difference</i>.</div>
<h2>Blocks-world view</h2>
<p>Difference: ON(A,B) false. Operator STACK(A,B). Preconditions HOLDING(A), CLEAR(B). New difference: HOLDING(A). Operator PICKUP(A) etc. Goal stack planning is MEA specialised to STRIPS operators.</p>
<h2>Operator selection</h2>
<p>Differences are ordered by importance (biggest first). The difference table maps each kind of difference to operators that can reduce it.</p>
<h2>Advantages and limitations</h2>
<table><tr><th>Advantages</th><th>Limitations</th></tr><tr><td>Focuses on relevant operators; breaks a hard problem into subproblems; mixes forward and backward reasoning</td><td>Needs a good difference table and ordering; can loop or choose operators that make other differences worse; no guarantee of optimality</td></tr></table>`,
qa:[
Q(2,`What is means-ends analysis?`,`A strategy that compares the current state with the goal, picks an operator that reduces the difference, and recursively solves the subproblems of enabling the operator and then reaching the goal.`),
Q(2,`Which program introduced means-ends analysis?`,`The General Problem Solver (GPS) by Newell, Shaw and Simon.`),
Q(5,`Explain the means-ends analysis algorithm with the subproblems it creates.`,`<p>Find the difference D between current and goal. Select an operator O that reduces D using the difference table. If O is not applicable, solve the subproblem current → state satisfying PRE(O). Apply O. Then solve the second subproblem: state after O → goal. Recurse until no difference remains. Differences are tried in order of importance.</p>`),
Q(13,`Explain means-ends analysis with a difference table. Use it to plan moving a desk with objects on top from one room to another.`,`<p><b>Algorithm (3).</b> Difference, operator, two subproblems.</p><p><b>Difference table (3).</b> PUSH, CARRY, WALK, PICKUP, PUTDOWN, PLACE with preconditions and the differences each reduces.</p><p><b>Solution (5).</b> Difference: desk in wrong room. Choose PUSH(desk,B). Preconditions: robot at desk → WALK(desk); desk clear → remove objects (PICKUP and CARRY or PUTDOWN them); hands empty. Apply PUSH. Bring the objects (CARRY) and PLACE them on the desk. Show each recursion.</p><p><b>Limits (2).</b> Needs difference table, ordering, loops.</p>`)
]},

{id:'m4-7',mod:'m4',title:'Partial-order planning',pr:'High',tags:'partial order planning pop causal links threats promotion demotion ordering constraints shoes socks',
body:`
<div class="def"><b>Partial-order planning (POP).</b> A planner that searches the space of <b>plans</b> rather than states. A plan commits only to the ordering constraints that are needed, leaving other steps unordered. Any total order consistent with the constraints is a valid solution.</div>
<h2>Why partial order</h2>
<p>Total-order planners decide the exact sequence too early. POP uses <b>least commitment</b>: choose an order only when forced. Independent subgoals (left sock and right sock) need no relative order.</p>
<h2>A partial plan has four parts</h2>
<table><tr><th>Part</th><th>Meaning</th></tr><tr><td>Steps</td><td>Actions, always including Start (effects = initial state) and Finish (preconditions = goal)</td></tr><tr><td>Ordering constraints</td><td>A ≺ B: A before B</td></tr><tr><td>Causal links</td><td>A –p→ B: A achieves p for B; p must stay true from A to B</td></tr><tr><td>Open preconditions</td><td>Preconditions with no causal link yet</td></tr></table>
<h2>Example: put on shoes and socks</h2>
<div class="wg" data-w="diag:pop"></div>
<p>Goal: RightShoeOn ∧ LeftShoeOn. Actions: RightSock (effect RightSockOn), RightShoe (PRE RightSockOn), same for left. Constraints: RightSock ≺ RightShoe, LeftSock ≺ LeftShoe. No ordering between the right and left chains. Linearizations include RS, RH, LS, LH or LS, RS, LH, RH and so on (6 valid orders).</p>
<h2>Threats and their resolution</h2>
<div class="def"><b>Threat.</b> A step C that could delete (negate) the condition p protected by a causal link A –p→ B, and could be ordered between A and B.</div>
<ul><li><b>Demotion:</b> order C <i>before</i> A (C ≺ A).</li><li><b>Promotion:</b> order C <i>after</i> B (B ≺ C).</li><li>If neither is consistent, backtrack.</li></ul>
<h2>POP algorithm</h2>
<pre><code>Initial plan: {Start, Finish}, constraint Start ≺ Finish, open preconditions = goal
loop:
  if no open preconditions and no threats: return the plan  (solution)
  1. Pick an open precondition p of some step B.
  2. Choose an action A (existing step or new) that adds p; add causal link A –p→ B
     and ordering A ≺ B; add A's preconditions as new open preconditions.
  3. For every threat to a causal link, resolve by promotion or demotion.
  If a choice leads to inconsistency, backtrack.</code></pre>
<h2>Advantages and limitations</h2>
<table><tr><th>Advantages</th><th>Limitations</th></tr><tr><td>Least commitment; handles independent subgoals without arbitrary order; avoids the Sussman anomaly; plans are flexible for execution and parallel actions</td><td>Complex bookkeeping; hard to design heuristics; not as fast as modern state-space planners; plan is not directly executable until linearized</td></tr></table>`,
qa:[
Q(2,`What is a causal link in POP?`,`A record A –p→ B meaning step A achieves precondition p for step B, so p must remain true between A and B.`),
Q(2,`What is a threat? How can it be resolved?`,`A step that may delete a condition protected by a causal link. Resolve by demotion (order it before the producer) or promotion (order it after the consumer).`),
Q(2,`State the principle of least commitment.`,`Make ordering and binding decisions only when necessary, so the plan stays as flexible as possible.`),
Q(5,`Explain the representation of a partial-order plan with an example.`,`<p>A plan has steps, ordering constraints, causal links and open preconditions, with Start and Finish dummy steps. Example: Goal RightShoeOn ∧ LeftShoeOn. Steps: RightSock, RightShoe, LeftSock, LeftShoe. Orderings: RightSock ≺ RightShoe, LeftSock ≺ LeftShoe. Links: RightSock –RightSockOn→ RightShoe, LeftSock –LeftSockOn→ LeftShoe. Left and right chains are unordered; any interleaving is a valid linear plan.</p>`),
Q(13,`Explain partial-order planning: representation, algorithm, threats, and the shoes and socks example. Compare with total-order planning.`,`<p><b>Idea (2).</b> Search plan space, least commitment.</p><p><b>Representation (3).</b> Steps, ordering constraints, causal links, open preconditions, Start/Finish.</p><p><b>Algorithm (3).</b> Pick open precondition, add or reuse an action, add link and order, resolve threats, backtrack.</p><p><b>Threats (2).</b> Definition; promotion and demotion.</p><p><b>Example (2).</b> Diagram: Start → RightSock → RightShoe → Finish and Start → LeftSock → LeftShoe → Finish.</p><p><b>Comparison (1).</b> Total order fixes the sequence early and may backtrack; POP delays decisions.</p>`)
]},

{id:'m4-8',mod:'m4',title:'Planning graphs',pr:'High',tags:'planning graph graphplan mutex mutual exclusion levels have cake',
body:`
<div class="def"><b>Planning graph.</b> A layered graph used to compute reachability and derive heuristics. It alternates <b>state levels</b> Sᵢ (literals) and <b>action levels</b> Aᵢ (actions), with links for preconditions and effects and <b>mutex</b> (mutual exclusion) links between pairs that cannot hold together.</div>
<h2>Construction</h2>
<ol><li>S₀ = all literals true in the initial state.</li><li>A₀ = all actions whose preconditions are in S₀ (plus <b>persistence (no-op)</b> actions that carry each literal forward).</li><li>S₁ = all effects of A₀ actions.</li><li>Add mutex links, then repeat until the graph <b>levels off</b> (two consecutive levels identical).</li></ol>
<h2>Mutex rules</h2>
<table><tr><th>Between</th><th>Mutex if</th></tr>
<tr><td>Two actions</td><td><b>Inconsistent effects:</b> one deletes what the other adds. <b>Interference:</b> one deletes a precondition of the other. <b>Competing needs:</b> their preconditions are mutex.</td></tr>
<tr><td>Two literals</td><td><b>Negation</b> of each other, or all ways of achieving them are mutex (<b>inconsistent support</b>).</td></tr></table>
<div class="ex"><b>Have-cake example.</b> Init: Have(Cake). Goal: Have(Cake) ∧ Eaten(Cake). Actions: Eat(Cake) PRE Have(Cake), EFFECT ¬Have(Cake) ∧ Eaten(Cake); Bake(Cake) PRE ¬Have(Cake), EFFECT Have(Cake).<br>
<b>S₀:</b> Have(Cake), ¬Eaten(Cake). <b>A₀:</b> Eat(Cake), no-ops. <b>S₁:</b> Have(Cake) (no-op), ¬Have(Cake) (Eat), Eaten(Cake), ¬Eaten(Cake). Mutexes in S₁: Have ↔ ¬Have; Have ↔ Eaten (Eat and persistence of Have are mutex because Eat deletes Have); Eaten ↔ ¬Eaten. So at level S₁ the goal Have ∧ Eaten is <b>not</b> reachable (mutex).<br>
<b>A₁:</b> Bake(Cake) now applicable (¬Have(Cake) in S₁), Eat, no-ops. <b>S₂:</b> Have(Cake) via Bake and Eaten(Cake) via persistence are no longer mutex. Goal reachable at level 2: Eat(Cake), Bake(Cake).</div>
<h2>Uses</h2>
<ul><li><b>Heuristic:</b> the level where all goal literals first appear (non-mutex) estimates plan length.</li><li><b>Impossible goals:</b> if the graph levels off without the goal, there is no plan.</li><li><b>GRAPHPLAN:</b> expand the graph until the goal literals appear with no mutex, then extract a plan by backward search.</li></ul>
<h2>Properties</h2>
<p>Polynomial size. Soundly tells that a goal is unreachable. Plan extraction is still search (NP-hard), but heavily pruned by mutexes.</p>`,
qa:[
Q(2,`What is a planning graph?`,`A layered graph of alternating literal levels and action levels with mutex links, used to estimate reachability and extract plans.`),
Q(2,`When are two actions mutex?`,`If their effects are inconsistent, if one interferes with a precondition of the other, or if they have competing needs (mutex preconditions).`),
Q(5,`Explain GRAPHPLAN with the planning-graph construction and the mutex relations.`,`<p>Start with S₀ from the initial state. Build A₀ with applicable actions and no-ops, then S₁ with their effects, mark mutexes (action: inconsistent effects, interference, competing needs; literal: negation or inconsistent support). Repeat until the graph levels off. If all goal literals are present and pairwise non-mutex at level Sᵢ, search backward for a plan; otherwise expand. If the graph levels off without that, no plan exists.</p>`),
Q(13,`Build the planning graph for the have-cake-and-eat-it-too problem up to level S₂. Explain the mutex links and extract a plan.`,`<p><b>Problem (2).</b> Init Have(Cake). Goal Have(Cake) ∧ Eaten(Cake). Eat and Bake operators.</p><p><b>S₀, A₀, S₁ (3).</b> As above, with persistence actions.</p><p><b>Mutexes (3).</b> Eat vs persistence of Have (interference), Have vs ¬Have, Eaten vs ¬Eaten, Have vs Eaten at S₁.</p><p><b>A₁, S₂ (3).</b> Bake becomes available; Have and Eaten non-mutex.</p><p><b>Extraction (2).</b> Eat(Cake) in A₀, Bake(Cake) in A₁.</p>`)
]},

{id:'m4-9',mod:'m4',title:'Hierarchical planning (HTN)',pr:'High',tags:'hierarchical planning htn task network decomposition abstract primitive refinement',
body:`
<div class="def"><b>Hierarchical planning.</b> Planning at several levels of abstraction. High-level (abstract) actions are repeatedly <b>decomposed</b> into lower-level actions until only <b>primitive</b> actions remain. The best-known form is Hierarchical Task Network (HTN) planning.</div>
<h2>Purpose</h2>
<p>Flat planners deal with thousands of primitive steps. People plan "get to the airport" before "turn the steering wheel". Hierarchy cuts search, reuses plan fragments (methods) and brings in expert knowledge.</p>
<h2>Components</h2>
<ul><li><b>Primitive actions:</b> directly executable.</li><li><b>High-level actions (HLAs):</b> abstract, with one or more <b>refinements (methods)</b>.</li><li><b>Method:</b> Refinement(HLA, PRE, STEPS) lists the subtasks and their order.</li></ul>
<h2>Example</h2>
<div class="wg" data-w="diag:htn"></div>
<pre><code>Refinement(BuildHouse,
   STEPS: [GetPermit, BuildStructure, FinishInterior])
Refinement(BuildStructure,
   STEPS: [Foundation, Walls, Roof])</code></pre>
<h2>Algorithm</h2>
<pre><code>HTN-PLAN(initial, task network):
  plan ← task network
  while plan contains a non-primitive step h:
       choose a method for h whose PRE holds
       replace h with the method's subtasks (keep ordering and links)
  return plan when all steps are primitive and the plan is consistent</code></pre>
<h2>Advantages and limitations</h2>
<table><tr><th>Advantages</th><th>Limitations</th></tr><tr><td>Huge reduction in search; reuses expert methods; plans are easy to understand; subtasks can be planned independently</td><td>Needs a hand-written method library; may miss solutions outside the methods; harder to guarantee correctness</td></tr></table>
<p>Used in game AI, logistics, spacecraft operations (NASA), military planning.</p>`,
qa:[
Q(2,`What is a high-level action?`,`An abstract action that has one or more refinements into sequences of lower-level (eventually primitive) actions.`),
Q(2,`Why is hierarchical planning efficient?`,`It searches over a few abstract steps first and uses pre-built methods, instead of searching thousands of primitive actions.`),
Q(5,`Explain hierarchical task network planning with an example.`,`<p>HTN planning starts with a top-level task and repeatedly replaces non-primitive tasks by their methods (refinements) until only primitive actions remain. Example: BuildHouse → [GetPermit, BuildStructure, FinishInterior]; BuildStructure → [Foundation, Walls, Roof]. The result is a primitive action plan. Benefits: reduced search, reuse of expert knowledge.</p>`),
Q(13,`Describe hierarchical planning: abstraction levels, refinements, algorithm, example, advantages and limitations.`,`<p><b>Idea (2).</b> Levels of abstraction.</p><p><b>Components (3).</b> Primitive actions, HLAs, refinements.</p><p><b>Algorithm (3).</b> Choose a non-primitive step, apply a method, repeat.</p><p><b>Example (3).</b> House-building decomposition tree.</p><p><b>Pros and cons (2).</b> Efficiency and reuse vs method authoring.</p>`)
]},

{id:'m4-10',mod:'m4',title:'Non-linear planning',pr:'High',tags:'non linear planning nonlinear noah tweak constraint posting interleaving sussman',
body:`
<div class="def"><b>Non-linear planning.</b> Planning in which the steps of a plan are not forced into a single order while the plan is being built. Subgoals can be interleaved, and the plan is a set of steps with <b>constraints</b> (ordering and variable bindings). It is the family to which partial-order planning belongs.</div>
<h2>Linear vs non-linear</h2>
<table><tr><th></th><th>Linear (goal stack)</th><th>Non-linear</th></tr>
<tr><td>Subgoals</td><td>Solved one after another, completely</td><td>Interleaved</td></tr>
<tr><td>Plan</td><td>Total sequence built as you go</td><td>Set of steps plus constraints</td></tr>
<tr><td>Goal interaction</td><td>Not handled (Sussman anomaly)</td><td>Detected and resolved</td></tr>
<tr><td>Optimality</td><td>Often not optimal</td><td>Usually shorter plans</td></tr></table>
<h2>Constraint posting</h2>
<p>Instead of choosing an order, the planner <b>posts constraints</b>: "A before B", "block x = C". It commits to a choice only when forced by a conflict (least commitment).</p>
<h2>Key techniques</h2>
<ul><li><b>Goal protection:</b> a link records that an earlier step's effect must stay true until needed.</li><li><b>Interleaving:</b> work on any open goal next.</li><li><b>Conflict resolution:</b> reorder steps (promotion/demotion) or add steps to restore a clobbered condition.</li></ul>
<h2>Sussman anomaly solved non-linearly</h2>
<div class="ex">Goal ON(A,B) ∧ ON(B,C), initial C on A. Linear plans conflict: ON(A,B) needs A free, ON(B,C) needs B free and C clear. A non-linear planner sees that: C must come off A first (needed by both goals), B must be stacked on C <i>before</i> A is stacked on B, because stacking A on B first would block B. Constraints: Stack(B,C) ≺ Stack(A,B). Result: <b>UNSTACK(C,A), PUTDOWN(C), PICKUP(B), STACK(B,C), PICKUP(A), STACK(A,B)</b>. Six steps.</div>
<h2>Systems</h2>
<p>NOAH (Sacerdoti, 1975), NONLIN (Tate), TWEAK (Chapman), SNLP, UCPOP.</p>
<h2>Advantages and limitations</h2>
<p>Advantages: shorter plans, solves goal-interaction problems, flexible for parallel execution. Limitations: more complex data structures, more bookkeeping, may need to backtrack, larger search for conflict checks.</p>`,
qa:[
Q(2,`What is non-linear planning?`,`Planning where steps are not committed to a fixed order while building; subgoals are interleaved and ordering is expressed as constraints.`),
Q(2,`Name two non-linear planners.`,`NOAH and TWEAK (also NONLIN, UCPOP).`),
Q(5,`Differentiate linear and non-linear planning. Why is the Sussman anomaly a problem for linear planners?`,`<p>Linear planners solve goals one after another with a total order, so achieving one goal may undo another. Non-linear planners interleave goals and keep ordering constraints, resolving conflicts when found. In the Sussman anomaly (goal ON(A,B) ∧ ON(B,C)) a linear planner builds A on B first and must destroy it to stack B on C, producing a long plan. A non-linear planner orders Stack(B,C) before Stack(A,B).</p>`),
Q(13,`Explain non-linear planning with constraint posting. Solve the Sussman anomaly and compare with goal-stack planning.`,`<p><b>Concept (2).</b> Interleaving, least commitment.</p><p><b>Constraint posting (3).</b> Post orderings and bindings, resolve conflicts.</p><p><b>Sussman solution (5).</b> Initial and goal states; common step UNSTACK(C,A), PUTDOWN(C); constraint STACK(B,C) before STACK(A,B); final six-step plan.</p><p><b>Comparison (3).</b> Linear goal stack gives ten steps; non-linear six; linear fails with interacting goals.</p>`)
]},

{id:'m4-11',mod:'m4',title:'Temporal logic and planning',pr:'High',tags:'temporal logic ltl ctl allen interval situation calculus event calculus time planning',
body:`
<div class="def"><b>Temporal logic.</b> A logic for stating and reasoning about how truth changes over time. In planning it expresses time-dependent goals, constraints and durations.</div>
<h2>Linear temporal logic (LTL) operators</h2>
<table><tr><th>Operator</th><th>Name</th><th>Meaning</th></tr>
<tr><td>X p (or ○p)</td><td>Next</td><td>p true in the next state</td></tr>
<tr><td>F p (or ◇p)</td><td>Eventually</td><td>p true at some future time</td></tr>
<tr><td>G p (or □p)</td><td>Always</td><td>p true at all future times</td></tr>
<tr><td>p U q</td><td>Until</td><td>p holds until q becomes true (and q does occur)</td></tr></table>
<p>Examples: G(request → F grant) (every request is eventually granted); G ¬(pit_at_agent) (safety: always avoid pits); F(at_goal) (liveness: eventually reach the goal).</p>
<h2>Branching time (CTL)</h2>
<p>Adds path quantifiers: A (all paths) and E (some path). AG p: on all paths always p. EF p: there is a path where p eventually holds.</p>
<h2>Allen's interval relations</h2>
<p>For two time intervals X and Y: <b>before, meets, overlaps, starts, during, finishes, equals</b> (and their inverses): 13 relations. Used to constrain action durations ("Load <i>before</i> Fly", "Fly <i>during</i> the Fuel period").</p>
<h2>Time in planning</h2>
<ul><li><b>Situation calculus:</b> situations are histories of actions. Successor-state axiom: <code>Holding(x, Result(a,s)) ⇔ a = Pickup(x) ∨ (Holding(x,s) ∧ a ≠ Putdown(x))</code>. Solves the frame problem declaratively.</li><li><b>Event calculus:</b> uses time points: Happens(e,t), Initiates(e,f,t), Terminates(e,f,t), HoldsAt(f,t).</li><li><b>Temporal planning:</b> actions have <b>durations</b>, start and end times, and resource use; the planner outputs a schedule (see Job-shop scheduling).</li></ul>
<h2>Uses and limits</h2>
<p>Used to specify robot goals, verify plans and model deadlines. Model checking temporal formulas can be expensive; real-time constraints require a metric time extension.</p>`,
qa:[
Q(2,`What do the temporal operators F and G mean?`,`F p (eventually): p holds at some future time. G p (always): p holds at all future times.`),
Q(2,`List Allen's interval relations.`,`Before, meets, overlaps, starts, during, finishes, equals, and the inverse of each except equals (13 in total).`),
Q(5,`Explain temporal logic and write LTL formulas for safety and liveness properties.`,`<p>Temporal logic adds time operators to logic: X next, F eventually, G always, U until. Safety ("nothing bad ever happens"): G ¬collision. Liveness ("something good eventually happens"): F at_goal, or G(request → F grant). CTL adds path quantifiers A and E. Used to specify goals and verify plans.</p>`),
Q(13,`Explain how time is represented in planning: temporal logic, situation calculus, event calculus and Allen's relations. Give examples.`,`<p><b>Temporal logic (3).</b> X, F, G, U with examples; CTL A, E.</p><p><b>Allen's relations (3).</b> 13 relations; example constraints.</p><p><b>Situation calculus (3).</b> Result(a,s), successor-state axiom for Holding, frame problem.</p><p><b>Event calculus (2).</b> Happens, Initiates, Terminates, HoldsAt.</p><p><b>Temporal planning (2).</b> Durations, deadlines, resources, schedule output.</p>`)
]},

{id:'m4-12',mod:'m4',title:'Conditional planning',pr:'Medium',tags:'conditional planning contingent sensing if then else partial observability uncertainty',
body:`
<div class="def"><b>Conditional (contingent) planning.</b> Planning for an uncertain or partially observable world by building a plan with <b>branches</b>: sensing actions are inserted and the plan contains <i>if-then-else</i> parts for each possible outcome.</div>
<h2>Purpose</h2>
<p>Classical plans assume a deterministic, observable world. A conditional plan stays valid whatever the world does, because it prepares a branch for each outcome.</p>
<h2>Structure of a conditional plan</h2>
<pre><code>[ CheckTire,
  if Flat then [ OpenTrunk, RemoveSpare, ChangeTire ]
  else [ Drive ] ]</code></pre>
<h2>Working principle</h2>
<ol><li>Identify uncertain facts the plan depends on.</li><li>Add <b>sensing (observation) actions</b> to find their value at run time.</li><li>For each possible outcome, plan a branch (an AND-OR search: OR over actions, AND over outcomes).</li><li>At execution, sense, then follow the matching branch.</li></ol>
<div class="ex"><b>Painting a chair.</b> Unknown: do the paint can and chair colour match? Plan: [LookAtChair, LookAtCan, if Color(Chair)=Color(Can) then [NoOp] else [OpenCan, Paint]].</div>
<h2>Types</h2>
<p><b>Sensorless (conformant)</b> plans: no sensing; work in all states. <b>Contingent</b> plans: branch on observations.</p>
<h2>Advantages and limitations</h2>
<p>Advantages: robust, no re-planning needed, safe for critical tasks. Limitations: plan size grows exponentially with the number of branches, needs a model of all outcomes, cannot handle truly unforeseen events.</p>`,
qa:[
Q(2,`What is a conditional plan?`,`A plan containing sensing actions and if-then-else branches so it works for each possible outcome of an uncertain world.`),
Q(5,`Explain conditional planning with an example. How does it differ from classical planning?`,`<p>Classical planning assumes a deterministic, fully observable world and produces a straight-line sequence. Conditional planning adds sensing actions and branches. Example: [CheckTire, if Flat then [OpenTrunk, RemoveSpare, ChangeTire] else [Drive]]. The planner searches an AND-OR tree: OR over action choices, AND over possible outcomes. It is more robust but its size grows with branching.</p>`),
Q(13,`Discuss conditional planning: need, representation, algorithm (AND-OR search), example, advantages and limitations.`,`<p><b>Need (2).</b> Uncertainty, partial observability.</p><p><b>Representation (3).</b> Sensing actions, if-then-else.</p><p><b>Algorithm (3).</b> AND-OR tree; a plan is a subtree that reaches the goal in every branch.</p><p><b>Example (3).</b> Flat tyre or painting a chair.</p><p><b>Pros and cons (2).</b> Robust vs exponential size.</p>`)
]},

{id:'m4-13',mod:'m4',title:'Reactive planning',pr:'Medium',tags:'reactive planning reflex behaviour subsumption brooks stimulus response',
body:`
<div class="def"><b>Reactive planning.</b> The agent does not build a plan in advance. It chooses an action directly from the current percept using condition-action rules or behaviours. The "plan" is the pattern of behaviour that emerges.</div>
<h2>Idea</h2>
<p>"The world is its own best model." Instead of reasoning about a model, sense and react quickly. Suitable for fast, dynamic, unpredictable environments.</p>
<h2>Mechanisms</h2>
<ul><li><b>Condition-action rules:</b> IF obstacle-ahead THEN turn.</li><li><b>Universal plans / policies:</b> a table mapping every state to an action.</li><li><b>Subsumption architecture (Brooks):</b> layers of behaviour (avoid obstacles, wander, explore, build maps); higher layers can suppress or override lower ones, lower layers keep running.</li><li><b>Behaviour-based control</b> in robots (e.g. vacuum cleaners).</li></ul>
<pre><code>loop:
  percept ← sense()
  action ← RULES[percept]      // highest priority matching rule
  execute(action)</code></pre>
<h2>Comparison</h2>
<table><tr><th></th><th>Deliberative (classical)</th><th>Reactive</th></tr><tr><td>World model</td><td>Explicit</td><td>None or minimal</td></tr><tr><td>Speed</td><td>Slow (plans first)</td><td>Very fast</td></tr><tr><td>Handles change</td><td>Poorly (re-plan)</td><td>Well</td></tr><tr><td>Looks ahead</td><td>Yes</td><td>No</td></tr><tr><td>Goals</td><td>Explicit</td><td>Implicit</td></tr></table>
<h2>Advantages and limitations</h2>
<p>Advantages: real-time response, robust, simple, no model needed. Limitations: no look-ahead so can get stuck (local minima), poor for long-term goals, hard to design rule priorities, cannot optimize.</p>
<p><b>Hybrid:</b> a deliberative layer sets goals while a reactive layer handles execution (three-layer architectures).</p>`,
qa:[
Q(2,`What is reactive planning?`,`Selecting actions directly from the current percept using condition-action rules, with no explicit plan or world model.`),
Q(2,`What is the subsumption architecture?`,`Brooks's layered behaviour architecture in which higher layers can suppress or subsume lower-level behaviours, all running in parallel.`),
Q(5,`Compare reactive and deliberative planning.`,`<p>Deliberative: builds an explicit plan from a world model; looks ahead; slower; fragile if the world changes. Reactive: stimulus-response rules; fast; handles dynamic environments; no look-ahead and may fail on long-term goals. Hybrid architectures combine both.</p>`),
Q(13,`Explain reactive planning: principle, mechanisms (rules, universal plans, subsumption), comparison with deliberative planning, merits and demerits.`,`<p><b>Principle (2).</b> Sense and react, no model.</p><p><b>Mechanisms (4).</b> Condition-action rules, universal plan, subsumption layers.</p><p><b>Comparison (3).</b> Table.</p><p><b>Merits (2), demerits (2).</b> Fast and robust vs no look-ahead.</p>`)
]},

{id:'m4-14',mod:'m4',title:'Replanning',pr:'High',tags:'replanning re-planning plan repair failure recovery execution monitoring',
body:`
<div class="def"><b>Re-planning.</b> Producing a new plan (or repairing the current one) when execution shows that the original plan can no longer succeed, because an action failed or the world changed.</div>
<h2>When is it needed?</h2>
<ul><li>An action fails or has an unexpected effect.</li><li>New information changes the facts.</li><li>The goal changes.</li><li>The plan's preconditions stop holding.</li></ul>
<h2>Approaches</h2>
<table><tr><th>Approach</th><th>Idea</th></tr>
<tr><td><b>Replan from scratch</b></td><td>Treat the current state as the new initial state and plan again. Simple, may discard good work.</td></tr>
<tr><td><b>Plan repair</b></td><td>Keep the valid part of the old plan; patch the broken step by planning a short detour back to the old plan.</td></tr>
<tr><td><b>Continuous replanning</b></td><td>Plan and monitor at every step.</td></tr></table>
<h2>Algorithm</h2>
<pre><code>plan ← PLANNER(state, goal)
while plan not empty:
    action ← FIRST(plan)
    execute(action); state ← observe()
    if state ≠ expected state:                    // failure detected
        plan ← REPAIR(plan, state) or PLANNER(state, goal)
    else plan ← REST(plan)</code></pre>
<div class="ex"><b>Robot delivery.</b> Plan: Pickup, GoToHallway, GoToRoom5. A corridor is blocked at GoToHallway. The monitor sees the robot is not in the hallway; the planner replans from the current location with a detour GoToStairs, GoToRoom5. The Pickup step is kept.</div>
<h2>Advantages and limitations</h2>
<p>Advantages: robust to failure, works in dynamic worlds. Limitations: costs time (may be too slow in real time), may oscillate, irreversible actions can make recovery impossible, needs good failure detection.</p>`,
qa:[
Q(2,`When does an agent need to replan?`,`When an action fails, the world changes unexpectedly, new information appears or the goal changes, so the remaining plan is no longer valid.`),
Q(2,`Differentiate plan repair and replanning from scratch.`,`Plan repair keeps the valid part of the old plan and fixes only the broken portion; replanning from scratch ignores the old plan and plans again from the current state.`),
Q(5,`Explain the re-planning process with the execute-monitor-replan loop.`,`<p>The agent makes a plan, executes one action, observes the state and compares it with the expected state. If they match, continue with the rest of the plan. If not, either repair the plan (patch the broken step and rejoin the old plan) or generate a new plan from the current state. Repeat until the goal is reached.</p>`),
Q(13,`Describe re-planning and plan repair in agents with an algorithm and example. Discuss merits and demerits.`,`<p><b>Need (2).</b> Failures, dynamic worlds.</p><p><b>Approaches (3).</b> From scratch, repair, continuous.</p><p><b>Algorithm (3).</b> Execute-monitor loop.</p><p><b>Example (3).</b> Blocked corridor robot.</p><p><b>Merits (1), demerits (1).</b> Robust; cost and irreversible actions.</p>`)
]},

{id:'m4-15',mod:'m4',title:'Multi-agent planning',pr:'High',tags:'multi agent planning cooperation coordination negotiation centralized distributed conflict joint plan',
body:`
<div class="def"><b>Multi-agent planning.</b> Planning in which several agents act in the same environment. Plans must account for the actions, goals and possible conflicts of the other agents.</div>
<h2>Settings</h2>
<ul><li><b>Cooperative:</b> agents share a common goal (a team of robots moving boxes).</li><li><b>Competitive:</b> goals conflict (game players).</li><li><b>Mixed:</b> partial cooperation (negotiation).</li></ul>
<h2>Approaches</h2>
<table><tr><th>Approach</th><th>Idea</th></tr>
<tr><td><b>Centralized planning</b></td><td>One planner computes a joint plan for all agents; agents just execute. Optimal but does not scale and is a single point of failure.</td></tr>
<tr><td><b>Distributed planning</b></td><td>Each agent plans on its own and the plans are merged and checked for conflicts.</td></tr>
<tr><td><b>Decentralized with coordination</b></td><td>Agents plan locally and coordinate by communication.</td></tr></table>
<h2>Coordination mechanisms</h2>
<ul><li><b>Task allocation:</b> contract net protocol (manager announces a task, agents bid, best bid wins).</li><li><b>Shared plans / joint intentions:</b> agents commit to the group's goal.</li><li><b>Conventions and roles:</b> pre-agreed rules (drive on the left).</li><li><b>Communication:</b> announcing intentions.</li><li><b>Negotiation:</b> resolving resource conflicts.</li></ul>
<h2>Issues</h2>
<p>Concurrent actions (two robots lifting one box), resource conflicts, deadlock, communication cost, trust, and uncertainty about others' intentions.</p>
<div class="ex"><b>Two robots, one tray.</b> Joint goal: carry a tray through a door. Conflict: both want to pass at the same time. Coordination: robot R1 holds the door while R2 passes, then they swap (a joint plan with ordering and synchronization).</div>
<h2>Advantages and limitations</h2>
<p>Advantages: parallel execution, robustness, specialization. Limitations: coordination overhead, exponential growth of joint action space, communication needs, conflicts.</p>`,
qa:[
Q(2,`What is multi-agent planning?`,`Planning for several agents sharing an environment, taking into account their actions and possible conflicts or cooperation.`),
Q(2,`What is the contract net protocol?`,`A task-allocation method: a manager announces a task, agents submit bids, and the manager awards the task to the best bidder.`),
Q(5,`Compare centralized and distributed multi-agent planning.`,`<p>Centralized: a single planner creates a joint plan; optimal and consistent but does not scale and fails if the planner fails. Distributed: each agent plans independently and coordinates by communication or by merging plans; scalable and robust but conflicts must be detected and resolved, and the result may be sub-optimal.</p>`),
Q(13,`Explain multi-agent planning: settings, approaches, coordination mechanisms, issues and an example.`,`<p><b>Settings (2).</b> Cooperative, competitive.</p><p><b>Approaches (3).</b> Centralized, distributed, with coordination.</p><p><b>Mechanisms (4).</b> Contract net, joint intentions, conventions, negotiation.</p><p><b>Issues (2).</b> Conflicts, concurrency, communication.</p><p><b>Example (2).</b> Robots carrying a tray through a door.</p>`)
]},

{id:'m4-16',mod:'m4',title:'Job-shop scheduling',pr:'High',tags:'job shop scheduling critical path makespan resources earliest start latest start slack gantt minimum slack',
body:`
<div class="def"><b>Scheduling.</b> Planning with time and resources: decide <i>when</i> each action happens and with which resource, so that ordering constraints and resource limits are met and a goal such as minimum <b>makespan</b> (total completion time) is achieved. <b>Job-shop scheduling:</b> a set of jobs, each a fixed sequence of actions with durations, competing for limited machines or resources.</div>
<h2>Typical approach</h2>
<p><b>Plan first, then schedule.</b> (1) Use partial-order planning to decide the actions and ordering. (2) Add durations and resources and compute the schedule.</p>
<h2>Critical path method (CPM)</h2>
<ul><li><b>ES(x):</b> earliest start = max over predecessors of (ES + duration).</li><li><b>LS(x):</b> latest start such that the project finish is not delayed.</li><li><b>Slack = LS − ES.</b> Actions with slack 0 are on the <b>critical path</b>.</li><li>Critical path length = minimum possible makespan (ignoring resources).</li></ul>
<h2>Worked example (car assembly)</h2>
<div class="ex">Job 1: AddEngine1 (30) → AddWheels1 (30) → Inspect1 (10).<br>Job 2: AddEngine2 (60) → AddWheels2 (15) → Inspect2 (10).<br>
<table><tr><th>Action</th><th>Duration</th><th>ES</th><th>LS</th><th>Slack</th></tr>
<tr><td>AddEngine1</td><td>30</td><td>0</td><td>15</td><td>15</td></tr>
<tr><td>AddWheels1</td><td>30</td><td>30</td><td>45</td><td>15</td></tr>
<tr><td>Inspect1</td><td>10</td><td>60</td><td>75</td><td>15</td></tr>
<tr><td>AddEngine2</td><td>60</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>AddWheels2</td><td>15</td><td>60</td><td>60</td><td>0</td></tr>
<tr><td>Inspect2</td><td>10</td><td>75</td><td>75</td><td>0</td></tr></table>
Critical path: AddEngine2 → AddWheels2 → Inspect2, length 60 + 15 + 10 = <b>85</b>. Job 1 can slip by 15 without delay.</div>
<h2>Adding resource constraints</h2>
<p>Suppose there is <b>one engine hoist</b>, <b>one wheel station</b> and <b>two inspectors</b>. Both engines need the same hoist, so they cannot overlap. Best schedule:</p>
<div data-w="gantt"></div>
<p>Engine1 0–30, Engine2 30–90, Wheels1 30–60, Wheels2 90–105, Inspect1 60–70, Inspect2 105–115. <b>Makespan 115</b> (longer than 85 because of the shared hoist). Starting Engine2 first would give Engine2 0–60, Engine1 60–90, Wheels2 60–75, Wheels1 90–120, makespan 130, so ordering matters.</p>
<h2>Heuristics</h2>
<p><b>Minimum slack:</b> schedule the unscheduled action with the least slack first. Also: shortest/longest processing time, backtracking and iterative repair for resource conflicts.</p>
<h2>Limits</h2>
<p>Job-shop scheduling is NP-hard; the critical-path method ignores resource conflicts; real problems need heuristics and local search.</p>`,
qa:[
Q(2,`What is slack in scheduling?`,`Slack = LS − ES, the amount an action can be delayed without delaying the whole project. Zero slack means the action is on the critical path.`),
Q(2,`What is makespan?`,`The total time from the start of the first action to the completion of the last one in a schedule.`),
Q(5,`Explain the critical path method with ES and LS computation.`,`<p>ES of an action = max over its predecessors of (ES + duration), with Start at 0. LS is computed backward from the finish: LS(x) = min over successors (LS(succ)) − duration(x), with Finish LS = project length. Slack = LS − ES. Actions with zero slack form the critical path, whose length is the shortest possible makespan if resources are unlimited.</p>`),
Q(13,`Two jobs: Job1 AddEngine1 (30), AddWheels1 (30), Inspect1 (10). Job2 AddEngine2 (60), AddWheels2 (15), Inspect2 (10). Find the critical path, ES/LS table and slack. Then schedule with one engine hoist.`,`<p><b>ES/LS (4).</b> Table with ES: 0, 30, 60, 0, 60, 75; LS: 15, 45, 75, 0, 60, 75; slack 15, 15, 15, 0, 0, 0.</p><p><b>Critical path (2).</b> AddEngine2 → AddWheels2 → Inspect2 = 85.</p><p><b>Resource schedule (5).</b> One hoist ⇒ engines in sequence. Engine1 0–30, Engine2 30–90; Wheels1 30–60, Wheels2 90–105; Inspect1 60–70, Inspect2 105–115. Makespan 115.</p><p><b>Conclusion (2).</b> Resource constraints raise the makespan above the critical-path bound.</p>`)
]},

{id:'m4-17',mod:'m4',title:'Knowledge-based planning',pr:'Medium',tags:'knowledge based planning situation calculus logical planning kb domain knowledge case based',
body:`
<div class="def"><b>Knowledge-based planning.</b> Planning that uses an explicit knowledge base of domain facts, rules and previous experience to guide plan generation, instead of searching blindly.</div>
<h2>Forms</h2>
<ul><li><b>Logical planning:</b> state the problem in logic (situation calculus) and prove that a goal holds in some situation. The plan is read from the proof: <code>∃s Goal(s)</code>, where s = Result(a₂, Result(a₁, S₀)).</li><li><b>Hierarchical (HTN) planning:</b> stored methods encode expert knowledge.</li><li><b>Case-based planning:</b> retrieve a similar past plan from a library, adapt it, store the new one.</li><li><b>Heuristic and domain-specific knowledge:</b> control rules say which operator to prefer.</li></ul>
<h2>Case-based planning cycle</h2>
<ol><li><b>Retrieve</b> a similar case.</li><li><b>Adapt</b> it to the new problem.</li><li><b>Execute and evaluate.</b></li><li><b>Retain</b> the new plan.</li></ol>
<div class="ex">Situation-calculus plan for the monkey and bananas: prove ∃s Has(Monkey, Bananas, s). Axioms say Climb(Box) requires AtBox and the successor-state axiom says Has holds after Grab if Height is reached. The proof yields: Go(Box), Push(Box, Under bananas), Climb, Grab.</div>
<h2>Advantages and limitations</h2>
<table><tr><th>Advantages</th><th>Limitations</th></tr><tr><td>Faster, reuses experience, plans explainable, expert knowledge captured</td><td>Knowledge engineering effort; incomplete or wrong knowledge gives bad plans; retrieval and adaptation are hard</td></tr></table>`,
qa:[
Q(2,`What is knowledge-based planning?`,`Planning that uses an explicit knowledge base of domain facts, rules or past plans to guide the generation of plans.`),
Q(5,`Explain case-based planning with its four steps.`,`<p>Retrieve a stored plan for a similar problem, adapt it to the differences, execute and evaluate it, then retain the new plan in the case library. Benefit: faster than planning from scratch; limit: needs a good similarity measure and adaptation rules.</p>`),
Q(13,`Discuss knowledge-based planning: logical (situation calculus), HTN and case-based approaches with advantages and limitations.`,`<p><b>Concept (2).</b> Use of explicit knowledge.</p><p><b>Logical (3).</b> Prove ∃s Goal(s) in situation calculus; extract the plan.</p><p><b>HTN (2).</b> Methods as expert knowledge.</p><p><b>Case-based (4).</b> Retrieve, adapt, evaluate, retain.</p><p><b>Pros and cons (2).</b></p>`)
]},

{id:'m4-18',mod:'m4',title:'Execution monitoring',pr:'Medium',tags:'execution monitoring plan monitoring action monitoring failure detection triangle table',
body:`
<div class="def"><b>Execution monitoring.</b> Checking, while a plan executes, that the world is as the plan expects, so that failures and unexpected changes are detected and handled.</div>
<h2>Why</h2>
<p>Real worlds are non-deterministic: actions fail, other agents interfere, sensors give new facts. A plan executed blindly may fail silently.</p>
<h2>Types</h2>
<table><tr><th>Type</th><th>What is checked</th></tr>
<tr><td><b>Action monitoring</b></td><td>Before an action, are its preconditions true? After it, did it have the expected effect?</td></tr>
<tr><td><b>Plan monitoring</b></td><td>Are the preconditions of <i>all remaining</i> steps still achievable? (the rest of the plan)</td></tr>
<tr><td><b>Goal monitoring</b></td><td>Is the goal still relevant? Is there a better goal?</td></tr></table>
<h2>Procedure</h2>
<pre><code>for each action a in plan:
    if not PRECONDITIONS(a) hold in sensed state: signal failure; REPLAN
    execute(a)
    if not EXPECTED-EFFECTS(a) hold after sensing: signal failure; REPLAN</code></pre>
<h2>Triangle table</h2>
<p>A tool (STRIPS/PLANEX) that records for each step the conditions required from the initial state and from earlier steps. At run time the executor finds the <b>latest</b> step whose kernel (needed conditions) is true, so it can skip finished steps or redo a failed one without full replanning.</p>
<h2>Responses to failure</h2>
<p>Retry the action, repair the plan, replan from scratch, or abort and report.</p>
<h2>Limits</h2>
<p>Needs reliable sensing; monitoring has a cost; some failures are visible only late.</p>`,
qa:[
Q(2,`What is execution monitoring?`,`Observing the world during plan execution and comparing it with what the plan expects, to detect failures and trigger a response.`),
Q(2,`What is a triangle table?`,`A table (used in PLANEX) that records the conditions each step needs, allowing the executor to pick the correct step to continue from after a deviation.`),
Q(5,`Explain action monitoring and plan monitoring.`,`<p>Action monitoring checks that an action's preconditions hold before it runs and that its effects appear after. Plan monitoring checks whether the remaining steps can still be executed from the current state. Any mismatch triggers a response: retry, repair, or replan.</p>`),
Q(13,`Explain execution monitoring: need, types, procedure, triangle tables, and the failure responses.`,`<p><b>Need (2).</b> Non-deterministic world.</p><p><b>Types (3).</b> Action, plan, goal monitoring.</p><p><b>Procedure (3).</b> Check preconditions, execute, check effects.</p><p><b>Triangle table (3).</b> Kernels, choose the latest satisfied step.</p><p><b>Responses (2).</b> Retry, repair, replan, abort.</p>`)
]},

{id:'m4-19',mod:'m4',title:'Continuous planning',pr:'Medium',tags:'continuous planning online interleaving planning execution always running dynamic',
body:`
<div class="def"><b>Continuous planning.</b> The agent never stops planning: it interleaves planning, execution and monitoring in one ongoing process, so plans are constantly extended and revised as the world and the goals change.</div>
<h2>Idea</h2>
<p>Classic planning is plan-then-execute. Continuous planning is a loop: work on the next part of the plan, act, observe, adjust. New goals can arrive at any time.</p>
<h2>Characteristics</h2>
<ul><li>Incremental, partial plans: only the near future is planned in detail.</li><li>Uses a partial-order planner so existing plans are extended.</li><li>Merges <b>planning, execution, monitoring and replanning</b>.</li><li>Handles goals added, dropped or changed at run time.</li></ul>
<h2>Loop</h2>
<pre><code>loop forever:
    percept ← sense(); update state and goals
    if a step is executable and its preconditions hold: execute it
    else if a precondition is open or a plan step failed: repair or extend the plan
    if a new goal appears: add it to the current partial plan
    remove completed steps and goals</code></pre>
<div class="ex"><b>Warehouse robot.</b> It carries order 1 while order 2 arrives. It adds order 2 to its partial plan, reorders pickups for a shorter route, and replans locally when a corridor is blocked. The plan is never "finished".</div>
<h2>Comparison</h2>
<table><tr><th></th><th>Classical</th><th>Continuous</th></tr><tr><td>Order</td><td>Plan, then execute</td><td>Interleaved</td></tr><tr><td>Goals</td><td>Fixed</td><td>Can change</td></tr><tr><td>World</td><td>Static</td><td>Dynamic</td></tr><tr><td>Plan</td><td>Complete</td><td>Partial, evolving</td></tr></table>
<h2>Advantages and limitations</h2>
<p>Advantages: adapts to change, responsive, handles new goals. Limitations: no global optimality, plan stability issues, risk of short-sighted decisions, heavier computation.</p>`,
qa:[
Q(2,`What is continuous planning?`,`An approach where the agent keeps planning while it executes, interleaving planning, execution and monitoring, and adjusting plans as the world and goals change.`),
Q(5,`Differentiate classical and continuous planning with an example.`,`<p>Classical planning builds a complete plan for a fixed goal in a static world and then executes it. Continuous planning interleaves planning and acting, keeps a partial plan, and revises it as new goals or events appear. Example: a warehouse robot adds a new order to its current plan and reroutes around a blocked aisle without starting from scratch.</p>`),
Q(13,`Explain continuous planning: motivation, working loop, characteristics, example and limitations.`,`<p><b>Motivation (2).</b> Dynamic worlds, changing goals.</p><p><b>Loop (3).</b> Sense, execute, repair, add goals.</p><p><b>Characteristics (3).</b> Partial plans, interleaving, monitoring.</p><p><b>Example (3).</b> Warehouse robot.</p><p><b>Limits (2).</b> Not globally optimal, instability.</p>`)
]}
];
const T=[...T3,...T4];
export {MODS,T};
