# Board PYQ

Class 12 Maths practice with real CBSE board Section A questions (2023–2026). Static site: `index.html`, `config.js`, `questions.js`, `figures/`. No build step.

## Try it locally
```
python -m http.server
```
Open `http://localhost:8000/index.html?demo=1` (student) or `?demo=parent` (parent, read-only). Demo mode saves to this browser only (`board-pyq-v1:` in localStorage). The `?demo` switch works on localhost only.

## Firebase (shared with study-desk)
`config.js` uses the study-desk project (`study-desk-a8b12`). Data is stored under `pyq/{email}/…`, never touching study-desk data.

1. Security rules live in `study-desk/firestore.rules` (a `pyq` block has been added). Check the diff, then from the study-desk folder:
   ```
   firebase deploy --only firestore:rules
   ```
2. In Firebase console → Authentication → Settings → Authorised domains, add `<your-github-username>.github.io` if it is not there already.

## GitHub Pages
Create a repository `board-pyq`, push this folder to `main`, then Settings → Pages → Deploy from branch `main`, folder `/ (root)`.

## Changing things
- Test defaults, awards and emails: `config.js`.
- Questions: `questions.js` only. Ids are permanent.
- `review.html` is the parent's read-only list of every question and answer.
