# Master prompt: exam-notes site generator

Fill the INPUT block, then paste the whole file to Claude Code in an empty folder.

---

## INPUT (edit this block only)

```yaml
subject: Theory of Computation
course_code: CSD 3101
exam: CAT-2
syllabus_scope: Modules III–V only. Do not add anything outside it.
youtube_channel: Neso Academy
playlist_url: ""            # optional; if empty, find the right playlist on the channel
topics:                     # one per line: title | module | priority (Very High / High / Medium)
  - Pumping lemma (regular) | Module III | Very High
  - Closure and decision properties | Module III | High
  - State elimination (FA to RE) | Module III | Very High
  - Context-free grammars | Module IV | High
  - Chomsky normal form | Module IV | Very High
past_paper: ""              # path or pasted text of last year's paper; empty = skip the paper page
mark_scheme: 2, 5 and 13 marks
interactive_tools: auto     # auto = pick simulators that suit the subject (e.g. PDA/TM, graph, circuit, calculator)
ai_tutor: puter             # puter | none
stack: React 18 + Vite, plain CSS, no UI library
```

---

## TASK

Build a revision-notes website for the exam above using the INPUT. Work in the current folder.

### 1. Research the videos first
- Use WebSearch and the channel's real pages to find, for every topic, the lessons from `youtube_channel` that cover it.
- For each video record: 11-character video ID, exact title, length in minutes. **Never invent or guess an ID.** If you cannot confirm a video exists on that channel for a topic, say so in the topic's `note` field and leave `v` empty rather than substituting another channel.
- Keep only videos that are inside `syllabus_scope`. One topic may reuse a video from another.
- Save as `src/data/videos.js`: `NESO_PL`-style playlist URL, a map `V[id] = [title, minutes]`, and `YT[topicId] = { v: [ids], note? }`.

### 2. Write the notes (`src/data/content.js`)
Export `MODS` (module id to name) and `T` (topics). Each topic: `id`, `mod`, `title`, `pr`, `tags`, `body` (HTML string), `qa` (array of `{m, q, a}`).
For every topic, in this order inside `body`:
1. A boxed definition (`<div class="def">`).
2. Intuition in plain words, then the formal procedure as numbered steps.
3. A "common mistake / scoring tip" box (`warn` and `tip` classes).
4. At least one fully worked example with every intermediate step written, finished by a check on a short input.
5. An interactive widget placeholder where one fits: `<div data-w="name"></div>`.

Exam questions (`qa`): include every mark size in `mark_scheme`. Answers must be written the way a student should write them in the exam, with a mark split for the longest ones. Accuracy first: if you are not certain a result is correct, verify it by hand or with code before including it, and never state an unverified claim as fact.

### 3. Interactive tools
Pick tools that fit the subject (examples: automata simulators, grammar-tree viewer, step-by-step stepper, truth-table or circuit evaluator, equation solver). Put pure logic in `src/engines.js` (no DOM, easy to test) and the React widgets in `src/components/widgets.jsx`. Each widget must work with keyboard only and respect `prefers-reduced-motion`.

### 4. Past paper page (only if `past_paper` is given)
Solve every question fully in `src/data/paper.js` as `PAPER = [{part, qs:[{n,m,q,a}]}]`. Mark OR-alternatives clearly. Add a short "what this paper tells you" summary of repeated topics.

### 5. App
Project layout:
```
index.html            fonts + (if ai_tutor=puter) <script src="https://js.puter.com/v2/">
src/main.jsx
src/App.jsx           hash routing, sidebar, search, theme, progress, j/k// keys
src/lib.js            store (localStorage, try/catch), esc, md, plain-text index of topics
src/styles.css
src/data/*.js
src/engines.js
src/components/{Html,widgets,Views,Tutor}.jsx
public/               PDF export of all notes (generate it, do not leave a placeholder)
README.md
```
Required features:
- Sidebar grouped by module, red dot for Very High priority, per-topic "mark as done" with a progress bar (saved in localStorage; the app must work when storage is blocked).
- Search across titles, tags and full note text. Keys: `j` next, `k` previous, `/` focus search.
- Day and Night themes via CSS variables, with an accessible contrast ratio in both.
- Topic page: embedded video player per topic (poster first, load `youtube-nocookie.com` iframe only on click), notes, widgets, exam questions with a marks filter, previous/next links.
- Home page: preparation order, what to practise, scoring advice.
- "All notes, one page" view with PDF download and print.
- Responsive down to 360px wide; sidebar becomes a drawer. No horizontal page scroll.
- If `ai_tutor=puter`: slide-over tutor panel using `puter.ai.chat` with streaming, a system prompt limited to `syllabus_scope`, the open topic's text as context, quick buttons (explain simply, 5 practice questions, fresh solved problem, model long answer, quick revision), and a "Try answering, then get marked" button on each exam question. Handle Puter failing to load with a clear message. Never put API keys in the code.

### 6. Design
Pick one distinctive visual direction that suits the subject (not a generic template). Define colours and fonts as CSS variables. Keep body text at 16px or larger with comfortable line length.

### 7. Verify before you say done
1. `npm install && npm run build` passes with no errors or warnings you can fix.
2. Start the preview, open every route (home, each topic, all, paper) and confirm no console errors.
3. Run each interactive tool on at least two inputs and check the output against a hand calculation.
4. Spot-check 5 video IDs by opening `https://www.youtube.com/watch?v=<id>` and confirming the title and channel match your data. Report any that do not.
5. Check at 360px and 1280px wide.

### 8. Report
End with: what was built, what you verified and how, any topic with no confirmed video, and any content you were unsure about. Do not claim something works if you did not run it.

## RULES
- Stay inside `syllabus_scope`.
- No fabricated video IDs, durations, citations, or exam "predictions" presented as certain.
- Do not copy another channel's transcripts or captions into the notes; write the notes in your own words and link to the videos.
- Ask me once, up front, only if INPUT is missing something you cannot reasonably default.
- After the build, `git init`, commit, and show me the commands to push. Do not push or create a remote repo unless I say so.
