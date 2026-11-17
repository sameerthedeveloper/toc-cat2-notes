const Q = (m, q, a) => ({ m, q, a });

export const T3 = [
  {
    id: 'm3-1', mod: 'm3', title: 'Public key cryptosystems', pr: 'High',
    tags: 'public key asymmetric cryptosystem confidentiality authentication applications requirements',
    body: `
<div class="def"><b>Definition.</b> A public key (asymmetric) cryptosystem uses a <b>pair of related keys</b>: a public key KU that anyone may know and a private key KR that only its owner knows. What one key does, only the other can undo.</div>
<h2>Why it exists</h2>
<p>Symmetric encryption has two weaknesses: sender and receiver must already <b>share a secret key</b> (the key distribution problem), and it gives no <b>digital signature</b>. Diffie and Hellman (1976) proposed public key cryptography to solve both.</p>
<h2>Six ingredients</h2>
<ol><li><b>Plaintext</b>: the readable message.</li><li><b>Encryption algorithm</b>: transforms the plaintext using a key.</li><li><b>Public key</b> and 4. <b>private key</b>: the key pair.</li><li><b>Ciphertext</b>: the scrambled output.</li><li><b>Decryption algorithm</b>: recovers the plaintext using the matching key.</li></ol>
<h2>Working principle</h2>
<ol><li>Each user generates a key pair and publishes the public key (directory, certificate).</li><li>To send Bob a secret, Alice encrypts with <b>Bob's public key</b>.</li><li>Only Bob's private key can decrypt it.</li></ol>
<div data-w="diag:pkconf"></div>
<h2>Authentication and signature</h2>
<p>Reverse the keys: Alice encrypts (signs) with <b>her private key</b>. Anyone can decrypt with her public key, and because only Alice holds that private key, the message must have come from her.</p>
<div data-w="diag:pkauth"></div>
<p>To get <b>both</b> secrecy and authentication, sign with KR<sub>a</sub> and then encrypt the result with KU<sub>b</sub>: <code>C = E(KU_b, E(KR_a, M))</code>. Bob decrypts with KR<sub>b</sub> and then verifies with KU<sub>a</sub>.</p>
<h2>Applications</h2>
<table><tr><th>Use</th><th>Meaning</th><th>Algorithms</th></tr>
<tr><td>Encryption and decryption</td><td>Sender encrypts with receiver's public key</td><td>RSA, ECC, ElGamal</td></tr>
<tr><td>Digital signature</td><td>Sender signs with own private key</td><td>RSA, DSS, ECC</td></tr>
<tr><td>Key exchange</td><td>Two sides agree a session key</td><td>RSA, Diffie–Hellman, ECC</td></tr></table>
<h2>Requirements (Diffie and Hellman)</h2>
<ul><li>Easy to generate a key pair (KU, KR).</li><li>Easy for the sender to encrypt: C = E(KU, M).</li><li>Easy for the receiver to decrypt: M = D(KR, C).</li><li>Infeasible to find KR from KU.</li><li>Infeasible to recover M from KU and C.</li><li>Either key can be used for encryption with the other used for decryption.</li></ul>
<p>These need a <b>trapdoor one-way function</b>: easy forwards, infeasible to reverse unless you hold the trapdoor (the private key). RSA uses factoring, Diffie–Hellman uses the discrete logarithm, ECC uses the elliptic curve discrete logarithm.</p>
<h2>Symmetric versus asymmetric</h2>
<table><tr><th></th><th>Symmetric</th><th>Asymmetric</th></tr>
<tr><td>Keys</td><td>One shared secret key</td><td>Key pair: public and private</td></tr>
<tr><td>Speed</td><td>Fast</td><td>Slow (heavy mathematics)</td></tr>
<tr><td>Key distribution</td><td>Hard: key must be sent secretly</td><td>Easy: only the public key is shared</td></tr>
<tr><td>Keys for n users</td><td>n(n − 1)/2 shared keys</td><td>2n keys</td></tr>
<tr><td>Signature</td><td>Not possible directly</td><td>Possible</td></tr>
<tr><td>Examples</td><td>DES, AES</td><td>RSA, ECC, DH</td></tr></table>
<div class="tip"><b>Exam tip.</b> Public key does not replace symmetric encryption. Real systems use it to exchange a session key and then encrypt the data with AES (a hybrid scheme).</div>`,
    qa: [
      Q(2, 'List any four applications of asymmetric encryption.', '<ol><li>Confidentiality: encrypting messages and files with the receiver\'s public key.</li><li>Digital signatures: proving who sent a message.</li><li>Key exchange: sharing a symmetric session key (RSA, Diffie–Hellman).</li><li>Authentication: verifying identity in TLS, SSH, X.509 certificates, secure email (PGP).</li></ol>'),
      Q(2, 'Why is the private key never shared?', 'Anyone holding the private key can read messages meant for the owner and forge the owner\'s signatures. Security depends on only the owner knowing it.'),
      Q(5, 'Compare symmetric and asymmetric encryption.', '<p>Write the table above: keys, speed, key distribution, number of keys for n users, signature support, examples. Add one line: symmetric for bulk data, asymmetric for key exchange and signatures, combined in a hybrid scheme.</p>'),
      Q(8, 'Describe the working principle of public key cryptography with a suitable diagram.', '<p><b>Idea (1).</b> Key pair, one public, one private, computationally hard to derive one from the other.</p><p><b>Ingredients (1).</b> Plaintext, encryption algorithm, public and private key, ciphertext, decryption algorithm.</p><p><b>Confidentiality (2).</b> Alice computes C = E(KU<sub>b</sub>, M). Bob computes M = D(KR<sub>b</sub>, C). Draw the first diagram.</p><p><b>Authentication (2).</b> Alice computes C = E(KR<sub>a</sub>, M). Anyone computes M = D(KU<sub>a</sub>, C). Draw the second diagram.</p><p><b>Both (1).</b> C = E(KU<sub>b</sub>, E(KR<sub>a</sub>, M)).</p><p><b>Requirement (1).</b> Trapdoor one-way function, so KR cannot be found from KU.</p>'),
    ],
  },
  {
    id: 'm3-2', mod: 'm3', title: 'RSA algorithm', pr: 'Very High',
    tags: 'rsa rivest shamir adleman encryption decryption euler totient modular exponentiation key generation factoring',
    body: `
<div class="def"><b>Definition.</b> RSA (Rivest, Shamir, Adleman, 1977) is a public key block cipher in which plaintext and ciphertext are integers between 0 and n − 1. Its security rests on the difficulty of <b>factoring</b> n = p × q for large primes.</div>
<h2>Algorithm</h2>
<table><tr><th>Step</th><th>Key generation</th></tr>
<tr><td>1</td><td>Choose two distinct primes <b>p</b> and <b>q</b>.</td></tr>
<tr><td>2</td><td>Compute <b>n = p × q</b>.</td></tr>
<tr><td>3</td><td>Compute <b>φ(n) = (p − 1)(q − 1)</b>.</td></tr>
<tr><td>4</td><td>Choose <b>e</b> with 1 &lt; e &lt; φ(n) and gcd(e, φ(n)) = 1.</td></tr>
<tr><td>5</td><td>Compute <b>d = e⁻¹ mod φ(n)</b>, that is e·d ≡ 1 (mod φ(n)).</td></tr>
<tr><td>6</td><td>Public key KU = {e, n}. Private key KR = {d, n}. Discard p, q.</td></tr></table>
<p><b>Encryption</b> (M &lt; n): <code>C = M^e mod n</code>. <b>Decryption</b>: <code>M = C^d mod n</code>.</p>
<h2>Why decryption works</h2>
<p>Since e·d ≡ 1 (mod φ(n)), write e·d = 1 + kφ(n). By Euler's theorem M^φ(n) ≡ 1 (mod n) when gcd(M, n) = 1, so C^d = M^(ed) = M · (M^φ(n))^k ≡ M (mod n).</p>
<h2>How to do the arithmetic by hand</h2>
<ol><li><b>Find d</b> with the extended Euclidean algorithm, or by trial: find d with e·d = 1 + k·φ(n).</li><li><b>Large powers</b>: square and multiply. Write the exponent in binary, repeatedly square the base mod n, and multiply the result by the base wherever the bit is 1.</li><li>Always reduce mod n after every multiplication to keep numbers small.</li></ol>
<div class="ex"><b>Worked example (CAT-2 paper).</b> p = 11, q = 13, e = 11, M = 7.
<pre>n = 11 × 13 = 143
φ(n) = 10 × 12 = 120
gcd(11, 120) = 1, so e is valid
d: 11 × d ≡ 1 (mod 120). 11 × 11 = 121 = 120 + 1, so d = 11
Public key {11, 143}, private key {11, 143}

Encrypt: C = 7^11 mod 143
 7^1 = 7
 7^2 = 49
 7^4 = 49² = 2401 mod 143 = 113
 7^8 = 113² = 12769 mod 143 = 42
 11 = 8 + 2 + 1, so 7^11 = 42 × 49 × 7
 42 × 49 = 2058 mod 143 = 56
 56 × 7 = 392 mod 143 = 106
C = 106

Decrypt: M = 106^11 mod 143
 106^2 = 11236 mod 143 = 82
 106^4 = 82² = 6724 mod 143 = 3
 106^8 = 9
 106^11 = 9 × 82 × 106 = 738 × 106 → 23 × 106 = 2438 mod 143 = 7
M = 7  ✓</pre></div>
<div data-w="rsa"></div>
<div data-w="inv"></div>
<h2>Attacks on RSA</h2>
<table><tr><th>Attack</th><th>Idea</th><th>Defence</th></tr>
<tr><td>Brute force</td><td>Try every private key</td><td>Large key (2048 bits or more)</td></tr>
<tr><td>Mathematical (factoring)</td><td>Factor n to get p, q, then φ(n) and d</td><td>Large n, strong primes</td></tr>
<tr><td>Timing</td><td>Time decryptions to infer d</td><td>Constant-time code, blinding (random factor)</td></tr>
<tr><td>Chosen ciphertext</td><td>Submit crafted C to learn about M</td><td>OAEP padding</td></tr>
<tr><td>Small e or small M</td><td>M^e &lt; n, so take an ordinary root</td><td>Random padding (OAEP)</td></tr></table>
<div class="tip"><b>Exam tip.</b> Always list the four given values, then n, φ(n), d, the public and private key, then C with the square-and-multiply table, then decrypt to show M comes back. The check at the end earns marks.</div>`,
    qa: [
      Q(2, 'State the RSA encryption and decryption formulas.', 'Encryption: C = M^e mod n. Decryption: M = C^d mod n, where n = p·q and e·d ≡ 1 (mod φ(n)).'),
      Q(2, 'What is the security basis of RSA?', 'The difficulty of factoring a large n into its two prime factors. Without p and q an attacker cannot compute φ(n) and therefore cannot find d.'),
      Q(5, 'List the steps of RSA key generation.', '<p>Choose primes p, q. n = pq. φ(n) = (p−1)(q−1). Pick e with gcd(e, φ(n)) = 1. Compute d = e⁻¹ mod φ(n). Publish {e, n}, keep {d, n} secret.</p>'),
      Q(5, 'Explain any four attacks on RSA.', 'Brute force, mathematical (factoring), timing, chosen ciphertext. Use the attack table above with one defence for each.'),
      Q(8, 'Alice sends M = 7 to Bob using RSA with p = 11, q = 13, e = 11. Encrypt and decrypt.', '<p><b>Keys (3).</b> n = 143, φ = 120, d = 11, KU = {11, 143}, KR = {11, 143}.</p><p><b>Encrypt (2.5).</b> C = 7¹¹ mod 143 = 106 with the square-and-multiply steps: 7² = 49, 7⁴ = 113, 7⁸ = 42, 42 × 49 × 7 mod 143 = 106.</p><p><b>Decrypt (2.5).</b> M = 106¹¹ mod 143 = 7. Bob recovers the original message.</p>'),
      Q(8, 'In an RSA system you intercept the ciphertext C = 10 sent to a user whose public key is e = 5, n = 35. What is the plaintext M?', '<pre>Factor n: 35 = 5 × 7, so p = 5, q = 7\nφ(n) = 4 × 6 = 24\nd = 5⁻¹ mod 24: 5 × 5 = 25 = 24 + 1, so d = 5\nM = C^d mod n = 10^5 mod 35\n 10² = 100 mod 35 = 30\n 10⁴ = 30² = 900 mod 35 = 25\n 10⁵ = 25 × 10 = 250 mod 35 = 5\nM = 5\nCheck: 5^5 mod 35 = 3125 mod 35 = 10 = C  ✓</pre><p>Key point: with a small n the attacker factors n, so the private key is easy to find.</p>'),
      Q(8, 'Take p = 3, q = 11, e = 7, M = 5. Find the keys, the ciphertext and recover M.', '<pre>n = 33, φ = 2 × 10 = 20, gcd(7, 20) = 1\nd: 7d ≡ 1 mod 20, d = 3 (7 × 3 = 21)\nC = 5^7 mod 33: 5² = 25, 5⁴ = 625 mod 33 = 31, 5⁷ = 31 × 25 × 5 = 3875 mod 33 = 14\nC = 14\nM = 14^3 mod 33 = 2744 mod 33 = 5  ✓</pre>'),
    ],
  },
  {
    id: 'm3-3', mod: 'm3', title: 'Diffie–Hellman key exchange', pr: 'Very High',
    tags: 'diffie hellman key exchange primitive root discrete logarithm man in the middle shared secret',
    body: `
<div class="def"><b>Definition.</b> Diffie–Hellman (DH, 1976) lets two users agree on a <b>shared secret key</b> over an insecure channel without ever sending the key. It cannot encrypt or sign; it only exchanges keys. Security rests on the <b>discrete logarithm problem</b>.</div>
<h2>Global public values</h2>
<p>A prime <b>q</b> and a <b>primitive root α</b> of q. α is a primitive root if α¹, α², …, α<sup>q−1</sup> (mod q) produce every number from 1 to q − 1 exactly once.</p>
<h2>Algorithm</h2>
<table><tr><th>Alice (A)</th><th>Bob (B)</th></tr>
<tr><td>Chooses private X<sub>A</sub> &lt; q</td><td>Chooses private X<sub>B</sub> &lt; q</td></tr>
<tr><td>Computes public <b>Y<sub>A</sub> = α^X<sub>A</sub> mod q</b></td><td>Computes public <b>Y<sub>B</sub> = α^X<sub>B</sub> mod q</b></td></tr>
<tr><td colspan="2" style="text-align:center">They exchange Y<sub>A</sub> and Y<sub>B</sub> in the open</td></tr>
<tr><td>K = Y<sub>B</sub>^X<sub>A</sub> mod q</td><td>K = Y<sub>A</sub>^X<sub>B</sub> mod q</td></tr></table>
<p><b>Why both get the same key:</b> K = (α^X<sub>B</sub>)^X<sub>A</sub> = α^(X<sub>A</sub>X<sub>B</sub>) = (α^X<sub>A</sub>)^X<sub>B</sub> (mod q).</p>
<p>An eavesdropper sees q, α, Y<sub>A</sub>, Y<sub>B</sub> and must solve X = log<sub>α</sub>Y mod q, which is infeasible for large q.</p>
<div class="ex"><b>Worked example (CAT-2 paper).</b> q = 7, α = 5, X<sub>A</sub> = 3, X<sub>B</sub> = 6.
<pre>Check α = 5 is a primitive root of 7:
 5^1=5, 5^2=25 mod 7=4, 5^3=20 mod 7=6, 5^4=30 mod 7=2, 5^5=10 mod 7=3, 5^6=15 mod 7=1
 all of 1..6 appear, so 5 is a primitive root

Y_A = 5^3 mod 7 = 125 mod 7 = 6
Y_B = 5^6 mod 7 = 15625 mod 7 = 1

K at Alice = Y_B^X_A mod 7 = 1^3 mod 7 = 1
K at Bob   = Y_A^X_B mod 7 = 6^6 mod 7 = 46656 mod 7 = 1   (6 ≡ −1, and (−1)^6 = 1)

Shared secret key K = 1</pre>
<p>(K = 1 is a poor key. With real parameters, q has hundreds of digits.)</p></div>
<div class="ex"><b>Second example.</b> q = 353, α = 3, X<sub>A</sub> = 97, X<sub>B</sub> = 233 gives Y<sub>A</sub> = 40, Y<sub>B</sub> = 248, K = 160.</div>
<div data-w="dh"></div>
<h2>Man-in-the-middle attack</h2>
<p>DH does <b>not authenticate</b> the public values. Mallory intercepts, replaces both Y values with her own, and ends up sharing one key with Alice and another with Bob.</p>
<div data-w="diag:dhmitm"></div>
<ol><li>Mallory picks private X<sub>M</sub> and computes Y<sub>M</sub> = α^X<sub>M</sub> mod q.</li><li>Alice sends Y<sub>A</sub>; Mallory keeps it and sends Y<sub>M</sub> to Bob. Bob sends Y<sub>B</sub>; Mallory sends Y<sub>M</sub> to Alice.</li><li>Alice's key K₁ = Y<sub>M</sub>^X<sub>A</sub> = Y<sub>A</sub>^X<sub>M</sub>. Bob's key K₂ = Y<sub>M</sub>^X<sub>B</sub> = Y<sub>B</sub>^X<sub>M</sub>.</li><li>Mallory decrypts each message with one key, reads or changes it, and re-encrypts it with the other. Neither side notices.</li></ol>
<p><b>Defences:</b> digital signatures on the DH values, certificates (X.509), authenticated DH (station-to-station), pre-shared keys, or checking a short fingerprint out of band.</p>
<h2>Other weaknesses</h2>
<ul><li><b>Small q</b> or non-primitive α: attacker can enumerate the keys.</li><li><b>Replay and clogging</b> (denial of service): attacker floods with fake Y values forcing costly exponentiations. Cookies counter this.</li><li>No authentication, no identity binding.</li></ul>
<div class="tip"><b>Exam tip.</b> Show α is a primitive root only if the question asks. Always compute both K values and show they match.</div>`,
    qa: [
      Q(2, 'What is a primitive root?', 'A number α is a primitive root of prime q if the powers α¹ … α<sup>q−1</sup> mod q are all different, covering every value 1 to q − 1.'),
      Q(2, 'Why can an eavesdropper not find the DH key?', 'She sees q, α, Y<sub>A</sub>, Y<sub>B</sub> but needs X<sub>A</sub> or X<sub>B</sub>, which means solving the discrete logarithm problem, infeasible for large q.'),
      Q(5, 'Explain the Diffie–Hellman algorithm.', 'Global q, α. Each side picks private X, computes Y = α^X mod q, exchanges Y, then computes K = Y_other^X mod q. Both reach α^(X_A X_B) mod q. Include one numeric example.'),
      Q(8, 'Users A and B use DH with q = 7, α = 5, X_A = 3, X_B = 6. Compute the public keys and the shared secret.', '<p><b>Public keys (4).</b> Y<sub>A</sub> = 5³ mod 7 = 125 mod 7 = 6. Y<sub>B</sub> = 5⁶ mod 7 = 1.</p><p><b>Shared key (4).</b> A: Y<sub>B</sub>^3 mod 7 = 1³ = 1. B: Y<sub>A</sub>^6 mod 7 = 6⁶ mod 7 = 1. Both get K = 1.</p>'),
      Q(16, 'Discuss the vulnerabilities of key exchange algorithms in the presence of man-in-the-middle attacks with a suitable example.', '<p><b>Basic DH and why it is open (3).</b> Public values are exchanged without authentication, so nothing proves Y<sub>A</sub> came from Alice.</p><p><b>Attack steps (5).</b> Mallory sits between A and B and substitutes her own value. Draw the diagram. Explain K₁ and K₂.</p><p><b>Numeric example (4).</b> q = 353, α = 3. X<sub>A</sub> = 97 → Y<sub>A</sub> = 40. X<sub>B</sub> = 233 → Y<sub>B</sub> = 248. Mallory X<sub>M</sub> = 109 → Y<sub>M</sub> = 3¹⁰⁹ mod 353. Alice\'s key = Y<sub>M</sub>^97, Mallory\'s copy = 40^109, equal. Bob\'s key = Y<sub>M</sub>^233 = 248^109.</p><p><b>Consequences (1).</b> Eavesdropping, modification, impersonation.</p><p><b>Countermeasures (3).</b> Signed DH values, X.509 certificates, authenticated DH and station-to-station protocol, pre-shared keys. Also mention RSA key exchange and ECDH share the same weakness when unauthenticated.</p>'),
    ],
  },
  {
    id: 'm3-4', mod: 'm3', title: 'Key management', pr: 'High',
    tags: 'key management distribution public key certificate x.509 authority directory session key hybrid',
    body: `
<div class="def"><b>Definition.</b> Key management covers how keys are <b>generated, distributed, stored, used, changed and destroyed</b>. Public key cryptography addresses two problems: distributing <b>public keys</b>, and using public keys to distribute <b>secret (session) keys</b>.</div>
<h2>1. Distribution of public keys</h2>
<table><tr><th>Scheme</th><th>How it works</th><th>Weakness</th></tr>
<tr><td>Public announcement</td><td>Users broadcast their public key (mail, web page, newsgroup)</td><td>Anyone can forge an announcement</td></tr>
<tr><td>Publicly available directory</td><td>A trusted directory holds name and public key entries; users register and update securely</td><td>Directory or its private key can be attacked</td></tr>
<tr><td>Public key authority</td><td>Central authority gives out keys on request, signing each reply with its private key</td><td>Bottleneck, must be online, single point of attack</td></tr>
<tr><td>Public key certificates</td><td>A certificate authority (CA) signs a binding of identity and public key; users exchange certificates, no online server needed</td><td>CA must be trusted; revocation needed</td></tr></table>
<h2>Certificates and X.509</h2>
<p>A certificate = {identity, public key, validity period, issuer} signed with the CA's private key: <code>C<sub>A</sub> = E(KR<sub>auth</sub>, [T, ID<sub>A</sub>, KU<sub>a</sub>])</code>. Anyone with the CA's public key verifies it. An <b>X.509</b> certificate holds: version, serial number, signature algorithm, issuer, validity (not before and not after), subject, subject public key, extensions, and the CA's signature. Revoked certificates are published on a <b>CRL</b> (certificate revocation list) or checked with OCSP.</p>
<h2>2. Public keys used to distribute secret keys</h2>
<p><b>Simple scheme (Merkle).</b> A generates a temporary pair, sends KU<sub>a</sub> and ID to B; B picks session key K<sub>s</sub> and returns E(KU<sub>a</sub>, K<sub>s</sub>); A decrypts it and both discard the pair. It is open to a man in the middle.</p>
<p><b>With confidentiality and authentication.</b> After exchanging nonces N<sub>1</sub>, N<sub>2</sub> under public key encryption, A sends <code>E(KU<sub>b</sub>, E(KR<sub>a</sub>, K<sub>s</sub>))</code>. Only B can open it, and only A could have signed it.</p>
<p><b>Hybrid approach.</b> A key distribution centre (KDC) shares a master key with each user. Public key encryption delivers the master keys, symmetric session keys are then handed out cheaply.</p>
<h2>Key lifecycle</h2>
<p>Generation (good randomness), distribution, storage (hardware module, protected files), use, rotation (change after a period or use), revocation (key compromised), destruction.</p>
<div class="tip"><b>Exam tip.</b> A 16-mark answer: four public-key distribution schemes with a diagram or message flow each, then certificates, then secret key distribution using public keys.</div>`,
    qa: [
      Q(2, 'What is a digital certificate?', 'A signed statement from a certificate authority binding an identity to a public key, so others can trust that the key belongs to that identity.'),
      Q(2, 'List the contents of an X.509 certificate.', 'Version, serial number, signature algorithm, issuer, validity period, subject, subject public key, extensions, and the issuer\'s signature.'),
      Q(5, 'Explain the techniques for distributing public keys.', 'Public announcement, public directory, public key authority, public key certificates. For each give the idea and the weakness using the table above.'),
      Q(8, 'Explain how public key cryptography is used to distribute secret keys.', '<p>Describe the simple Merkle scheme and why a man in the middle breaks it (3). Then the confidentiality and authentication version with nonces and E(KU<sub>b</sub>, E(KR<sub>a</sub>, K<sub>s</sub>)) (3). Finish with the hybrid approach (2).</p>'),
    ],
  },
  {
    id: 'm3-5', mod: 'm3', title: 'Elliptic curve arithmetic', pr: 'High',
    tags: 'elliptic curve arithmetic point addition doubling scalar multiplication weierstrass finite field infinity',
    body: `
<div class="def"><b>Definition.</b> An elliptic curve over a prime field is the set of points (x, y) satisfying <b>y² = x³ + ax + b (mod p)</b>, with 4a³ + 27b² ≢ 0 (mod p), together with a special <b>point at infinity O</b> that acts as the identity.</div>
<h2>Geometric idea (over real numbers)</h2>
<ul><li><b>Negative:</b> −P = (x, −y), the reflection in the x-axis. P + (−P) = O.</li><li><b>Addition P + Q:</b> draw the line through P and Q, find the third point where it meets the curve, reflect it in the x-axis.</li><li><b>Doubling 2P:</b> draw the tangent at P, find where it meets the curve again, reflect.</li></ul>
<h2>Algebraic formulas modulo p</h2>
<table><tr><th>Case</th><th>Slope λ</th></tr>
<tr><td>P ≠ Q (addition)</td><td>λ = (y₂ − y₁) / (x₂ − x₁) mod p</td></tr>
<tr><td>P = Q (doubling)</td><td>λ = (3x₁² + a) / (2y₁) mod p</td></tr></table>
<p>Then <b>x₃ = λ² − x₁ − x₂ (mod p)</b> and <b>y₃ = λ(x₁ − x₃) − y₁ (mod p)</b>. Division means multiplying by the modular inverse. If x₁ = x₂ and y₁ = −y₂ the sum is O.</p>
<p><b>Scalar multiplication.</b> kP = P + P + … + P (k times), done fast with double-and-add. Given P and kP, finding k is the <b>elliptic curve discrete logarithm problem (ECDLP)</b>, which has no sub-exponential algorithm known.</p>
<div class="ex"><b>Worked example.</b> Curve y² = x³ + 2x + 2 (mod 17), P = (5, 1).
<pre>Check: 1² = 1;  5³ + 2×5 + 2 = 137 mod 17 = 1   ✓ on the curve

Doubling 2P:
 λ = (3×5² + 2) / (2×1) = 77 / 2 mod 17
 77 mod 17 = 9;  2⁻¹ mod 17 = 9;  λ = 9 × 9 = 81 mod 17 = 13
 x₃ = 13² − 5 − 5 = 159 mod 17 = 6
 y₃ = 13 × (5 − 6) − 1 = −14 mod 17 = 3
 2P = (6, 3)

Addition 3P = 2P + P = (6,3) + (5,1):
 λ = (1 − 3) / (5 − 6) = (−2)/(−1) = 2
 x₃ = 2² − 6 − 5 = −7 mod 17 = 10
 y₃ = 2 × (6 − 10) − 3 = −11 mod 17 = 6
 3P = (10, 6)

Multiples: 1P (5,1)  2P (6,3)  3P (10,6)  4P (3,1)  5P (9,16)  6P (16,13)  7P (0,6)
           8P (13,7)  9P (7,6)  10P (7,11) ... 19P = O, so P has order 19</pre></div>
<div data-w="ecc"></div>
<div class="tip"><b>Exam tip.</b> Write the curve and check the point lies on it. State which formula (addition or doubling) you use and why. Reduce every step mod p. A negative number mod p: add p.</div>`,
    qa: [
      Q(2, 'What is the point at infinity in elliptic curve arithmetic?', 'The identity element O of the curve group: P + O = P, and P + (−P) = O. It is the result when a line is vertical.'),
      Q(2, 'Write the formulas for point addition on y² = x³ + ax + b mod p.', 'λ = (y₂ − y₁)/(x₂ − x₁) for P ≠ Q, or (3x₁² + a)/(2y₁) for P = Q. x₃ = λ² − x₁ − x₂, y₃ = λ(x₁ − x₃) − y₁, all mod p.'),
      Q(5, 'Explain point addition and doubling on an elliptic curve.', 'Give the geometric picture (chord through P and Q, tangent at P, reflect the third intersection), then the algebraic formulas with both λ cases, and the special case P + (−P) = O.'),
      Q(8, 'On y² = x³ + 2x + 2 (mod 17) with P = (5, 1), compute 2P and 3P.', '<p>Check P on the curve (1). Doubling: λ = 13, 2P = (6, 3) (3.5). Addition 2P + P: λ = 2, 3P = (10, 6) (3.5).</p>'),
      Q(8, 'Using y² = x³ + x + 1 (mod 23), add P = (3, 10) and Q = (9, 7).', '<pre>λ = (7 − 10)/(9 − 3) = −3/6 = −1/2 mod 23\n2⁻¹ mod 23 = 12, so λ = −12 mod 23 = 11\nx₃ = 11² − 3 − 9 = 109 mod 23 = 17\ny₃ = 11 × (3 − 17) − 10 = −164 mod 23 = 20\nP + Q = (17, 20)</pre>'),
    ],
  },
  {
    id: 'm3-6', mod: 'm3', title: 'Elliptic Curve Cryptography (ECC)', pr: 'Very High',
    tags: 'ecc elliptic curve cryptography ecdh ecdsa key exchange encryption key size ecdlp',
    body: `
<div class="def"><b>Definition.</b> ECC builds public key cryptography on the group of points of an elliptic curve. Its hard problem is the <b>elliptic curve discrete logarithm problem</b>: given G and Q = kG, find k. It gives the same security as RSA with <b>much smaller keys</b>.</div>
<h2>Domain parameters (public)</h2>
<p>Prime p, curve coefficients a and b, base point <b>G</b> of large prime order n. Private key = integer <b>d</b> (1 &lt; d &lt; n). Public key = point <b>Q = dG</b>.</p>
<h2>1. ECC Diffie–Hellman key exchange</h2>
<ol><li>A picks private n<sub>A</sub>, computes public <b>P<sub>A</sub> = n<sub>A</sub>G</b>. B picks n<sub>B</sub>, computes <b>P<sub>B</sub> = n<sub>B</sub>G</b>.</li><li>They exchange P<sub>A</sub> and P<sub>B</sub>.</li><li>A computes K = n<sub>A</sub>P<sub>B</sub>; B computes K = n<sub>B</sub>P<sub>A</sub>. Both equal n<sub>A</sub>n<sub>B</sub>G.</li></ol>
<div class="ex"><b>Example.</b> Curve y² = x³ + 2x + 2 (mod 17), G = (5, 1), order 19. n<sub>A</sub> = 3, n<sub>B</sub> = 4.
<pre>P_A = 3G = (10, 6)
P_B = 4G = (3, 1)
A computes K = 3 × P_B = 3 × (3,1) = 12G
B computes K = 4 × P_A = 4 × (10,6) = 12G
12G = −7G (since 19G = O) = −(0,6) = (0, 11)
Shared secret point K = (0, 11); its x-coordinate becomes the key</pre></div>
<h2>2. ECC encryption (ElGamal style)</h2>
<p>Encode the message as a point P<sub>m</sub>. B's public key is P<sub>B</sub> = n<sub>B</sub>G. A picks random k and sends the pair <code>C<sub>m</sub> = {kG, P<sub>m</sub> + kP<sub>B</sub>}</code>. B decrypts: <code>(P<sub>m</sub> + kP<sub>B</sub>) − n<sub>B</sub>(kG) = P<sub>m</sub></code> because kP<sub>B</sub> = k·n<sub>B</sub>G.</p>
<h2>3. ECDSA signatures</h2>
<p>Same flow as DSA, with point multiplication instead of exponentiation (see Digital Signature Standard).</p>
<h2>Why ECC beats RSA</h2>
<table><tr><th>Security level (bits)</th><th>RSA / DH key size</th><th>ECC key size</th></tr>
<tr><td>80</td><td>1024</td><td>160</td></tr><tr><td>112</td><td>2048</td><td>224</td></tr><tr><td>128</td><td>3072</td><td>256</td></tr><tr><td>192</td><td>7680</td><td>384</td></tr><tr><td>256</td><td>15360</td><td>521</td></tr></table>
<p>Smaller keys mean less storage, less bandwidth and faster computation, ideal for phones, smart cards and IoT.</p>
<h2>RSA versus ECC</h2>
<table><tr><th></th><th>RSA</th><th>ECC</th></tr>
<tr><td>Hard problem</td><td>Integer factoring</td><td>Elliptic curve discrete log</td></tr>
<tr><td>Key size for 128-bit security</td><td>3072 bits</td><td>256 bits</td></tr>
<tr><td>Speed</td><td>Fast to encrypt and verify, slow to sign and generate keys</td><td>Faster key generation and signing</td></tr>
<tr><td>Implementation</td><td>Simple</td><td>Complex, curve choice matters</td></tr>
<tr><td>Best attack</td><td>Sub-exponential (number field sieve)</td><td>Fully exponential</td></tr></table>
<div class="tip"><b>Exam tip.</b> For "explain ECC with an example", write definition, curve and parameters, ECDH steps with a numeric example, ECC encryption in one paragraph, then the key-size table.</div>`,
    qa: [
      Q(2, 'Why is ECC preferred over RSA for mobile devices?', 'It gives the same security with far smaller keys (256-bit ECC ≈ 3072-bit RSA), so it needs less memory, bandwidth, and computation.'),
      Q(2, 'State the elliptic curve discrete logarithm problem.', 'Given points G and Q = kG on the curve, find the integer k. No efficient method is known for large curves.'),
      Q(5, 'Compare RSA and ECC.', 'Use the RSA versus ECC table: hard problem, key size, speed, implementation, best attack.'),
      Q(8, 'Explain the concept of Elliptic Curve Cryptography (ECC) with an example.', '<p><b>Concept (2).</b> Group of points, ECDLP, public key Q = dG.</p><p><b>Parameters (1).</b> p, a, b, G, n.</p><p><b>ECDH (3).</b> Curve y² = x³ + 2x + 2 mod 17, G = (5, 1). n<sub>A</sub> = 3 gives P<sub>A</sub> = (10, 6). n<sub>B</sub> = 4 gives P<sub>B</sub> = (3, 1). Both compute 12G = (0, 11).</p><p><b>Encryption and benefits (2).</b> C<sub>m</sub> = {kG, P<sub>m</sub> + kP<sub>B</sub>}; smaller keys than RSA.</p>'),
      Q(16, 'Explain ECC in detail: arithmetic, key exchange, encryption, security and comparison with RSA.', '<p>Curve definition and the group law with both slope formulas (4). A worked point addition and doubling (3). ECDH with numbers (3). ECC encryption with decryption proof (3). Security: ECDLP, key-size table (2). RSA vs ECC table (1).</p>'),
    ],
  },
];
