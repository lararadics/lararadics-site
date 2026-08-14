/**
 * compress-images.js
 *
 * Batch-compresses every image in /images IN PLACE, keeping the exact same
 * filenames — so nothing in the HTML/JS needs to change.
 *
 * What it does per file:
 *   - Resizes anything wider than MAX_WIDTH down to MAX_WIDTH (upscaling never happens)
 *   - Re-encodes JPEGs at JPEG_QUALITY with mozjpeg
 *   - Re-encodes PNGs at PNG_QUALITY (only matters if you have any PNGs)
 *   - Strips EXIF/metadata (smaller files; harmless for a portfolio site)
 *   - Skips a file if the "compressed" version would end up LARGER than the
 *     original (rare, but can happen with already-small files)
 *
 * USAGE (run from the project root, where the /images folder lives):
 *   1. npm install sharp --save-dev
 *   2. node compress-images.js
 *
 * A backup of every original is kept in /images-original so you can always
 * revert. Nothing is deleted.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, 'images');
const BACKUP_DIR = path.join(__dirname, 'images-original');

const MAX_WIDTH = 2000;     // plenty for full-bleed on a 4K screen; drop to 1600 for even smaller files
const JPEG_QUALITY = 78;    // 75-80 is a good invisible-loss sweet spot for photography
const PNG_QUALITY = 80;

const VALID_EXT = new Set(['.jpg', '.jpeg', '.png']);

async function run() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`No /images folder found at ${IMAGES_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

  const files = fs.readdirSync(IMAGES_DIR).filter(f =>
    VALID_EXT.has(path.extname(f).toLowerCase())
  );

  console.log(`Found ${files.length} images. Compressing...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const srcPath = path.join(IMAGES_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    const ext = path.extname(file).toLowerCase();

    const before = fs.statSync(srcPath).size;

    // Back up the untouched original the first time we see this file
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(srcPath, backupPath);
    }

    // Always compress from the pristine backup, so re-running this script
    // never re-compresses an already-compressed file (no quality loss on re-run)
    let pipeline = sharp(backupPath).rotate(); // .rotate() with no args = auto-orient from EXIF, then strip it
    const meta = await sharp(backupPath).metadata();

    if (meta.width && meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH });
    }

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
    }

    const tmpPath = srcPath + '.tmp';
    await pipeline.toFile(tmpPath);

    const after = fs.statSync(tmpPath).size;

    if (after < before) {
      fs.renameSync(tmpPath, srcPath);
      totalBefore += before;
      totalAfter += after;
      console.log(`✓ ${file}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`);
    } else {
      fs.unlinkSync(tmpPath);
      totalBefore += before;
      totalAfter += before;
      console.log(`– ${file}: already optimal, skipped`);
    }
  }

  const savedMB = (totalBefore - totalAfter) / 1024 / 1024;
  const pct = totalBefore > 0 ? (100 * (totalBefore - totalAfter) / totalBefore).toFixed(1) : 0;
  console.log(`\nDone. Saved ${savedMB.toFixed(1)}MB (${pct}%) across ${files.length} images.`);
  console.log(`Originals are safely kept in /images-original if you ever want to revert.`);
}

run().catch(err => {
  console.error('Something went wrong:', err);
  process.exit(1);
});
