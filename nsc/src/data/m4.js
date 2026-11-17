const Q = (m, q, a) => ({ m, q, a });

export const T4 = [
  {
    id: 'm4-1', mod: 'm4', title: 'Authentication requirements', pr: 'High',
    tags: 'authentication requirements attacks masquerade replay content modification sequence timing repudiation integrity',
    body: `
<div class="def"><b>Message authentication</b> is a procedure that lets the receiver verify that a message is <b>genuine</b>: it comes from the claimed source (authentic source) and has <b>not been altered</b> (integrity), and that it is <b>timely</b> and in the right sequence.</div>
<h2>Requirements</h2>
<ol><li>Verify that the received message <b>came from the alleged source</b> and was <b>not altered</b>.</li><li>Verify <b>sequencing and timeliness</b> (no replay, no reordering).</li><li>Digital signatures add <b>source non-repudiation</b>: the sender cannot later deny sending.</li></ol>
<h2>Attacks that authentication must stop</h2>
<table><tr><th>Attack</th><th>Meaning</th></tr>
<tr><td>Disclosure</td><td>Message contents released to someone without the right key</td></tr>
<tr><td>Traffic analysis</td><td>Discovering who talks to whom, how often, how long (pattern, even if encrypted)</td></tr>
<tr><td>Masquerade</td><td>Fraudulent message inserted pretending to come from a legitimate source</td></tr>
<tr><td>Content modification</td><td>Contents of a message are changed</td></tr>
<tr><td>Sequence modification</td><td>Messages are reordered, inserted, deleted</td></tr>
<tr><td>Timing modification</td><td>Delay or replay of messages (replay attack)</td></tr>
<tr><td>Source repudiation</td><td>Sender denies having sent the message</td></tr>
<tr><td>Destination repudiation</td><td>Receiver denies having received it</td></tr></table>
<p>Masquerade, content, sequence and timing modification are countered by <b>message authentication</b>. Source and destination repudiation need <b>digital signatures</b>. Disclosure needs <b>encryption</b>. Traffic analysis needs traffic padding.</p>
<h2>Integrity versus authentication</h2>
<table><tr><th>Integrity</th><th>Authentication</th></tr>
<tr><td>Message has not been changed in transit</td><td>Message really comes from the claimed sender</td></tr>
<tr><td>Checked with a hash or checksum</td><td>Needs a secret: MAC, signature or password</td></tr>
<tr><td>A plain hash is enough for accidental changes</td><td>Stops an active attacker who can recompute the hash</td></tr>
<tr><td>Question answered: was it altered?</td><td>Question answered: who sent it?</td></tr></table>
<div class="tip"><b>Exam tip.</b> Connect each attack to its countermeasure in a table. Mention replay prevention: sequence numbers, timestamps, nonces.</div>`,
    qa: [
      Q(2, 'Distinguish between integrity and authentication.', 'Integrity assures the data has not been altered. Authentication assures the data came from the claimed sender. A message can keep integrity yet be forged (a fresh message with a freshly computed plain hash), so authentication needs a secret key.'),
      Q(2, 'What is a replay attack and how is it prevented?', 'The attacker records a valid message and resends it later. It is prevented with sequence numbers, timestamps or nonces.'),
      Q(5, 'List and explain the attacks that threaten message authentication.', 'Eight-row attack table above, each in one line, plus which service counters each.'),
    ],
  },
  {
    id: 'm4-2', mod: 'm4', title: 'Authentication functions', pr: 'High',
    tags: 'authentication functions message encryption mac hash function levels symmetric public key',
    body: `
<div class="def"><b>Two levels.</b> Any authentication scheme has a lower level that produces an <b>authenticator</b> (a value used to authenticate), and a higher level protocol that uses it so the receiver can verify the message. The authenticator comes from one of three function classes.</div>
<h2>1. Message encryption</h2>
<ul><li><b>Symmetric encryption:</b> only sender and receiver know K. A message that decrypts to sensible plaintext must have come from the sender. Needs structure or redundancy (an error-detecting code or frame check sequence) so the receiver can tell valid plaintext from random.</li>
<li><b>Public key, encrypt with receiver's public key:</b> gives confidentiality only. Anyone can send it, so no authentication.</li>
<li><b>Public key, encrypt with sender's private key:</b> gives authentication and signature. Anyone can read it, so no confidentiality.</li>
<li><b>Both:</b> E(KU<sub>b</sub>, E(KR<sub>a</sub>, M)). Slow: four public key operations per exchange.</li></ul>
<h2>2. Message authentication code (MAC)</h2>
<p>A fixed-size tag T = MAC(K, M) computed with a shared secret K and appended to the message. See the MAC topic.</p>
<h2>3. Hash function</h2>
<p>A function H(M) mapping any message to a fixed-length digest. On its own it gives no authentication, so the digest is protected: encrypted with a symmetric key, signed with a private key (digital signature), or mixed with a secret value.</p>
<h2>Six ways to use a hash for authentication</h2>
<p>A hash H(M) takes only the message (no key), so the hash code must be protected. There are six standard methods:</p>
<table><tr><th>Method</th><th>Sent</th><th>Gives</th></tr>
<tr><td>1</td><td>E(K, M ‖ H(M))</td><td>Authentication and confidentiality (encrypt message and hash together)</td></tr>
<tr><td>2</td><td>M ‖ E(K, H(M))</td><td>Authentication only (only the hash is encrypted)</td></tr>
<tr><td>3</td><td>M ‖ E(KR<sub>a</sub>, H(M))</td><td>Authentication and digital signature</td></tr>
<tr><td>4</td><td>E(K, M ‖ E(KR<sub>a</sub>, H(M)))</td><td>Signature and confidentiality</td></tr>
<tr><td>5</td><td>M ‖ H(M ‖ S)</td><td>Authentication using a shared secret S, no encryption</td></tr>
<tr><td>6</td><td>E(K, M ‖ H(M ‖ S))</td><td>Authentication and confidentiality with a shared secret</td></tr></table>
<div data-w="diag:hashmethods"></div>
<p><b>Why method 5 is popular:</b> encryption software is slow and costly, and encryption hardware can be tied to patents or export limits. A secret value S mixed into the hash gives authentication without any encryption. This idea led to HMAC.</p>
<h2>Which to use</h2>
<table><tr><th>Function</th><th>Strength</th><th>Weakness</th></tr>
<tr><td>Encryption</td><td>Authenticates and hides in one step</td><td>Slow; needs redundancy in the plaintext</td></tr>
<tr><td>MAC</td><td>Fast, no encryption needed, can authenticate selected messages</td><td>No signature (receiver can also forge)</td></tr>
<tr><td>Hash</td><td>Fast, no secret needed to compute</td><td>Must be protected by a key to authenticate</td></tr></table>`,
    qa: [
      Q(2, 'Name the three types of authentication functions.', 'Message encryption, message authentication code (MAC), and hash function.'),
      Q(5, 'Explain how public key encryption provides confidentiality, authentication and both.', 'Use the three public key modes with formulas: E(KU_b, M), E(KR_a, M) and E(KU_b, E(KR_a, M)), with what each gives and the cost.'),
      Q(8, 'Discuss the authentication functions with suitable schemes.', '<p>Two levels (1). Encryption modes (3). MAC (2). Hash with the six methods and what each provides (2).</p>'),
      Q(8, 'Explain the six methods of message authentication using a hash function, with diagrams.', '<p>One line on why the hash must be protected (1). For each method write the sent form and what it provides (1 each) and draw the diagram for as many as time allows: 1 E(K, M ‖ H(M)), 2 M ‖ E(K, H(M)), 3 M ‖ E(KR<sub>a</sub>, H(M)), 4 E(K, M ‖ E(KR<sub>a</sub>, H(M))), 5 M ‖ H(M ‖ S), 6 E(K, M ‖ H(M ‖ S)) (5).</p><p>Note the reason for method 5 (no encryption cost) (1). Receiver steps: decrypt, recompute, compare (1).</p>'),
    ],
  },
  {
    id: 'm4-3', mod: 'm4', title: 'Message Authentication Code (MAC)', pr: 'Very High',
    tags: 'mac message authentication code hmac cmac tag shared key forgery ipad opad',
    body: `
<div class="def"><b>Definition.</b> A MAC (cryptographic checksum) is a short fixed-size tag <b>T = MAC(K, M)</b> computed from a message M and a <b>secret key K</b> shared by sender and receiver. The tag travels with the message. Only a holder of K can produce or verify it.</div>
<h2>How it works</h2>
<ol><li>Sender computes T = MAC(K, M) and sends M ‖ T.</li><li>Receiver recomputes MAC(K, M′) on the received message.</li><li>If it equals the received T, the message is accepted: it is <b>unaltered</b> (integrity) and came from the <b>key holder</b> (authentication). Otherwise it is rejected.</li></ol>
<div data-w="diag:macauth"></div>
<h2>Three basic uses of a MAC</h2>
<ol><li><b>Authentication only:</b> send M ‖ MAC(K, M).</li><li><b>Authentication tied to plaintext:</b> T = MAC(K₁, M), send E(K₂, M ‖ T). The receiver decrypts, then checks the MAC on the plaintext.</li><li><b>Authentication tied to ciphertext:</b> C = E(K₂, M), send C ‖ MAC(K₁, C). The receiver checks the MAC on the ciphertext first.</li></ol>
<h2>MAC with confidentiality</h2>
<p>A MAC does not hide M. For secrecy add encryption with a second key:</p>
<ul><li><b>Authenticate then encrypt:</b> T = MAC(K<sub>1</sub>, M), send E(K<sub>2</sub>, M ‖ T).</li><li><b>Encrypt then authenticate:</b> C = E(K<sub>2</sub>, M), T = MAC(K<sub>1</sub>, C), send C ‖ T. This is the preferred order because forged ciphertext is rejected before decryption.</li></ul>
<div data-w="diag:macconf"></div>
<div data-w="diag:macconf2"></div>
<h2>Requirements</h2>
<ul><li>Knowing M and T, it is computationally infeasible to find M′ with the same T (no forging).</li><li>Tags are uniformly distributed.</li><li>The tag depends equally on every bit of the message.</li></ul>
<h2>Applications</h2>
<ul><li>Message authentication when only one side needs to be sure (one party's broadcast, selected messages in a heavy load).</li><li>Integrity of stored files and software when no secrecy is needed.</li><li>Network protocols: IPsec (HMAC), TLS records, SSH, Wi-Fi and banking messages.</li><li>Challenge-response authentication.</li></ul>
<h2>Security of MACs</h2>
<ul><li><b>Computation resistance:</b> given one or more pairs [x<sub>i</sub>, MAC(K, x<sub>i</sub>)], it is infeasible to compute a valid pair [x, MAC(K, x)] for any new x ≠ x<sub>i</sub>.</li><li><b>Brute force:</b> harder than on a hash because the attacker needs known message and tag pairs. Effort is min(2<sup>k</sup>, 2<sup>n</sup>).</li><li><b>Cryptanalysis:</b> an ideal MAC needs an effort at least equal to brute force.</li></ul>
<h2>Constructions</h2>
<p><b>1. HMAC (based on a hash).</b></p>
<p><b>Design objectives:</b> (1) use available hash functions without modification; (2) allow the embedded hash to be replaced easily if a faster or stronger one appears; (3) preserve the original hash speed; (4) handle keys in a simple way; (5) have a well understood analysis of the strength of the mechanism based on reasonable assumptions about the hash.</p>
<p><b>Notation:</b> H = embedded hash (MD5, SHA-1); b = block size in bits; n = hash length; K = secret key (recommended length ≥ n; a key longer than b is hashed first); K⁺ = K padded with zeros on the left to b bits; ipad = 00110110 (0x36) repeated b/8 times; opad = 01011100 (0x5C) repeated b/8 times.</p>
<p><code>HMAC(K, M) = H[ (K⁺ ⊕ opad) ‖ H[ (K⁺ ⊕ ipad) ‖ M ] ]</code></p>
<div data-w="diag:hmac"></div>
<ol><li>Append zeros to the left of K to make the b-bit string K⁺.</li><li>XOR K⁺ with ipad to get the b-bit block S<sub>i</sub>.</li><li>Append M to S<sub>i</sub>.</li><li>Apply H to the stream from step 3.</li><li>XOR K⁺ with opad to get the b-bit block S<sub>o</sub>.</li><li>Append the hash result of step 4 to S<sub>o</sub>.</li><li>Apply H to the stream from step 6 and output the result.</li></ol>
<p>HMAC resists length-extension attacks that break the naive H(K ‖ M).</p>
<p><b>2. DAA (Data Authentication Algorithm).</b> DES in CBC mode with zero IV. Blocks D₁ … D<sub>N</sub>: O₁ = E(K, D₁), O₂ = E(K, D₂ ⊕ O₁), O₃ = E(K, D₃ ⊕ O₂), … O<sub>N</sub> = E(K, D<sub>N</sub> ⊕ O<sub>N−1</sub>). The DAC is O<sub>N</sub> or its leftmost 16 to 64 bits. It is weak for variable-length messages.</p>
<p><b>3. CMAC (Cipher-based MAC).</b> Improves DAA using AES or triple DES for messages of any length. Blocks M₁ … M<sub>n</sub>, key K, derived constants K₁ and K₂: C₁ = E(K, M₁), C₂ = E(K, M₂ ⊕ C₁), … C<sub>n</sub> = E(K, M<sub>n</sub> ⊕ C<sub>n−1</sub> ⊕ K₁), tag T = MSB<sub>Tlen</sub>(C<sub>n</sub>) (the Tlen leftmost bits). If the last block is incomplete, pad it on the right with a 1 and as many 0s as needed, and use K₂ instead of K₁.</p>
<div data-w="mac"></div>
<h2>Limits</h2>
<p>Sender and receiver share K, so either could create the tag. A MAC therefore cannot prove <b>to a third party</b> who sent it, and gives no non-repudiation. A digital signature does.</p>
<h2>MAC versus hash function</h2>
<table><tr><th></th><th>MAC</th><th>Hash function</th></tr>
<tr><td>Key</td><td>Needs a secret key</td><td>No key</td></tr>
<tr><td>Provides</td><td>Integrity and authentication</td><td>Integrity only</td></tr>
<tr><td>Who can compute</td><td>Only key holders</td><td>Anyone</td></tr>
<tr><td>Attacker alters message</td><td>Cannot fix the tag without K</td><td>Can recompute the hash</td></tr></table>
<h2>MAC versus digital signature</h2>
<table><tr><th></th><th>MAC</th><th>Digital signature</th></tr>
<tr><td>Key type</td><td>Symmetric, shared</td><td>Asymmetric: sign with private, verify with public</td></tr>
<tr><td>Non-repudiation</td><td>No</td><td>Yes</td></tr>
<tr><td>Speed</td><td>Fast</td><td>Slower</td></tr>
<tr><td>Verifier</td><td>Only a key holder</td><td>Anyone with the public key</td></tr></table>`,
    qa: [
      Q(2, 'Define a MAC.', 'A fixed-size tag T = MAC(K, M) produced from a message and a shared secret key, used by the receiver to check the message\'s integrity and origin.'),
      Q(2, 'Why does a MAC not give non-repudiation?', 'Both parties hold the same key, so either could have produced the tag. A third party cannot tell who did.'),
      Q(5, 'Differentiate MAC and hash function.', 'Use the MAC versus hash table: key, what it provides, who can compute, effect of tampering.'),
      Q(5, 'Explain HMAC.', 'Give the formula, ipad and opad, inner and outer hash, why it is preferred over H(K ‖ M), and the hash it can use (SHA-256).'),
      Q(8, 'Explain the structure of HMAC with its design objectives.', '<p>Five design objectives (2). Notation K⁺, ipad, opad, b, n (1). Formula (1). Seven steps with the diagram (3). Why secure: two nested hashes, length extension blocked (1).</p>'),
      Q(5, 'Differentiate DAA and CMAC.', 'DAA is DES-CBC with a zero IV and takes the last block as tag; it is weak for variable-length messages. CMAC uses AES or 3DES with K₁ (complete last block) or K₂ (padded last block) and takes the leftmost Tlen bits of C<sub>n</sub>; it is secure for messages of any length.'),
      Q(8, 'Describe the concept of MAC and elaborate its applications for message authentication and confidentiality with a neat diagram.', '<p><b>Concept (2).</b> Definition, T = MAC(K, M), shared key.</p><p><b>Authentication diagram (2).</b> Sender computes and appends; receiver recomputes and compares.</p><p><b>Confidentiality (2.5).</b> Authentication tied to plaintext: E(K<sub>2</sub>, M ‖ MAC(K<sub>1</sub>, M)). Authentication tied to ciphertext: C = E(K<sub>2</sub>, M), send C ‖ MAC(K<sub>1</sub>, C). Draw both diagrams.</p><p><b>Applications (1.5).</b> IPsec, TLS, SSH, challenge-response, file integrity. Limit: no non-repudiation.</p>'),
    ],
  },
  {
    id: 'm4-4', mod: 'm4', title: 'Hash functions', pr: 'Very High',
    tags: 'hash function properties preimage collision birthday avalanche merkle damgard applications',
    body: `
<div class="def"><b>Definition.</b> A cryptographic hash function H maps a message of <b>any length</b> to a <b>fixed-length digest</b> h = H(M) (a fingerprint). It is a one-way function: easy to compute forwards, infeasible to reverse or to find two inputs with the same output.</div>
<h2>Properties</h2>
<table><tr><th>Property</th><th>Meaning</th></tr>
<tr><td>Variable input size</td><td>H applies to a block of any size</td></tr>
<tr><td>Fixed output size</td><td>Digest has constant length</td></tr>
<tr><td>Efficiency</td><td>H(M) is easy to compute in hardware and software</td></tr>
<tr><td>Preimage resistant (one-way)</td><td>Given h, infeasible to find M with H(M) = h</td></tr>
<tr><td>Second preimage resistant (weak collision resistance)</td><td>Given M₁, infeasible to find M₂ ≠ M₁ with H(M₂) = H(M₁)</td></tr>
<tr><td>Collision resistant (strong)</td><td>Infeasible to find any pair x ≠ y with H(x) = H(y)</td></tr>
<tr><td>Pseudorandomness</td><td>Output passes randomness tests</td></tr></table>
<h2>Avalanche effect</h2>
<p>A small change in the input (one bit) changes about <b>half of the output bits</b>. It makes the digest unpredictable and hides any relation between input and output.</p>
<div data-w="hash"></div>
<h2>General structure: Merkle–Damgård</h2>
<p>Most hashes (MD5, SHA-1, SHA-2) use an <b>iterated</b> design. Pad the message and append its length, split into N blocks Y₁…Y<sub>N</sub>, and chain a <b>compression function f</b>: CV₀ = IV, CV<sub>i</sub> = f(CV<sub>i−1</sub>, Y<sub>i</sub>), H(M) = CV<sub>N</sub>. If f is collision resistant, so is the whole hash.</p>
<div data-w="diag:md"></div>
<p><b>Hash versus MAC.</b> A hash is like a MAC (variable-size input, fixed-size output, called hash code, hash value or message digest), but it uses <b>no key</b>: the message is the only input. See <a href="#m4-2">authentication functions</a> for the six ways to protect a hash code.</p>
<h2>Applications</h2>
<ul><li>Message authentication (inside HMAC) and digital signatures (sign the digest, not the message).</li><li>File and software integrity checks, checksums, forensics.</li><li>Password storage (salted hash).</li><li>One-way passwords, key derivation, blockchain proof of work, deduplication.</li></ul>
<h2>Types of hash algorithms</h2>
<table><tr><th>Family</th><th>Examples</th><th>Design</th></tr>
<tr><td>MD family</td><td>MD2, MD4, MD5 (128-bit)</td><td>Merkle–Damgård, little-endian words</td></tr>
<tr><td>SHA-1</td><td>SHA-1 (160-bit)</td><td>Merkle–Damgård, 80 steps</td></tr>
<tr><td>SHA-2</td><td>SHA-224, 256, 384, 512</td><td>Merkle–Damgård</td></tr>
<tr><td>SHA-3</td><td>Keccak (224–512)</td><td>Sponge construction</td></tr>
<tr><td>RIPEMD, Whirlpool</td><td>RIPEMD-160, Whirlpool (512)</td><td>Parallel lines; AES-like block cipher</td></tr>
<tr><td>Block cipher based, keyed</td><td>Davies–Meyer, HMAC, CMAC</td><td>Cipher or hash used to make a keyed function</td></tr></table>
<h2>Hashing versus encryption</h2>
<table><tr><th></th><th>Hashing</th><th>Encryption</th></tr>
<tr><td>Reversible?</td><td>No, one-way</td><td>Yes, with the key</td></tr>
<tr><td>Output length</td><td>Fixed</td><td>Depends on input</td></tr>
<tr><td>Key</td><td>None</td><td>Required</td></tr>
<tr><td>Purpose</td><td>Integrity, fingerprint</td><td>Confidentiality</td></tr></table>`,
    qa: [
      Q(2, 'What is meant by avalanche effect?', 'A one-bit change in the input changes about half of the output bits, so similar inputs give completely unrelated digests.'),
      Q(2, 'List any two properties of a cryptographic hash function.', 'Any two of: fixed-length output for any input, one-way (preimage resistance), second-preimage resistance, collision resistance, efficiency.'),
      Q(5, 'Explain preimage, second preimage and collision resistance.', 'Define each in one line from the table, with the work needed: 2ⁿ, 2ⁿ, 2^(n/2) for an n-bit hash.'),
      Q(5, 'Differentiate hashing and encryption.', 'Use the hashing vs encryption table.'),
      Q(16, 'Discuss the different types of cryptographic hash algorithms and explain their operation with suitable diagrams.', '<p><b>Requirements (2).</b> Properties above.</p><p><b>Classification (3).</b> MD family, SHA family, RIPEMD, Whirlpool, keyed (HMAC).</p><p><b>Iterated structure with diagram (4).</b> Draw the Merkle–Damgård chain: IV, f, Y₁…Y<sub>N</sub>, CV<sub>i</sub>, digest.</p><p><b>MD5 operation (3).</b> Padding, length, four-word buffer, four rounds of 16 steps, digest of 128 bits.</p><p><b>SHA operation (3).</b> SHA-1 padding, 80 steps, five-word buffer, message schedule; SHA-512 uses 1024-bit blocks and 80 rounds.</p><p><b>SHA-3 and applications (1).</b> Sponge, signatures, HMAC, password storage.</p>'),
    ],
  },
  {
    id: 'm4-5', mod: 'm4', title: 'MD5 algorithm', pr: 'Very High',
    tags: 'md5 message digest rivest 128 bit padding buffer rounds compression function',
    body: `
<div class="def"><b>Definition.</b> MD5 (Message Digest 5, Rivest, 1991, RFC 1321) takes a message of any length, processes it in <b>512-bit blocks</b>, and produces a <b>128-bit digest</b>.</div>
<h2>Steps</h2>
<ol>
<li><b>Append padding bits.</b> Add a single 1 bit followed by 0 bits so the length becomes 448 mod 512 (64 bits short of a multiple of 512). Padding is always added, 1 to 512 bits.</li>
<li><b>Append length.</b> Add the original length as a 64-bit value (little-endian). Total length is now a multiple of 512. The message is N blocks of sixteen 32-bit words.</li>
<li><b>Initialise the MD buffer.</b> Four 32-bit registers (little-endian hex):<br>A = 67452301, B = EFCDAB89, C = 98BADCFE, D = 10325476.</li>
<li><b>Process each 512-bit block</b> in four rounds of 16 steps (64 steps). Each round uses a different nonlinear function and all 16 message words once (in a different order). The output of the block is added to the input buffer values.</li>
<li><b>Output.</b> After the last block, A ‖ B ‖ C ‖ D (128 bits) is the message digest.</li>
</ol>
<h2>One step</h2>
<p><code>a ← b + ((a + g(b, c, d) + X[k] + T[i]) &lt;&lt;&lt; s)</code></p>
<p>X[k] is a 32-bit message word, T[i] = floor(2³² × |sin(i)|) is a constant for step i (64 constants), s is a left rotation amount that changes per step, and the four registers rotate roles after each step.</p>
<table><tr><th>Round</th><th>Function g(b, c, d)</th></tr>
<tr><td>1 (steps 1–16)</td><td>F = (b ∧ c) ∨ (¬b ∧ d)</td></tr>
<tr><td>2 (steps 17–32)</td><td>G = (b ∧ d) ∨ (c ∧ ¬d)</td></tr>
<tr><td>3 (steps 33–48)</td><td>H = b ⊕ c ⊕ d</td></tr>
<tr><td>4 (steps 49–64)</td><td>I = c ⊕ (b ∨ ¬d)</td></tr></table>
<p>Message word order: round 1 uses k = i; round 2 uses (5i + 1) mod 16; round 3 uses (3i + 5) mod 16; round 4 uses 7i mod 16.</p>
<p>Known test values: MD5("") = d41d8cd98f00b204e9800998ecf8427e, MD5("abc") = 900150983cd24fb0d6963f7d28e17f72. The hash lab above computes them live.</p>
<h2>Features</h2>
<ul><li>128-bit digest, 512-bit block, 64 steps in 4 rounds.</li><li>Fast and simple; works on 32-bit words (little-endian).</li><li>Every output bit depends on every input bit (avalanche).</li></ul>
<h2>Weakness</h2>
<p>Collisions were found in 2004 (Wang et al.) and are now made in seconds on a laptop; a real rogue CA certificate was forged in 2008. MD5 is <b>broken for signatures and certificates</b>. A 128-bit digest also gives only 2⁶⁴ birthday work. Use SHA-256 or SHA-3 instead; MD5 survives only for non-security checksums.</p>
<h2>MD5 versus SHA-1</h2>
<table><tr><th></th><th>MD5</th><th>SHA-1</th></tr>
<tr><td>Digest</td><td>128 bits</td><td>160 bits</td></tr>
<tr><td>Block</td><td>512 bits</td><td>512 bits</td></tr>
<tr><td>Steps</td><td>64 (4 × 16)</td><td>80 (4 × 20)</td></tr>
<tr><td>Buffer</td><td>4 words (A–D)</td><td>5 words (A–E)</td></tr>
<tr><td>Byte order</td><td>Little-endian</td><td>Big-endian</td></tr>
<tr><td>Constants</td><td>64 different T[i]</td><td>4 constants, one per round</td></tr>
<tr><td>Message schedule</td><td>Words reused directly</td><td>16 words expanded to 80</td></tr>
<tr><td>Brute-force strength</td><td>2¹²⁸ preimage, 2⁶⁴ collision</td><td>2¹⁶⁰ preimage, 2⁸⁰ collision</td></tr>
<tr><td>Speed</td><td>Faster</td><td>Slower</td></tr>
<tr><td>Status</td><td>Broken</td><td>Deprecated (collision 2017)</td></tr></table>`,
    qa: [
      Q(2, 'Mention any two features of MD5.', '(1) Produces a 128-bit message digest from a message of any length. (2) Processes the message in 512-bit blocks through four rounds of 16 steps.'),
      Q(2, 'What are the initial values of the MD5 buffer?', 'A = 67452301, B = EFCDAB89, C = 98BADCFE, D = 10325476 (hex).'),
      Q(5, 'Why is MD5 no longer considered secure?', 'Practical collision attacks exist (2004), allowing forged certificates and signatures; the 128-bit digest is too short for birthday resistance (2⁶⁴). Use SHA-256 instead.'),
      Q(8, 'Explain the working of the MD5 algorithm.', '<p>Padding (1.5). Append 64-bit length (1). Initialise A, B, C, D (1). Four rounds with F, G, H, I and 16 steps each, with the step equation (3.5). Output A ‖ B ‖ C ‖ D (1).</p>'),
      Q(16, 'Describe the MD5 algorithm in detail with a diagram and compare it with SHA-1.', '<p>Steps with diagram (6). Round functions table and the step equation (4). Features and weaknesses (2). MD5 vs SHA-1 table (4).</p>'),
    ],
  },
  {
    id: 'm4-6', mod: 'm4', title: 'Secure Hash Algorithm (SHA)', pr: 'Very High',
    tags: 'sha secure hash algorithm sha-1 sha-256 sha-512 sha-3 nist rounds message schedule',
    body: `
<div class="def"><b>Definition.</b> SHA is a family of cryptographic hash functions published by NIST. SHA-1 (1993, FIPS 180) is based on MD4 and takes input of less than 2⁶⁴ bits, using 512-bit blocks, and produces a <b>160-bit</b> digest. SHA-2 adds longer digests; SHA-3 (2015) is a new design.</div>
<h2>SHA-1 steps</h2>
<ol>
<li><b>Padding.</b> Append a 1 bit then zeros so the length is 448 mod 512, then append the 64-bit message length (big-endian). Result: N blocks of 512 bits.</li>
<li><b>Initialise buffer.</b> Five 32-bit registers A = 67452301, B = EFCDAB89, C = 98BADCFE, D = 10325476, E = C3D2E1F0.</li>
<li><b>Process each block</b> in 80 steps (4 rounds of 20). The 16 words W₀…W₁₅ are expanded to 80:<br><code>W<sub>t</sub> = ROTL¹(W<sub>t−3</sub> ⊕ W<sub>t−8</sub> ⊕ W<sub>t−14</sub> ⊕ W<sub>t−16</sub>)</code></li>
<li>Each step: <code>TEMP = ROTL⁵(A) + f<sub>t</sub>(B, C, D) + E + W<sub>t</sub> + K<sub>t</sub></code>, then E = D, D = C, C = ROTL³⁰(B), B = A, A = TEMP.</li>
<li>After 80 steps add A…E to the values from before the block (mod 2³²). Output is A ‖ B ‖ C ‖ D ‖ E after the last block.</li>
</ol>
<table><tr><th>Steps</th><th>f<sub>t</sub>(B, C, D)</th><th>K<sub>t</sub></th></tr>
<tr><td>0–19</td><td>(B ∧ C) ∨ (¬B ∧ D)</td><td>5A827999</td></tr>
<tr><td>20–39</td><td>B ⊕ C ⊕ D</td><td>6ED9EBA1</td></tr>
<tr><td>40–59</td><td>(B ∧ C) ∨ (B ∧ D) ∨ (C ∧ D)</td><td>8F1BBCDC</td></tr>
<tr><td>60–79</td><td>B ⊕ C ⊕ D</td><td>CA62C1D6</td></tr></table>
<div data-w="hash"></div>
<h2>SHA-1 compression function</h2>
<div data-w="diag:sha1"></div>
<p>One step: <code>(A, B, C, D, E) ← (E + f(t, B, C, D) + S⁵(A) + W<sub>t</sub> + K<sub>t</sub>, A, S³⁰(B), C, D)</code>, where S<sup>k</sup> is a circular left shift by k bits and + is addition mod 2³².</p>
<ul><li><b>f(t, B, C, D)</b>: steps 0–19 use the <b>conditional</b> function (if B then C else D); steps 20–39 and 60–79 use the <b>parity</b> function (B ⊕ C ⊕ D); steps 40–59 use the <b>majority</b> function (true if two or three of the inputs are true).</li><li><b>W<sub>t</sub></b>: the first 16 words are the block itself; for t = 16…79, W<sub>t</sub> = S¹(W<sub>t−16</sub> ⊕ W<sub>t−14</sub> ⊕ W<sub>t−8</sub> ⊕ W<sub>t−3</sub>).</li><li>The output of the 80th step is added word by word (mod 2³²) to the input chaining value.</li></ul>
<pre>CV₀ = IV
CV_(q+1) = SUM32( CV_q, ABCDE_q )
MD = CV_L        (L = number of 512-bit blocks)</pre>
<h2>The SHA family</h2>
<table><tr><th></th><th>SHA-1</th><th>SHA-256</th><th>SHA-384</th><th>SHA-512</th></tr>
<tr><td>Digest (bits)</td><td>160</td><td>256</td><td>384</td><td>512</td></tr>
<tr><td>Message limit (bits)</td><td>&lt; 2⁶⁴</td><td>&lt; 2⁶⁴</td><td>&lt; 2¹²⁸</td><td>&lt; 2¹²⁸</td></tr>
<tr><td>Block (bits)</td><td>512</td><td>512</td><td>1024</td><td>1024</td></tr>
<tr><td>Word (bits)</td><td>32</td><td>32</td><td>64</td><td>64</td></tr>
<tr><td>Steps</td><td>80</td><td>64</td><td>80</td><td>80</td></tr>
<tr><td>Collision security (bits)</td><td>80 (broken)</td><td>128</td><td>192</td><td>256</td></tr></table>
<p><b>SHA-3 (Keccak)</b> is built as a <b>sponge</b>: input is absorbed into a large internal state by XOR and permutation, then the digest is squeezed out. It is immune to the length-extension attack that affects the Merkle–Damgård hashes.</p>
<h2>Features</h2>
<ul><li>Longer digest than MD5, so stronger against brute force (2⁸⁰ collision work for SHA-1, 2¹²⁸ for SHA-256).</li><li>Message expansion mixes every message bit into many steps (avalanche).</li><li>Standardised (FIPS 180-4), widely implemented in hardware and software.</li><li>Slightly slower than MD5.</li></ul>
<h2>Applications</h2>
<ul><li><b>Digital signatures</b>: DSS and RSA sign the SHA digest.</li><li><b>HMAC</b> for message authentication (IPsec, TLS).</li><li><b>Certificates</b> (X.509 signed with SHA-256) and code signing.</li><li><b>Integrity checks</b> for downloads, backups, version control (Git).</li><li><b>Password hashing</b> (with salt) and key derivation, blockchain proof of work (SHA-256 in Bitcoin).</li></ul>
<h2>Security</h2>
<p>SHA-1 collisions were shown in 2005 (theory) and 2017 (SHAttered, a real colliding PDF pair), so SHA-1 is deprecated. SHA-256 and above remain secure.</p>`,
    qa: [
      Q(2, 'What is the digest size and block size of SHA-1?', 'Digest 160 bits, block 512 bits.'),
      Q(2, 'Why is SHA-1 deprecated?', 'Practical collisions (SHAttered, 2017) show it no longer gives 2⁸⁰ collision resistance, so it cannot be trusted for signatures.'),
      Q(5, 'Differentiate MD5 and SHA.', 'Use the MD5 vs SHA-1 table (digest, steps, buffer, byte order, strength, speed, status).'),
      Q(8, 'Elucidate the features of Secure Hash Algorithm (SHA) with its application.', '<p><b>Features (4).</b> 160 to 512-bit digests, 512 or 1024-bit blocks, 80-step compression (64 for SHA-256), message expansion, avalanche, one-way, collision resistant, standardised in FIPS 180. Show the family table.</p><p><b>Operation in brief (1).</b> Padding, buffer, 80 steps, final add.</p><p><b>Applications (3).</b> Digital signatures (sign the digest, DSS), HMAC, certificates, integrity checks, password hashing, blockchain.</p>'),
      Q(16, 'Explain SHA-1 in detail with diagrams and compare the SHA family.', '<p>Padding and length (2). Buffer initial values (1). Message schedule with the W<sub>t</sub> equation (3). 80-step update with f<sub>t</sub> and K<sub>t</sub> table (5). Output (1). Family comparison table (3). SHA-3 sponge note (1).</p>'),
    ],
  },
  {
    id: 'm4-7', mod: 'm4', title: 'Security of hash functions and MACs', pr: 'High',
    tags: 'security hash mac brute force birthday paradox cryptanalysis attacks collision preimage length extension',
    body: `
<div class="def"><b>Goal.</b> An attack on a hash or MAC means finding a way to break one of its required properties faster than brute force. Security is measured by the <b>work factor</b> of the best known attack.</div>
<h2>Brute-force attacks on hash functions (n-bit digest)</h2>
<table><tr><th>Attack</th><th>Goal</th><th>Effort</th></tr>
<tr><td>Preimage</td><td>Given h, find M with H(M) = h</td><td>2ⁿ</td></tr>
<tr><td>Second preimage</td><td>Given M₁, find M₂ with the same hash</td><td>2ⁿ</td></tr>
<tr><td>Collision</td><td>Find any M₁ ≠ M₂ with the same hash</td><td>2^(n/2) (birthday attack)</td></tr></table>
<h2>Birthday paradox</h2>
<p>In a room of just 23 people there is a 50% chance two share a birthday. For an n-bit hash, after about 2^(n/2) random messages the chance of some pair colliding is about 50%. This is why a 64-bit hash is unsafe (2³² work) and why digests need at least 160 bits (MD5's 128 bits give only 2⁶⁴).</p>
<p><b>Birthday attack on signatures.</b> The attacker prepares 2^(n/2) variants of a harmless contract and 2^(n/2) variants of a fraudulent one (changing spaces, wording). Two of them hash to the same value. The victim signs the harmless one; the attacker attaches that signature to the fraudulent one.</p>
<h2>Cryptanalysis</h2>
<p>Attacks on the internal structure of the compression function: differential paths, message modification, chosen-prefix collisions. MD5 collisions (2004) and SHA-1 collisions (2017) broke these hashes far below brute force.</p>
<h2>Length-extension attack</h2>
<p>For Merkle–Damgård hashes, knowing H(M) lets an attacker compute H(M ‖ padding ‖ X) without knowing M. This breaks the naive MAC H(K ‖ M), so <b>HMAC</b> (or SHA-3) is used.</p>
<h2>Attacks on MACs</h2>
<table><tr><th>Attack</th><th>Effort</th></tr>
<tr><td>Brute-force the key (k bits)</td><td>2ᵏ trials against known message and tag pairs</td></tr>
<tr><td>Forge a tag (n-bit tag)</td><td>2ⁿ attempts; need a long tag</td></tr>
<tr><td>Replay</td><td>Resend a valid message and tag; stopped by sequence numbers, timestamps, nonces</td></tr>
<tr><td>Cryptanalysis of the hash or cipher inside</td><td>HMAC is secure if the hash behaves like a pseudorandom function even when it is collision-weak</td></tr></table>
<p>The effective MAC security is min(2ᵏ, 2ⁿ), so both the key and the tag must be long.</p>
<h2>Defences</h2>
<ul><li>Use SHA-256 or longer; avoid MD5 and SHA-1.</li><li>Use HMAC, not H(K ‖ M).</li><li>Include sequence numbers or timestamps with every authenticated message.</li><li>Use constant-time tag comparison.</li></ul>`,
    qa: [
      Q(2, 'What is a birthday attack?', 'It uses the birthday paradox to find a collision in an n-bit hash with about 2^(n/2) trials instead of 2ⁿ.'),
      Q(5, 'Explain brute-force attacks on hash functions and MACs.', 'Use the preimage, second preimage and collision table, then the MAC key and tag attacks. State min(2ᵏ, 2ⁿ).'),
      Q(8, 'Explain the birthday attack and its effect on digital signatures.', '<p>Paradox and the 2^(n/2) bound (3). Attack on signatures with two sets of variants (3). Defence: longer digest (SHA-256), randomised messages (2).</p>'),
    ],
  },
  {
    id: 'm4-8', mod: 'm4', title: 'Digital signatures', pr: 'Very High',
    tags: 'digital signature rsa signature non repudiation direct arbitrated requirements properties forgery',
    body: `
<div class="def"><b>Definition.</b> A digital signature is data that proves the <b>origin and integrity</b> of a message and that the sender cannot later deny sending it (<b>non-repudiation</b>). Message authentication protects two parties from a third party; a signature also protects them from each other.</div>
<h2>Why we need it</h2>
<p>Alice emails Bob "I will pay you on the 24th". Later she denies saying it. Message authentication cannot settle this, because Bob could have forged a MAC with the shared key. A signature depends on Alice's private key alone, so Bob can show the signed message to a third party as proof, and Alice cannot deny it.</p>
<p>It is one of the major applications of public key cryptography, providing message authentication, message integrity and non-repudiation.</p>
<h2>Three algorithms</h2>
<ol><li><b>Key generation:</b> produces the signer's private key (the unique information) and public key.</li><li><b>Signing:</b> input = message and private key, output = digital signature.</li><li><b>Verification:</b> at the receiver, input = message, signature and public key, output = valid or not valid.</li></ol>
<div data-w="diag:dsgen"></div>
<h2>Properties</h2>
<ul><li>Verifies the <b>author</b>, the <b>date and time</b> of the signature.</li><li>Authenticates the <b>contents</b> at the time of signing.</li><li>Can be <b>verified by third parties</b> to settle disputes.</li></ul>
<h2>Requirements</h2>
<ul><li>Depends on the message being signed (a bit pattern).</li><li>Uses information unique to the sender, to stop forgery and denial.</li><li>Relatively easy to produce, recognise and verify.</li><li>Computationally infeasible to forge: neither a new message for an existing signature nor a new signature for an existing message.</li><li>Practical to store a copy.</li></ul>
<h2>Generation and verification (hash then sign)</h2>
<div data-w="diag:dsig"></div>
<ol><li><b>Sign:</b> Alice computes digest h = H(M), then signature S = E(KR<sub>a</sub>, h). She sends M ‖ S.</li><li><b>Verify:</b> Bob computes h′ = H(M) of the received message and h″ = D(KU<sub>a</sub>, S).</li><li>If h′ = h″ the signature is valid: the message is unchanged and came from Alice. Otherwise reject.</li></ol>
<p>Signing the hash, not the message, is faster and gives a fixed-size signature.</p>
<h2>RSA signature example</h2>
<p>Alice has n = 143, e = 11, d = 11. Digest h = 7. Signature S = h<sup>d</sup> mod n = 7¹¹ mod 143 = 106. Bob checks S<sup>e</sup> mod n = 106¹¹ mod 143 = 7 = h ✓.</p>
<h2>Types</h2>
<table><tr><th>Type</th><th>Idea</th></tr>
<tr><td>Direct</td><td>Only sender and receiver involved; receiver verifies with sender's public key. Weakness: sender may claim the private key was stolen, or the timestamp may be forged.</td></tr>
<tr><td>Arbitrated</td><td>A trusted arbiter checks every signed message and timestamps it before it reaches the receiver. Adds trust and a bottleneck.</td></tr></table>
<h2>Attacks</h2>
<p>Key-only, known-message, chosen-message attacks. Forgery types: <b>total break</b> (private key recovered), <b>universal</b>, <b>selective</b>, <b>existential</b> (a valid signature for some meaningless message).</p>
<h2>Digital signature versus MAC</h2>
<table><tr><th></th><th>Digital signature</th><th>MAC</th></tr>
<tr><td>Key</td><td>Private signs, public verifies</td><td>One shared secret key</td></tr>
<tr><td>Non-repudiation</td><td>Yes</td><td>No</td></tr>
<tr><td>Third party can verify</td><td>Yes</td><td>No</td></tr>
<tr><td>Speed</td><td>Slower</td><td>Faster</td></tr>
<tr><td>Key distribution</td><td>Only public key shared</td><td>Secret shared securely first</td></tr></table>`,
    qa: [
      Q(2, 'What is a digital signature?', 'A value computed from a message and the signer\'s private key that lets anyone verify with the public key who signed it and that it is unchanged.'),
      Q(2, 'Why do we sign the hash of a message and not the message?', 'It is much faster and gives a fixed-size signature however long the message is.'),
      Q(5, 'Explain direct and arbitrated digital signature.', 'Direct versus arbitrated rows, with one weakness each.'),
      Q(8, 'Explain digital signature generation and verification with a diagram.', '<p>Definition and properties (2). Diagram (2). Sign and verify steps with equations (3). Security property: forging needs KR<sub>a</sub> (1).</p>'),
    ],
  },
  {
    id: 'm4-9', mod: 'm4', title: 'Authentication protocols', pr: 'High',
    tags: 'authentication protocols mutual one way replay nonce timestamp needham schroeder kerberos x.509',
    body: `
<div class="def"><b>Definition.</b> An authentication protocol lets two parties prove their identities to each other and agree on a fresh session key, resisting <b>replay</b> and <b>masquerade</b>.</div>
<h2>Mutual authentication</h2>
<p>Two issues: <b>confidentiality</b> of keys and nonces, and <b>timeliness</b> against replay. Replay attacks include simple replay, repetition that can be logged, repetition that cannot be detected (original suppressed), and backward replay without modification.</p>
<h2>Countering replay</h2>
<table><tr><th>Method</th><th>How</th><th>Limit</th></tr>
<tr><td>Sequence numbers</td><td>Accept a message only if its number is new</td><td>Both sides must keep state</td></tr>
<tr><td>Timestamps</td><td>Accept only if the clock time is recent</td><td>Needs synchronised clocks</td></tr>
<tr><td>Challenge response (nonce)</td><td>A sends a random N; B returns it in the reply</td><td>Extra message exchange</td></tr></table>
<h2>Symmetric key protocol: Needham–Schroeder (with a KDC)</h2>
<ol><li>A → KDC: ID<sub>A</sub> ‖ ID<sub>B</sub> ‖ N₁</li><li>KDC → A: E(K<sub>a</sub>, [K<sub>s</sub> ‖ ID<sub>B</sub> ‖ N₁ ‖ E(K<sub>b</sub>, [K<sub>s</sub> ‖ ID<sub>A</sub>])])</li><li>A → B: E(K<sub>b</sub>, [K<sub>s</sub> ‖ ID<sub>A</sub>])</li><li>B → A: E(K<sub>s</sub>, N₂)</li><li>A → B: E(K<sub>s</sub>, f(N₂))</li></ol>
<p>Vulnerable if an old K<sub>s</sub> is compromised (replay of message 3). Denning added a timestamp T to fix it. Kerberos is built on these ideas with an authentication server and ticket-granting server.</p>
<div data-w="diag:ns"></div>
<h2>Public key protocol (using a key server)</h2>
<p>A gets B's certificate from an authority, sends E(KU<sub>b</sub>, [N<sub>a</sub> ‖ ID<sub>A</sub>]), B replies with E(KU<sub>a</sub>, [N<sub>a</sub> ‖ N<sub>b</sub>]) and A returns E(KU<sub>b</sub>, N<sub>b</sub>). Each side proves it holds its private key.</p>
<h2>One-way authentication (email)</h2>
<p>Sender and receiver are not online together. Options: encrypt the message with a session key which is itself encrypted with the receiver's public key (confidentiality); sign with the sender's private key (authentication); or both.</p>
<h2>Kerberos in brief</h2>
<p>A client gets a <b>ticket-granting ticket</b> from the Authentication Server, uses it to get a <b>service ticket</b> from the Ticket Granting Server, and presents that ticket and an authenticator (identity plus timestamp) to the service. Passwords never cross the network; timestamps stop replay.</p>
<h2>X.509 authentication procedures</h2>
<table><tr><th>Procedure</th><th>Messages</th><th>Use</th></tr>
<tr><td>One-way</td><td>1 (A → B)</td><td>Proves A's identity and message integrity; uses timestamp and signature</td></tr>
<tr><td>Two-way</td><td>2</td><td>Both sides authenticated; needs synchronised clocks</td></tr>
<tr><td>Three-way</td><td>3</td><td>Uses nonces instead of timestamps, no clock sync needed</td></tr></table>`,
    qa: [
      Q(2, 'Why are nonces used in authentication protocols?', 'A nonce is a fresh random number. Seeing it returned proves the reply is new, not a replay of an old message.'),
      Q(5, 'Explain the methods used to prevent replay attacks.', 'Sequence numbers, timestamps and challenge-response nonces from the table above, with the limit of each.'),
      Q(8, 'Explain the Needham–Schroeder authentication protocol and its weakness.', '<p>Five steps (5). Role of K<sub>s</sub>, nonces N₁ and N₂ (1). Replay weakness and timestamp fix (2).</p>'),
    ],
  },
  {
    id: 'm4-10', mod: 'm4', title: 'Digital Signature Standard (DSS)', pr: 'High',
    tags: 'dss dsa digital signature standard nist fips 186 ecdsa signing verifying',
    body: `
<div class="def"><b>Definition.</b> The Digital Signature Standard (DSS, NIST FIPS 186) specifies the Digital Signature Algorithm (<b>DSA</b>), plus RSA and ECDSA. DSA uses a <b>SHA hash</b> and the discrete logarithm problem. It provides <b>signatures only</b>, not encryption or key exchange.</div>
<h2>DSS approach</h2>
<p>The message is hashed with SHA; the digest and a random one-time number k are inputs to the signing function with the sender's private key; the output is the pair <b>(r, s)</b>. The verifier uses the sender's public key to recompute a value v and checks v = r.</p>
<div data-w="diag:dss"></div>
<h2>Global parameters</h2>
<p>Prime <b>p</b> (512 to 3072 bits), prime <b>q</b> that divides p − 1 (160 to 256 bits), and <b>g = h^((p−1)/q) mod p</b> with 1 &lt; h &lt; p − 1 and g &gt; 1.</p>
<p><b>Keys:</b> private x (0 &lt; x &lt; q), public <b>y = g^x mod p</b>.</p>
<h2>Signing</h2>
<p>Choose a random k with 0 &lt; k &lt; q (fresh for every message).</p>
<ul><li><b>r = (g^k mod p) mod q</b></li><li><b>s = [k⁻¹ (H(M) + x·r)] mod q</b></li><li>Signature = (r, s)</li></ul>
<h2>Verifying</h2>
<ul><li>w = s⁻¹ mod q</li><li>u₁ = [H(M)·w] mod q</li><li>u₂ = (r·w) mod q</li><li><b>v = [(g^u₁ · y^u₂) mod p] mod q</b></li><li>Valid if <b>v = r</b>.</li></ul>
<div class="ex"><b>Worked example.</b> p = 23, q = 11 (11 divides 22), h = 2, so g = 2² mod 23 = 4. Private x = 3, public y = 4³ mod 23 = 18. Message hash H(M) = 5, random k = 7.
<pre>Sign:
 r = (4^7 mod 23) mod 11 = 8 mod 11 = 8
 k⁻¹ = 7⁻¹ mod 11 = 8 (7 × 8 = 56 = 55 + 1)
 s = 8 × (5 + 3 × 8) mod 11 = 8 × 29 mod 11 = 8 × 7 mod 11 = 56 mod 11 = 1
 Signature (r, s) = (8, 1)

Verify:
 w = 1⁻¹ mod 11 = 1
 u₁ = 5 × 1 mod 11 = 5
 u₂ = 8 × 1 mod 11 = 8
 v = (4^5 × 18^8 mod 23) mod 11 = (12 × 16 mod 23) mod 11 = 8 mod 11 = 8
 v = r  ✓ signature valid</pre></div>
<h2>Why it works</h2>
<p>Substituting s shows g^(u₁) y^(u₂) ≡ g^k (mod p), so v = r. The signer needs x to compute s; nobody can compute s from y alone.</p>
<h2>Important points</h2>
<ul><li><b>k must be secret, random and never reused.</b> Reuse of k for two messages reveals the private key x. If s = 0 or r = 0, pick a new k.</li><li>Signature length is only 2 × |q| bits (320 bits), shorter than an RSA signature of the same strength.</li><li><b>ECDSA</b> replaces the modular arithmetic with elliptic curve point multiplication, giving smaller keys.</li></ul>
<h2>RSA versus DSS</h2>
<table><tr><th></th><th>RSA signature</th><th>DSS (DSA)</th></tr>
<tr><td>Purpose</td><td>Encryption, key exchange and signature</td><td>Signatures only</td></tr>
<tr><td>Hard problem</td><td>Factoring</td><td>Discrete logarithm</td></tr>
<tr><td>Signature</td><td>Same size as modulus</td><td>Two numbers (r, s) of |q| bits</td></tr>
<tr><td>Randomness</td><td>None needed to sign</td><td>Fresh random k per signature</td></tr>
<tr><td>Verification</td><td>Faster</td><td>Slower</td></tr></table>`,
    qa: [
      Q(2, 'Define Digital Signature Standard (DSS).', 'DSS is the NIST standard (FIPS 186) for digital signatures. It specifies DSA, which signs the SHA hash of a message with a private key and a random k, producing a pair (r, s) that is verified with the public key.'),
      Q(2, 'Why must k never be reused in DSA?', 'Two signatures with the same k allow solving for k and then for the private key x.'),
      Q(5, 'Write the DSA signing and verification equations.', 'r = (g^k mod p) mod q; s = k⁻¹(H(M) + xr) mod q. w = s⁻¹; u₁ = H(M)w; u₂ = rw; v = (g^u₁ y^u₂ mod p) mod q; accept if v = r.'),
      Q(8, 'Explain the Digital Signature Standard with the signing and verifying process.', '<p>Overview and diagram (2). Parameters p, q, g, x, y (2). Signing (2). Verifying (2). Add the worked example if time permits.</p>'),
      Q(16, 'Explain DSA in detail, prove verification works and compare it with RSA signatures.', '<p>Parameters (3). Signing (3). Verification (3). Worked example (4). Role of k (1). RSA vs DSS table (2).</p>'),
    ],
  },
  {
    id: 'cmp-1', mod: 'cmp', title: 'Exam comparisons', pr: 'Very High',
    tags: 'comparison compare difference symmetric asymmetric rsa dh ecc mac hash hashing encryption digital signature md5 sha',
    body: `
<div class="def"><b>How to use.</b> Comparison questions are 5 marks or part of 16. Write 5 to 6 rows, each with a clear contrast, then one summing-up line.</div>
<h2>Symmetric and asymmetric encryption (Module III)</h2>
<table><tr><th></th><th>Symmetric</th><th>Asymmetric</th></tr>
<tr><td>Keys</td><td>One shared key</td><td>Public and private pair</td></tr><tr><td>Speed</td><td>Fast</td><td>Slow</td></tr><tr><td>Key distribution</td><td>Problem: secure channel needed</td><td>Public key can be openly shared</td></tr>
<tr><td>Keys for n users</td><td>n(n−1)/2</td><td>2n</td></tr><tr><td>Signature</td><td>No</td><td>Yes</td></tr><tr><td>Examples</td><td>AES, DES</td><td>RSA, ECC</td></tr></table>
<h2>RSA and Diffie–Hellman</h2>
<table><tr><th></th><th>RSA</th><th>Diffie–Hellman</th></tr>
<tr><td>Purpose</td><td>Encryption, signature, key exchange</td><td>Key exchange only</td></tr><tr><td>Hard problem</td><td>Factoring</td><td>Discrete logarithm</td></tr>
<tr><td>Key pair</td><td>Fixed key pair {e,n}, {d,n}</td><td>Fresh private value per session</td></tr><tr><td>Shared key</td><td>One side picks and encrypts it</td><td>Both contribute to K = α^(X_A X_B)</td></tr>
<tr><td>Attack</td><td>Factoring, timing, chosen ciphertext</td><td>Man in the middle (no authentication)</td></tr></table>
<h2>RSA and ECC</h2>
<table><tr><th></th><th>RSA</th><th>ECC</th></tr>
<tr><td>Hard problem</td><td>Factoring</td><td>ECDLP</td></tr><tr><td>Key for 128-bit security</td><td>3072 bits</td><td>256 bits</td></tr><tr><td>Resources</td><td>More memory and bandwidth</td><td>Less, good for mobile and IoT</td></tr><tr><td>Maths</td><td>Modular exponentiation</td><td>Point addition and multiplication</td></tr></table>
<h2>MAC and hash function (Module IV)</h2>
<table><tr><th></th><th>MAC</th><th>Hash</th></tr>
<tr><td>Key</td><td>Secret key needed</td><td>No key</td></tr><tr><td>Provides</td><td>Integrity and authentication</td><td>Integrity</td></tr><tr><td>Computed by</td><td>Key holders only</td><td>Anyone</td></tr></table>
<h2>Hashing and encryption</h2>
<table><tr><th></th><th>Hashing</th><th>Encryption</th></tr>
<tr><td>Reversible</td><td>No</td><td>Yes with the key</td></tr><tr><td>Output</td><td>Fixed length</td><td>Same size as the input or more</td></tr><tr><td>Goal</td><td>Integrity, fingerprint</td><td>Confidentiality</td></tr></table>
<h2>MAC and digital signature</h2>
<table><tr><th></th><th>MAC</th><th>Digital signature</th></tr>
<tr><td>Keys</td><td>Shared symmetric</td><td>Private signs, public verifies</td></tr><tr><td>Non-repudiation</td><td>No</td><td>Yes</td></tr><tr><td>Third party check</td><td>No</td><td>Yes</td></tr><tr><td>Speed</td><td>Fast</td><td>Slower</td></tr></table>
<h2>MD5 and SHA</h2>
<table><tr><th></th><th>MD5</th><th>SHA-1</th><th>SHA-256</th></tr>
<tr><td>Digest</td><td>128</td><td>160</td><td>256</td></tr><tr><td>Block</td><td>512</td><td>512</td><td>512</td></tr><tr><td>Steps</td><td>64</td><td>80</td><td>64</td></tr><tr><td>Collision work</td><td>2⁶⁴ (broken)</td><td>2⁸⁰ (broken)</td><td>2¹²⁸</td></tr></table>`,
    qa: [
      Q(5, 'Compare MAC and digital signature.', 'Use the MAC and signature table above.'),
      Q(5, 'Compare RSA and ECC.', 'Use the RSA and ECC table above.'),
    ],
  },
];
