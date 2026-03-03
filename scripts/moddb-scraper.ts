import puppeteer from 'puppeteer';

async function scrapeModDB() {
  const url = 'https://www.moddb.com/mods?sort=visitstotal-desc';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a realistic user agent and other headers if needed
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
  });

  try {
    console.log('🌐 Navigating to ModDB...');
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.table');
    await page.waitForSelector('.row');

    // Extract data
    const mods = await page.evaluate(() => {
      const modElements = Array.from(document.querySelectorAll('.row'));
      return modElements.map((el) => ({
        title: el.querySelector('.content h4 a')?.textContent?.trim() ?? '',
        content: el.querySelector('.content p')?.textContent?.trim() ?? '',
        releaseDate:
          el.querySelector('.subheading time')?.getAttribute('datetime') ?? '',
        imageUrl: el.querySelector('.image img')?.getAttribute('src') ?? '',
      }));
    });

    console.log('📝 Scraped mods:', mods.slice(0, 5)); // Show first 5 as a sample
    await browser.close();
    return mods;
  } catch (error) {
    console.error('❌ Error scraping ModDB:', error);
    await browser.close();
  }
}

scrapeModDB();
