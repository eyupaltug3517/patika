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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function scrollTo(page, y) {
  await page.evaluate((sy) => {
    Array.from(document.querySelectorAll('*')).filter(el => {
      const s = window.getComputedStyle(el);
      return (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
    }).forEach(el => el.scrollTop = sy);
  }, y);
  await sleep(400);
}

async function clickTab(page, tabText) {
  await page.evaluate((text) => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const tab = tabs.find(t => t.textContent?.includes(text));
    if (!tab) return;
    const getDeepest = (el) => el.children.length === 0 ? el : getDeepest(el.children[0]);
    getDeepest(tab).click();
  }, tabText);
  await sleep(1000);
}

async function clickMiddleTab(page) {
  // AI Asistan — orta (3. tab, index 2)
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const getDeepest = (el) => el.children.length === 0 ? el : getDeepest(el.children[0]);
    if (tabs[2]) getDeepest(tabs[2]).click();
  });
  await sleep(1000);
}

async function clickByExactText(page, text) {
  const found = await page.evaluate((txt) => {
    const all = Array.from(document.querySelectorAll('div, span, button'));
    const el = all.find(e => e.textContent?.trim() === txt);
    if (el) { el.click(); return true; }
    return false;
  }, text);
  await sleep(1000);
  return found;
}

async function goBack(page) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {}),
    page.goBack({ waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {}),
  ]);
  await sleep(800);
}

(async () => {
  console.log('🚀 Tarayıcı başlatılıyor...');
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=390,844', '--window-position=9999,9999'],
  });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // alert/confirm'i devre dışı bırak
  await page.evaluateOnNewDocument(() => {
    window.alert = () => {};
    window.confirm = () => true;
  });

  console.log('📱 Uygulama açılıyor...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(2000);

  // ── 1. Dashboard üst ──────────────────────────────────────────────
  console.log('📸 1/9  Dashboard (üst)');
  await scrollTo(page, 0);
  await page.screenshot({ path: path.join(OUT_DIR, '01-dashboard-top.png') });

  // ── 2. Dashboard – Hızlı İşlemler ────────────────────────────────
  console.log('📸 2/9  Dashboard (hızlı işlemler)');
  await scrollTo(page, 650);
  await page.screenshot({ path: path.join(OUT_DIR, '02-dashboard-quick-actions.png') });
  await scrollTo(page, 0);

  // ── 3. Sağlık Günlüğü ────────────────────────────────────────────
  console.log('📸 3/9  Sağlık Günlüğü');
  await clickTab(page, 'Sağlık');
  await page.screenshot({ path: path.join(OUT_DIR, '03-saglik-gunlugu.png') });

  // ── 4. Sağlık Kaydı formu ────────────────────────────────────────
  console.log('📸 4/9  Sağlık Kaydı formu');
  await clickByExactText(page, '📋 Kayıt Ekle');
  await page.screenshot({ path: path.join(OUT_DIR, '04-saglik-kaydi-form.png') });
  await goBack(page);
  await sleep(500);

  // ── 5. AI Asistan ────────────────────────────────────────────────
  console.log('📸 5/9  AI Asistan');
  await clickMiddleTab(page);
  await page.screenshot({ path: path.join(OUT_DIR, '05-ai-asistan.png') });

  // ── 6. Randevular ─────────────────────────────────────────────────
  console.log('📸 6/9  Randevular');
  await clickTab(page, 'Randevu');
  await page.screenshot({ path: path.join(OUT_DIR, '06-randevular.png') });

  // ── 7. Randevu Ekle formu ─────────────────────────────────────────
  console.log('📸 7/9  Randevu Ekle formu');
  await clickByExactText(page, '➕ Ekle');
  await page.screenshot({ path: path.join(OUT_DIR, '07-randevu-ekle-form.png') });
  await goBack(page);
  await sleep(500);

  // ── 8. Ayarlar ────────────────────────────────────────────────────
  console.log('📸 8/9  Ayarlar');
  await clickTab(page, 'Ayarlar');
  await page.screenshot({ path: path.join(OUT_DIR, '08-ayarlar.png') });

  // ── 9. Hayvan Profili ─────────────────────────────────────────────
  console.log('📸 9/9  Hayvan Profili');
  await clickTab(page, 'Anasayfa');
  await sleep(500);
  // Karamel kartına tıkla
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const karamel = all.find(el =>
      el.children.length === 0 &&
      el.textContent?.trim() === 'Karamel' &&
      el.tagName !== 'SCRIPT'
    );
    if (karamel) {
      // Üst touchable elementini bul
      let el = karamel;
      for (let i = 0; i < 8; i++) {
        if (!el.parentElement) break;
        el = el.parentElement;
        const style = window.getComputedStyle(el);
        if (style.cursor === 'pointer') { el.click(); return; }
      }
      karamel.click();
    }
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '09-hayvan-profili.png') });

  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'));
  console.log(`\n✅ ${files.length} screenshot kaydedildi → screenshots/`);
  files.forEach(f => console.log('   📷', f));
})().catch(err => {
  console.error('❌ Hata:', err.message);
  process.exit(1);
});
