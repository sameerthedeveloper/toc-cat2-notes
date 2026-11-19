# CAT-2 notes: AI, Theory of Computation, Network Security, Data Mining

Four revision-notes sites in one repo, React + Vite, with the same paper-and-grid look.

- `/` Artificial Intelligence Techniques (CSD 3102), Modules III and IV
- `/toc/` Theory of Computation (CSD 3101), Modules III to V
- `/nsc/` Network Security and Cryptography (CSD 3103), Modules III and IV: RSA, Diffie–Hellman, ECC, MAC, hashes, signatures, live calculators, Oct 2025 paper solved. Videos: Neso Academy (number theory), 4G Silver Academy (Tamil), and other channels for MAC, MD5 and SHA.
- `/dmdw/` Data Mining and Data Warehousing (CSD 3104), Modules III and IV: decision trees, naive Bayes, backpropagation, SVM, evaluation measures, k-means, hierarchical, DBSCAN, outliers, with live calculators, the Oct 2025 paper solved, and video lessons (Mahesh Huddar, Trouble-Free and others).

The **AI / TOC / NSC / DMDW** dropdown in the top bar switches between them.

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
```

## Layout

- `src/data/content.js` – 30 topics with notes and 2/5/13-mark questions
- `src/data/paper.js` – last year's CAT-2 paper (28 Oct 2025) with full answers
- `src/data/videos.js` – video lessons by topic, with channel per video
- `toc/` – the Theory of Computation site (own `index.html`, `src/`, styles)
- `src/engines.js` – pure logic: truth tables, entailment, unification, chaining, goal-stack planner, Wumpus inference, diagrams
- `src/components/` – `Views` (pages), `widgets` (Wumpus world, solvers, videos), `Tutor` (Puter.js AI tutor), `Html` (authored HTML + widget placeholders)
- `public/AI-CAT2-notes.pdf` – offline PDF of the notes
- `legacy/` – the original single-file HTML version

## Videos

Mahesh Huddar is the main source (Wumpus world, logic, chaining, unification, resolution, means-ends analysis). Neso Academy covers the logic topics as discrete maths. A few other channels fill the semantic network, frame and planning pages, and each video shows its channel. Every video ID was checked against YouTube oEmbed. Ten planning topics (conditional, reactive, continuous and multi-agent planning, re-planning, execution monitoring, temporal logic, job-shop scheduling, knowledge-based planning, the simple planning agent) had no lesson on any channel, so those pages say so.

The AI tutor loads Puter.js from a CDN and needs internet access and a free Puter account.

## Generator prompt

`MASTER_PROMPT.md` is the prompt used to generate a notes site like these for a new course.
