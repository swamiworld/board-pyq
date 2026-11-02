# Board PYQ

Class 12 practice with real CBSE board Section A questions (2023–2026), one question bank per subject. Maths, Physics, Chemistry and Computer Science are live; English follows. Static site: `index.html`, `config.js`, `questions*.js`, `figures/`. No build step.

## Try it locally
```
python -m http.server
```
Open `http://localhost:8000/index.html?demo=1` (student) or `?demo=parent` (parent, read-only). Demo mode saves to this browser only (`board-pyq-v1:` in localStorage). The `?demo` switch works on localhost only.

## Firebase (shared with study-desk)
`config.js` uses the study-desk project (`study-desk-a8b12`). Data is stored under `pyq/{email}/…`, never touching study-desk data.

1. Security rules live in `study-desk/firestore.rules` (the `pyq` rules are per document: settings, stats, bookmarks, attempts). Check the diff, then from the study-desk folder:
   ```
   firebase deploy --only firestore:rules
   ```
2. In Firebase console → Authentication → Settings → Authorised domains, add `<your-github-username>.github.io` if it is not there already.

## Families
The admin (`adminEmail` in `config.js`) adds parents and their students on the **Families** tab. Each parent then manages their own students on **My children**. The list is stored in Firestore (`pyqParents`, `pyqStudents`), not in `config.js`. The `students` and `parentEmails` in `config.js` only seed the list the first time the admin signs in.

Order for the first rollout: publish the rules, push the app, then the admin signs in once (this adds the seed student). Until then the existing student cannot sign in.

## GitHub Pages
Create a repository `board-pyq`, push this folder to `main`, then Settings → Pages → Deploy from branch `main`, folder `/ (root)`.

## Changing things
- Test defaults, awards and emails: `config.js`.
- Questions: one file per subject, ids are permanent and unique across subjects.
  | Subject | File | Variable | Ids | Review page |
  |---|---|---|---|---|
  | Maths | `questions.js` | `window.PYQ` | m0001… | `review.html` |
  | Physics | `questions_physics.js` | `window.PYQ_PHYSICS` | p0001… | `review_physics.html` |
  | Chemistry | `questions_chemistry.js` | `window.PYQ_CHEMISTRY` | c0001… | `review_chemistry.html` |
  | Computer Science | `questions_cs.js` | `window.PYQ_CS` | s0001… | `review_cs.html` |
  | English | `questions_english.js` (plus a top-level `passages` array) | `window.PYQ_ENGLISH` | e0001… | later |
- To add a subject: drop its file in, add `<script src="questions_xxx.js">` after `questions.js` in `index.html`. It then appears in the subject switch (it is already listed in `config.subjects`).
- Progress, mistakes and bookmarks are stored by question id, so no data change is needed when a subject is added.
