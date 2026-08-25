const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

// Format file size helper
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

// Clean and recreate directory
function prepareDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, 'css'), { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, 'js'), { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, 'assets', 'images'), { recursive: true });
}

async function build() {
  console.log('\n🚀 Starting MessageYard Production Build & Asset Compression...\n');
  const startTime = Date.now();
  prepareDist();

  let totalOriginalSize = 0;
  let totalMinifiedSize = 0;
  const stats = [];

  // 1. Minify HTML Files
  const htmlFiles = ['index.html', 'autosend.html'];
  for (const file of htmlFiles) {
    const srcPath = path.join(ROOT_DIR, file);
    if (!fs.existsSync(srcPath)) continue;

    const originalContent = fs.readFileSync(srcPath, 'utf8');
    const originalSize = Buffer.byteLength(originalContent);

    const minifiedContent = await minifyHtml(originalContent, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
    });

    const destPath = path.join(DIST_DIR, file);
    fs.writeFileSync(destPath, minifiedContent, 'utf8');
    const minifiedSize = Buffer.byteLength(minifiedContent);

    totalOriginalSize += originalSize;
    totalMinifiedSize += minifiedSize;

    stats.push({
      file: file,
      type: 'HTML',
      original: originalSize,
      compressed: minifiedSize,
      savings: (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1) + '%',
    });
  }

  // 2. Minify CSS Files
  const cssCleaner = new CleanCSS({
    level: {
      1: { all: true },
      2: { restructureRules: false, mergeMedia: true },
    },
  });

  const cssFiles = ['styles.css', 'autosend.css'];
  for (const file of cssFiles) {
    const srcPath = path.join(ROOT_DIR, 'css', file);
    if (!fs.existsSync(srcPath)) continue;

    const originalContent = fs.readFileSync(srcPath, 'utf8');
    const originalSize = Buffer.byteLength(originalContent);

    const output = cssCleaner.minify(originalContent);
    const destPath = path.join(DIST_DIR, 'css', file);
    fs.writeFileSync(destPath, output.styles, 'utf8');
    const minifiedSize = Buffer.byteLength(output.styles);

    totalOriginalSize += originalSize;
    totalMinifiedSize += minifiedSize;

    stats.push({
      file: `css/${file}`,
      type: 'CSS',
      original: originalSize,
      compressed: minifiedSize,
      savings: (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1) + '%',
    });
  }

  // 3. Minify JavaScript Files
  const jsFiles = ['app.js'];
  for (const file of jsFiles) {
    const srcPath = path.join(ROOT_DIR, 'js', file);
    if (!fs.existsSync(srcPath)) continue;

    const originalContent = fs.readFileSync(srcPath, 'utf8');
    const originalSize = Buffer.byteLength(originalContent);

    const result = await minifyJs(originalContent, {
      compress: {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
      },
      mangle: true,
    });

    const destPath = path.join(DIST_DIR, 'js', file);
    fs.writeFileSync(destPath, result.code, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code);

    totalOriginalSize += originalSize;
    totalMinifiedSize += minifiedSize;

    stats.push({
      file: `js/${file}`,
      type: 'JS',
      original: originalSize,
      compressed: minifiedSize,
      savings: (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1) + '%',
    });
  }

  // 4. Compress & Optimize Assets (Images & Media)
  function getAllAssetFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllAssetFiles(fullPath, fileList);
      } else if (!file.startsWith('.')) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const assetFiles = getAllAssetFiles(path.join(ROOT_DIR, 'assets'));

  for (const file of assetFiles) {
    const relativePath = path.relative(ROOT_DIR, file);
    const destPath = path.join(DIST_DIR, relativePath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const originalSize = fs.statSync(file).size;
    const ext = path.extname(file).toLowerCase();

    try {
      if (ext === '.jpg' || ext === '.jpeg') {
        await sharp(file)
          .jpeg({ quality: 82, progressive: true, mozjpeg: true })
          .toFile(destPath);
      } else if (ext === '.png') {
        await sharp(file)
          .png({ compressionLevel: 9, quality: 85, effort: 8 })
          .toFile(destPath);
      } else {
        fs.copyFileSync(file, destPath);
      }

      const compressedSize = fs.statSync(destPath).size;
      totalOriginalSize += originalSize;
      totalMinifiedSize += compressedSize;

      const savingPct = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
      stats.push({
        file: relativePath,
        type: 'Asset (' + ext.replace('.', '').toUpperCase() + ')',
        original: originalSize,
        compressed: compressedSize,
        savings: savingPct > 0 ? savingPct + '%' : '0%',
      });
    } catch (err) {
      console.warn(`Could not compress ${file}, copying raw file:`, err.message);
      fs.copyFileSync(file, destPath);
      totalOriginalSize += originalSize;
      totalMinifiedSize += originalSize;
    }
  }

  // 5. Print Results Table
  console.log('📦 Production Build Summary:');
  console.log('-----------------------------------------------------------------------------------');
  console.log(
    'File'.padEnd(38) +
      'Type'.padEnd(16) +
      'Original'.padEnd(12) +
      'Compressed'.padEnd(14) +
      'Savings'
  );
  console.log('-----------------------------------------------------------------------------------');

  for (const s of stats) {
    console.log(
      s.file.padEnd(38) +
        s.type.padEnd(16) +
        formatBytes(s.original).padEnd(12) +
        formatBytes(s.compressed).padEnd(14) +
        s.savings
    );
  }

  console.log('-----------------------------------------------------------------------------------');
  const totalSaved = totalOriginalSize - totalMinifiedSize;
  const totalPct = (((totalOriginalSize - totalMinifiedSize) / totalOriginalSize) * 100).toFixed(1);
  console.log(
    `✨ Total Build Size: ${formatBytes(totalOriginalSize)} ➔ ${formatBytes(totalMinifiedSize)} (${totalPct}% smaller, saved ${formatBytes(totalSaved)})`
  );
  console.log(`⏱️  Build completed in ${Date.now() - startTime}ms`);
  console.log(`📁 Distribution output directory: ${DIST_DIR}\n`);
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
