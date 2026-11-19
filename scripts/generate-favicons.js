const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const svgPath = path.resolve('src/app/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Generating 512x512 favicon.png, src/app/icon.png & android-chrome-512x512.png...');
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync('public/favicon.png', png512);
  fs.writeFileSync('src/app/icon.png', png512);
  fs.writeFileSync('public/android-chrome-512x512.png', png512);

  console.log('Generating 192x192 android-chrome-192x192.png...');
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync('public/android-chrome-192x192.png', png192);

  console.log('Generating 180x180 apple-touch-icon.png & src/app/apple-icon.png...');
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync('public/apple-touch-icon.png', png180);
  fs.writeFileSync('src/app/apple-icon.png', png180);

  console.log('Generating 32x32 favicon-32x32.png and favicon.ico...');
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync('public/favicon-32x32.png', png32);
  fs.writeFileSync('public/favicon.ico', png32);

  console.log('Generating 16x16 favicon-16x16.png...');
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync('public/favicon-16x16.png', png16);

  console.log('All favicon assets successfully generated!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
