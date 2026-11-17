/* CSD 3103 Network Security and Cryptography · CAT-2 · 29 Oct 2025 · 50 marks · 90 min */
export const PAPER = [
  {
    part: 'Part A: 5 × 2 = 10 marks',
    qs: [
      { n: '1', m: 2, kl: 'CO3 KL2', q: 'Distinguish between integrity and authentication.',
        a: `<table><tr><th>Integrity</th><th>Authentication</th></tr>
<tr><td>Data has not been altered in transit</td><td>Data comes from the claimed sender</td></tr>
<tr><td>Checked with a hash or checksum</td><td>Needs a secret: MAC, signature</td></tr>
<tr><td>Answers: was it changed?</td><td>Answers: who sent it?</td></tr></table>
<p>A plain hash gives integrity only: an attacker can change the message and recompute the hash. A MAC or digital signature gives both.</p>` },
      { n: '2', m: 2, kl: 'CO2 KL1', q: 'List any four applications of asymmetric encryption.',
        a: `<ol><li>Confidentiality: encrypting messages with the receiver's public key.</li><li>Digital signatures: proof of origin and non-repudiation.</li><li>Key exchange: distributing symmetric session keys (RSA, Diffie–Hellman, ECDH).</li><li>Authentication: identity proof in TLS, SSH and X.509 certificates, secure email (PGP).</li></ol>` },
      { n: '3', m: 2, kl: 'CO3 KL1', q: 'Mention any two features of MD5.',
        a: `<div data-w="vids:q-3"></div>
<ol><li>Takes a message of any length and produces a fixed <b>128-bit</b> digest.</li><li>Processes the message in <b>512-bit blocks</b>, with four rounds of 16 steps each (64 steps), using a four-word buffer A, B, C, D.</li></ol>
<p>(Also acceptable: fast and simple, little-endian 32-bit words, now broken by collision attacks.)</p>` },
      { n: '4', m: 2, kl: 'CO4 KL1', q: 'Define Digital Signature Standard (DSS).',
        a: `<div data-w="vids:q-4"></div>
<p>DSS is the NIST standard (FIPS 186) for digital signatures. It specifies the <b>Digital Signature Algorithm (DSA)</b>, which hashes the message with SHA, then signs the digest with the sender's private key and a random number k to produce a pair <b>(r, s)</b>. The receiver verifies with the sender's public key. It provides signatures only, not encryption or key exchange.</p>` },
      { n: '5', m: 2, kl: 'CO3 KL1', q: 'What is meant by avalanche effect?',
        a: `<p>The avalanche effect means that a <b>small change in the input</b> (even one bit) causes a <b>large change in the output</b>, about half of the output bits flip. In a hash function this makes the digest unpredictable and stops an attacker finding related inputs. Example: SHA-256 of "Hello, CAT-2" and "Hello, CAT-3" share almost nothing.</p>` },
    ],
  },
  {
    part: 'Part B: 2 × 16 = 32 marks',
    qs: [
      { n: '6a(i)', m: 8, kl: 'CO2 KL2', q: 'Describe the working principles of public key cryptography with suitable diagram.',
        a: `<div data-w="vids:q-6ai"></div>
<p><b>Idea (1).</b> Each user has a <b>key pair</b>: a public key KU (shared with everyone) and a private key KR (kept secret). What one key does, only the other can undo. It is based on a trapdoor one-way function, so KR cannot be found from KU.</p>
<p><b>Ingredients (1).</b> Plaintext, encryption algorithm, public and private keys, ciphertext, decryption algorithm.</p>
<p><b>Confidentiality (2.5).</b> Alice encrypts with Bob's public key: C = E(KU<sub>b</sub>, M). Only Bob's private key opens it: M = D(KR<sub>b</sub>, C).</p>
<div data-w="diag:pkconf"></div>
<p><b>Authentication and signature (2.5).</b> Alice encrypts with her own private key: C = E(KR<sub>a</sub>, M). Anyone decrypts with KU<sub>a</sub>; success proves it came from Alice.</p>
<div data-w="diag:pkauth"></div>
<p><b>Both (1).</b> C = E(KU<sub>b</sub>, E(KR<sub>a</sub>, M)).</p>` },
      { n: '6a(ii)', m: 8, kl: 'CO2 KL2', q: 'Explain the concept of Elliptic Curve Cryptography (ECC) with an example.',
        a: `<div data-w="vids:q-6aii"></div>
<p><b>Concept (2).</b> ECC uses the group of points on an elliptic curve y² = x³ + ax + b (mod p). The private key is an integer d; the public key is the point Q = dG, where G is a public base point. Given G and Q, finding d is the <b>elliptic curve discrete logarithm problem</b>, infeasible for large curves. So ECC gives RSA-level security with much smaller keys (256-bit ECC ≈ 3072-bit RSA).</p>
<p><b>Arithmetic (1.5).</b> Addition: λ = (y₂−y₁)/(x₂−x₁); doubling: λ = (3x₁²+a)/(2y₁); x₃ = λ² − x₁ − x₂; y₃ = λ(x₁−x₃) − y₁ (all mod p).</p>
<p><b>Example: ECC Diffie–Hellman (3.5).</b> Curve y² = x³ + 2x + 2 mod 17, G = (5, 1).</p>
<pre>Alice private n_A = 3  →  P_A = 3G = (10, 6)
Bob   private n_B = 4  →  P_B = 4G = (3, 1)
Alice: K = n_A × P_B = 3 × (3, 1) = 12G = (0, 11)
Bob:   K = n_B × P_A = 4 × (10, 6) = 12G = (0, 11)
Shared secret point (0, 11)</pre>
<p><b>Benefits (1).</b> Small keys, low computation, suited to mobile and IoT.</p>` },
      { n: '6b', m: 16, kl: 'CO2 KL2', or: true, q: 'Discuss the vulnerabilities of key exchange algorithms in the presence of Man-in-the-Middle attacks with suitable example.',
        a: `<div data-w="vids:q-6b"></div>
<p><b>Background (3).</b> Diffie–Hellman lets A and B agree on a key K = α^(X<sub>A</sub>X<sub>B</sub>) mod q over an open channel, but the exchanged values Y<sub>A</sub> and Y<sub>B</sub> are <b>not authenticated</b>. Anyone on the path can replace them. The same weakness applies to any unauthenticated key exchange, including RSA key transport and ECDH.</p>
<p><b>Attack (5).</b> Mallory sits between Alice and Bob.</p>
<div data-w="diag:dhmitm"></div>
<ol><li>Alice sends Y<sub>A</sub>. Mallory intercepts it and sends Y<sub>M</sub> = α^X<sub>M</sub> mod q to Bob.</li><li>Bob sends Y<sub>B</sub>. Mallory intercepts it and sends Y<sub>M</sub> to Alice.</li><li>Alice computes K₁ = Y<sub>M</sub>^X<sub>A</sub> mod q. Mallory computes the same key as Y<sub>A</sub>^X<sub>M</sub>.</li><li>Bob computes K₂ = Y<sub>M</sub>^X<sub>B</sub> mod q. Mallory computes the same key as Y<sub>B</sub>^X<sub>M</sub>.</li><li>Mallory decrypts each message with one key, reads or changes it, and re-encrypts it with the other. Neither side detects anything.</li></ol>
<p><b>Example (4).</b> q = 7, α = 5 (primitive root). X<sub>A</sub> = 3 → Y<sub>A</sub> = 5³ mod 7 = 6. X<sub>B</sub> = 6 → Y<sub>B</sub> = 5⁶ mod 7 = 1. Mallory picks X<sub>M</sub> = 4 → Y<sub>M</sub> = 5⁴ mod 7 = 2.</p>
<pre>Alice gets Y_M = 2, computes K₁ = 2^3 mod 7 = 1; Mallory: Y_A^X_M = 6^4 mod 7 = 1  (match)
Bob   gets Y_M = 2, computes K₂ = 2^6 mod 7 = 1; Mallory: Y_B^X_M = 1^4 mod 7 = 1  (match)</pre>
<p>(With real parameters K₁ ≠ K₂: Alice and Bob each hold a different key, both known to Mallory.)</p>
<p><b>Consequences (1).</b> Eavesdropping, message modification, impersonation, no confidentiality or integrity.</p>
<p><b>Countermeasures (3).</b> Digital signatures on the exchanged values, X.509 certificates issued by a trusted CA, authenticated DH (station-to-station protocol with signatures and MAC), pre-shared keys, and out-of-band verification of key fingerprints. Also use a large prime q and a primitive root, and cookies to resist clogging.</p>` },
      { n: '7a(i)', m: 8, kl: 'CO3 KL2', q: 'Elucidate the features of Secure Hash Algorithm (SHA) with its application.',
        a: `<div data-w="vids:q-7ai"></div>
<p><b>Definition (1).</b> SHA is a family of NIST hash functions (FIPS 180). SHA-1 takes a message under 2⁶⁴ bits, uses 512-bit blocks and gives a 160-bit digest.</p>
<p><b>Features (4).</b></p>
<table><tr><th></th><th>SHA-1</th><th>SHA-256</th><th>SHA-512</th></tr><tr><td>Digest</td><td>160</td><td>256</td><td>512</td></tr><tr><td>Block</td><td>512</td><td>512</td><td>1024</td></tr><tr><td>Steps</td><td>80</td><td>64</td><td>80</td></tr></table>
<ul><li>Pads the message to 448 mod 512 and appends a 64-bit length, then processes block by block.</li><li>Five-word buffer A–E initialised with fixed constants; 80 steps in 4 rounds, with message expansion W<sub>t</sub> = ROTL¹(W<sub>t−3</sub> ⊕ W<sub>t−8</sub> ⊕ W<sub>t−14</sub> ⊕ W<sub>t−16</sub>).</li><li>Longer digest than MD5, so stronger against brute force (2⁸⁰ for collisions in SHA-1, 2¹²⁸ for SHA-256).</li><li>One-way, avalanche, collision resistant; standardised. SHA-3 uses a different (sponge) design.</li></ul>
<p><b>Applications (3).</b> Digital signatures (sign the digest, DSS); HMAC for message authentication in IPsec and TLS; X.509 certificates; file and download integrity, Git; password hashing with salt; blockchain proof of work.</p>` },
      { n: '7a(ii)', m: 8, kl: 'CO3 KL2', q: 'Describe the concept of Message Authentication Code (MAC) and elaborate its applications for message authentication and confidentiality with neat diagram.',
        a: `<div data-w="vids:q-7aii"></div>
<p><b>Concept (2).</b> A MAC is a fixed-size tag T = MAC(K, M) computed from the message and a shared secret key K. The sender appends T. The receiver recomputes the tag with K and compares. A match shows the message is unaltered (integrity) and came from someone holding K (authentication).</p>
<p><b>Message authentication (2).</b></p>
<div data-w="diag:macauth"></div>
<p><b>Message authentication and confidentiality (3).</b> A MAC does not hide the message, so add encryption with a second key K<sub>2</sub>. Authenticate then encrypt: send E(K<sub>2</sub>, M ‖ MAC(K<sub>1</sub>, M)). Encrypt then authenticate (preferred): C = E(K<sub>2</sub>, M), send C ‖ MAC(K<sub>1</sub>, C); the receiver checks the tag before decrypting.</p>
<div data-w="diag:macconf"></div>
<p><b>Applications (1).</b> IPsec and TLS (HMAC), SSH, banking messages, file integrity, challenge-response login. It gives no non-repudiation because both sides hold K.</p>` },
      { n: '7b', m: 16, kl: 'CO3 KL2', or: true, q: 'Discuss the different types of cryptographic hash algorithms and explain its operation with suitable diagrams.',
        a: `<div data-w="vids:q-7b"></div>
<p><b>Hash function and requirements (2).</b> H maps any-length input to a fixed-length digest; needs preimage, second-preimage and collision resistance, plus the avalanche effect.</p>
<p><b>Types (3).</b></p>
<table><tr><th>Family</th><th>Examples</th><th>Design</th></tr><tr><td>MD family</td><td>MD5 (128-bit)</td><td>Merkle–Damgård</td></tr><tr><td>SHA-1 / SHA-2</td><td>SHA-1, 224, 256, 384, 512</td><td>Merkle–Damgård</td></tr><tr><td>SHA-3</td><td>Keccak</td><td>Sponge</td></tr><tr><td>RIPEMD, Whirlpool</td><td>RIPEMD-160, Whirlpool</td><td>Parallel lines / block cipher based</td></tr><tr><td>Keyed (MACs)</td><td>HMAC, CMAC</td><td>Hash or cipher with a key</td></tr></table>
<p><b>General operation, with diagram (4).</b> Pad and append length; split into Y₁…Y<sub>N</sub>; chain the compression function f: CV₀ = IV, CV<sub>i</sub> = f(CV<sub>i−1</sub>, Y<sub>i</sub>); digest = CV<sub>N</sub>.</p>
<div data-w="diag:md"></div>
<p><b>MD5 operation (3).</b> Pad to 448 mod 512, append 64-bit length. Buffer A = 67452301, B = EFCDAB89, C = 98BADCFE, D = 10325476. Each 512-bit block passes through 4 rounds × 16 steps using F, G, H, I with step a ← b + ((a + g(b,c,d) + X[k] + T[i]) &lt;&lt;&lt; s). Output A ‖ B ‖ C ‖ D = 128 bits.</p>
<p><b>SHA-1 operation (3).</b> Same padding. Five-word buffer, A–E with C3D2E1F0 as E. Expand 16 words to 80. For each step: TEMP = ROTL⁵(A) + f<sub>t</sub>(B,C,D) + E + W<sub>t</sub> + K<sub>t</sub>; shift registers, C = ROTL³⁰(B). Output 160 bits. SHA-256 and SHA-512 follow the same pattern with larger words and digests.</p>
<p><b>SHA-3 and status (1).</b> Sponge: absorb then squeeze; MD5 and SHA-1 are broken, use SHA-256 or SHA-3.</p>` },
    ],
  },
  {
    part: 'Part C: 1 × 8 = 8 marks',
    qs: [
      { n: '8a', m: 8, kl: 'CO2 KL3', q: 'Alice wants to securely send a message to Bob using the RSA algorithm. Given the plaintext message M = 7, and the RSA parameters p = 11, q = 13, and e = 11, perform the encryption and decryption to show how Bob can recover the original message.',
        a: `<div data-w="vids:q-8a"></div>
<p><b>Key generation (3).</b></p>
<pre>n = p × q = 11 × 13 = 143
φ(n) = (p − 1)(q − 1) = 10 × 12 = 120
gcd(11, 120) = 1, so e = 11 is valid
d = e⁻¹ mod 120: 11 × d ≡ 1 (mod 120). 11 × 11 = 121 = 120 + 1, so d = 11
Public key KU = {11, 143}     Private key KR = {11, 143}</pre>
<p><b>Encryption by Alice (2.5).</b> C = M^e mod n = 7¹¹ mod 143.</p>
<pre>7² = 49
7⁴ = 49² = 2401 mod 143 = 113
7⁸ = 113² = 12769 mod 143 = 42
7¹¹ = 7⁸ × 7² × 7¹ = 42 × 49 × 7
42 × 49 = 2058 mod 143 = 56
56 × 7 = 392 mod 143 = 106
C = 106</pre>
<p><b>Decryption by Bob (2.5).</b> M = C^d mod n = 106¹¹ mod 143.</p>
<pre>106² = 11236 mod 143 = 82
106⁴ = 82² = 6724 mod 143 = 3
106⁸ = 3² = 9
106¹¹ = 106⁸ × 106² × 106 = 9 × 82 × 106
9 × 82 = 738 mod 143 = 23
23 × 106 = 2438 mod 143 = 7
M = 7</pre>
<p>Bob recovers the original message M = 7. ✓</p>
<div data-w="rsa"></div>` },
      { n: '8b', m: 8, kl: 'CO2 KL3', or: true, q: 'User A and User B want to establish a shared secret key using the Diffie-Hellman algorithm. Given that q = 7 and the primitive root is 5, and assuming user A\'s private key X_A = 3 and user B\'s private key X_B = 6, compute the public keys for both users and determine the shared secret key.',
        a: `<div data-w="vids:q-8b"></div>
<p><b>Given (1).</b> q = 7, α = 5, X<sub>A</sub> = 3, X<sub>B</sub> = 6. (5 is a primitive root of 7: 5¹ = 5, 5² = 4, 5³ = 6, 5⁴ = 2, 5⁵ = 3, 5⁶ = 1.)</p>
<p><b>Public keys (3).</b></p>
<pre>Y_A = α^X_A mod q = 5³ mod 7 = 125 mod 7 = 6      (125 = 17 × 7 + 6)
Y_B = α^X_B mod q = 5⁶ mod 7 = 15625 mod 7 = 1    (from the table, 5⁶ ≡ 1)</pre>
<p><b>Shared secret key (4).</b></p>
<pre>User A: K = Y_B^X_A mod q = 1³ mod 7 = 1
User B: K = Y_A^X_B mod q = 6⁶ mod 7 = 46656 mod 7 = 1   (6 ≡ −1, so (−1)⁶ = 1)</pre>
<p>Both users get the same shared secret key <b>K = 1</b>. (Note: it is a weak key because Y<sub>B</sub> = 1. Real systems use a large q.)</p>
<div data-w="dh"></div>` },
    ],
  },
];
