/* Video lessons. Every ID was read from the channel's own search results and checked against
   YouTube oEmbed (title and channel). Sources: Neso Academy (English; it teaches the number theory
   behind RSA and Diffie–Hellman but has no RSA, ECC, MAC, MD5, SHA or DSS lectures) and
   4G Silver Academy (Tamil; RSA, Diffie–Hellman, ECC, hash functions, signatures, X.509, Kerberos). */
const NESO = 'Neso Academy';
const G4 = '4G Silver Academy (Tamil)';
const TF = 'Trouble-Free';
const SS = 'Sundeep Saradhi Kanthety';
const AS = 'Abhishek Sharma';
const PN = 'Practical Networking';
const BC = 'BECAUSE (Tamil)';
const SL = 'Simplilearn';
const CB = 'Chirag Bhalodia';
const RS = 'RareSkills';

export const NESO_LINK = ['Neso Academy channel', 'https://www.youtube.com/@nesoacademy'];
export const G4_LINK = ['4G Silver Academy channel', 'https://www.youtube.com/@4G_Silver_Academy_%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D'];

/* These uploaders switched embedding off (oEmbed answers 401), so the player links out to YouTube instead. */
export const NOEMBED = new Set(['QXfXJMoyG9w', '7Ub8uGPP5_w', 'C6obOvCU-SQ', 'qpAJgEk2ejE', 'kp8NALv9_x4']);

/* id: [title, minutes, channel] */
export const V = {
  /* 4G Silver Academy, Tamil */
  QXfXJMoyG9w: ['RSA algorithm (Cryptography and Cyber Security, unit 4)', '17', G4],
  LO9uaWg4u4I: ['RSA algorithm (Networks and Security, unit 4)', '17', G4],
  '7Ub8uGPP5_w': ['Diffie–Hellman key exchange algorithm', '14', G4],
  'C6obOvCU-SQ': ['Elliptic Curve Cryptography', '7', G4],
  ClHQrUGK_a4: ['Hash function and secure hash function', '8', G4],
  YhPwLNbEB90: ['Digital Signature Algorithm (DSA)', '8', G4],
  qpAJgEk2ejE: ['ElGamal digital signature', '5', G4],
  fa5jfEGhWdo: ['Schnorr signature', '8', G4],
  cWowVka1VmI: ['X.509 certificate', '8', G4],
  zgW9qNErF8Y: ['Kerberos', '8', G4],
  'Ai4I-Qyfp4A': ['Security attacks', '8', G4],
  yIm0Ol9Dg4Y: ['Security attacks', '16', NESO],
  bRgL_Dry7uw: ['Security services', '9', NESO],
  kp8NALv9_x4: ['Cryptography and Cyber Security important questions, Sem 5', '6', G4],
  '-717E9ajGxk': ['Cryptography and Cyber Security important questions, Nov 2025 exam', '6', G4],

  /* other channels, only for MAC, MD5 and SHA, where Neso and 4G have no lesson */
  Xb_84P8Y7JI: ['MAC: working and significance', '7', TF],
  HjgDdTKtohM: ['HMAC (hash based) and CMAC (cipher based)', '8', TF],
  Om4O14irGzA: ['Message authentication code in cryptography', '15', AS],
  sxWxCtJ3og0: ['HMAC algorithm explained', '21', SS],
  fzMIjWFYQl0: ['MAC and HMAC', '7', PN],
  JtLNyJcbMEk: ['Message authentication code (MAC), part 1', '15', BC],
  't-rT3Zv9bDY': ['Hashed message authentication code (HMAC)', '14', BC],
  '7ZKwKVn4utw': ['MD5 algorithm: working and example', '10', TF],
  '53O9J2J5i14': ['MD5 algorithm explained step by step', '32', SS],
  r6GlzIWiMD0: ['MD5 algorithm explained', '13', SL],
  Wdo8UtTF91I: ['MD5 algorithm: working of message digest', '8', CB],
  '5MiMK45gkTY': ['How the MD5 hash function works, from scratch', '14', RS],
  YBZRHb1o8x0: ['SHA (Secure Hash Algorithm) with example', '6', TF],

  /* Neso Academy, English */
  LaZ3It6pbWE: ['Public key cryptography: chapter 4 introduction', '2', NESO],
  '5J3l894CiMI': ['Prime numbers in cryptography', '10', NESO],
  'DwQ7-k9LkJ4': ['Euler’s totient function (phi function)', '9', NESO],
  osge0_lZTaY: ['Euler’s totient function: solved examples', '13', NESO],
  DyOv20d4c70: ['Euler’s theorem', '8', NESO],
  '3Cb0ys-jppU': ['Fermat’s little theorem', '8', NESO],
  YwaQ4m1eHQo: ['Multiplicative inverse', '10', NESO],
  lq285DDdmtw: ['Extended Euclidean algorithm: solved example 1', '10', NESO],
  '6AUkmf1BYJ0': ['Extended Euclidean algorithm: solved example 2', '6', NESO],
  _gYUlvcnjs0: ['Modular exponentiation, part 1', '10', NESO],
  bg0P_3UiG5I: ['Modular exponentiation, part 2', '20', NESO],
  DKy98FWHwdg: ['Primitive roots', '9', NESO],
  za9azzh4v9A: ['The discrete logarithm problem', '8', NESO],
  yKNTfeqSEhc: ['The discrete logarithm problem: solved example', '5', NESO],
};

const OTHER = 'Neither Neso Academy nor 4G Silver Academy has a lesson on this topic, so these come from other channels (Trouble-Free, Sundeep Saradhi Kanthety and others).';
const NO_NESO = 'Neso Academy has no lecture on this topic, so this comes from 4G Silver Academy (in Tamil).';
const MATHS = 'Neso Academy has no RSA lecture, but its number theory lessons below cover the arithmetic the answer needs: totient, inverse, modular exponentiation.';

export const YT = {
  'm3-1': { pl: [NESO_LINK], v: ['LaZ3It6pbWE', '5J3l894CiMI', 'QXfXJMoyG9w'], note: 'The 4G Silver Academy RSA lesson (Tamil) also introduces the public key idea.' },
  'm3-2': { pl: [G4_LINK, NESO_LINK], v: ['LO9uaWg4u4I', 'QXfXJMoyG9w', 'DwQ7-k9LkJ4', 'osge0_lZTaY', 'DyOv20d4c70', '3Cb0ys-jppU', 'YwaQ4m1eHQo', 'lq285DDdmtw', '6AUkmf1BYJ0', '_gYUlvcnjs0', 'bg0P_3UiG5I'], note: MATHS },
  'm3-3': { pl: [G4_LINK, NESO_LINK], v: ['7Ub8uGPP5_w', 'DKy98FWHwdg', '_gYUlvcnjs0', 'za9azzh4v9A', 'yKNTfeqSEhc'], note: 'Neso Academy covers primitive roots and the discrete logarithm problem, which are what Diffie–Hellman rests on.' },
  'm3-4': { pl: [G4_LINK], v: ['cWowVka1VmI'], note: 'Covers X.509 certificates only. ' + NO_NESO },
  'm3-6': { pl: [G4_LINK], v: ['C6obOvCU-SQ'], note: NO_NESO },
  'm4-1': { pl: [NESO_LINK, G4_LINK], v: ['yIm0Ol9Dg4Y', 'bRgL_Dry7uw', 'Ai4I-Qyfp4A'], note: 'These cover security attacks and services in general; neither channel has a lesson on authentication functions.' },
  'm4-3': { pl: [], v: ['Xb_84P8Y7JI', 'fzMIjWFYQl0', 'Om4O14irGzA', 'HjgDdTKtohM', 'sxWxCtJ3og0', 'JtLNyJcbMEk', 't-rT3Zv9bDY'], note: OTHER + ' The last two are in Tamil. HjgDdTKtohM and sxWxCtJ3og0 cover HMAC and CMAC.' },
  'm4-5': { pl: [], v: ['7ZKwKVn4utw', 'Wdo8UtTF91I', 'r6GlzIWiMD0', '5MiMK45gkTY', '53O9J2J5i14'], note: OTHER + ' The Sundeep Saradhi video is the longest and works through every step; RareSkills builds MD5 from scratch.' },
  'm4-4': { pl: [G4_LINK], v: ['ClHQrUGK_a4'], note: NO_NESO },
  'm4-6': { pl: [G4_LINK], v: ['ClHQrUGK_a4', 'YBZRHb1o8x0'], note: 'The 4G lecture (Tamil) covers hash functions and SHA together. The Trouble-Free video works an SHA example; neither Neso Academy nor 4G has a longer SHA lesson.' },
  'm4-8': { pl: [G4_LINK], v: ['YhPwLNbEB90', 'qpAJgEk2ejE', 'fa5jfEGhWdo'], note: NO_NESO },
  'm4-9': { pl: [G4_LINK], v: ['zgW9qNErF8Y'], note: 'Kerberos only. ' + NO_NESO },
  'm4-10': { pl: [G4_LINK], v: ['YhPwLNbEB90'], note: NO_NESO },
  /* last year's paper */
  paper: { pl: [G4_LINK], v: ['kp8NALv9_x4', '-717E9ajGxk'], note: 'These are important-question lists for a different university’s exam (Anna University CB3491), so use them for topic ideas, not as a match for this paper.' },
  'q-3': { pl: [], v: ['7ZKwKVn4utw', 'Wdo8UtTF91I'] },
  'q-4': { pl: [G4_LINK], v: ['YhPwLNbEB90'] },
  'q-6ai': { pl: [NESO_LINK, G4_LINK], v: ['LaZ3It6pbWE', 'QXfXJMoyG9w'] },
  'q-6aii': { pl: [G4_LINK], v: ['C6obOvCU-SQ'] },
  'q-6b': { pl: [NESO_LINK, G4_LINK], v: ['yIm0Ol9Dg4Y', 'Ai4I-Qyfp4A', '7Ub8uGPP5_w'] },
  'q-7ai': { pl: [G4_LINK], v: ['ClHQrUGK_a4'] },
  'q-7aii': { pl: [], v: ['Xb_84P8Y7JI', 'fzMIjWFYQl0', 'Om4O14irGzA', 'JtLNyJcbMEk'] },
  'q-7b': { pl: [G4_LINK], v: ['ClHQrUGK_a4'] },
  'q-8a': { pl: [G4_LINK, NESO_LINK], v: ['LO9uaWg4u4I', 'QXfXJMoyG9w', 'DwQ7-k9LkJ4', 'lq285DDdmtw', '_gYUlvcnjs0', 'bg0P_3UiG5I'] },
  'q-8b': { pl: [G4_LINK, NESO_LINK], v: ['7Ub8uGPP5_w', 'DKy98FWHwdg', '_gYUlvcnjs0'] },
};
