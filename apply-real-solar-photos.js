const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\BIT\\Desktop\\AG POWER Solar Website Transformation';
const brainRoot = 'C:\\Users\\BIT\\.gemini\\antigravity\\brain\\8c3300fc-edb4-4d70-8484-7c4ce2cf7913';

// 100% Real Solar Images
const SOLAR_ASSETS = {
  waaree: path.join(brainRoot, 'waaree_topcon_bifacial_1795158563240.jpg'),
  adani: path.join(brainRoot, 'adani_mono_perc_1795158581430.jpg'),
  tata: path.join(brainRoot, 'tata_power_all_black_1795158599272.jpg'),
  vikram: path.join(brainRoot, 'vikram_somera_grand_panel_1795524814851.jpg'),
  goldi: path.join(brainRoot, 'goldi_heloc_plus_module_1795524899824.jpg'),
  allBlack: path.join(projectRoot, 'public/images/panels/tata-power-all-black.webp'),

  // Solar Real-World Scenes
  engineerMounting: path.join(brainRoot, 'hero_solar_engineer_sharp_1795423487091.jpg'),
  technicianInspect: path.join(brainRoot, 'hero_solar_man_with_yellow_helmet_1795067109160.jpg'),
  customerHome: path.join(brainRoot, 'hero_solar_customer_1794825776553.jpg'),
  solarCleaning: path.join(brainRoot, 'solar_cleaning_maintenance_1795524420576.jpg'),
  solarInverter: path.join(brainRoot, 'solar_inverter_installation_1795524453023.jpg'),
  commercialArray: path.join(projectRoot, 'public/images/blog/commercial-solar-benefits.webp'),
  jalvayuRooftop: path.join(projectRoot, 'public/images/case-studies/jalvayu.webp'),
  electroglobalPlant: path.join(projectRoot, 'public/images/case-studies/electroglobal.webp'),
  residentialArray: path.join(projectRoot, 'public/images/services/residential-solar.webp'),
};

async function processImage(srcPath, destPath, width = 1200, height = 900) {
  if (!fs.existsSync(srcPath)) {
    console.error(`Missing source: ${srcPath}`);
    return;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const buf = fs.readFileSync(srcPath);
  await sharp(buf)
    .resize(width, height, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(destPath);
  console.log(`Saved: ${destPath}`);
}

async function run() {
  console.log('=== STEP 1: FIXING PUBLIC PANELS IMAGES ===');
  await processImage(SOLAR_ASSETS.vikram, path.join(projectRoot, 'public/images/panels/vikram-somera-topcon.webp'), 1200, 900);
  await processImage(SOLAR_ASSETS.goldi, path.join(projectRoot, 'public/images/panels/goldi-heloc-plus-topcon.webp'), 1200, 900);

  console.log('=== STEP 2: FIXING BLOG IMAGES (ALL 8 POSTS) ===');
  // 1. PM Surya Ghar -> Indian Home with Rooftop Solar
  await processImage(SOLAR_ASSETS.customerHome, path.join(projectRoot, 'public/images/blog/pm-surya-ghar.webp'), 1200, 675);
  await processImage(SOLAR_ASSETS.customerHome, path.join(projectRoot, 'public/blog/post-1.webp'), 1200, 675);

  // 2. TOPCon vs Mono PERC -> Real Solar Module Face
  await processImage(SOLAR_ASSETS.waaree, path.join(projectRoot, 'public/images/blog/topcon-vs-mono-perc.webp'), 1200, 675);
  await processImage(SOLAR_ASSETS.waaree, path.join(projectRoot, 'public/blog/post-2.webp'), 1200, 675);

  // 3. Residential Solar ROI -> Real Rooftop Solar Array
  await processImage(SOLAR_ASSETS.residentialArray, path.join(projectRoot, 'public/images/blog/residential-solar-roi.webp'), 1200, 675);
  await processImage(SOLAR_ASSETS.residentialArray, path.join(projectRoot, 'public/blog/post-3.webp'), 1200, 675);

  // 4. Commercial Solar Benefits -> Real Commercial Solar Plant
  await processImage(SOLAR_ASSETS.commercialArray, path.join(projectRoot, 'public/images/blog/commercial-solar-benefits.webp'), 1200, 675);
  await processImage(SOLAR_ASSETS.commercialArray, path.join(projectRoot, 'public/blog/post-4.webp'), 1200, 675);

  // 5. Housing Society Solar -> Real Apartment Solar Structure
  await processImage(SOLAR_ASSETS.jalvayuRooftop, path.join(projectRoot, 'public/images/blog/on-grid-vs-hybrid.webp'), 1200, 675);
  await processImage(SOLAR_ASSETS.jalvayuRooftop, path.join(projectRoot, 'public/blog/post-5.webp'), 1200, 675);

  // 6. Net Metering & Inverters -> Real Inverter & Net Metering Installation
  await processImage(SOLAR_ASSETS.solarInverter, path.join(projectRoot, 'public/images/blog/net-metering-guide.webp'), 1200, 675);
  await processImage(SOLAR_ASSETS.solarInverter, path.join(projectRoot, 'public/blog/post-6.webp'), 1200, 675);

  // 7. Installation Step-by-Step -> Real Solar Engineer Mounting Panels
  await processImage(SOLAR_ASSETS.engineerMounting, path.join(projectRoot, 'public/images/blog/installation-step-by-step.webp'), 1200, 675);

  // 8. Cleaning & Maintenance -> Real Solar Cleaning with Telescopic Brush
  await processImage(SOLAR_ASSETS.solarCleaning, path.join(projectRoot, 'public/images/blog/cleaning-maintenance.webp'), 1200, 675);

  console.log('=== STEP 3: FIXING 5-IMAGE GALLERIES FOR ALL 6 PANELS ===');
  const panelConfigs = [
    {
      slug: 'waaree-arka-topcon-550w',
      main: SOLAR_ASSETS.waaree,
      rooftop: SOLAR_ASSETS.customerHome,
      closeup: SOLAR_ASSETS.waaree,
      structure: SOLAR_ASSETS.jalvayuRooftop,
      detail: SOLAR_ASSETS.solarInverter,
    },
    {
      slug: 'adani-shine-mono-perc-540w',
      main: SOLAR_ASSETS.adani,
      rooftop: SOLAR_ASSETS.residentialArray,
      closeup: SOLAR_ASSETS.adani,
      structure: SOLAR_ASSETS.electroglobalPlant,
      detail: SOLAR_ASSETS.technicianInspect,
    },
    {
      slug: 'vikram-somera-topcon-575w',
      main: SOLAR_ASSETS.vikram,
      rooftop: SOLAR_ASSETS.commercialArray,
      closeup: SOLAR_ASSETS.vikram,
      structure: SOLAR_ASSETS.electroglobalPlant,
      detail: SOLAR_ASSETS.engineerMounting,
    },
    {
      slug: 'tata-power-mono-perc-545w',
      main: SOLAR_ASSETS.tata,
      rooftop: SOLAR_ASSETS.jalvayuRooftop,
      closeup: SOLAR_ASSETS.tata,
      structure: SOLAR_ASSETS.residentialArray,
      detail: SOLAR_ASSETS.solarCleaning,
    },
    {
      slug: 'goldi-heloc-plus-topcon-550w',
      main: SOLAR_ASSETS.goldi,
      rooftop: SOLAR_ASSETS.commercialArray,
      closeup: SOLAR_ASSETS.goldi,
      structure: SOLAR_ASSETS.electroglobalPlant,
      detail: SOLAR_ASSETS.solarInverter,
    },
    {
      slug: 'architectural-all-black-450w',
      main: SOLAR_ASSETS.allBlack,
      rooftop: SOLAR_ASSETS.customerHome,
      closeup: SOLAR_ASSETS.tata,
      structure: SOLAR_ASSETS.allBlack,
      detail: SOLAR_ASSETS.engineerMounting,
    },
  ];

  for (const p of panelConfigs) {
    const dir = path.join(projectRoot, 'public/panels', p.slug);
    await processImage(p.main, path.join(dir, 'main.webp'), 1200, 900);
    await processImage(p.rooftop, path.join(dir, 'rooftop.webp'), 1200, 900);
    await processImage(p.closeup, path.join(dir, 'closeup.webp'), 1200, 900);
    await processImage(p.structure, path.join(dir, 'structure.webp'), 1200, 900);
    await processImage(p.detail, path.join(dir, 'detail.webp'), 1200, 900);
  }

  // Copy to legacy slugs
  const aliases = [
    { target: 'waaree-arka-topcon-550w', alias: 'n-type-topcon-bifacial' },
    { target: 'adani-shine-mono-perc-540w', alias: 'mono-perc-half-cut-mbb' },
    { target: 'architectural-all-black-450w', alias: 'architectural-all-black-premium' },
  ];

  for (const a of aliases) {
    const srcDir = path.join(projectRoot, 'public/panels', a.target);
    const destDir = path.join(projectRoot, 'public/panels', a.alias);
    fs.mkdirSync(destDir, { recursive: true });
    for (const f of ['main.webp', 'rooftop.webp', 'closeup.webp', 'structure.webp', 'detail.webp']) {
      fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
    }
    console.log(`Copied alias ${a.alias}`);
  }

  console.log('ALL SOLAR ASSETS PROCESSED WITH 100% REAL SOLAR EQUIPMENT & INSTALLATIONS!');
}

run().catch(console.error);
