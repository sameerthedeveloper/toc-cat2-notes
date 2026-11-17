const MODS={m3:'Module III · Regular languages (selected)',m4:'Module IV · Context-free grammars',m5:'Module V · Pushdown automata & Turing machines'};
const Q=(m,q,a)=>({m,q,a});

const STEPS={
se:[
 ['Given DFA','States A (start) and B (final). A–0→A, A–1→B, B–0→B, B–1→A. Language: strings with an odd number of 1s.'],
 ['Add new start S and new final F','S –ε→ A. B –ε→ F. Now there is exactly one start (no incoming edges) and one final (no outgoing edges). Final status of B is dropped.'],
 ['Eliminate B','Paths through B: A→B→A = <code>1 0* 1</code>, and A→B→F = <code>1 0* ε = 10*</code>. Merge with existing A→A loop <code>0</code> using union: A→A becomes <code>0 + 10*1</code>. New edge A→F = <code>10*</code>.'],
 ['Eliminate A','Remaining path S→A→F with loop on A. Rule: R(S,F) = R(S,A) · R(A,A)* · R(A,F) = <code>ε (0+10*1)* 10*</code>.'],
 ['Final regular expression','<b>(0 + 10*1)* 10*</b>. Check: "1" ✓, "0110" ✓ (two 1s ✗ → rejected), "101" ✗ (two 1s), "010" ✓.']
],
cnf:[
 ['Grammar','S → aSb | A<br>A → aA | ε<br>Language: aᵐbⁿ with m ≥ n.'],
 ['1 · New start symbol','S appears on a right-hand side, so add S₀ → S.<br>S₀ → S ; S → aSb | A ; A → aA | ε'],
 ['2 · Remove ε-productions','Nullable: A (A→ε), S (S→A), S₀ (S₀→S). For every rule, add versions with nullable symbols deleted; drop A→ε. Keep S₀→ε because ε ∈ L.<br>S₀ → S | ε<br>S → aSb | ab | A<br>A → aA | a'],
 ['3 · Remove unit productions','Unit pairs: (S₀,S), (S₀,A), (S,A). Copy the non-unit rules of the target.<br>S₀ → aSb | ab | aA | a | ε<br>S → aSb | ab | aA | a<br>A → aA | a'],
 ['4 · Remove useless symbols','All symbols are generating and reachable. Nothing to remove.'],
 ['5 · Replace terminals in long rules','Add Tₐ → a, T_b → b and use them wherever the right side has length ≥ 2.<br>S₀ → TₐS T_b | TₐT_b | TₐA | a | ε<br>S → TₐS T_b | TₐT_b | TₐA | a<br>A → TₐA | a ; Tₐ → a ; T_b → b'],
 ['6 · Break rules longer than 2','TₐS T_b → Tₐ D, D → S T_b.<br><b>Final CNF:</b><br>S₀ → TₐD | TₐT_b | TₐA | a | ε<br>S → TₐD | TₐT_b | TₐA | a<br>A → TₐA | a ; D → S T_b ; Tₐ → a ; T_b → b<br>Test "aab": S₀ ⇒ TₐD ⇒ aD ⇒ aS T_b ⇒ a·a·b ✓']
],
gnf:[
 ['Grammar','S → AA | a<br>A → SS | b<br>Already ε-free, unit-free, no useless symbols. Order: A₁ = S, A₂ = A.'],
 ['1 · Make every rule A<sub>i</sub> → A<sub>j</sub>γ obey j > i','S → AA | a ✓ (S=A₁ goes to A₂).<br>A → SS | b ✗ (A₂ → A₁...). Substitute S → AA | a into A → SS:<br>A → AAS | aS | b'],
 ['2 · Remove left recursion (Lemma 2)','A → A·(AS) | aS | b. Here α = AS, β = aS, b. Introduce Z:<br>A → aS | b | aS Z | b Z<br>Z → AS | AS Z'],
 ['3 · Back-substitute into S','Every A-rule now starts with a terminal. Replace leading A in S → AA:<br>S → aSA | bA | aSZA | bZA | a'],
 ['4 · Back-substitute into Z','Replace leading A in Z → AS | ASZ using the four A-rules:<br>Z → aSS | bS | aSZS | bZS | aSSZ | bSZ | aSZSZ | bZSZ'],
 ['Final GNF','S → aSA | bA | aSZA | bZA | a<br>A → aS | b | aSZ | bZ<br>Z → aSS | bS | aSZS | bZS | aSSZ | bSZ | aSZSZ | bZSZ<br>Every rule: one terminal followed by variables ✓']
]
};

const T=[
/* ---------------- MODULE III ---------------- */
{id:'m3-1',mod:'m3',title:'Pumping lemma (regular)',pr:'Very High',tags:'pumping lemma non-regular proof adversary',
body:`
<div class="def"><b>Pumping lemma.</b> If L is regular, there is a pumping length p ≥ 1 such that every w ∈ L with |w| ≥ p can be written w = xyz with
<br>(1) |xy| ≤ p &nbsp; (2) |y| ≥ 1 &nbsp; (3) xyⁱz ∈ L for every i ≥ 0.</div>
<p>It comes from the pigeonhole principle: a DFA with p states reading p symbols must repeat a state, so the loop y can be repeated or deleted.</p>
<div class="warn"><b>Direction matters.</b> The lemma only <em>disproves</em> regularity. A language that passes the lemma can still be non-regular, so never use it to show that a language is regular.</div>
<h2>Proof template (the adversary game)</h2>
<ol>
<li>Assume L is regular. The adversary gives you p.</li>
<li><b>You</b> choose a string w ∈ L with |w| ≥ p. Make it depend on p and force the first p symbols to be one kind of symbol.</li>
<li>The <b>adversary</b> picks any split w = xyz obeying |xy| ≤ p and |y| ≥ 1. So y lies inside the first p symbols.</li>
<li><b>You</b> choose i (usually 0 or 2) so that xyⁱz ∉ L. Contradiction, so L is not regular.</li>
</ol>
<div class="tip"><b>Scoring tip.</b> Write all four steps in words. Cover every possible y (y = aᵏ, 1 ≤ k ≤ p). Examiners deduct marks for "take y = a" without saying why that is the only case.</div>
<h2>Try it: break the adversary</h2>
<div data-w="plgame"></div>
<h2>Solved examples</h2>
<div class="ex"><b>L = {aⁿbⁿ : n ≥ 0}.</b> w = aᵖbᵖ. Since |xy| ≤ p, y = aᵏ with 1 ≤ k ≤ p. Take i = 2: xy²z = aᵖ⁺ᵏbᵖ. Number of a’s ≠ number of b’s, so ∉ L. Contradiction.</div>
<div class="ex"><b>L = {a^(n²)}.</b> w = a^(p²). y = aᵏ, 1 ≤ k ≤ p. With i = 2 the length is p² + k. Because p² &lt; p² + k ≤ p² + p &lt; (p+1)², the length lies strictly between two consecutive squares. ∉ L.</div>
<div class="ex"><b>L = {ww : w ∈ {a,b}*}.</b> w = aᵖbaᵖb. y lies inside the first block of a’s, y = aᵏ. i = 2 gives aᵖ⁺ᵏbaᵖb. The two halves differ (first half has more a’s before the first b), so it is not of the form uu.</div>
<div class="ex"><b>L = {0ⁱ1ʲ : i &gt; j}.</b> Pump <em>down</em>. w = 0ᵖ⁺¹1ᵖ, y = 0ᵏ, i = 0 gives 0ᵖ⁺¹⁻ᵏ1ᵖ with p+1−k ≤ p. Zeros are no longer more than ones. ∉ L.</div>
<h2>Common mistakes</h2>
<ul><li>Choosing a fixed w that does not depend on p.</li><li>Assuming y is the whole of a block, or choosing the split yourself.</li><li>Forgetting that i = 0 (pumping down) is allowed and sometimes the only way.</li><li>Using the lemma to prove a language regular.</li></ul>`,
qa:[
Q(2,'State the pumping lemma for regular languages.','If L is regular, ∃ p ≥ 1 such that ∀ w ∈ L with |w| ≥ p, w = xyz where |xy| ≤ p, |y| ≥ 1, and xyⁱz ∈ L ∀ i ≥ 0.'),
Q(2,'Can the pumping lemma be used to prove a language is regular? Why?','No. It is a necessary condition only. Some non-regular languages satisfy it, so it can only be used to show non-regularity by contradiction.'),
Q(5,'Show that L = {aⁿbⁿ | n ≥ 0} is not regular.','<p><b>1.</b> Assume L regular with pumping length p.<br><b>2.</b> Choose w = aᵖbᵖ ∈ L, |w| = 2p ≥ p.<br><b>3.</b> Any split with |xy| ≤ p puts y inside the a-block: y = aᵏ, 1 ≤ k ≤ p.<br><b>4.</b> Pump i = 2: xy²z = aᵖ⁺ᵏbᵖ. Since k ≥ 1, #a ≠ #b, so ∉ L.<br><b>5.</b> Contradiction with the lemma, so L is not regular. ∎</p>'),
Q(5,'Prove that L = {ww | w ∈ {a,b}*} is not regular.','<p>Assume regular, pumping length p. Take w = aᵖbaᵖb ∈ L (it is uu with u = aᵖb). |xy| ≤ p ⇒ y = aᵏ in the first a-block, k ≥ 1. xy²z = aᵖ⁺ᵏbaᵖb. It has exactly two b’s, so if it were uu each u would contain one b, forcing u = aᵖ⁺ᵏb and u = aᵖb. These differ since k ≥ 1. ∉ L. Contradiction. ∎</p>'),
Q(13,'Using the pumping lemma, prove that (a) L₁ = {a^(n²) | n ≥ 1}, (b) L₂ = {0ⁱ1ʲ | i &gt; j} are not regular. Explain the role of p, x, y, z.','<p><b>Setup (2 marks).</b> p is the number of states of the assumed DFA. x = prefix before the loop, y = the loop (non-empty, within the first p symbols), z = the rest. Pumping repeats the loop i times.</p><p><b>(a) (5 marks).</b> Assume regular. w = a^(p²), |w| ≥ p. y = aᵏ, 1 ≤ k ≤ p. Take i = 2: |xy²z| = p² + k. Bounds: p² &lt; p²+k ≤ p²+p &lt; p²+2p+1 = (p+1)². Not a perfect square ⇒ ∉ L₁. Contradiction.</p><p><b>(b) (5 marks).</b> Assume regular. w = 0ᵖ⁺¹1ᵖ ∈ L₂. y = 0ᵏ with 1 ≤ k ≤ p+1 (y inside the first p zeros so k ≤ p). Take i = 0: xz = 0ᵖ⁺¹⁻ᵏ1ᵖ. Zeros = p+1−k ≤ p = ones, so i &gt; j fails ⇒ ∉ L₂. Contradiction.</p><p><b>Conclusion (1 mark).</b> Both languages violate the lemma, so neither is regular. ∎</p>')
]},

{id:'m3-2',mod:'m3',title:'Properties of regular languages',pr:'High',tags:'closure decision complement intersection homomorphism',
body:`
<h2>Closure properties</h2>
<p>Regular languages are closed under:</p>
<table><tr><th>Operation</th><th>How to prove it (construction)</th></tr>
<tr><td>Union, concatenation, star</td><td>Regular expressions: R₁+R₂, R₁R₂, R₁*.</td></tr>
<tr><td>Complement</td><td>Take a <em>complete</em> DFA and swap final and non-final states.</td></tr>
<tr><td>Intersection</td><td>Product DFA with states (p,q), accepting when both components accept. Or De Morgan: L₁∩L₂ = complement of (L̄₁ ∪ L̄₂).</td></tr>
<tr><td>Difference</td><td>L₁ − L₂ = L₁ ∩ L̄₂.</td></tr>
<tr><td>Reversal</td><td>Reverse all arrows, swap start and finals (add a new start with ε-moves to old finals).</td></tr>
<tr><td>Homomorphism h</td><td>Replace each symbol a in the regular expression by h(a).</td></tr>
<tr><td>Inverse homomorphism</td><td>New DFA reads a, simulates the old DFA on h(a).</td></tr>
<tr><td>Quotient L/a, prefix, suffix</td><td>Change the start or final states of the DFA.</td></tr></table>
<div class="warn"><b>Not closed:</b> infinite union, and arbitrary subsets. (Every finite language is regular, yet {aⁿbⁿ} is a subset of the regular a*b*.)</div>
<h2>Decision properties</h2>
<table><tr><th>Question</th><th>Algorithm</th></tr>
<tr><td>Membership w ∈ L?</td><td>Run the DFA on w.</td></tr>
<tr><td>Is L empty?</td><td>Is any final state reachable from the start state?</td></tr>
<tr><td>Is L finite?</td><td>Is there a cycle on a path from start to a final state? If yes, infinite.</td></tr>
<tr><td>L₁ = L₂ ?</td><td>Minimize both DFAs and compare, or check that (L₁−L₂) ∪ (L₂−L₁) is empty.</td></tr>
<tr><td>L₁ ⊆ L₂ ?</td><td>Check L₁ ∩ L̄₂ = ∅.</td></tr></table>
<h2>Using closure to prove non-regularity</h2>
<div class="ex"><b>L = {w ∈ {a,b}* : #a(w) = #b(w)}.</b> Suppose L is regular. Then L ∩ a*b* is regular (intersection with a regular language). But L ∩ a*b* = {aⁿbⁿ}, which is not regular. Contradiction.</div>
<div class="tip"><b>Shortcut.</b> Pumping lemma is long. If you can intersect with a simple regular language and land on aⁿbⁿ, the proof is three lines.</div>
<h2>Myhill–Nerode in one line</h2>
<p>L is regular exactly when the relation "x ≡ y if for all z, xz ∈ L ⇔ yz ∈ L" has finitely many classes. The number of classes equals the number of states in the minimal DFA.</p>`,
qa:[
Q(2,'Show that regular languages are closed under complement.','Take a complete DFA M for L. Build M′ with the same states and transitions but F′ = Q − F. M′ accepts w exactly when M rejects w, so L(M′) = L̄.'),
Q(2,'List four decision properties of regular languages.','Membership, emptiness, finiteness, equivalence (also containment). All are decidable by algorithms on the DFA.'),
Q(5,'Prove closure under intersection using the product construction.','<p>Let M₁ = (Q₁,Σ,δ₁,q₁,F₁), M₂ = (Q₂,Σ,δ₂,q₂,F₂). Define M = (Q₁×Q₂, Σ, δ, (q₁,q₂), F₁×F₂) with δ((p,q),a) = (δ₁(p,a), δ₂(q,a)).<br>By induction on |w|, δ*((q₁,q₂),w) = (δ₁*(q₁,w), δ₂*(q₂,w)). Hence M accepts w iff both M₁ and M₂ accept w, so L(M) = L₁ ∩ L₂. ∎</p>'),
Q(5,'Show that {w | #a(w) = #b(w)} is not regular using closure properties.','<p>Assume regular. Regular languages are closed under intersection, and a*b* is regular, so L ∩ a*b* is regular. A string aⁱbʲ has equal counts only if i = j, so the intersection is {aⁿbⁿ}. That language is not regular (pumping lemma). Contradiction. ∎</p>')
]},

{id:'m3-3',mod:'m3',title:'State elimination (FA → RE)',pr:'Very High',tags:'state elimination dfa regular expression conversion',
body:`
<p>State elimination converts a finite automaton into a regular expression by deleting states one at a time and putting regular expressions on edges.</p>
<div class="def"><b>Algorithm.</b>
<ol style="margin:.4em 0 0">
<li>Add a new start state S with an ε-edge to the old start. Add a new final state F with ε-edges from every old final state. Old finals become non-final.</li>
<li>Merge parallel edges by union: edges labelled R₁ and R₂ become R₁ + R₂.</li>
<li>Pick a state s (not S or F) to eliminate. For every pair p → s → q, add the edge <br><code>R(p,q) = R(p,q) + R(p,s) · R(s,s)* · R(s,q)</code> (omit R(s,s)* if s has no self-loop).</li>
<li>Delete s. Repeat until only S and F remain. The label on S → F is the answer.</li>
</ol></div>
<div class="tip"><b>Order.</b> Remove the states with the fewest in-edges × out-edges first. The result differs in form but is the same language. Verify with 2–3 short strings.</div>
<h2>Worked example (step through)</h2>
<div data-w="steps:se"></div>
<h2>Frequent slips</h2>
<ul><li>Forgetting the self-loop term R(s,s)*.</li><li>Not unioning the old A→A edge with the new path through the removed state.</li><li>Writing 0+1 as 01 (concatenation). Union is +.</li><li>Skipping the new start/final states when the start state has incoming edges.</li></ul>`,
qa:[
Q(2,'Why are a new start state and a new final state added in state elimination?','So there is exactly one start state with no incoming edges and exactly one final state with no outgoing edges. Then the label of the single edge S → F is the whole regular expression.'),
Q(2,'Write the formula for the new edge when state s is removed.','R(p,q) = R(p,q) + R(p,s) R(s,s)* R(s,q).'),
Q(5,'Find a regular expression for the DFA: q0 start, q1 final; δ(q0,a)=q1, δ(q0,b)=q0, δ(q1,a)=q1, δ(q1,b)=q0.','<p><b>Add S, F:</b> S –ε→ q0, q1 –ε→ F.<br><b>Eliminate q1:</b> q0→q1 = a, loop on q1 = a, q1→q0 = b, q1→F = ε.<br>q0→q0 = b + a a* b ; q0→F = a a*.<br><b>Eliminate q0:</b> S→q0 = ε, loop = (b + aa*b), q0→F = aa*.<br><b>RE = (b + aa*b)* aa*</b>, equivalent to (a+b)*a: all strings ending in a. ∎</p>'),
Q(13,'Describe the state elimination method and use it to convert the DFA (A start, B final; A–0→A, A–1→B, B–0→B, B–1→A) into a regular expression.','<p><b>Algorithm (3 marks).</b> Add new start S and final F; merge parallel edges by +; eliminate states using R(p,q) += R(p,s)R(s,s)*R(s,q); stop when only S and F remain.</p><p><b>Setup (2 marks).</b> S –ε→ A, B –ε→ F.</p><p><b>Eliminate B (4 marks).</b> A→B = 1, loop B = 0*, B→A = 1, B→F = ε. A→A = 0 + 10*1. A→F = 10*.</p><p><b>Eliminate A (2 marks).</b> R(S,F) = ε (0+10*1)* 10*.</p><p><b>Answer (2 marks).</b> (0 + 10*1)* 10* : strings with an odd number of 1s. Verification with "1", "010", "0110" (rejected).</p>')
]},

/* ---------------- MODULE IV ---------------- */
{id:'m4-1',mod:'m4',title:'Context-free grammars',pr:'High',tags:'cfg grammar derivation language design simplification',
body:`
<div class="def"><b>CFG.</b> G = (V, T, P, S): V variables, T terminals, P productions A → α with A ∈ V and α ∈ (V ∪ T)*, and S the start symbol. L(G) = {w ∈ T* : S ⇒* w}.</div>
<p><b>Derivation</b> replaces a variable by the right side of one of its productions. <b>Leftmost</b> derivation always expands the leftmost variable; <b>rightmost</b> the rightmost. A string of terminals and variables reachable from S is a <b>sentential form</b>.</p>
<h2>Design patterns</h2>
<table><tr><th>Language</th><th>Grammar</th></tr>
<tr><td>aⁿbⁿ, n ≥ 0</td><td>S → aSb | ε</td></tr>
<tr><td>aⁿb²ⁿ</td><td>S → aSbb | ε</td></tr>
<tr><td>aⁿbᵐcⁿ</td><td>S → aSc | B ; B → bB | ε</td></tr>
<tr><td>aⁱbʲcᵏ with i = j or j = k</td><td>S → XC | AY ; X → aXb | ε ; C → cC | ε ; A → aA | ε ; Y → bYc | ε</td></tr>
<tr><td>Palindromes over {a,b}</td><td>S → aSa | bSb | a | b | ε</td></tr>
<tr><td>Balanced parentheses</td><td>S → (S)S | ε</td></tr>
<tr><td>Equal a’s and b’s</td><td>S → aSbS | bSaS | ε</td></tr>
<tr><td>Arithmetic expressions</td><td>E → E+T | T ; T → T*F | F ; F → (E) | id</td></tr></table>
<div class="tip"><b>Method.</b> Match symbols from the outside in (aⁿ…bⁿ) with a rule that wraps S. Independent blocks get their own variables. Union of languages: S → S₁ | S₂.</div>
<h2>Simplification (needed before CNF/GNF)</h2>
<ol><li><b>Useless symbols:</b> remove non-generating variables first, then unreachable ones. Order matters.</li><li><b>ε-productions:</b> find nullable variables; add every combination with them removed; delete A → ε.</li><li><b>Unit productions A → B:</b> replace with B’s non-unit rules.</li></ol>
<h2>Regular grammar vs CFG</h2><table><tr><th></th><th>Regular grammar</th><th>CFG</th></tr><tr><td>Rules</td><td>A → aB, A → a, A → ε (right-linear)</td><td>A → any string of variables and terminals</td></tr><tr><td>Machine</td><td>Finite automaton</td><td>Pushdown automaton</td></tr><tr><td>Example</td><td>a*b*</td><td>aⁿbⁿ</td></tr></table><h2>Closure of CFLs</h2>
<p>Closed under union, concatenation, star, reversal, homomorphism, and intersection with a regular language. <b>Not</b> closed under intersection or complement (aⁿbⁿcᵐ ∩ aᵐbⁿcⁿ = aⁿbⁿcⁿ).</p>
<div data-w="tree:anbn"></div>`,
qa:[
Q(2,'Define a context-free grammar.','A 4-tuple G = (V,T,P,S): variables, terminals, productions of the form A → α (A a single variable), and a start variable. Each production has exactly one variable on its left side.'),
Q(2,'Derive "aabb" from S → aSb | ab.','S ⇒ aSb ⇒ aabb (using S → aSb then S → ab).'),
Q(5,'Construct a CFG for L = {aⁿbᵐcⁿ | n, m ≥ 0}.','<p>S → aSc | B<br>B → bB | ε<br>The outer rule matches a’s with c’s; B generates the b’s in the middle. Example "aabcc": S ⇒ aSc ⇒ aaScc ⇒ aaBcc ⇒ aabBcc ⇒ aabcc. ∎</p>'),
Q(5,'Construct a CFG for L = {aⁱbʲcᵏ | i = j or j = k}. Is it ambiguous?','<p>S → XC | AY ; X → aXb | ε ; C → cC | ε ; A → aA | ε ; Y → bYc | ε.<br>XC covers i = j (any k); AY covers j = k (any i).<br>Strings with i = j = k (e.g. "abc") have two different leftmost derivations, so this grammar is ambiguous. In fact L is inherently ambiguous.</p>')
]},

{id:'m4-2',mod:'m4',title:'Parse trees',pr:'High',tags:'parse tree derivation tree yield leftmost rightmost',
body:`
<div class="def"><b>Parse tree</b> for G: the root is S; each interior node is a variable A whose children, left to right, form the right side of a production A → X₁…Xₖ; leaves are terminals or ε. The <b>yield</b> is the leaves read left to right.</div>
<p>For a string w the following are equivalent: w ∈ L(G); a parse tree with root S and yield w exists; a leftmost derivation of w exists; a rightmost derivation of w exists. A tree corresponds to exactly one leftmost and one rightmost derivation.</p>
<div class="ex"><b>Grammar:</b> S → aAS | a ; A → SbA | SS | ba. <b>String:</b> aabbaa.<br>
Leftmost: S ⇒ aAS ⇒ aSbAS ⇒ aabAS ⇒ aabbaS ⇒ aabbaa<br>
Rightmost: S ⇒ aAS ⇒ aAa ⇒ aSbAa ⇒ aSbbaa ⇒ aabbaa</div>
<div data-w="tree:ullman"></div>
<h2>How to draw one</h2>
<ol><li>Write S at the top.</li><li>Follow the leftmost derivation. At each step, give the expanded variable children for the rule used.</li><li>Read the leaves left to right and confirm they spell w.</li></ol>
<div class="tip"><b>Order of children is the order of the right side.</b> Swapping them gives a different string.</div>`,
qa:[
Q(2,'Define parse tree and yield.','A parse tree is a rooted ordered tree: root labelled S, interior nodes labelled with variables whose children spell a production body, leaves labelled terminals or ε. The yield is the concatenation of the leaf labels from left to right.'),
Q(5,'For S → aAS | a, A → SbA | SS | ba, give leftmost and rightmost derivations and the parse tree for aabbaa.','<p><b>Leftmost:</b> S ⇒ aAS ⇒ aSbAS ⇒ aabAS ⇒ aabbaS ⇒ aabbaa.<br><b>Rightmost:</b> S ⇒ aAS ⇒ aAa ⇒ aSbAa ⇒ aSbbaa ⇒ aabbaa.<br><b>Tree:</b> S has children a, A, S. The A has children S, b, A. The first inner S → a; the inner A → ba; the last S → a. Yield aabbaa (diagram above). ∎</p>')
]},

{id:'m4-3',mod:'m4',title:'Ambiguity',pr:'High',tags:'ambiguity ambiguous grammar precedence associativity dangling else',
body:`
<div class="def"><b>Ambiguous grammar.</b> A CFG is ambiguous if some string in L(G) has two or more distinct parse trees (equivalently two leftmost derivations, or two rightmost derivations).</div>
<h2>See it happen</h2>
<div data-w="ambig"></div>
<h2>Removing ambiguity</h2>
<p>Encode <b>precedence</b> by layering variables (higher precedence deeper) and <b>associativity</b> by the direction of recursion.</p>
<pre><code>Ambiguous:     E → E+E | E*E | (E) | id
Unambiguous:   E → E+T | T
               T → T*F | F
               F → (E) | id</code></pre>
<p>Left recursion (E → E+T) makes + left-associative. * binds tighter because T sits below E.</p>
<h2>Other classic cases</h2>
<ul><li><b>Dangling else:</b> S → if b then S | if b then S else S | a is ambiguous. Fix: split into matched and unmatched statements.</li><li><b>S → SS | a:</b> "aaa" has two trees ((aa)a and a(aa)).</li><li><b>S → aS | Sa | a:</b> "aa" is ambiguous.</li></ul>
<div class="warn"><b>Inherently ambiguous language:</b> every grammar for it is ambiguous, e.g. {aⁱbʲcᵏ : i = j or j = k}. Deciding whether a CFG is ambiguous is undecidable. Do not claim an algorithm exists.</div>`,
qa:[
Q(2,'When is a grammar ambiguous? Give an example.','When some string has more than one parse tree. Example: E → E+E | E*E | id, string id+id*id.'),
Q(2,'What is an inherently ambiguous language?','A CFL for which every grammar is ambiguous, for example {aⁱbʲcᵏ | i = j or j = k}.'),
Q(5,'Show that E → E+E | E*E | id is ambiguous and give an equivalent unambiguous grammar.','<p>For id+id*id, tree 1 uses E → E+E at the root with the right child E*E (value 2+(3×4) = 14). Tree 2 uses E → E*E at the root with the left child E+E ((2+3)×4 = 20). Two parse trees ⇒ ambiguous.<br>Unambiguous: E → E+T | T ; T → T*F | F ; F → id. Here * is forced below + and both operators are left-associative. ∎</p>')
]},

{id:'m4-4',mod:'m4',title:'Chomsky normal form',pr:'Very High',tags:'cnf chomsky normal form conversion',
body:`
<div class="def"><b>CNF.</b> Every production is A → BC (two variables) or A → a (one terminal). If ε ∈ L, S → ε is allowed and S never appears on a right side. Every CFL without ε has a CNF grammar.</div>
<h2>Conversion procedure</h2>
<ol>
<li><b>START:</b> add S₀ → S if S appears on any right side.</li>
<li><b>Remove ε-productions</b> (except S₀ → ε if ε ∈ L).</li>
<li><b>Remove unit productions.</b></li>
<li><b>Remove useless symbols.</b></li>
<li><b>Replace terminals</b> in rules of length ≥ 2 by new variables Tₐ → a.</li>
<li><b>Binarize:</b> A → B₁B₂…Bₖ becomes A → B₁D₁, D₁ → B₂D₂, …</li>
</ol>
<div class="tip"><b>Always write the grammar after every step.</b> Marks are given per step, and a wrong early step is carried forward only if you wrote it down.</div>
<h2>Worked conversion</h2>
<div data-w="steps:cnf"></div>
<h2>Why CNF matters</h2>
<p>Every derivation of a string of length n takes exactly 2n−1 steps, parse trees are binary, and the CYK parsing algorithm runs in O(n³).</p>`,
qa:[
Q(2,'Define Chomsky normal form.','Every production has the form A → BC or A → a, with A, B, C variables and a a terminal. S → ε is allowed only when ε ∈ L and S is not on any right side.'),
Q(2,'How many derivation steps does a string of length n need in CNF?','Exactly 2n − 1 steps (n−1 binary rules and n terminal rules).'),
Q(5,'Convert S → aSb | ab to CNF.','<p>No ε, unit or useless rules. Terminals: A → a, B → b. S → ASB | AB. Binarize ASB: S → AX, X → SB.<br><b>CNF:</b> S → AX | AB ; X → SB ; A → a ; B → b. ∎</p>'),
Q(13,'Convert S → aSb | A ; A → aA | ε into Chomsky normal form, showing each step.','<p><b>1 (1 mark)</b> S₀ → S. <b>2 (3)</b> Nullable A, S, S₀: S₀ → S | ε ; S → aSb | ab | A ; A → aA | a. <b>3 (3)</b> Units S₀→S, S₀→A, S→A: S₀ → aSb | ab | aA | a | ε ; S → aSb | ab | aA | a ; A → aA | a. <b>4 (1)</b> No useless symbols. <b>5 (2)</b> Tₐ → a, T_b → b, replace in long rules. <b>6 (2)</b> D → S T_b.</p><p><b>Final (1 mark):</b> S₀ → TₐD | TₐT_b | TₐA | a | ε ; S → TₐD | TₐT_b | TₐA | a ; A → TₐA | a ; D → S T_b ; Tₐ → a ; T_b → b. (Use the stepper above for full intermediate grammars.)</p>')
]},

{id:'m4-5',mod:'m4',title:'Greibach normal form',pr:'Very High',tags:'gnf greibach left recursion substitution',
body:`
<div class="def"><b>GNF.</b> Every production has the form A → aα where a is a terminal and α is a (possibly empty) string of variables. Each derivation step produces exactly one new terminal at the left, which is why GNF gives PDAs with no ε-moves.</div>
<h2>Two lemmas</h2>
<div class="def"><b>Lemma 1 (substitution).</b> If A → Bγ and B → β₁ | β₂ | …, replace by A → β₁γ | β₂γ | …</div>
<div class="def"><b>Lemma 2 (left recursion).</b> A → Aα₁ | … | Aαᵣ | β₁ | … | βₛ becomes<br>A → βᵢ | βᵢZ (for each i) and Z → αⱼ | αⱼZ (for each j), where Z is a new variable.</div>
<h2>Procedure</h2>
<ol>
<li>Simplify: no ε, no unit rules, no useless symbols (CNF is a convenient start).</li>
<li>Rename the variables A₁ … Aₙ.</li>
<li>Using Lemma 1 and Lemma 2, make every rule Aᵢ → Aⱼγ satisfy j &gt; i, or begin with a terminal. Process i = 1, 2, …, n.</li>
<li>Now Aₙ's rules all start with a terminal. Back-substitute upward into Aₙ₋₁, …, A₁.</li>
<li>Back-substitute into the Z variables.</li>
</ol>
<div class="tip"><b>Check.</b> At the end, scan every production. If any right side starts with a variable, a substitution is missing.</div>
<h2>Worked conversion</h2>
<div data-w="steps:gnf"></div>`,
qa:[
Q(2,'Define Greibach normal form.','Every production is A → aα with a ∈ T and α ∈ V* (S → ε only if ε ∈ L).'),
Q(2,'Why must left recursion be removed when converting to GNF?','A left-recursive rule A → Aα keeps a variable at the front forever, so the rule can never begin with a terminal. Lemma 2 rewrites it with a new variable Z.'),
Q(5,'Convert A → Aa | b to GNF.','<p>Left recursion with α = a, β = b. Lemma 2: A → b | bZ ; Z → a | aZ. All rules start with a terminal. Language: b aⁿ. ∎</p>'),
Q(13,'Convert S → AA | a ; A → SS | b into Greibach normal form.','<p><b>Order (1):</b> S = A₁, A = A₂. <b>Check rules (2):</b> S → AA | a is fine; A → SS violates the order.</p><p><b>Substitute (2):</b> A → SS | b with S → AA | a: A → AAS | aS | b.</p><p><b>Left recursion (3):</b> A → aS | b | aSZ | bZ ; Z → AS | ASZ.</p><p><b>Back-substitute S (2):</b> S → aSA | bA | aSZA | bZA | a.</p><p><b>Back-substitute Z (2):</b> Z → aSS | bS | aSZS | bZS | aSSZ | bSZ | aSZSZ | bZSZ.</p><p><b>Final (1):</b> all rules begin with a terminal. ∎</p>')
]},

{id:'m4-6',mod:'m4',title:'Pumping lemma (CFL)',pr:'High',tags:'pumping lemma cfl context free non-cfl uvwxy',
body:`
<div class="def"><b>Pumping lemma for CFLs.</b> If L is context-free, there is p ≥ 1 such that every z ∈ L with |z| ≥ p can be written z = uvwxy with<br>(1) |vwx| ≤ p &nbsp; (2) |vx| ≥ 1 &nbsp; (3) uvⁱwxⁱy ∈ L for all i ≥ 0.</div>
<p>Origin: a parse tree of a long string has a path where some variable A repeats. The two A-subtrees give v, x which can be pumped together. Unlike the regular case, <em>two</em> pieces are pumped, and both on the same count.</p>
<h2>Proof template</h2>
<ol><li>Assume L is context-free with pumping length p.</li><li>Choose z ∈ L, |z| ≥ p, that spreads the "counts" over blocks.</li><li>Because |vwx| ≤ p, the window vwx touches at most two <em>adjacent</em> blocks (or fewer). Do a case analysis.</li><li>Pump i = 0 or 2 and show the string leaves L in every case.</li></ol>
<div class="ex"><b>L = {aⁿbⁿcⁿ}.</b> z = aᵖbᵖcᵖ. vwx has length ≤ p, so it cannot contain both an a and a c.<br>Case 1: vwx lies within the a’s (or b’s, or c’s): pumping changes one count only.<br>Case 2: vwx straddles a|b: pumping changes a’s and/or b’s but leaves the c’s at p.<br>Case 3: vwx straddles b|c: similarly a’s stay at p.<br>In all cases the three counts are unequal after i = 2. ∉ L.</div>
<div class="ex"><b>L = {aⁱbʲcᵏ : i &lt; j &lt; k}.</b> z = aᵖbᵖ⁺¹cᵖ⁺². If v or x contains a’s, pump up (i=2): a’s reach ≥ b’s. If v, x contain only b’s or c’s (no a’s), pump down (i=0): b’s drop to ≤ a’s, or c’s drop to ≤ b’s.</div>
<div class="ex"><b>L = {ww}.</b> z = aᵖbᵖaᵖbᵖ. vwx (≤ p) lies inside the first half, inside the second half, or crosses the middle. Pumping breaks the equality of the two halves in each case.</div>
<div class="warn"><b>Do not try</b> {wwᴿ}. It is context-free (S → aSa | bSb | ε), so no contradiction exists.</div>`,
qa:[
Q(2,'State the pumping lemma for CFLs.','If L is a CFL, ∃ p such that every z ∈ L with |z| ≥ p can be written z = uvwxy with |vwx| ≤ p, |vx| ≥ 1, and uvⁱwxⁱy ∈ L for all i ≥ 0.'),
Q(2,'Give two languages that are not context-free.','{aⁿbⁿcⁿ | n ≥ 0} and {ww | w ∈ {a,b}*}. Also {a^(n²)} and {a^(2ⁿ)}.'),
Q(5,'Prove that L = {aⁿbⁿcⁿ | n ≥ 0} is not context-free.','<p>Assume CFL, pumping length p. z = aᵖbᵖcᵖ. |vwx| ≤ p, so vwx cannot contain both a and c. <b>Case 1:</b> vwx within one block: i = 2 changes one count only. <b>Case 2:</b> vwx spans a and b: i = 2 raises a’s or b’s but not c’s. <b>Case 3:</b> spans b and c: a’s unchanged. In every case the counts differ, so uv²wx²y ∉ L. Contradiction. ∎</p>'),
Q(13,'Prove that (a) L₁ = {aⁱbʲcᵏ | i &lt; j &lt; k} and (b) L₂ = {ww | w ∈ {a,b}*} are not context-free.','<p><b>(a) (6 marks)</b> z = aᵖbᵖ⁺¹cᵖ⁺². Since |vwx| ≤ p, it touches at most two adjacent blocks. <b>Case 1</b> v or x has an a: then it has no c (window too short). Pump i = 2: a’s ≥ p+1 ≥ b’s, so i &lt; j fails. <b>Case 2</b> v and x contain no a: they contain b’s and/or c’s. If they contain a b, pump i = 0: b’s ≤ p = a’s, fails i &lt; j. Otherwise they contain only c’s: i = 0 gives c’s ≤ p+1 = b’s, fails j &lt; k. All cases fail ⇒ not CFL.</p><p><b>(b) (6 marks)</b> z = aᵖbᵖaᵖbᵖ. <b>Case 1</b> vwx lies inside the first half: with i = 2 the string grows, the midpoint shifts right, and the second half now begins with symbols from the first half&apos;s last b-block, so the halves differ (the first half starts aᵖ… but the second starts with b or an a-block of different length). <b>Case 2</b> inside the second half: symmetric (i = 2 shifts the midpoint left). <b>Case 3</b> vwx crosses the middle, so it lies within bᵖaᵖ: pump down (i = 0) to get aᵖbˢaᵗbᵖ with s &lt; p or t &lt; p. A string uu would need its first b-block and second b-block to have equal lengths and equal a-prefixes, but here the a-blocks (p and t) or b-blocks (s and p) differ. Not of the form uu. Contradiction.</p><p><b>Conclusion (1 mark).</b> Neither is context-free. ∎</p>')
]},

/* ---------------- MODULE V ---------------- */
{id:'m5-1',mod:'m5',title:'Pushdown automata: definition',pr:'Very High',tags:'pda pushdown automata transitions stack construction',
body:`
<div class="def"><b>PDA.</b> P = (Q, Σ, Γ, δ, q₀, Z₀, F): states, input alphabet, stack alphabet, transition function, start state, initial stack symbol, final states.<br>δ : Q × (Σ ∪ {ε}) × Γ → finite subsets of Q × Γ*.</div>
<p>A move δ(q, a, X) ∋ (p, γ) reads a (or nothing if ε), pops X, pushes γ (leftmost symbol of γ ends on top), and goes to state p. An <b>instantaneous description</b> is (q, w, γ): state, remaining input, stack with top on the left. We write ⊢ for one move.</p>
<h2>Example: aⁿbⁿ (n ≥ 1), by final state</h2>
<pre><code>δ(q0, a, Z) = {(q0, AZ)}     push A for the first a
δ(q0, a, A) = {(q0, AA)}     push A for each further a
δ(q0, b, A) = {(q1, ε)}      first b: pop A
δ(q1, b, A) = {(q1, ε)}      each b pops one A
δ(q1, ε, Z) = {(qf, Z)}      stack back to Z: accept
F = {qf}</code></pre>
<p>Trace on aabb: (q0,aabb,Z) ⊢ (q0,abb,AZ) ⊢ (q0,bb,AAZ) ⊢ (q1,b,AZ) ⊢ (q1,ε,Z) ⊢ (qf,ε,Z) accept.</p>
<h2>Simulator</h2>
<p>Pick a machine, type a string, and watch the accepting computation (nondeterministic machines are searched for any accepting path).</p>
<div data-w="pda"></div>
<h2>Design recipe</h2>
<ol><li>Decide what the stack counts or remembers.</li><li>Push while reading the first part; pop while matching the second.</li><li>Nondeterministic guess (ε-move) at the middle for wwᴿ.</li><li>Accept when the input is consumed and the stack shows only the bottom marker.</li></ol>`,
qa:[
Q(2,'Define a pushdown automaton formally.','A 7-tuple (Q, Σ, Γ, δ, q₀, Z₀, F) with δ: Q × (Σ∪{ε}) × Γ → finite subsets of Q × Γ*.'),
Q(2,'What is an instantaneous description of a PDA?','A triple (q, w, γ): current state, unread input, stack contents (top at the left). A move is written (q, aw, Xβ) ⊢ (p, w, γβ).'),
Q(5,'Construct a PDA that accepts {aⁿbⁿ | n ≥ 1} and trace aabb.','<p>Transitions: δ(q0,a,Z)={(q0,AZ)}, δ(q0,a,A)={(q0,AA)}, δ(q0,b,A)={(q1,ε)}, δ(q1,b,A)={(q1,ε)}, δ(q1,ε,Z)={(qf,Z)}; F={qf}.<br>Trace: (q0,aabb,Z) ⊢ (q0,abb,AZ) ⊢ (q0,bb,AAZ) ⊢ (q1,b,AZ) ⊢ (q1,ε,Z) ⊢ (qf,ε,Z). Accepted. ∎</p>'),
Q(13,'Construct a PDA for L = {wwᴿ | w ∈ {a,b}*}. Give the formal definition, all transitions, and trace "abba".','<p><b>Formal (2).</b> P = ({q0,q1,qf}, {a,b}, {a,b,Z}, δ, q0, Z, {qf}).</p><p><b>Idea (2).</b> Phase 1 (q0): push every symbol. Nondeterministically guess the middle (ε-move) to q1. Phase 2 (q1): pop when the input symbol equals the top. Accept when Z is exposed.</p><p><b>Transitions (5).</b><br>q0: for x∈{a,b} and top t∈{Z,a,b}: δ(q0,x,t) = {(q0, x t)}<br>δ(q0,ε,t) = {(q1,t)} for t ∈ {Z,a,b}<br>δ(q1,a,a) = {(q1,ε)}, δ(q1,b,b) = {(q1,ε)}<br>δ(q1,ε,Z) = {(qf,Z)}</p><p><b>Trace abba (3).</b> (q0,abba,Z) ⊢ (q0,bba,aZ) ⊢ (q0,ba,baZ) ⊢ (q1,ba,baZ) ⊢ (q1,a,aZ) ⊢ (q1,ε,Z) ⊢ (qf,ε,Z) accepted.</p><p><b>Remark (1).</b> The guess makes it a nondeterministic PDA; no DPDA exists for this language.</p>')
]},

{id:'m5-2',mod:'m5',title:'Languages of a PDA',pr:'High',tags:'acceptance final state empty stack',
body:`
<div class="def"><b>Acceptance by final state:</b> L(P) = {w : (q₀, w, Z₀) ⊢* (q, ε, γ) with q ∈ F}.<br><b>Acceptance by empty stack:</b> N(P) = {w : (q₀, w, Z₀) ⊢* (q, ε, ε) for some q}.</div>
<p>The two modes define the same class of languages (the context-free languages) for nondeterministic PDAs.</p>
<h2>Empty stack → final state</h2>
<ol><li>Add a new bottom marker X₀ under Z₀: new start p₀ with δ(p₀, ε, X₀) = {(q₀, Z₀X₀)}.</li><li>Add a new final state p_f. For every state q: δ(q, ε, X₀) = {(p_f, ε)}.</li></ol>
<p>If P empties its stack it exposes X₀, which sends the machine to p_f.</p>
<h2>Final state → empty stack</h2>
<ol><li>New start p₀ pushes X₀ below Z₀ so an accidental empty stack cannot occur: δ(p₀, ε, X₀) = {(q₀, Z₀X₀)}.</li><li>From every final state go to a new state p_e: δ(q, ε, Z) ∋ (p_e, ε) for q ∈ F and every stack symbol Z (including X₀).</li><li>p_e pops everything: δ(p_e, ε, Z) = {(p_e, ε)}.</li></ol>
<div class="tip"><b>Why X₀?</b> Without a new bottom marker, the old machine might empty its stack on a non-accepted string and be wrongly accepted.</div>`,
qa:[
Q(2,'Define L(P) and N(P).','L(P) = strings leading to a final state with input consumed (stack arbitrary). N(P) = strings leading to an empty stack with input consumed (state arbitrary).'),
Q(5,'Show how a PDA accepting by empty stack can be converted to one accepting by final state.','<p>Given P with N(P) = L, build P′ = (Q ∪ {p₀, p_f}, Σ, Γ ∪ {X₀}, δ′, p₀, X₀, {p_f}). δ′(p₀, ε, X₀) = {(q₀, Z₀X₀)}. All δ moves are kept. For every q ∈ Q: δ′(q, ε, X₀) = {(p_f, ε)}. P′ pushes Z₀ over X₀ and simulates P; when P empties its stack X₀ is on top and P′ moves to the final state p_f. So L(P′) = N(P). ∎</p>')
]},

{id:'m5-3',mod:'m5',title:'PDA ≡ CFG',pr:'High',tags:'cfg to pda pda to cfg equivalence triple construction',
body:`
<div class="def"><b>Theorem.</b> A language is context-free iff some PDA accepts it.</div>
<h2>CFG → PDA (empty-stack acceptance, one state)</h2>
<p>Given G = (V, T, P, S) build P′ = ({q}, T, V ∪ T, δ, q, S, ∅) with</p>
<ul><li>for each variable A: δ(q, ε, A) = {(q, β) : A → β ∈ P}   (expand)</li><li>for each terminal a: δ(q, a, a) = {(q, ε)}   (match)</li></ul>
<div class="ex"><b>G: S → aSb | ab. Input aabb.</b><br>(q,aabb,S) ⊢ (q,aabb,aSb) ⊢ (q,abb,Sb) ⊢ (q,abb,abb) ⊢ (q,bb,bb) ⊢ (q,b,b) ⊢ (q,ε,ε). Accepted. The stack simulates a leftmost derivation.</div>
<h2>PDA → CFG (triple construction)</h2>
<p>Variables are S and triples <code>[pXq]</code> meaning: "starting in state p with X on top, the PDA can read some string and end in state q having popped X (and nothing below)."</p>
<ol>
<li>S → [q₀ Z₀ p] for every state p.</li>
<li>If δ(p, a, X) ∋ (r, ε): add [pXr] → a.</li>
<li>If δ(p, a, X) ∋ (r, Y₁Y₂…Yₖ): for <em>every</em> choice of states r₁ … rₖ add<br>[pXrₖ] → a [rY₁r₁][r₁Y₂r₂] … [rₖ₋₁Yₖrₖ].</li>
</ol>
<div class="ex"><b>PDA (empty stack) for aⁿbⁿ:</b> δ(q0,a,Z)=(q0,AZ), δ(q0,a,A)=(q0,AA), δ(q0,b,A)=(q1,ε), δ(q1,b,A)=(q1,ε), δ(q1,ε,Z)=(q1,ε).<br>
Productions that can terminate (after discarding useless ones):<br>
S → [q0 Z q1]<br>
[q0 Z q1] → a [q0 A q1] [q1 Z q1]<br>
[q0 A q1] → b | a [q0 A q1] [q1 A q1]<br>
[q1 A q1] → b ; [q1 Z q1] → ε<br>
Derive aabb: S ⇒ [q0Zq1] ⇒ a[q0Aq1][q1Zq1] ⇒ a·a[q0Aq1][q1Aq1]·[q1Zq1] ⇒ aab[q1Aq1][q1Zq1] ⇒ aabb[q1Zq1] ⇒ aabb ✓.</div>
<div class="warn"><b>Size.</b> A rule that pushes k symbols creates |Q|ᵏ productions. Say so, then keep only useful ones in your answer.</div>`,
qa:[
Q(2,'What does the variable [pXq] denote in the PDA-to-CFG construction?','Strings that take the PDA from state p with X on top of the stack to state q while popping X (never touching the stack below X).'),
Q(5,'Convert the CFG S → aSb | ab into a PDA and show acceptance of aabb.','<p>P = ({q}, {a,b}, {S,a,b}, δ, q, S, ∅): δ(q,ε,S) = {(q,aSb), (q,ab)}, δ(q,a,a) = {(q,ε)}, δ(q,b,b) = {(q,ε)}.<br>(q,aabb,S) ⊢ (q,aabb,aSb) ⊢ (q,abb,Sb) ⊢ (q,abb,abb) ⊢ (q,bb,bb) ⊢ (q,b,b) ⊢ (q,ε,ε). Accepted by empty stack. ∎</p>'),
Q(13,'Construct a CFG for the PDA with δ(q0,a,Z)={(q0,AZ)}, δ(q0,a,A)={(q0,AA)}, δ(q0,b,A)={(q1,ε)}, δ(q1,b,A)={(q1,ε)}, δ(q1,ε,Z)={(q1,ε)} (start q0, Z₀ = Z, empty-stack acceptance). Derive aabb.','<p><b>Variables (2).</b> S and [pXq] for p,q ∈ {q0,q1}, X ∈ {Z,A}.</p><p><b>Start rules (1).</b> S → [q0Zq0] | [q0Zq1].</p><p><b>Rules from each move (5).</b><br>(q0,a,Z)→(q0,AZ): [q0Zr] → a[q0Aq0][q0Zr] | a[q0Aq1][q1Zr], r ∈ {q0,q1}.<br>(q0,a,A)→(q0,AA): [q0Ar] → a[q0Aq0][q0Ar] | a[q0Aq1][q1Ar].<br>(q0,b,A)→(q1,ε): [q0Aq1] → b.<br>(q1,b,A)→(q1,ε): [q1Aq1] → b.<br>(q1,ε,Z)→(q1,ε): [q1Zq1] → ε.</p><p><b>Simplify (2).</b> [q0Aq0], [q0Zq0] have no terminating rule, so they are non-generating; remove them. Result: S → [q0Zq1]; [q0Zq1] → a[q0Aq1][q1Zq1]; [q0Aq1] → b | a[q0Aq1][q1Aq1]; [q1Aq1] → b; [q1Zq1] → ε.</p><p><b>Derivation (3).</b> S ⇒ [q0Zq1] ⇒ a[q0Aq1][q1Zq1] ⇒ aa[q0Aq1][q1Aq1][q1Zq1] ⇒ aab[q1Aq1][q1Zq1] ⇒ aabb[q1Zq1] ⇒ aabb.</p>')
]},

{id:'m5-4',mod:'m5',title:'Deterministic PDA',pr:'High',tags:'dpda deterministic dcfl hierarchy',
body:`
<div class="def"><b>DPDA.</b> A PDA is deterministic if for every q, a, X: (1) δ(q, a, X) has at most one element; (2) if δ(q, ε, X) is non-empty then δ(q, a, X) is empty for every a ∈ Σ. At most one move is ever possible.</div>
<table><tr><th></th><th>DPDA</th><th>NPDA</th></tr>
<tr><td>Power</td><td>Deterministic CFLs (DCFL), a proper subset</td><td>All CFLs</td></tr>
<tr><td>Acceptance modes</td><td>Final state is stronger; empty stack only for languages with the prefix property</td><td>Equivalent</td></tr>
<tr><td>Example</td><td>aⁿbⁿ, wcwᴿ, balanced parentheses</td><td>wwᴿ, aⁿbⁿ ∪ aⁿb²ⁿ</td></tr>
<tr><td>Complement</td><td>DCFLs are closed</td><td>CFLs are not</td></tr>
<tr><td>Union / intersection</td><td>Not closed</td><td>Union closed; intersection not</td></tr></table>
<h2>Why wwᴿ needs nondeterminism</h2>
<p>A machine reading w must <em>guess</em> where w ends and wᴿ begins. In abba versus abbaabba the middle moves. No deterministic rule can decide it from the next symbol. With a marker (wcwᴿ) the middle is visible, so a DPDA works.</p>
<h2>Hierarchy</h2>
<pre><code>Regular ⊂ DCFL ⊂ CFL ⊂ Context-sensitive ⊂ Recursive ⊂ Recursively enumerable
 (DFA)    (DPDA)  (NPDA)   (LBA)               (TM that halts)  (TM)</code></pre>
<div class="tip"><b>Fact to quote.</b> Every DCFL has an unambiguous grammar. The reverse is false: wwᴿ has an unambiguous grammar but is not a DCFL.</div>`,
qa:[
Q(2,'When is a PDA deterministic?','When for every (q, a, X) at most one move exists, and if an ε-move exists for (q, X) then no input-symbol move exists for (q, X).'),
Q(2,'Name a CFL that is not accepted by any DPDA.','{wwᴿ | w ∈ {a,b}*}.'),
Q(5,'Differentiate DPDA and NPDA. Show wwᴿ needs nondeterminism.','<p>DPDA: ≤ 1 move in every configuration; accepts DCFLs; closed under complement. NPDA: may have several moves; accepts all CFLs; strictly more powerful. For wwᴿ the PDA must decide at each symbol whether the midpoint has been reached. The next symbol alone does not tell it. After reading "ab" the next symbol is b both in abba (midpoint is here, w = ab) and in abbbba (still inside w = abb), yet the required action differs. A DPDA has no way to try both, so the language is not a DCFL; an NPDA guesses. ∎</p>')
]},

{id:'m5-5',mod:'m5',title:'Turing machine',pr:'Very High',tags:'turing machine tm transition design simulator',
body:`
<div class="def"><b>Turing machine.</b> M = (Q, Σ, Γ, δ, q₀, B, F). Γ ⊇ Σ is the tape alphabet, B ∈ Γ − Σ the blank, δ: Q × Γ → Q × Γ × {L, R}. The tape is infinite to the right (and left, in the two-way model). M accepts by entering a final state.</div>
<p>L(M) is <b>recursively enumerable</b>. If M halts on every input, L is <b>recursive</b> (decidable). Unlike a PDA, a TM can overwrite symbols and move both ways, so it recognises aⁿbⁿcⁿ and everything computable.</p>
<h2>Run machines</h2>
<p>Pick a machine, enter an input, then step or run. The tape shows the head and the current state.</p>
<div data-w="tm"></div>
<h2>TM for 0ⁿ1ⁿ (n ≥ 1)</h2>
<p><b>Idea:</b> replace the leftmost 0 by X, move right to the first 1, replace it by Y, move back left to X, repeat. When no 0 remains, check that no 1 remains.</p>
<table><tr><th>State</th><th>0</th><th>1</th><th>X</th><th>Y</th><th>B</th></tr>
<tr><td>q0</td><td>(q1,X,R)</td><td>–</td><td>–</td><td>(q3,Y,R)</td><td>–</td></tr>
<tr><td>q1</td><td>(q1,0,R)</td><td>(q2,Y,L)</td><td>–</td><td>(q1,Y,R)</td><td>–</td></tr>
<tr><td>q2</td><td>(q2,0,L)</td><td>–</td><td>(q0,X,R)</td><td>(q2,Y,L)</td><td>–</td></tr>
<tr><td>q3</td><td>–</td><td>–</td><td>–</td><td>(q3,Y,R)</td><td>(q4,B,R)</td></tr>
<tr><td>q4</td><td colspan="5">final state</td></tr></table>
<p>A dash means no move: the machine halts and rejects. For n ≥ 0 (empty string accepted) add δ(q0, B) = (q4, B, R).</p>
<h2>TM for aⁿbⁿcⁿ</h2>
<p>Mark one a (X), one b (Y), one c (Z) per round. Rewind to the last X. When a’s run out, verify that only Y and Z remain. Use the simulator: select "aⁿbⁿcⁿ".</p>
<h2>TM vs PDA vs DFA</h2>
<table><tr><th>Model</th><th>Memory</th><th>Recognises</th></tr><tr><td>DFA</td><td>None</td><td>Regular</td></tr><tr><td>PDA</td><td>Stack (one access point)</td><td>Context-free</td></tr><tr><td>TM</td><td>Infinite tape, read/write/both directions</td><td>Recursively enumerable</td></tr></table>`,
qa:[
Q(2,'Define a Turing machine.','M = (Q, Σ, Γ, δ, q₀, B, F), with δ: Q × Γ → Q × Γ × {L,R}; Γ is the tape alphabet, B the blank, F the final states.'),
Q(2,'How does a Turing machine differ from a PDA?','A TM has an infinite tape it can read, overwrite and traverse in both directions. A PDA only pushes/pops a stack. So a TM accepts languages such as aⁿbⁿcⁿ that no PDA can.'),
Q(5,'Design a TM for 0ⁿ1ⁿ (n ≥ 1) and describe the idea.','<p>Mark the leftmost 0 as X, move right to the first 1 and mark it Y, return left to X, step right, repeat. When the next symbol is Y, scan right over Y’s to a blank to accept. Transitions: δ(q0,0)=(q1,X,R), δ(q1,0)=(q1,0,R), δ(q1,Y)=(q1,Y,R), δ(q1,1)=(q2,Y,L), δ(q2,0)=(q2,0,L), δ(q2,Y)=(q2,Y,L), δ(q2,X)=(q0,X,R), δ(q0,Y)=(q3,Y,R), δ(q3,Y)=(q3,Y,R), δ(q3,B)=(q4,B,R). F={q4}. ∎</p>'),
Q(13,'Design a Turing machine for L = {aⁿbⁿcⁿ | n ≥ 1}. Give the algorithm, the transition table and trace abc.','<p><b>Algorithm (3).</b> Repeat: replace leftmost a by X; move right to leftmost b → Y; continue to leftmost c → Z; return to X. When the next symbol after X is Y, scan right over Y, Z to a blank and accept. Any other symbol means reject.</p><p><b>Definition (1).</b> Q = {q0..q5}, Σ = {a,b,c}, Γ = Σ ∪ {X,Y,Z,B}, F = {q5}.</p><p><b>Transitions (5).</b><br>δ(q0,a)=(q1,X,R) δ(q0,Y)=(q4,Y,R)<br>δ(q1,a)=(q1,a,R) δ(q1,Y)=(q1,Y,R) δ(q1,b)=(q2,Y,R)<br>δ(q2,b)=(q2,b,R) δ(q2,Z)=(q2,Z,R) δ(q2,c)=(q3,Z,L)<br>δ(q3,a|b|Y|Z)=(q3,same,L) δ(q3,X)=(q0,X,R)<br>δ(q4,Y)=(q4,Y,R) δ(q4,Z)=(q4,Z,R) δ(q4,B)=(q5,B,R)</p><p><b>Trace abc (3).</b> q0·abc → X·q1·bc → XY·q2·c → X·q3·YZ → q3·XYZ → X·q0·YZ → XY·q4·Z → XYZ·q4·B → XYZB·q5. Accepted.</p><p><b>Note (1).</b> Halts and rejects on strings like aabc (no b left to mark).</p>')
]},

{id:'m5-6',mod:'m5',title:'TM programming techniques',pr:'Very High',tags:'storage finite control multiple tracks shifting subroutines multitape nondeterministic',
body:`
<p>Complex TMs are built from a handful of reusable tricks. Each trick keeps the machine a standard TM; it only organises the state set and tape alphabet.</p>
<h2>1 · Storage in the finite control</h2>
<p>States are pairs [q, d] where d is a stored symbol from a finite set. Example: "does the first symbol appear again?" Read the first symbol, store it in the state, scan right comparing.</p>
<pre><code>δ([q0,B], 0) = ([q1,0], 0, R)     remember a 0
δ([q1,0], 1) = ([q1,0], 1, R)     skip 1
δ([q1,0], 0) = reject             0 reappeared
δ([q1,0], B) = ([q2,B], B, R)     accept: first symbol unique</code></pre>
<h2>2 · Multiple tracks</h2>
<p>Treat each cell as a tuple, e.g. [a, ✓]. Top track holds data, bottom track holds marks. Used to <b>check off</b> symbols: match {ww}, compare strings, mark visited cells.</p>
<h2>3 · Shifting over</h2>
<p>To insert k symbols, shift everything right by k: store the displaced symbol in the control, write the new one, move, repeat. Used in copying and in implementing arithmetic.</p>
<h2>4 · Subroutines</h2>
<p>A TM fragment with a start and a return state, "called" by passing control to its start state. Unary addition as a call-free example (1ᵐ0 1ⁿ → 1ᵐ⁺ⁿ):</p>
<pre><code>δ(q0,1)=(q0,1,R)   skip first block
δ(q0,0)=(q1,1,R)   turn separator into 1
δ(q1,1)=(q1,1,R)   skip second block
δ(q1,B)=(q2,B,L)   hit end
δ(q2,1)=(qf,B,R)   erase one 1 → total m+n</code></pre>
<p>Run it in the simulator under "unary addition". The "binary increment" machine uses the same style.</p>
<h2>5 · Variants (equivalent in power)</h2>
<table><tr><th>Variant</th><th>Simulated by single-tape TM with…</th></tr>
<tr><td>Multi-tape TM</td><td>k tracks plus head markers. Time t becomes O(t²).</td></tr>
<tr><td>Nondeterministic TM</td><td>Deterministic TM doing breadth-first search of the computation tree. Time grows exponentially.</td></tr>
<tr><td>Two-way infinite tape</td><td>Fold the tape into two tracks.</td></tr>
<tr><td>Multi-dimensional, RAM-style models</td><td>Polynomial-time simulation.</td></tr></table>
<div class="tip"><b>Exam wording.</b> "Programming techniques" answers need the name, one-line idea, and a tiny example for each technique. Five techniques with an example each is a 13-mark answer.</div>`,
qa:[
Q(2,'List four programming techniques for Turing machines.','Storage in the finite control, multiple tracks, shifting over, subroutines (also checking off symbols).'),
Q(2,'Does a multi-tape TM accept more languages than a single-tape TM?','No. A single-tape TM simulates k tapes with k tracks and marked head positions. Only the running time changes (quadratic slowdown).'),
Q(5,'Explain "storage in the finite control" with an example.','<p>The state is a pair [q, d] with d a symbol from a finite set, so the machine can remember a bounded amount of data. Example: accept strings over {0,1} whose first symbol never reappears. Read the first symbol into the state ([q1,0] or [q1,1]), scan right: if the remembered symbol appears again halt and reject, otherwise accept at the blank. The finite number of pairs keeps the state set finite. ∎</p>'),
Q(13,'Explain five programming techniques used in designing Turing machines with an example for each.','<p><b>1. Storage in finite control (3).</b> States [q,d]; example first-symbol-unique test.</p><p><b>2. Multiple tracks (3).</b> Cell is a tuple; second track holds ✓ marks; example: matching ww by checking off each symbol pair.</p><p><b>3. Shifting over (2).</b> Store displaced symbol in the state, overwrite, move right; example: inserting a symbol at the front of the input.</p><p><b>4. Subroutines (3).</b> A machine fragment with an entry and a return state; example: unary addition 1ᵐ01ⁿ → 1ᵐ⁺ⁿ by turning 0 into 1 and erasing the last 1, reused inside a multiplication machine.</p><p><b>5. Equivalence of variants (2).</b> Multi-tape (tracks and head markers, O(t²)), nondeterministic (BFS over configurations, exponential). Same languages accepted.</p>')
]}
];
export {MODS,STEPS,T};
