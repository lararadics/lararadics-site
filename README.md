# LARARADICS site

Static site: no build step, no dependencies. Open any `.html` file directly or serve the folder.

## Files
- `index.html` — homepage (scroll-driven fade sequence)
- `architecture.html`, `events.html` — category pages
- `project.html` — single project template, driven by a URL query param, e.g. `project.html?p=guggenheim`
- `info.html` — info/contact page
- `images/` — all photos, referenced by filename

## Updating photos
Every image lives in `images/` under its own filename (the original camera filenames, e.g. `IMG_9103.jpg`, `DSCF2919.jpg`).

To swap in a real photo:
1. Export/rename your file to match the filename already used in the site (e.g. replace `images/IMG_9103.jpg`), **or**
2. Add a new file to `images/` and update the filename reference in the relevant HTML:
   - Homepage sequence: edit the `compositions` array near the top of the `<script>` block in `index.html`
   - Project montages: edit the `PROJECTS` object in `project.html`
   - Architecture/Events grids: edit the `<img src="images/...">` tags directly in `architecture.html` / `events.html`

No other code changes are needed — just add the file and point to its name.

## Publishing
1. Push this folder to a GitHub repo (see the chat for exact commands).
2. Connect the repo to Netlify (or similar) with build command: none, publish directory: `/` (repo root).
3. Optional: add a custom domain in Netlify's domain settings once connected.

## Still to do
- Favicon
- Optimize/compress final production images (current ones are straight off camera, some are 400–550KB)
