/**
 * generate-thumbnails.js
 *
 * The architecture.html and people.html pages show a small ~300px-wide
 * "cover" image per project in a grid. Until now those pages were loading
 * the SAME full-resolution (2000px wide) image used on the project detail
 * page — massive overkill for a thumbnail, and the main reason those pages
 * feel slow to load.
 *
 * This script:
 *   1. Scans architecture.html and people.html for every "images/FILENAME"
 *      reference (i.e. every cover image currently in use)
 *   2. Generates a small, thumbnail-sized copy of each one at
 *      images/thumbs/FILENAME (700px wide, quality 75 — plenty sharp for
 *      a ~300-400px CSS box, even on retina screens)
 *
 * It re-runs safely: if a thumbnail already exists for a file it's
 * skipped, so you only pay the processing cost for new cover images.
 *
 * USAGE (after you've already run `npm install sharp --save-dev` once):
 *   node generate-thumbnails.js
 *
 * You only need to run this again when you change which image is used as
 * a project's COVER photo on architecture.html or people.html. Adding
 * images inside a project (via project.html) does NOT require this —
 * that's what compress-images.js is for.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, 'images');
const THUMBS_DIR = path.join(IMAGES_DIR, 'thumbs');
const SOURCE_DIR = fs.existsSync(path.join(__dirname, 'images-original'))
  ? path.join(__dirname, 'images-original') // prefer the pristine original if we have it
  : IMAGES_DIR;

const THUMB_WIDTH = 700;
const THUMB_QUALITY = 75;

const HTML_FILES = ['architecture.html', 'people.html'];

function findCoverImages() {
  const found = new Set();
  const re = /images\/(?:thumbs\/)?([A-Za-z0-9_\-.]+\.(?:jpe?g|png))/gi;
  for (const file of HTML_FILES) {
    const fp = path.join(__dirname, file);
    if (!fs.existsSync(fp)) continue;
    const text = fs.readFileSync(fp, 'utf8');
    let m;
    while ((m = re.exec(text)) !== null) {
      found.add(m[1]);
    }
  }
  return Array.from(found);
}

async function run() {
  const covers = findCoverImages();
  if (covers.length === 0) {
    console.log('No images/... references found in architecture.html or people.html.');
    return;
  }
  if (!fs.existsSync(THUMBS_DIR)) fs.mkdirSync(THUMBS_DIR, { recursive: true });

  console.log(`Found ${covers.length} cover image(s) referenced on the grid pages.\n`);

  for (const file of covers) {
    const outPath = path.join(THUMBS_DIR, file);
    if (fs.existsSync(outPath)) {
      console.log(`– ${file}: thumbnail already exists, skipped`);
      continue;
    }

    const srcPath = path.join(SOURCE_DIR, file);
    if (!fs.existsSync(srcPath)) {
      console.log(`! ${file}: source not found in ${SOURCE_DIR}, skipped`);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    let pipeline = sharp(srcPath).rotate().resize({ width: THUMB_WIDTH });
    pipeline = (ext === '.png')
      ? pipeline.png({ quality: THUMB_QUALITY, compressionLevel: 9 })
      : pipeline.jpeg({ quality: THUMB_QUALITY, mozjpeg: true });

    await pipeline.toFile(outPath);
    const size = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`✓ ${file}: thumbnail created (${size}KB)`);
  }

  console.log('\nDone. Thumbnails live in images/thumbs/.');
}

run().catch(err => {
  console.error('Something went wrong:', err);
  process.exit(1);
});
