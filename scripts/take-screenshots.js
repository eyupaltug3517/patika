/**
 * Patika 🐾 — Screenshot Script
 * Requires the app to be served at http://localhost:3333
 * Run: node scripts/take-screenshots.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3333';
const OUT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORT = { width: 390, height: 844 };

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function scrollTo(page, y) {
  await page.evaluate((scrollY) => {
    Array.from(document.querySelectorAll('*')).filter(el => {
      const s = window.getComputedStyle(el);
      return (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
    }).forEach(el => el.scrollTop = scrollY);
  }, y);
  await sleep(400);
}

async function navigateToTab(page, tabText) {
  // Use React Navigation's URL routing with --single SPA mode
  const routes = {
    'Anasayfa': '/',
    'Sağlık': '/Saglik',
    'Randevu': '/Randevular',
    'Ayarlar': '/Ayarlar',
    'AI': '/Asistan',
  };
  const route = routes[tabText];
  if (route) {
    await page.goto(BASE_URL + route, { waitUntil: 'networkidle2', timeout: 15000 });
    await sleep(1000);
  }
}

async function clickTabInPage(page, tabText) {
  await page.evaluate((text) => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const tab = tabs.find(t => t.textContent?.includes(text));
    if (tab) {
      const getDeepest = (el) => el.children.length === 0 ? el : getDeepest(el.children[0]);
      getDeepest(tab).click();
    }
  }, tabText);
  await sleep(800);
}

async function safeGoto(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(1500);
}

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  await page.evaluateOnNewDocument(() => {
    window.alert = (msg) => console.log('[ALERT]', msg);
    window.confirm = () => true;
  });

  // ---- 1. Dashboard top ----
  console.log('📸 1/9  Dashboard (üst)...');
  await safeGoto(page, BASE_URL + '/');
  await scrollTo(page, 0);
  await page.screenshot({ path: path.join(OUT_DIR, '01-dashboard-top.png') });

  // ---- 2. Dashboard bottom ----
  console.log('📸 2/9  Dashboard (hızlı işlemler)...');
  await scrollTo(page, 700);
  await page.screenshot({ path: path.join(OUT_DIR, '02-dashboard-quick-actions.png') });

  // ---- 3. Sağlık ----
  console.log('📸 3/9  Sağlık Günlüğü...');
  await safeGoto(page, BASE_URL + '/Saglik');
  await page.screenshot({ path: path.join(OUT_DIR, '03-saglik-gunlugu.png') });

  // ---- 4. Sağlık Kaydı Form ----
  console.log('📸 4/9  Sağlık Kaydı formu...');
  await safeGoto(page, BASE_URL + '/HealthLogEntry');
  await page.screenshot({ path: path.join(OUT_DIR, '04-saglik-kaydi-form.png') });

  // ---- 5. AI Asistan ----
  console.log('📸 5/9  AI Asistan...');
  await safeGoto(page, BASE_URL + '/Asistan');
  await page.screenshot({ path: path.join(OUT_DIR, '05-ai-asistan.png') });

  // ---- 6. Randevular ----
  console.log('📸 6/9  Randevular...');
  await safeGoto(page, BASE_URL + '/Randevular');
  await page.screenshot({ path: path.join(OUT_DIR, '06-randevular.png') });

  // ---- 7. Randevu Ekle ----
  console.log('📸 7/9  Randevu Ekle formu...');
  await safeGoto(page, BASE_URL + '/AddAppointment');
  await page.screenshot({ path: path.join(OUT_DIR, '07-randevu-ekle-form.png') });

  // ---- 8. Ayarlar ----
  console.log('📸 8/9  Ayarlar...');
  await safeGoto(page, BASE_URL + '/Ayarlar');
  await page.screenshot({ path: path.join(OUT_DIR, '08-ayarlar.png') });

  // ---- 9. Hayvan Profili ----
  console.log('📸 9/9  Hayvan Profili...');
  await safeGoto(page, BASE_URL + '/PetProfile');
  await page.screenshot({ path: path.join(OUT_DIR, '09-hayvan-profili.png') });

  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'));
  console.log(`\n✅ ${files.length} screenshot alındı → screenshots/ klasörü`);
  files.forEach(f => console.log('   📷', f));
})().catch(err => {
  console.error('❌ Hata:', err.message);
  process.exit(1);
});
