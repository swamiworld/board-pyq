# Board PYQ

A practice app for a Class 12 CBSE student who is weak at MCQs. She picks a Maths chapter and answers a short test made only of **real board-exam Section A questions** (MCQ and Assertion–Reason, 2023–2026, Regular and Compartment, every set). Each question shows the year, exam, set and QP code it came from. The parent sees her results read-only.

Sister app: `..\study-desk` (same owner, same student). Reuse its conventions, look and Firebase project; read its `CLAUDE.md` before starting.

## Working with the owner
- Keep explanations brief and to the point.
- Ask all clarifying questions before starting a change, not midway through.
- Show what will change before pushing to GitHub or deploying Firebase rules.

## Status
- Done: `questions.js` (778 questions, answers checked against the official CBSE marking schemes and re-solved independently), `figures/`, `review.html` (read-only list of all questions with answers, for the parent).
- To build: `index.html`, `config.js`, `firestore.rules` changes, `README.md`.

## Files
- `index.html` – the whole app: HTML, CSS and one `<script type="module">`. No build step, no framework.
- `config.js` – `window.APP_CONFIG`: Firebase web config, student and parent emails, test defaults, award tiers.
- `questions.js` – `window.PYQ`: the question bank. Generated; content changes go here, never into `index.html`.
- `figures/` – PNG figures referenced by `question.figure` (28 questions: LPP regions, graphs, Venn diagrams).
- `review.html` – parent's read-only question browser. Keep it working if the bank format changes.
- `data/excluded.json` – 13 board questions deliberately left out (no correct option, misprint, or marks given to all). Do not add them back.

Keep it a static site on GitHub Pages: plain HTML/JS, no bundler, no npm dependencies, no backend, unless the owner agrees.

## Question bank (`questions.js`)
```js
window.PYQ = { version, subject, class, chapters: [{n, t, unit, unitName, unitMarks, count}], questions: [...] };
// question:
{ id: "m0013", chapter: 12, type: "mcq" | "ar", text, options: {A,B,C,D}, answer: "B",
  hint, explanation, difficulty: 1|2|3, figure?: "figures/m0018.png", note?: "...",
  sources: [[2023, "C", "65/C/1", 13], [2023, "C", "65/C/2", 16]] }   // [year, R=Regular | C=Compartment, QP code, question no.]
```
- Maths is LaTeX between `$...$`; render with **KaTeX 0.16.11** (pinned, from a CDN). Split the string on `$`: even parts are plain text (escape with `esc()`), odd parts go to `katex.renderToString(part, {throwOnError:false})`. `\n` in text means a line break (Assertion–Reason questions use it).
- Assertion–Reason (`type:"ar"`) options are the standard four statements; show them like any other options.
- **Ids are permanent.** Progress is stored by id. Never renumber, reuse or delete an id; new questions get new ids.
- One question can have several sources: the same question appeared in several sets or years. Show all of them, e.g. "2024 Regular · 65/2/1 Q7 · also 65/2/3 Q12".
- Chapters (13) and their question counts are in `PYQ.chapters`; group the chapter picker by unit and show unit marks (Unit III Calculus 35 marks, and so on).

## Users and roles
- Student: `dharshiniworld@gmail.com` (Dharshini). Parent (read-only): `swamiworld@gmail.com`. Keep these in `config.js` (`students`, `parentEmails`), lowercase. Any other Google account is signed out with a message.
- Google sign-in exactly as in study-desk (`signInWithPopup`, falling back to `signInWithRedirect`).
- **Demo mode**: if `firebase.apiKey` starts with `PASTE`, skip Firebase, act as the student and use `localStorage` (prefix `board-pyq-v1:`). Use this for local testing.

## Firebase
- Reuse the study-desk Firebase project (`study-desk-a8b12`), same web config. Firebase JS SDK **10.12.2** via dynamic `import()` from gstatic, pinned.
- Data lives under its own top-level collection so it never touches study-desk data:
  - `pyq/{email}/state/settings` – `{count: 10, timerOn: false}`
  - `pyq/{email}/state/stats` – `{seen: {qid: n}, wrong: {qid: {count, last}}, correctStreak: {qid: n}, updatedAt}`
  - `pyq/{email}/attempts/{autoId}` – `{chapter, startedAt, finishedAt, count, timerOn, timeLimitSec, timedOut, score, total, award, items: [{id, chosen|null, correct, timeSec, hintUsed, review}]}`
- Storage goes through one interface (e.g. `getSettings`, `saveSettings`, `getStats`, `saveStats`, `addAttempt`, `listAttempts`) with `localStore()` and `firebaseStore()` implementations, as in study-desk.
- **Security rules are shared with study-desk** (one project = one rules file). Do not deploy a separate rules file from this repo: add a `match /pyq/{email}/{document=**}` block (student read/write own data; parent read) to `..\study-desk\firestore.rules`, keep it above the final deny-all block, and show the owner the diff before `firebase deploy --only firestore:rules`.
- Add the GitHub Pages domain to Firebase Auth authorised domains if it differs from study-desk's.

## Student flow
1. **Home**: chapter picker grouped by unit. For each chapter show total questions, how many she has seen, and her last score. Settings: number of questions per test (default 10, min 5, max 30) and timer on/off. Both are saved.
2. **Pick questions** for the chosen chapter:
   - Take the questions with the lowest `seen` count first; break ties randomly. So a new test never repeats a question until every question in the chapter has been shown once, then the second round starts, and so on.
   - If the chapter has fewer questions than the chosen count, use them all.
   - Later (not now, keep the code ready for it): an option to mix in questions from `wrong`.
3. **Test screen** – one question at a time:
   - Question text, figure (if any), four options as large tappable buttons, and a source line: year, Regular/Compartment, QP code, question number (all sources).
   - **Previous / Next** buttons, **Mark for review** toggle, **Hint** button (shows `hint`; record `hintUsed`).
   - **Question palette**: a left side panel on wide screens and a collapsible strip or drawer on phones. One button per question, coloured by state: not visited, visited but not answered, answered, marked for review, answered and marked for review. Tapping a number jumps to it. Show a small legend.
   - **Done** button: confirm if any questions are unanswered or marked for review, then submit.
   - Options are shown in their original order (A–D labels match the board paper). Do not shuffle.
4. **Timer**:
   - If `timerOn`: a countdown for the whole test, `count × config.secondsPerQuestion` (default 90 s), shown at the top. Turns amber at 20 % left and red at 10 %. At zero, show "Time's up" and submit automatically (`timedOut: true`).
   - **Always**, whether or not the timer is shown, record the time spent on each question (sum of every visit) in `timeSec`.
5. **Result screen** (after Done):
   - Score (e.g. 7/10), total time, average time per question.
   - For every question: her answer, the correct answer, right or wrong, time taken, hint used, and the explanation. Highlight questions where she took much longer than average.
   - A **virtual award** based on the percentage, with a celebration animation (same style as study-desk stickers; no sound; respect reduced motion). Tiers in `config.awards`, e.g. 100 % trophy, 80 %+ gold medal, 60 %+ silver, 40 %+ bronze, below 40 % a "keep going" star. Awards are kept in the attempt and listed on a **My awards** screen.
   - Save the attempt. Update `seen` (+1 for every question in the submitted test), `wrong` (add or increment wrong and unanswered questions), and remove a question from `wrong` after she answers it correctly twice in a row (`correctStreak`).
   - A test closed before Done is not saved and does not change `seen`.
6. **Progress**: per chapter, number of tests, best and last score, average time per question, questions seen / total; list of past attempts (tap to reopen the result).

## Parent view (read-only)
- Same Progress and attempts screens for the student, plus per-chapter accuracy and the list of questions she got wrong most often (with the question, her answers and the correct answer).
- No test-taking, no editing.

## Design
- Same look as study-desk: mobile-first, max width about 680 px for content (the test screen may use the wider layout with the side palette), warm cream background with dark-mode indigo, indigo accent, green for correct, red for wrong, amber for review/timer warning, gold and pink for awards. Colours as CSS variables on `:root` with dark-mode values.
- Fonts: Bricolage Grotesque (headings) and Atkinson Hyperlegible (body).
- Large tap targets; maths must not overflow on a 390 px screen (allow horizontal scroll inside the question box for wide matrices).
- All user-visible strings from data go through `esc()` or KaTeX.

## Testing
- Serve locally with `python -m http.server` and use demo mode.
- Before finishing a change, click through the affected screens in a headless browser (Playwright) at about 390 px wide and at desktop width. Check the console for errors and that no `.katex-error` elements appear.
- Check: no repeats across tests until the chapter is exhausted; timer auto-submit; per-question time adds up across revisits; palette states; result and award saved; parent view is read-only.

## Deploy
- New GitHub repository (e.g. `board-pyq`) served by GitHub Pages from `main`. Pushing to `main` is a release, so confirm with the owner first.
- Rules: see Firebase above (deploy from study-desk only).
