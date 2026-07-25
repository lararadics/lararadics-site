# LARARADICS site

Static site: no build step, no dependencies. Open any `.html` file directly or serve the folder.

## Files
- `index.html` — homepage (scroll-driven fade sequence)
- `architecture.html`, `people.html`, `motion.html` — category pages
- `project.html` — single project template, driven by a URL query param, e.g. `project.html?p=guggenheim`
- `info.html` — info/contact page
- `images/` — all photos, referenced by filename
- `videos/` — video clips for the Motion page, referenced by filename

## Changing photos on the homepage
Open `index.html` in a plain text editor and find the `compositions` list near the top of the `<script>` block. Each line is one "slide" on the homepage:

```
{ type:'full',  images:['IMG_9103.jpg'], align:'center' },
```

- To swap a photo: replace the filename inside the quotes with a filename that exists in `images/` (or drop a new file into `images/` with that exact name).
- To add a slide: copy one of the lines and paste it in the list, changing the filename.
- To remove a slide: delete its line.

`type` can be `full` (one big photo), `offset` (one photo, off-center), or `group` (three photos side by side).

## Adding or changing projects
Projects live in `project.html`, in the `PROJECTS` list near the top of the `<script>` block:

```
guggenheim: { title: 'Guggenheim', category: 'architecture', images: ['IMG_9103.jpg', 'DSCF2919.jpg'] },
```

- To add a new project: copy one line, give it a new name before the colon (e.g. `newbuild:`), a title, a category (`architecture` or `people`), and the list of image filenames.
- To change a project's photos: edit the filenames inside `images: [...]`.
- Each project automatically gets its own page at `project.html?p=yourprojectname`.
- To link to it from a category page (`architecture.html` or `people.html`), add a new card:

```html
<a class="p-link" href="project.html?p=newbuild">
  <div class="p-cell"><img src="images/YOUR-FILE.jpg" alt=""></div>
  <div class="p-title">New Build</div>
</a>
```

## Adding videos (Motion page)
Open `motion.html` and find the `CLIPS` list:

```
{ title: 'Site Walkthrough', file: 'videos/site-walkthrough.mp4', poster: 'images/IMG_9103.jpg' },
```

1. Put your video file in the `videos/` folder.
2. Add a line to `CLIPS` with a title and the filename (the `poster` image is optional — it's the still image shown before playback).

## Updating photos in general
Every image lives in `images/` under its own filename. To swap one in:
1. Replace the file in `images/` with the same filename, **or**
2. Add a new file and update the filename reference wherever it's used (see above).

## Publishing changes
This site auto-deploys: whenever you push new changes to the `main` branch on GitHub, Netlify rebuilds the live site automatically within a minute or two. No extra steps needed.

## Still to do
- Favicon
- Optimize/compress final production images (some are 400–550KB straight off camera)
