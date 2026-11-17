/* CSD 3102 Artificial Intelligence Techniques · CAT-2 · 28 Oct 2025 · 50 marks · 90 min
   Answers are written the way a student should write them in the exam. */
export const PAPER = [
  {
    part: 'Part A: 5 × 2 = 10 marks',
    qs: [
      {
        n: '1', m: 2, kl: 'CO3 KL1',
        q: 'Define knowledge-based agent.',
        a: `<p>A <b>knowledge-based agent</b> keeps an explicit <b>knowledge base (KB)</b>, a set of sentences in a formal language, and uses an <b>inference engine</b> to derive new sentences and choose its action.</p>
<p>It is <b>told</b> what it perceives and <b>asked</b> what to do: <code>TELL(KB, percept)</code>, <code>action ← ASK(KB, query)</code>, <code>TELL(KB, action)</code>. Changing the KB changes the behaviour without rewriting the program.</p>`,
      },
      {
        n: '2', m: 2, kl: 'CO3 KL2',
        q: 'Distinguish between forward chaining and backward chaining.',
        a: `<table><tr><th></th><th>Forward chaining</th><th>Backward chaining</th></tr>
<tr><td>Direction</td><td>Data-driven: facts to conclusions</td><td>Goal-driven: query back to facts</td></tr>
<tr><td>Starts from</td><td>Known facts</td><td>The goal (query)</td></tr>
<tr><td>Process</td><td>Fire every rule whose premises hold, add its conclusion, repeat</td><td>Find rules whose conclusion is the goal, then prove their premises as sub-goals</td></tr>
<tr><td>Effort</td><td>May derive many irrelevant facts</td><td>Explores only rules relevant to the goal</td></tr>
<tr><td>Suits</td><td>Monitoring, deriving all consequences</td><td>Diagnosis, answering one question</td></tr></table>`,
      },
      {
        n: '3', m: 2, kl: 'CO3 KL1',
        q: 'State the purpose of predicate logic.',
        a: `<p>Predicate (first-order) logic lets an agent represent <b>objects, their properties and the relations between them</b>, and make statements about <b>all</b> (∀) or <b>some</b> (∃) objects, which propositional logic cannot do.</p>
<p>Example: <code>∀x Man(x) → Mortal(x)</code> is one sentence for every man. In the Wumpus world one sentence <code>∀x,y Breezy(x,y) ⇔ ∃a,b Adjacent([x,y],[a,b]) ∧ Pit([a,b])</code> replaces 16 propositional ones.</p>`,
      },
      {
        n: '4', m: 2, kl: 'CO4 KL1',
        q: 'Mention any two types of planning strategies.',
        a: `<ol><li><b>Forward (progression) state-space planning</b>: search from the initial state, applying every applicable action until the goal holds.</li>
<li><b>Backward (regression) state-space planning</b>: search from the goal, using only relevant actions: <code>g′ = (g − ADD(a)) ∪ PRE(a)</code>.</li></ol>
<p>Others: partial-order planning (least commitment on ordering) and hierarchical task network (HTN) planning.</p>`,
      },
      {
        n: '5', m: 2, kl: 'CO4 KL1',
        q: 'Give an example for mutual exclusion.',
        a: `<p>Two actions or literals are <b>mutually exclusive (mutex)</b> in a planning graph if they cannot occur or hold together.</p>
<p><b>Example (have-cake).</b> <code>Eat(Cake)</code> deletes <code>Have(Cake)</code>, so <code>Eat(Cake)</code> and the persistence (no-op) of <code>Have(Cake)</code> are mutex (inconsistent effects). Hence <code>Have(Cake)</code> and <code>Eaten(Cake)</code> are mutex at level S₁, and the goal <code>Have ∧ Eaten</code> is not reachable until S₂.</p>
<p>Simpler: <code>At(Robot, A)</code> and <code>At(Robot, B)</code> cannot both be true.</p>`,
      },
    ],
  },
  {
    part: 'Part B: 2 × 16 = 32 marks',
    qs: [
      {
        n: '6a', m: 16, kl: 'CO3 KL2',
        q: 'Describe the Wumpus World environment and explain how an agent can use logic to survive in it.',
        a: `<div data-w="vids:q-6a"></div>
<div class="def"><b>Wumpus world.</b> A 4×4 cave of rooms. A monster (the wumpus) sits in one room, some rooms hold bottomless pits, and one room holds gold. The agent starts at [1,1], must grab the gold and climb out alive. It is the standard testbed for knowledge-based agents.</div>
<h4>PEAS description (4 marks)</h4>
<table><tr><th>Part</th><th>Wumpus world</th></tr>
<tr><td>Performance</td><td>+1000 for climbing out with the gold, −1000 for death, −1 per action, −10 for using the arrow</td></tr>
<tr><td>Environment</td><td>4×4 grid; agent starts at [1,1] facing right; wumpus, gold and pits placed at random (never at the start)</td></tr>
<tr><td>Actuators</td><td>Forward, TurnLeft, TurnRight, Grab, Shoot (one arrow), Climb</td></tr>
<tr><td>Sensors</td><td>Stench, Breeze, Glitter, Bump, Scream</td></tr></table>
<h4>Percepts and properties (3 marks)</h4>
<ul><li><b>Stench</b> in the wumpus room and the rooms next to it. <b>Breeze</b> in rooms next to a pit. <b>Glitter</b> where the gold is. <b>Bump</b> on hitting a wall. <b>Scream</b> when the wumpus dies.</li>
<li>Environment: discrete, static, sequential, single agent, <b>partially observable</b> and deterministic.</li></ul>
<h4>How the agent uses logic (6 marks)</h4>
<p>The KB stores the rules of the world and every percept. For each square [x,y]:</p>
<pre>B[x,y] ⇔ P[x+1,y] ∨ P[x−1,y] ∨ P[x,y+1] ∨ P[x,y−1]    (breeze iff a neighbour has a pit)
S[x,y] ⇔ W[x+1,y] ∨ W[x−1,y] ∨ W[x,y+1] ∨ W[x,y−1]    (stench iff a neighbour has the wumpus)
¬P[1,1], ¬W[1,1]                                        (start is safe)
exactly one wumpus: W[1,1] ∨ … ∨ W[4,4], and ¬W[a] ∨ ¬W[b] for a ≠ b
OK[x,y] ⇔ ¬P[x,y] ∧ ¬W[x,y]                             (safe room)</pre>
<p>At each step the agent <code>TELL</code>s the percept, then <code>ASK</code>s which rooms are <code>OK</code>, and moves only to proven-safe rooms. <b>Absence of a percept is information:</b> no breeze at a room proves all four neighbours are pit-free.</p>
<table><tr><th>Step</th><th>At</th><th>Percept</th><th>Deduction</th></tr>
<tr><td>1</td><td>[1,1]</td><td>none</td><td>¬B, ¬S ⇒ [1,2] and [2,1] are safe</td></tr>
<tr><td>2</td><td>[2,1]</td><td>Breeze</td><td>Pit at [2,2] or [3,1]. Go back to [1,1]</td></tr>
<tr><td>3</td><td>[1,2]</td><td>Stench</td><td>Wumpus at [1,3] or [2,2]; ¬S[2,1] rules out [2,2], so wumpus at [1,3]. ¬B[1,2] rules out a pit at [2,2], so the pit is at [3,1]</td></tr>
<tr><td>4</td><td>[2,2]</td><td>none</td><td>[2,3] and [3,2] are safe</td></tr>
<tr><td>5</td><td>[2,3]</td><td>Glitter, Breeze, Stench</td><td>Grab the gold, return along safe rooms, Climb</td></tr></table>
<div data-w="wumpus"></div>
<h4>Limits (1 mark)</h4>
<p>Propositional logic needs a rule per square (very many sentences); first-order logic is more compact. Logic cannot choose between two equally uncertain rooms, which needs probability.</p>`,
      },
      {
        n: '6b(i)', m: 8, kl: 'CO3 KL2', or: true,
        q: 'Discuss the significance and properties of knowledge representation.',
        a: `<div class="def"><b>Knowledge representation (KR)</b> is the study of how to encode facts, rules and relationships about the world in a form a computer can store, reason with and use to decide what to do.</div>
<h4>Significance (4 marks)</h4>
<ul><li>An intelligent agent needs more than raw data: it must <b>store</b> what it knows, <b>derive</b> new facts and <b>act</b> on them.</li>
<li>KR gives a formal language with defined meaning, so conclusions are precise and explainable.</li>
<li>It separates knowledge from the program: the KB can be extended or corrected without rewriting the code.</li>
<li>It is the basis of knowledge-based agents, expert systems and planning.</li></ul>
<table><tr><th>Type of knowledge</th><th>Example</th></tr>
<tr><td>Declarative (facts)</td><td>Delhi is the capital of India</td></tr>
<tr><td>Procedural (how to)</td><td>Steps to solve a quadratic equation</td></tr>
<tr><td>Heuristic</td><td>Check the fuel first when a car will not start</td></tr>
<tr><td>Structural</td><td>A dog is a mammal and has four legs</td></tr></table>
<h4>Properties of a good scheme (4 marks)</h4>
<table><tr><th>Property</th><th>Meaning</th></tr>
<tr><td>Representational adequacy</td><td>Can express all the knowledge needed</td></tr>
<tr><td>Inferential adequacy</td><td>Can derive new knowledge from old</td></tr>
<tr><td>Inferential efficiency</td><td>Can direct inference toward promising paths</td></tr>
<tr><td>Acquisitional efficiency</td><td>New knowledge is easy to add</td></tr></table>
<p>Techniques: logic (precise, sound inference), semantic networks (visual, inheritance), frames (defaults, grouped slots), production rules (modular, explainable).</p>`,
      },
      {
        n: '6b(ii)', m: 8, kl: 'CO3 KL2', or: true,
        q: 'Explicate the components of semantic networks.',
        a: `<div class="def"><b>Semantic network.</b> A graph in which <b>nodes</b> represent concepts or objects and <b>labelled directed arcs</b> represent relations between them.</div>
<h4>Components (4 marks)</h4>
<table><tr><th>Component</th><th>Role</th><th>Example</th></tr>
<tr><td>Nodes</td><td>Concepts (classes) and individual objects</td><td>Bird, Canary, Tweety</td></tr>
<tr><td>Arcs (links)</td><td>Labelled relations between nodes</td><td>isa, instance, has, can</td></tr>
<tr><td><b>isa / AKO</b> link</td><td>Class is a subclass of another class</td><td>Canary isa Bird</td></tr>
<tr><td><b>instance</b> link</td><td>Object is a member of a class</td><td>Tweety instance Canary</td></tr>
<tr><td>Property links</td><td>Attributes and parts</td><td>Bird can Fly; Animal has Skin</td></tr>
<tr><td>Inheritance procedure</td><td>Follow isa and instance links upward until a value is found</td><td>Tweety can fly, because Bird can fly</td></tr></table>
<div data-w="diag:semnet"></div>
<h4>Working (3 marks)</h4>
<p>Properties flow down isa and instance links. <i>Does Tweety have skin?</i> Tweety → Canary → Bird → Animal, and Animal has skin, so yes. <b>Exceptions</b> are stored lower in the hierarchy: Penguin cannot fly overrides the Bird default, and the lowest value found wins.</p>
<h4>Advantages and limits (1 mark)</h4>
<p>Natural, visual and efficient inheritance. But links have no standard semantics, and negation, disjunction and quantifiers are hard to express. Conversion to logic: <code>Canary(Tweety)</code>, <code>∀x Canary(x) → Bird(x)</code>.</p>`,
      },
      {
        n: '7a(i)', m: 8, kl: 'CO4 KL3',
        q: 'Illustrate the architecture and working of a simple planning agent.',
        a: `<div class="def"><b>Simple planning agent.</b> An agent that perceives the world, builds a state description, formulates a goal, runs a planner to get a sequence of actions, then executes the plan one action at a time.</div>
<div data-w="diag:agent"></div>
<h4>Algorithm (4 marks)</h4>
<pre>function SIMPLE-PLANNING-AGENT(percept) returns an action
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
  return action</pre>
<h4>Working (3 marks)</h4>
<ol><li>Perceive and record the percept in the KB.</li><li>Compute the current state description.</li><li>If no plan exists, ask the KB for the goal and call the planner.</li><li>Execute the first action, keep the rest of the plan.</li><li>On later steps keep executing the stored plan.</li></ol>
<h4>Limits (1 mark)</h4>
<p>It assumes a deterministic, static world so the stored plan stays valid. If an action fails or the world changes the plan is wrong, which motivates execution monitoring and re-planning.</p>`,
      },
      {
        n: '7a(ii)', m: 8, kl: 'CO4 KL2',
        q: 'Elaborate the means-ends analysis with its algorithm and example.',
        a: `<div class="def"><b>Means-ends analysis (MEA).</b> The strategy of the General Problem Solver (Newell and Simon). It finds the <b>difference</b> between the current state and the goal, picks an <b>operator</b> that reduces it, and recursively solves the sub-problems of satisfying the operator's preconditions and reaching the goal afterwards.</div>
<h4>Algorithm (3 marks)</h4>
<pre>MEA(current, goal):
  if current = goal: return success
  D ← most important difference between current and goal
  O ← operator relevant to reducing D          (from the difference table)
  if O's preconditions not true in current:
      MEA(current, preconditions of O)         // sub-problem 1: make O applicable
  apply O → new state
  MEA(new state, goal)                         // sub-problem 2: continue to the goal</pre>
<h4>Example: move a desk with two objects on it (4 marks)</h4>
<table><tr><th>Operator</th><th>Preconditions</th><th>Reduces</th></tr>
<tr><td>PUSH(obj, loc)</td><td>at(robot,obj) ∧ large(obj) ∧ clear(obj) ∧ armempty</td><td>object location</td></tr>
<tr><td>CARRY(obj, loc)</td><td>at(robot,obj) ∧ small(obj)</td><td>object location</td></tr>
<tr><td>WALK(loc)</td><td>none</td><td>robot location</td></tr>
<tr><td>PICKUP / PUTDOWN</td><td>at(robot,obj) / holding(obj)</td><td>holding</td></tr>
<tr><td>PLACE(o1, o2)</td><td>at(robot,o2) ∧ holding(o1)</td><td>on relation</td></tr></table>
<ol><li>Difference: desk location. Operator <code>PUSH(desk, B)</code>.</li>
<li>Its preconditions fail (robot not at the desk, desk not clear). Each unsatisfied precondition is a new difference.</li>
<li>Sub-goals: <code>WALK(desk)</code>; move the objects off the desk (<code>PICKUP</code>, <code>PUTDOWN</code> or <code>CARRY</code>).</li>
<li>Apply <code>PUSH(desk, B)</code>, then restore the objects with <code>PLACE</code>.</li></ol>
<p><b>Blocks-world view.</b> Difference ON(A,B) is false → operator <code>STACK(A,B)</code> → new differences HOLDING(A) and CLEAR(B) → <code>PICKUP(A)</code>. Goal-stack planning is MEA specialised to STRIPS operators.</p>
<p>Differences are ordered by importance, biggest first. Limits: not always optimal, and operators with interacting sub-goals (Sussman anomaly) can fail.</p>`,
      },
      {
        n: '7b(i)', m: 8, kl: 'CO4 KL2', or: true,
        q: 'Enumerate the properties of partial order planning.',
        a: `<div class="def"><b>Partial-order planning (POP).</b> Searches the space of <b>plans</b> rather than states. A plan commits only to the ordering constraints that are needed; any total order consistent with them is a solution.</div>
<h4>Properties (6 marks)</h4>
<ol><li><b>Least commitment.</b> An order is chosen only when forced, so independent sub-goals (left sock, right sock) need no relative order.</li>
<li><b>Plan-space search.</b> Nodes are partial plans, edges are plan refinements.</li>
<li><b>A partial plan has four parts:</b> steps (always including Start and Finish), ordering constraints <code>A ≺ B</code>, causal links <code>A –p→ B</code>, and open preconditions.</li>
<li><b>Causal links</b> protect a condition p from A to B.</li>
<li><b>Threat resolution.</b> A step C that may delete p between A and B is resolved by <i>demotion</i> (C ≺ A) or <i>promotion</i> (B ≺ C); otherwise backtrack.</li>
<li><b>Sound and complete</b> when searched systematically, and it avoids the Sussman anomaly.</li>
<li><b>Flexible output.</b> Many linearizations, so steps can run in parallel (shoes and socks: 6 valid orders).</li></ol>
<div data-w="diag:pop"></div>
<h4>Algorithm (2 marks)</h4>
<pre>initial plan: {Start, Finish}, Start ≺ Finish, open preconditions = goal
loop:
  if no open preconditions and no threats: return plan
  pick an open precondition p of some step B
  choose an action A (existing or new) that adds p
  add causal link A –p→ B and order A ≺ B; add A's preconditions as open
  resolve every threat by promotion or demotion; backtrack on inconsistency</pre>`,
      },
      {
        n: '7b(ii)', m: 8, kl: 'CO4 KL2', or: true,
        q: 'Explain the techniques used to handle dynamic environments and job shop scheduling problems.',
        a: `<h4>Dynamic environments (4 marks)</h4>
<p>Classical planning assumes a static, deterministic world. When the world changes during execution these techniques keep the agent working:</p>
<table><tr><th>Technique</th><th>Idea</th></tr>
<tr><td>Execution monitoring</td><td>Compare the observed state with the expected state after each action and detect failure or changed conditions</td></tr>
<tr><td>Re-planning</td><td>Plan again from the current state (from scratch) or <b>repair</b> the old plan with a short detour. Example: corridor blocked, so GoToStairs then GoToRoom5</td></tr>
<tr><td>Conditional planning</td><td>Plan branches for each contingency, with sensing actions to choose the branch at run time</td></tr>
<tr><td>Reactive planning</td><td>Condition-action rules react immediately with no look-ahead</td></tr>
<tr><td>Continuous planning</td><td>Interleave planning, execution and monitoring; goals can be added at any time</td></tr></table>
<pre>plan ← PLANNER(state, goal)
while plan not empty:
    action ← FIRST(plan); execute(action); state ← observe()
    if state ≠ expected: plan ← REPAIR(plan, state) or PLANNER(state, goal)
    else plan ← REST(plan)</pre>
<h4>Job-shop scheduling (4 marks)</h4>
<p><b>Scheduling</b> is planning with time and resources. A <b>job-shop problem</b> has jobs, each a fixed sequence of actions with durations, competing for limited resources; the goal is a minimum <b>makespan</b>. It is NP-hard.</p>
<ul><li><b>Plan first, then schedule:</b> a partial-order planner fixes actions and order; then durations and resources are added.</li>
<li><b>Critical path method:</b> ES = earliest start; LS = latest start without delaying the finish; slack = LS − ES. Zero slack means the action is on the critical path.</li>
<li><b>Resource constraints</b> (one engine hoist) stop actions overlapping.</li>
<li><b>Heuristics:</b> least slack first, shortest or longest processing time, iterative repair.</li></ul>
<table><tr><th>Car assembly</th><th>Dur.</th><th>ES</th><th>LS</th><th>Slack</th></tr>
<tr><td>AddEngine1 → AddWheels1 → Inspect1</td><td>30, 30, 10</td><td>0, 30, 60</td><td>15, 45, 75</td><td>15</td></tr>
<tr><td>AddEngine2 → AddWheels2 → Inspect2</td><td>60, 15, 10</td><td>0, 60, 75</td><td>0, 60, 75</td><td>0 (critical)</td></tr></table>
<p>Critical path length = 60 + 15 + 10 = <b>85</b>. With one hoist, Engine1 runs 0–30 and Engine2 30–90, giving makespan <b>115</b>; starting Engine2 first gives 130. Order matters.</p>`,
      },
    ],
  },
  {
    part: 'Part C: 1 × 8 = 8 marks',
    qs: [
      {
        n: '8a', m: 8, kl: 'CO4 KL5',
        q: 'Develop an algorithm for continuous planning enabling the robots to dynamically adjust their tasks and routes to handle new orders and unexpected obstacles in a smart warehouse.',
        a: `<div class="def"><b>Continuous planning.</b> The agent never stops planning: it interleaves planning, execution and monitoring in one loop, so plans are extended and revised as orders arrive and the world changes. Only the near future is planned in detail.</div>
<h4>Data (1 mark)</h4>
<ul><li><code>MAP</code>: warehouse grid with blocked cells. <code>ORDERS</code>: queue of pick tasks. <code>PLAN[r]</code>: partial plan of each robot r (route plus task order).</li>
<li>Operators: <code>MoveTo(cell)</code>, <code>Pick(item)</code>, <code>Drop(station)</code>, <code>Wait</code>.</li></ul>
<h4>Algorithm (5 marks)</h4>
<pre>loop forever:
  percepts ← SENSE()                         // positions, new orders, blocked cells
  UPDATE(MAP, ORDERS, robot states)

  for each new order o in ORDERS:             // handle new orders
      r ← robot with lowest cost to add o     (distance + queued load)
      INSERT o into PLAN[r] at the position giving the shortest route
      add o's preconditions as open sub-goals (reach shelf, pick, reach station)

  for each robot r:
      step ← FIRST(PLAN[r])
      if step.preconditions hold and next cell is free (reservation table):
          EXECUTE(step)
      else if next cell blocked or reserved:   // unexpected obstacle
          REPAIR(PLAN[r]): A* from current cell to the next waypoint
                           avoiding blocked cells; keep the rest of the plan
          if no route: reassign r's orders to other robots, or Wait
      if observed state ≠ expected state:      // execution monitoring
          REPAIR(PLAN[r])

  REMOVE completed steps and orders
  re-optimise task order of each partial plan (shorter route) when idle</pre>
<h4>Example (1 mark)</h4>
<p>Robot R1 carries order 1 to the packing station when order 2 arrives. The planner inserts order 2 on R1's route because it is on the way, so the pickup order is rearranged to shorten the trip. A corridor then becomes blocked: R1 replans locally with A* through the next aisle and keeps the rest of its plan.</p>
<h4>Properties (1 mark)</h4>
<p>Adapts to new goals and obstacles, and only replans the broken part. Limits: no global optimum, plans may oscillate, short-sighted choices and heavier computation; a reservation table avoids robot collisions.</p>`,
      },
      {
        n: '8b', m: 8, kl: 'CO4 KL4', or: true,
        q: 'Justify the effectiveness of the vacuum world environment in demonstrating the functioning of intelligent agents using a smart home vacuum robot in Artificial Intelligence.',
        a: `<div data-w="vids:q-8b"></div>
<div class="def"><b>Vacuum world.</b> The standard teaching environment for intelligent agents: squares A and B, each Clean or Dirty, and a vacuum agent that senses its location and local dirt and can move Left, Right or Suck. It has 2 × 2 × 2 = 8 states.</div>
<h4>PEAS of the smart home vacuum robot (2 marks)</h4>
<table><tr><th>Part</th><th>Smart home vacuum</th></tr>
<tr><td>Performance</td><td>+1 per clean square per time step; small penalty per move and for battery use</td></tr>
<tr><td>Environment</td><td>Rooms of the home (squares), dirt, furniture, pets, charging dock</td></tr>
<tr><td>Actuators</td><td>Wheels (Left, Right), suction (Suck), NoOp / dock</td></tr>
<tr><td>Sensors</td><td>Location sensor, dirt sensor, bump sensor, battery level</td></tr></table>
<h4>Why it is effective for demonstrating agents (5 marks)</h4>
<ol><li><b>Small and fully specified.</b> All 8 states and the percept-to-action table can be written out: <code>[A,Dirty]→Suck</code>, <code>[A,Clean]→Right</code>, <code>[B,Dirty]→Suck</code>, <code>[B,Clean]→Left</code>. It shows clearly what a percept, an action and an agent function are.</li>
<li><b>Shows rationality.</b> Whether the agent is rational depends on the performance measure. Penalise movement and the shuttling reflex agent stops being rational, which separates a perfect agent from a rational one.</li>
<li><b>One environment, every agent type.</b> Simple reflex (table above) → model-based (remembers which squares are clean, avoids shuttling) → goal-based (plans a cleaning route and a trip to the dock) → utility-based (trades battery against coverage) → learning (builds a map of the home).</li>
<li><b>Environment properties can be varied.</b> Add a faulty Suck (stochastic), a local-only dirt sensor (partially observable), or dirt that reappears (dynamic) and see how the agent design must change.</li>
<li><b>Maps directly to a real product.</b> Squares become rooms; dirt, bump and battery sensors match a smart home robot, so the lessons transfer.</li></ol>
<h4>Limitation (1 mark)</h4>
<p>It is a toy: it has no uncertainty about the rules, no knowledge base or other agents. Those are added by the Wumpus world (logic) and by multi-agent and continuous planning.</p>`,
      },
    ],
  },
];
