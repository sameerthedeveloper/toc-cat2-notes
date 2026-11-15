# TOC CAT-2 notes

Theory of Computation (CSD 3101) revision notes, Modules III–V. React + Vite.

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
```

## Layout

- `src/data/` – topics, last year's paper, Neso video list, tutor system prompt
- `src/engines.js` – pure logic: Turing machine, PDA, pumping lemma, parse-tree layout
- `src/components/` – `Views` (pages), `widgets` (simulators, stepper, videos), `Tutor` (Puter.js AI tutor), `Html` (authored HTML + widget placeholders)
- `public/TOC-CAT2-notes.pdf` – offline PDF of all notes
- `legacy/` – the original single-file HTML version

The AI tutor loads Puter.js from a CDN and needs internet access and a free Puter account.
