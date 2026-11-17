/* Number theory, elliptic curves, hashes and diagrams. All BigInt so the numbers stay exact. */
export const mod = (a, m) => ((a % m) + m) % m;
export const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
export function egcd(a, b) {
  let [r0, r1, s0, s1, t0, t1] = [a, b, 1n, 0n, 0n, 1n];
  const rows = [];
  while (r1 !== 0n) {
    const q = r0 / r1;
    rows.push({ q, r: r1 });
    [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; [t0, t1] = [t1, t0 - q * t1];
  }
  return { g: r0, x: s0, y: t0, rows };
}
export const inv = (a, m) => { const e = egcd(mod(a, m), m); if (e.g !== 1n) throw new Error(a + ' has no inverse mod ' + m); return mod(e.x, m); };
export function powTrace(b, e, m) {
  /* right-to-left square and multiply, returning each step so it can be shown in an exam answer */
  const steps = []; let r = 1n, base = mod(b, m), x = e, i = 0;
  while (x > 0n) {
    const bit = x & 1n;
    if (bit) r = mod(r * base, m);
    steps.push({ i, bit: Number(bit), base, r });
    base = mod(base * base, m); x >>= 1n; i++;
  }
  return { result: r, steps };
}
export const pow = (b, e, m) => powTrace(b, e, m).result;
export const isPrime = (n) => { if (n < 2n) return false; for (let i = 2n; i * i <= n; i++) if (n % i === 0n) return false; return true; };
export const factors = (n) => { const f = []; for (let p = 2n; p * p <= n; p++) { if (n % p === 0n) { f.push(p); while (n % p === 0n) n /= p; } } if (n > 1n) f.push(n); return f; };
export const isPrimitiveRoot = (g, q) => { if (!isPrime(q)) return false; const o = q - 1n; return factors(o).every((p) => pow(g, o / p, q) !== 1n); };
export const primitiveRoots = (q) => { const r = []; for (let g = 2n; g < q; g++) if (isPrimitiveRoot(g, q)) r.push(g); return r; };

/* RSA */
export function rsa(p, q, e, M) {
  if (!isPrime(p) || !isPrime(q)) throw new Error('p and q must both be prime');
  if (p === q) throw new Error('p and q must differ');
  const n = p * q, phi = (p - 1n) * (q - 1n);
  if (e <= 1n || e >= phi) throw new Error('need 1 < e < φ(n) = ' + phi);
  if (gcd(e, phi) !== 1n) throw new Error('gcd(e, φ(n)) must be 1, but gcd(' + e + ', ' + phi + ') = ' + gcd(e, phi));
  if (M < 0n || M >= n) throw new Error('message must satisfy 0 ≤ M < n = ' + n);
  const eg = egcd(e, phi), d = mod(eg.x, phi);
  const enc = powTrace(M, e, n), C = enc.result, dec = powTrace(C, d, n);
  return { n, phi, d, eg, C, enc, dec, M2: dec.result };
}

/* Diffie-Hellman */
export function dh(q, a, xa, xb) {
  if (!isPrime(q)) throw new Error('q must be prime');
  if (a <= 1n || a >= q) throw new Error('need 1 < α < q');
  const ya = pow(a, xa, q), yb = pow(a, xb, q);
  return { ya, yb, ka: pow(yb, xa, q), kb: pow(ya, xb, q), root: isPrimitiveRoot(a, q), roots: primitiveRoots(q) };
}

/* Elliptic curve y² = x³ + ax + b over Z_p. Point at infinity is null. */
export const onCurve = (P, c) => P === null || mod(P[1] * P[1], c.p) === mod(P[0] ** 3n + c.a * P[0] + c.b, c.p);
export function ecAdd(P, Q, c) {
  const { p, a } = c;
  if (P === null) return { R: Q, note: 'P is O, so P + Q = Q' };
  if (Q === null) return { R: P, note: 'Q is O, so P + Q = P' };
  const [x1, y1] = P, [x2, y2] = Q;
  if (x1 === x2 && mod(y1 + y2, p) === 0n) return { R: null, note: 'Q = −P, so the sum is the point at infinity O' };
  let l, how;
  if (x1 === x2 && y1 === y2) {
    l = mod((3n * x1 * x1 + a) * inv(2n * y1, p), p);
    how = `λ = (3x₁² + a) / 2y₁ = (3·${x1}² + ${a}) / (2·${y1}) = ${3n * x1 * x1 + a} / ${2n * y1} ≡ ${l} (mod ${p})`;
  } else {
    l = mod((y2 - y1) * inv(x2 - x1, p), p);
    how = `λ = (y₂ − y₁) / (x₂ − x₁) = (${y2} − ${y1}) / (${x2} − ${x1}) = ${y2 - y1} / ${x2 - x1} ≡ ${l} (mod ${p})`;
  }
  const x3 = mod(l * l - x1 - x2, p), y3 = mod(l * (x1 - x3) - y1, p);
  return { R: [x3, y3], l, note: how + `\nx₃ = λ² − x₁ − x₂ = ${l}² − ${x1} − ${x2} ≡ ${x3}\ny₃ = λ(x₁ − x₃) − y₁ = ${l}·(${x1} − ${x3}) − ${y1} ≡ ${y3}` };
}
export function ecMul(k, P, c) {
  const list = []; let R = null;
  for (let i = 1n; i <= k; i++) { R = i === 1n ? P : ecAdd(R, P, c).R; list.push(R); if (R === null) break; }
  return { R, list };
}
export const ptStr = (P) => (P === null ? 'O' : `(${P[0]}, ${P[1]})`);
export function ecPoints(c) {
  const pts = [];
  for (let x = 0n; x < c.p; x++) for (let y = 0n; y < c.p; y++) if (onCurve([x, y], c)) pts.push([x, y]);
  return pts;
}

/* Hashes. SHA-1/256 use the browser's crypto; MD5 is not in WebCrypto so it is written out. */
const enc = (s) => new TextEncoder().encode(s);
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
export async function sha(alg, s) { return hex(await crypto.subtle.digest(alg, enc(s))); }
export async function hmac(alg, key, msg) {
  const k = await crypto.subtle.importKey('raw', enc(key), { name: 'HMAC', hash: alg }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, enc(msg)));
}
export function md5(str) {
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const bytes = [...enc(str)], len = bytes.length;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bits = len * 8;
  for (let i = 0; i < 8; i++) bytes.push(i < 4 ? (bits >>> (8 * i)) & 255 : 0);
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const rol = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
  for (let o = 0; o < bytes.length; o += 64) {
    const M = Array.from({ length: 16 }, (_, i) => (bytes[o + 4 * i] | (bytes[o + 4 * i + 1] << 8) | (bytes[o + 4 * i + 2] << 16) | (bytes[o + 4 * i + 3] << 24)) >>> 0);
    let [A, B, C, D] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + rol(F, S[(i >> 4) * 4 + (i % 4)])) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  return [a0, b0, c0, d0].map((w) => [0, 8, 16, 24].map((s) => ((w >>> s) & 255).toString(16).padStart(2, '0')).join('')).join('');
}
export const bitDiff = (h1, h2) => {
  let n = 0;
  for (let i = 0; i < h1.length; i++) n += (parseInt(h1[i], 16) ^ parseInt(h2[i], 16)).toString(2).replace(/0/g, '').length;
  return n;
};

/* ---- Diagram helper (boxes and labelled arrows) ---- */
export function netSVG(nodes, edges, W, H, opt = {}) {
  const nw = opt.nw || 118, nh = opt.nh || 34; const N = {}; nodes.forEach((n) => (N[n.id] = n));
  const clip = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y; const aw = (a.w || nw) / 2, ah = (a.h || nh) / 2; const t = Math.min(dx ? aw / Math.abs(dx) : 1e9, dy ? ah / Math.abs(dy) : 1e9); return [a.x + dx * t, a.y + dy * t]; };
  let s = `<svg class="net" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${opt.label || 'diagram'}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>`;
  edges.forEach(([f, t, l, d]) => {
    const a = N[f], b = N[t]; const [x1, y1] = clip(a, b), [x2, y2] = clip(b, a);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${d ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#ar)"/>`;
    if (l) s += `<text class="el" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 5}" text-anchor="middle">${l}</text>`;
  });
  nodes.forEach((n) => { const w = n.w || nw, h = n.h || nh; s += `<g class="nd ${n.c || ''}"><rect x="${n.x - w / 2}" y="${n.y - h / 2}" width="${w}" height="${h}" rx="${n.r ?? 4}"/><text x="${n.x}" y="${n.y + 4}" text-anchor="middle">${n.t}</text></g>`; });
  return s + '</svg>';
}
const hop = (id, x, y, t, c, w) => ({ id, x, y, t, c, w });
export const DIAG = {
  pkconf: () => netSVG([hop('m', 50, 60, 'Plaintext M', '', 90), hop('e', 190, 60, 'Encrypt', 'hi', 80), hop('c', 340, 60, 'Ciphertext C', '', 110), hop('d', 490, 60, 'Decrypt', 'hi', 80), hop('o', 620, 60, 'Plaintext M', '', 90), hop('pu', 190, 140, 'Bob public KU_b', 'prop', 130), hop('pr', 490, 140, 'Bob private KR_b', 'prop', 130)],
    [['m', 'e'], ['e', 'c'], ['c', 'd'], ['d', 'o'], ['pu', 'e'], ['pr', 'd']], 680, 175, { label: 'Public key encryption for confidentiality' }),
  pkauth: () => netSVG([hop('m', 50, 60, 'Message M', '', 90), hop('e', 190, 60, 'Sign', 'hi', 80), hop('c', 340, 60, 'Signed C', '', 100), hop('d', 490, 60, 'Verify', 'hi', 80), hop('o', 620, 60, 'Message M', '', 90), hop('pr', 190, 140, 'Alice private KR_a', 'prop', 140), hop('pu', 490, 140, 'Alice public KU_a', 'prop', 140)],
    [['m', 'e'], ['e', 'c'], ['c', 'd'], ['d', 'o'], ['pr', 'e'], ['pu', 'd']], 680, 175, { label: 'Public key use for authentication' }),
  dhmitm: () => netSVG([hop('a1', 70, 30, 'Alice', 'hi', 90), hop('m1', 330, 30, 'Mallory', 'bad', 100), hop('b1', 590, 30, 'Bob', 'hi', 90), hop('b2', 590, 110, 'Bob', 'hi', 90), hop('m2', 330, 110, 'Mallory', 'bad', 100), hop('a2', 70, 110, 'Alice', 'hi', 90)],
    [['a1', 'm1', 'Y_A'], ['m1', 'b1', 'Y_M (fake, in place of Y_A)'], ['b2', 'm2', 'Y_B'], ['m2', 'a2', 'Y_M (fake, in place of Y_B)']], 660, 145, { label: 'Man in the middle on Diffie-Hellman' }),
  macauth: () => netSVG([hop('m', 60, 50, 'Message M', '', 100), hop('mac', 230, 50, 'MAC(K, M)', 'hi', 100), hop('t', 230, 130, 'Tag T', 'prop', 70), hop('rx', 420, 90, 'Receiver', '', 90), hop('cmp', 585, 90, 'Recompute and compare', 'hi', 175)],
    [['m', 'mac'], ['mac', 't'], ['t', 'rx', 'M ‖ T'], ['rx', 'cmp']], 680, 150, { label: 'MAC for authentication' }),
  macconf: () => netSVG([hop('m', 50, 50, 'M', '', 50), hop('mac', 150, 50, 'MAC(K1, M)', 'hi', 100), hop('en', 300, 50, 'Encrypt K2', 'hi', 100), hop('c', 440, 50, 'Ciphertext', '', 90), hop('de', 440, 130, 'Decrypt K2', 'hi', 100), hop('v', 590, 130, 'Check MAC K1', 'hi', 110)],
    [['m', 'mac', 'M ‖ T'], ['mac', 'en'], ['en', 'c'], ['c', 'de'], ['de', 'v']], 680, 170, { label: 'MAC with confidentiality' }),
  md: () => netSVG([hop('iv', 50, 40, 'IV', 'prop', 50), hop('f1', 180, 40, 'f', 'hi', 60), hop('f2', 320, 40, 'f', 'hi', 60), hop('f3', 460, 40, 'f', 'hi', 60), hop('h', 600, 40, 'Hash H(M)', '', 90), hop('y1', 180, 120, 'Block 1', '', 80), hop('y2', 320, 120, 'Block 2', '', 80), hop('y3', 460, 120, 'Block N + padding', '', 130)],
    [['iv', 'f1'], ['f1', 'f2', 'CV₁'], ['f2', 'f3', 'CV₂'], ['f3', 'h'], ['y1', 'f1'], ['y2', 'f2'], ['y3', 'f3']], 680, 150, { label: 'Iterated (Merkle–Damgård) hash' }),
  dsig: () => netSVG([hop('m', 60, 40, 'Message M', '', 100), hop('h', 200, 40, 'Hash H', 'hi', 70), hop('s', 340, 40, 'Sign: encrypt with KR_a', 'hi', 170), hop('sig', 530, 40, 'Signature', 'prop', 90), hop('v', 340, 130, 'Verify: decrypt with KU_a', 'hi', 180), hop('h2', 200, 130, 'Hash H', 'hi', 70), hop('ok', 530, 130, 'Equal? valid : invalid', 'hi', 140)],
    [['m', 'h'], ['h', 's'], ['s', 'sig'], ['sig', 'v', 'M ‖ sig'], ['v', 'ok'], ['h2', 'ok']], 640, 170, { label: 'Digital signature' }),
  dss: () => netSVG([hop('m', 60, 40, 'Message M', '', 100), hop('h', 210, 40, 'SHA hash', 'hi', 90), hop('s', 380, 40, 'Sign (r, s) with x, k', 'hi', 150), hop('o', 560, 40, '(r, s)', 'prop', 70), hop('v', 380, 130, 'Verify with public y', 'hi', 150), hop('ok', 560, 130, 'v = r ?', 'hi', 80)],
    [['m', 'h'], ['h', 's'], ['s', 'o'], ['o', 'v', 'M ‖ (r,s)'], ['v', 'ok']], 640, 170, { label: 'DSS signing and verifying' }),
  ns: () => netSVG([hop('a1', 70, 25, 'Alice', 'hi', 90), hop('b1', 420, 25, 'Bob', 'hi', 90), hop('b2', 420, 85, 'Bob', 'hi', 90), hop('a2', 70, 85, 'Alice', 'hi', 90), hop('a3', 70, 145, 'Alice', 'hi', 90), hop('b3', 420, 145, 'Bob', 'hi', 90)],
    [['a1', 'b1', '1. A, N_a'], ['b2', 'a2', '2. E(K, [N_a, N_b])'], ['a3', 'b3', '3. E(K, N_b)']], 490, 175, { label: 'Challenge response with nonces' }),
};

const lane = (title, nodes, edges, W = 680, H = 80) => `<h4 style="margin:14px 0 4px">${title}</h4>` + netSVG(nodes, edges, W, H, { label: title });
DIAG.macconf2 = () => netSVG([hop('m', 50, 50, 'M', '', 50), hop('en', 170, 50, 'Encrypt K₂', 'hi', 100), hop('c', 300, 50, 'C', '', 50), hop('mac', 300, 130, 'MAC(K₁, C)', 'hi', 110), hop('s', 470, 90, 'C ‖ T', 'prop', 80), hop('v', 610, 90, 'Check, then decrypt', 'hi', 150)],
  [['m', 'en'], ['en', 'c'], ['c', 'mac'], ['c', 's'], ['mac', 's'], ['s', 'v']], 690, 170, { label: 'MAC tied to ciphertext' });
DIAG.hmac = () => netSVG([hop('k', 60, 40, 'K⁺ (padded key)', 'prop', 110), hop('x1', 210, 40, '⊕ ipad → S_i', 'hi', 110), hop('h1', 360, 40, 'H( S_i ‖ M )', 'hi', 110), hop('m', 360, 120, 'Message M', '', 100), hop('x2', 210, 120, '⊕ opad → S_o', 'hi', 110), hop('h2', 530, 80, 'H( S_o ‖ inner )', 'hi', 130), hop('o', 650, 80, 'MAC', 'prop', 50)],
  [['k', 'x1'], ['x1', 'h1'], ['m', 'h1'], ['x2', 'h2'], ['h1', 'h2', 'n-bit'], ['h2', 'o']], 690, 160, { label: 'HMAC structure' });
DIAG.sha1 = () => netSVG([hop('cv', 60, 40, 'CV_q (A B C D E)', 'prop', 110), hop('r', 220, 40, '80 steps: 4 rounds × 20', 'hi', 170), hop('y', 220, 120, 'Block Y_q → W_t', '', 120), hop('k', 380, 120, 'K_t', 'prop', 50), hop('sum', 400, 40, 'SUM32 (mod 2³²)', 'hi', 120), hop('cv2', 560, 40, 'CV_{q+1}', 'prop', 90)],
  [['cv', 'r'], ['y', 'r'], ['k', 'r'], ['r', 'sum'], ['cv', 'sum', '', 1], ['sum', 'cv2']], 640, 160, { label: 'SHA-1 compression function' });
DIAG.dsgen = () => netSVG([hop('kg', 70, 40, 'Key generation', 'hi', 110), hop('pr', 70, 120, 'Private key', 'prop', 100), hop('sg', 250, 120, 'Signing algorithm', 'hi', 130), hop('m', 250, 40, 'Message M', '', 100), hop('sig', 420, 120, 'Signature', 'prop', 80), hop('vf', 570, 80, 'Verification algorithm', 'hi', 160), hop('pub', 570, 20, 'Public key', 'prop', 90)],
  [['kg', 'pr'], ['pr', 'sg'], ['m', 'sg'], ['sg', 'sig'], ['sig', 'vf', 'M ‖ sig'], ['pub', 'vf'], ['m', 'vf', '', 1]], 690, 160, { label: 'Generic digital signature model' });
const HM = [
  ['1. E(K, M ‖ H(M)): authentication and confidentiality', 'E(K, M ‖ H(M))', 'Decrypt, recompute H, compare'],
  ['2. M ‖ E(K, H(M)): authentication only', 'M ‖ E(K, H(M))', 'Decrypt code, recompute H, compare'],
  ['3. M ‖ E(KR_a, H(M)): authentication and digital signature', 'M ‖ E(KR_a, H(M))', 'Decrypt with KU_a, recompute, compare'],
  ['4. E(K, M ‖ E(KR_a, H(M))): signature and confidentiality', 'E(K, M ‖ E(KR_a, H(M)))', 'Decrypt, verify with KU_a'],
  ['5. M ‖ H(M ‖ S): authentication with a shared secret, no encryption', 'M ‖ H(M ‖ S)', 'Append S, hash, compare'],
  ['6. E(K, M ‖ H(M ‖ S)): authentication and confidentiality', 'E(K, M ‖ H(M ‖ S))', 'Decrypt, hash M ‖ S, compare'],
];
const tw = (t) => Math.round(t.length * 8 + 24);
DIAG.hashmethods = () => HM.map(([t, send, chk]) => { const wb = tw(send), wc = tw(chk); return lane(t, [hop('a', 55, 40, 'Message M', '', 90), hop('b', 55 + 45 + 40 + wb / 2, 40, send, 'hi', wb), hop('c', 700 - 8 - wc / 2, 40, chk, 'prop', wc)], [['a', 'b', 'sender'], ['b', 'c', 'channel']], 700, 80); }).join('');
