import { NextResponse } from 'next/server';
import { chromium, Browser, BrowserContext } from 'playwright';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  url: string;
}

const STORE_URL = 'https://etownsportinggoods.chipply.com/ParksideHarmony/';

let browser: Browser | null = null;
let context: BrowserContext | null = null;

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ]
    });
  }
  return browser;
}

async function getContext() {
  if (!context) {
    const browser = await getBrowser();
    context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    });
  }
  return context;
}

async function scrapeProducts(): Promise<Product[]> {
  try {
    console.log('Getting browser context...');
    const context = await getContext();
    
    console.log('Creating new page...');
    const page = await context.newPage();

    console.log('Navigating to store:', STORE_URL);
    await page.goto(STORE_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for the content to load
    await page.waitForSelector('body', { timeout: 5000 });

    // Log page info for debugging
    const title = await page.title();
    console.log('Page title:', title);

    // Take a screenshot for debugging in development
    if (process.env.NODE_ENV === 'development') {
      await page.screenshot({ path: 'public/debug-store.png' });
    }

    // Extract products
    console.log('Extracting products...');
    const products = await page.evaluate(() => {
      const items: Array<{
        name?: string;
        price?: string;
        image?: string;
        url?: string;
      }> = [];
      
      // Common selectors for product elements
      const productSelectors = [
        '.product-item',
        '.item',
        '.store-item',
        '[data-product]',
        'tr:has(img)',
        'div:has(img):has(.price)',
        '.catalog-entry',
        '.product',
        '.product-container',
        '[class*="product"]',
        '[id*="product"]'
      ];

      // Try each selector
      for (const selector of productSelectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
        
        if (elements.length > 0) {
          elements.forEach((element: Element) => {
            // Try multiple approaches to find product info
            const name = 
              (element.querySelector('h1, h2, h3, h4, .name, .title, [class*="name"], [class*="title"]') as HTMLElement)?.textContent?.trim() ||
              (element.querySelector('[data-name]') as HTMLElement)?.textContent?.trim() ||
              (element.querySelector('td:first-child') as HTMLElement)?.textContent?.trim();

            const price = 
              (element.querySelector('.price, [data-price], [class*="price"]') as HTMLElement)?.textContent?.trim() ||
              Array.from(element.querySelectorAll('*'))
                .find(el => (el as HTMLElement).textContent?.includes('$'))
                ?.textContent?.trim();

            const imgElement = element.querySelector('img') as HTMLImageElement | null;
            const image = imgElement?.src || imgElement?.dataset.src;

            const linkElement = element.tagName.toLowerCase() === 'a' 
              ? (element as HTMLAnchorElement)
              : element.querySelector('a') as HTMLAnchorElement | null;
            const url = linkElement?.href;

            if (name || price || image) {
              items.push({ 
                name: name || undefined,
                price: price || undefined,
                image: image || undefined,
                url: url || undefined
              });
            }
          });

          if (items.length > 0) break; // Stop if we found products
        }
      }

      return items;
    });

    console.log(`Found ${products.length} products`);

    // Process and validate the products
    const validProducts = products
      .filter(product => product.name && (product.price || product.image))
      .map((product, index) => ({
        id: String(index + 1),
        name: product.name || 'Unknown Product',
        price: product.price || 'Price not available',
        image: product.image || '/images/merchandise/placeholder.jpg',
        url: product.url || STORE_URL
      }));

    if (validProducts.length === 0) {
      // Check if we're on a login page or error page
      const pageText = await page.textContent('body');
      
      if (pageText?.toLowerCase().includes('login') || pageText?.toLowerCase().includes('sign in')) {
        throw new Error('Store requires authentication');
      } else if (pageText?.toLowerCase().includes('error') || pageText?.toLowerCase().includes('not found')) {
        throw new Error('Store returned an error page');
      } else {
        // Log the entire HTML for debugging
        const html = await page.content();
        console.log('Page HTML:', html);
        throw new Error('No products found - store may be empty or structure changed');
      }
    }

    await page.close();
    return validProducts;
  } catch (error) {
    console.error('Error scraping products:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const products = await scrapeProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in merchandise API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

// Cleanup function
export async function cleanup() {
  if (context) {
    await context.close();
    context = null;
  }
  if (browser) {
    await browser.close();
    browser = null;
  }
} 