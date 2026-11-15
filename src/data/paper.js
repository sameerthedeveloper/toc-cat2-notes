const PAPER=[
{part:'Part A · 5 × 2 = 10 marks',qs:[
{n:'1',m:2,q:'State the conditions of the pumping lemma.',a:`<p>If L is regular there is a constant p ≥ 1 such that every w ∈ L with |w| ≥ p can be split w = xyz with</p><p>(1) |xy| ≤ p &nbsp; (2) |y| ≥ 1 &nbsp; (3) xyⁱz ∈ L for all i ≥ 0.</p><p>(For CFLs: z = uvwxy, |vwx| ≤ p, |vx| ≥ 1, uvⁱwxⁱy ∈ L for all i ≥ 0.)</p>`},
{n:'2',m:2,q:'Define ambiguous grammar.',a:`<p>A CFG G is ambiguous if some string w ∈ L(G) has two or more distinct parse trees (equivalently, two leftmost derivations or two rightmost derivations).</p><p>Example: E → E+E | E*E | id is ambiguous for id+id*id.</p>`},
{n:'3',m:2,q:'Differentiate regular grammar and context-free grammar.',a:`<table><tr><th></th><th>Regular grammar</th><th>Context-free grammar</th></tr>
<tr><td>Production form</td><td>A → aB, A → a, A → ε (right-linear) or A → Ba (left-linear)</td><td>A → α, α ∈ (V∪T)*</td></tr>
<tr><td>Right side</td><td>At most one variable, at the end (or start)</td><td>Any mix of variables and terminals</td></tr>
<tr><td>Accepted by</td><td>Finite automaton</td><td>Pushdown automaton</td></tr>
<tr><td>Example</td><td>a*b*  (S → aS | B, B → bB | ε)</td><td>aⁿbⁿ  (S → aSb | ε)</td></tr>
<tr><td>Power</td><td>Regular ⊂ CFL, cannot count</td><td>Can match nested pairs</td></tr></table>`},
{n:'4',m:2,q:'How is the pushdown automaton related to the context-free grammar?',a:`<p>They are equivalent in power. A language is context-free iff some PDA accepts it.</p><p><b>CFG → PDA:</b> one-state PDA with δ(q,ε,A) = {(q,β) : A → β} and δ(q,a,a) = {(q,ε)}. The stack simulates a leftmost derivation.</p><p><b>PDA → CFG:</b> variables [pXq] with productions built from each move.</p>`},
{n:'5',m:2,q:'List any two programming techniques used in designing Turing machines.',a:`<p><b>1. Storage in the finite control:</b> states are pairs [q, d] so the machine remembers a symbol.</p><p><b>2. Multiple tracks:</b> each cell holds a tuple, e.g. data and a check mark. (Others: shifting over, subroutines.)</p>`}
]},
{part:'Part B · 2 × 16 = 32 marks',qs:[
{n:'6a (i)',m:10,q:'Convert the given grammar into Greibach Normal Form: A → BC ; B → CA | a ; C → AB | b. (The paper prints the last line as “B → AB | b”; it can only be C → AB | b, so that is assumed. Say so in the exam.)',a:`<p><b>Step 0.</b> No ε, unit or useless rules. Order A₁ = A, A₂ = B, A₃ = C.</p>
<p><b>Step 1: enforce j &gt; i.</b> A → BC ✓. B → CA | a ✓. C → AB | b ✗ (C → A…). Substitute A → BC: C → BCB | b. Substitute B → CA | a: C → CACB | aCB | b.</p>
<p><b>Step 2: remove left recursion (Lemma 2).</b> α = ACB; β = aCB, b.<br>C → aCB | b | aCBZ | bZ<br>Z → ACB | ACBZ</p>
<p><b>Step 3: back-substitute into B.</b> B → CA | a:<br>B → aCBA | bA | aCBZA | bZA | a</p>
<p><b>Step 4: back-substitute into A.</b> A → BC:<br>A → aCBAC | bAC | aCBZAC | bZAC | aC</p>
<p><b>Step 5: back-substitute into Z.</b> Let P = {aCBAC, bAC, aCBZAC, bZAC, aC} (the A-rules). Z → ACB | ACBZ becomes<br>Z → p CB | p CBZ for every p ∈ P.</p>
<p><b>Final GNF</b></p><pre><code>A → aCBAC | bAC | aCBZAC | bZAC | aC
B → aCBA  | bA  | aCBZA  | bZA  | a
C → aCB | b | aCBZ | bZ
Z → aCBACCB | bACCB | aCBZACCB | bZACCB | aCCB
  | aCBACCBZ | bACCBZ | aCBZACCBZ | bZACCBZ | aCCBZ</code></pre><p>Every right side starts with a terminal followed by variables. ∎ (I checked all three start symbols against the original grammar for strings up to length 9.)</p>`},
{n:'6a (ii)',m:6,q:'Show that L = {wwᴿ | w ∈ {a,b}*} is not regular.',a:`<p><b>1.</b> Assume L regular with pumping length p.<br><b>2.</b> Choose w = aᵖbbaᵖ = (aᵖb)(aᵖb)ᴿ ∈ L, |w| ≥ p.<br><b>3.</b> |xy| ≤ p, so y = aᵏ with 1 ≤ k ≤ p, inside the first a-block.<br><b>4.</b> Pump i = 2: xy²z = aᵖ⁺ᵏbbaᵖ.<br><b>5.</b> Every string uuᴿ is a palindrome. aᵖ⁺ᵏbbaᵖ is not: its reverse is aᵖbbaᵖ⁺ᵏ, which differs since k ≥ 1. So xy²z ∉ L.<br><b>6.</b> Contradiction, so L is not regular. ∎</p>`},
{n:'6b (i)',m:8,q:'OR · Obtain an unambiguous grammar for E → E+E | E−E | E*E | E/E | (E) | I ; I → a | b | c, and show the derivation for (a+b)*(a−b).',a:`<p><b>Why ambiguous.</b> No precedence or associativity: a+b*c has two trees.</p><p><b>Unambiguous grammar</b> (layers give precedence: * and / bind tighter than + and −; left recursion gives left associativity):</p><pre><code>E → E + T | E − T | T
T → T * F | T / F | F
F → ( E ) | I
I → a | b | c</code></pre>
<p><b>Leftmost derivation of (a+b)*(a−b):</b></p><pre><code>E ⇒ T ⇒ T*F ⇒ F*F ⇒ (E)*F ⇒ (E+T)*F ⇒ (T+T)*F ⇒ (F+T)*F
  ⇒ (I+T)*F ⇒ (a+T)*F ⇒ (a+F)*F ⇒ (a+I)*F ⇒ (a+b)*F
  ⇒ (a+b)*(E) ⇒ (a+b)*(E−T) ⇒ (a+b)*(T−T) ⇒ (a+b)*(F−T)
  ⇒ (a+b)*(I−T) ⇒ (a+b)*(a−T) ⇒ (a+b)*(a−F) ⇒ (a+b)*(a−I) ⇒ (a+b)*(a−b)</code></pre>
<p><b>Tree shape.</b> Root E → T. T → T * F: left T → F → ( E ), the E → E+T giving a and b; right F → ( E ), the E → E−T giving a and b. Each string now has exactly one tree, so the grammar is unambiguous.</p>`},
{n:'6b (ii)',m:8,q:'OR · Describe the properties of regular languages.',a:`<p><b>1. Closure properties (with proof idea)</b></p>
<table><tr><th>Operation</th><th>Reason</th></tr><tr><td>Union, concatenation, star</td><td>Regular expressions R₁+R₂, R₁R₂, R₁*</td></tr><tr><td>Complement</td><td>Complete DFA, swap final and non-final states</td></tr><tr><td>Intersection, difference</td><td>Product DFA (accept when both accept); L₁−L₂ = L₁∩L̄₂</td></tr><tr><td>Reversal</td><td>Reverse arrows, swap start and finals</td></tr><tr><td>Homomorphism, inverse homomorphism, quotient</td><td>Substitute in the RE; simulate DFA on h(a)</td></tr></table>
<p><b>2. Decision properties:</b> membership (run the DFA), emptiness (is a final state reachable), finiteness (cycle on a path to a final state), equivalence (minimize both and compare), containment (L₁∩L̄₂ = ∅).</p>
<p><b>3. Pumping lemma:</b> every regular language has a pumping length p; used to show non-regularity (e.g. aⁿbⁿ).</p>
<p><b>4. Myhill–Nerode:</b> L is regular iff it has finitely many distinguishable classes; the number equals the states of the minimal DFA.</p>
<p><b>5. Other facts:</b> every finite language is regular; regular languages are equivalent to DFA, NFA, ε-NFA, regular expressions and regular grammars; not closed under infinite union.</p>`},
{n:'7a',m:16,q:'Construct CFG for (i) {0²ⁿ1ᵐ | n ≥ 0, m ≥ 0}, (ii) {wwᴿ | w ∈ {a,b}*}, (iii) {w ∈ {0,1}* | w contains at least one occurrence of 101}, (iv) strings of a’s and b’s with equal numbers of a’s and b’s. (4 marks each)',a:`<p><b>(i) 0²ⁿ1ᵐ</b><br><code>S → AB ; A → 00A | ε ; B → 1B | ε</code><br>A makes an even number of 0s, B any number of 1s. Check: 001 = S ⇒ AB ⇒ 00AB ⇒ 00B ⇒ 001B ⇒ 001.</p>
<p><b>(ii) wwᴿ (even palindromes)</b><br><code>S → aSa | bSb | ε</code><br>Check abba: S ⇒ aSa ⇒ abSba ⇒ abba.</p>
<p><b>(iii) contains 101</b><br><code>S → X 101 X ; X → 0X | 1X | ε</code><br>X generates any string over {0,1}, so S generates (anything)·101·(anything). Check 01011: X=0, 101, X=1.</p>
<p><b>(iv) equal number of a’s and b’s</b><br><code>S → aSbS | bSaS | ε</code><br>Each a is matched with a b, either of them first, and the rest is again balanced. Check abba: S ⇒ aSbS ⇒ a·bSaS·bS … ⇒ abba. (Alternative: S → aSb | bSa | SS | ε.)</p>
<p>All four grammars were checked by computer against the language definitions for strings up to length 8.</p>`},
{n:'7b (i)',m:8,q:'OR · Convert to CNF: S → a | aA | B ; A → aBB | ε ; B → Aa | b.',a:`<p><b>Step 1, new start.</b> S is not on any right side, so no S₀ is needed.</p>
<p><b>Step 2, remove ε.</b> Nullable: A only (S is not nullable, so ε ∉ L). Delete A → ε and add rules with A removed:<br>S → a | aA | B<br>A → aBB<br>B → Aa | a | b</p>
<p><b>Step 3, remove unit S → B.</b> Copy B’s rules: S → a | aA | Aa | b ; A → aBB ; B → Aa | a | b.</p>
<p><b>Step 4, useless symbols.</b> A, B, S all generate strings and are reachable. None removed.</p>
<p><b>Step 5, terminals in long rules.</b> Add T → a.<br>S → a | b | TA | AT<br>A → TBB<br>B → AT | a | b</p>
<p><b>Step 6, binarize.</b> A → TBB becomes A → TD, D → BB.</p>
<p><b>Final CNF</b></p><pre><code>S → a | b | TA | AT
A → TD
D → BB
B → AT | a | b
T → a</code></pre><p>Test “aaaa”: S ⇒ TA ⇒ aA ⇒ aTD ⇒ aaD ⇒ aaBB ⇒ aaaB ⇒ aaaa ✓ (also checked by computer for all strings up to length 9).</p>`},
{n:'7b (ii)',m:8,q:'OR · Explain the pumping lemma for context-free languages and its applications.',a:`<p><b>Statement.</b> If L is a CFL there is p ≥ 1 such that every z ∈ L with |z| ≥ p can be written z = uvwxy with (1) |vwx| ≤ p, (2) |vx| ≥ 1, (3) uvⁱwxⁱy ∈ L for all i ≥ 0.</p>
<p><b>Why it holds.</b> A parse tree of a long string (in CNF) is deep, so some variable A repeats on a root-to-leaf path. The upper A generates vwx, the lower A generates w. Repeating or removing the part between them pumps v and x together.</p>
<p><b>Use (proof by contradiction).</b> Assume L is a CFL; pick z ∈ L with |z| ≥ p; consider every position of vwx (it is shorter than p, so it touches at most two adjacent blocks); show some i gives a string outside L.</p>
<p><b>Applications.</b></p><ul><li>{aⁿbⁿcⁿ} is not a CFL (z = aᵖbᵖcᵖ).</li><li>{ww} is not a CFL (z = aᵖbᵖaᵖbᵖ).</li><li>{aⁱbʲcᵏ | i &lt; j &lt; k} and {a^(n²)} are not CFLs.</li><li>It shows the CFL class is not closed under intersection or complement.</li></ul>
<p><b>Limit.</b> It only proves a language is <em>not</em> context-free; it cannot prove one is.</p>`}
]},
{part:'Part C · 1 × 8 = 8 marks',qs:[
{n:'8a',m:8,q:'Demonstrate a PDA for L = {wcwᴿ | w ∈ (a+b)*} and show the instantaneous descriptions for the string “aabcbaa”.',a:`<p><b>Idea.</b> Push each symbol of w. The marker c tells the machine where the middle is (so it is deterministic). Then pop one symbol per matching input symbol. Accept when only Z is left.</p>
<p><b>Definition.</b> P = ({q0,q1,q2}, {a,b,c}, {a,b,Z}, δ, q0, Z, {q2}).</p>
<pre><code>δ(q0, a, Z) = {(q0, aZ)}     δ(q0, b, Z) = {(q0, bZ)}
δ(q0, a, a) = {(q0, aa)}     δ(q0, b, a) = {(q0, ba)}
δ(q0, a, b) = {(q0, ab)}     δ(q0, b, b) = {(q0, bb)}
δ(q0, c, Z) = {(q1, Z)}      δ(q0, c, a) = {(q1, a)}   δ(q0, c, b) = {(q1, b)}
δ(q1, a, a) = {(q1, ε)}      δ(q1, b, b) = {(q1, ε)}
δ(q1, ε, Z) = {(q2, Z)}</code></pre>
<p><b>Instantaneous descriptions for aabcbaa</b> (stack top on the left):</p>
<pre><code>(q0, aabcbaa, Z) ⊢ (q0, abcbaa, aZ) ⊢ (q0, bcbaa, aaZ) ⊢ (q0, cbaa, baaZ)
⊢ (q1, baa, baaZ) ⊢ (q1, aa, aaZ) ⊢ (q1, a, aZ) ⊢ (q1, ε, Z) ⊢ (q2, ε, Z)</code></pre>
<p>q2 is final and the input is consumed, so aabcbaa is accepted. ∎ (Run it in the PDA simulator: machine “wcwᴿ”.)</p>`},
{n:'8b',m:8,q:'OR · Design a Turing machine for L = {0ⁿ1ⁿ | n ≥ 0}. Show that 0011 is accepted.',a:`<p><b>Idea.</b> Replace the leftmost 0 by X, move right to the first 1, replace it by Y, move back to X and repeat. When no 0 is left, check that no 1 is left. For n = 0 (empty input) accept at once.</p>
<p><b>Definition.</b> M = ({q0,q1,q2,q3,q4}, {0,1}, {0,1,X,Y,B}, δ, q0, B, {q4}).</p>
<table><tr><th>State</th><th>0</th><th>1</th><th>X</th><th>Y</th><th>B</th></tr>
<tr><td>q0</td><td>(q1,X,R)</td><td>–</td><td>–</td><td>(q3,Y,R)</td><td>(q4,B,R)</td></tr>
<tr><td>q1</td><td>(q1,0,R)</td><td>(q2,Y,L)</td><td>–</td><td>(q1,Y,R)</td><td>–</td></tr>
<tr><td>q2</td><td>(q2,0,L)</td><td>–</td><td>(q0,X,R)</td><td>(q2,Y,L)</td><td>–</td></tr>
<tr><td>q3</td><td>–</td><td>–</td><td>–</td><td>(q3,Y,R)</td><td>(q4,B,R)</td></tr></table>
<p><b>Instantaneous descriptions for 0011</b> (state written just before the scanned cell):</p>
<pre><code>[q0]0011 ⊢ X[q1]011 ⊢ X0[q1]11 ⊢ X[q2]0Y1 ⊢ [q2]X0Y1 ⊢ X[q0]0Y1
⊢ XX[q1]Y1 ⊢ XXY[q1]1 ⊢ XX[q2]YY ⊢ X[q2]XYY ⊢ XX[q0]YY
⊢ XXY[q3]Y ⊢ XXYY[q3]B ⊢ XXYYB[q4]</code></pre>
<p>The machine enters the final state q4, so 0011 is accepted. ∎ (Run it in the TM simulator.)</p>`}
]}
];
export {PAPER};
