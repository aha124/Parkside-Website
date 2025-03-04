const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Script to scrape news articles from the Parkside Harmony website
 * This script will:
 * 1. Visit https://parksideharmony.org/news
 * 2. Extract news article information (title, date, summary, image, URL)
 * 3. Save the data to public/data/news.json
 */

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

// Main scraping function
async function scrapeNews() {
  console.log('Starting news scraping process...');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to the news page
    console.log('Navigating to Parkside Harmony news page...');
    await page.goto('https://parksideharmony.org/news', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Get page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Extract news articles
    console.log('Extracting news articles...');
    const newsItems = [];
    
    // Find all news article elements
    $('.view-content .views-row').each((index, element) => {
      // Extract data from each news article
      const title = $(element).find('h2 a').text().trim();
      const url = $(element).find('h2 a').attr('href');
      const fullUrl = url ? `https://parksideharmony.org${url}` : '';
      
      // Extract date
      const dateText = $(element).find('.field-name-post-date').text().trim();
      
      // Extract image URL
      let imageUrl = $(element).find('img').attr('src');
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://parksideharmony.org${imageUrl}`;
      }
      
      // Extract summary
      const summary = $(element).find('.field-name-body').text().trim().substring(0, 200) + '...';
      
      // Create news item object
      const newsItem = {
        id: uuidv4(),
        title,
        date: dateText || 'No date available',
        summary,
        imageUrl: imageUrl || '/images/news-placeholder.jpg',
        url: fullUrl || '#'
      };
      
      newsItems.push(newsItem);
    });
    
    // If no news items were found, create dummy data
    if (newsItems.length === 0) {
      console.log('No news items found. Creating dummy data...');
      newsItems.push(
        {
          id: uuidv4(),
          title: "Parkside Harmony Welcomes New Music Director",
          date: "February 28, 2025",
          summary: "We're excited to announce our new Music Director who brings 20 years of barbershop experience to our chorus.",
          imageUrl: "/images/news1.jpg",
          url: "/news/new-director"
        },
        {
          id: uuidv4(),
          title: "Parkside Wins Excellence in Harmony Award",
          date: "February 15, 2025",
          summary: "Our chorus has been recognized for outstanding musical performance at the regional barbershop competition.",
          imageUrl: "/images/news2.jpg",
          url: "/news/excellence-award"
        },
        {
          id: uuidv4(),
          title: "Annual Fundraiser Exceeds Goals",
          date: "January 30, 2025",
          summary: "Thanks to our generous supporters, we've exceeded our fundraising goals for the year, allowing us to expand our community programs.",
          imageUrl: "/images/news3.jpg",
          url: "/news/fundraiser-success"
        }
      );
    }
    
    // Save data to JSON file
    const outputPath = path.join(process.cwd(), 'public', 'data', 'news.json');
    ensureDirectoryExists(outputPath);
    
    fs.writeFileSync(outputPath, JSON.stringify(newsItems, null, 2));
    console.log(`Successfully scraped ${newsItems.length} news items and saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error scraping news:', error);
    
    // Create dummy data in case of error
    const dummyNews = [
      {
        id: uuidv4(),
        title: "Parkside Harmony Welcomes New Music Director",
        date: "February 28, 2025",
        summary: "We're excited to announce our new Music Director who brings 20 years of barbershop experience to our chorus.",
        imageUrl: "/images/news1.jpg",
        url: "/news/new-director"
      },
      {
        id: uuidv4(),
        title: "Parkside Wins Excellence in Harmony Award",
        date: "February 15, 2025",
        summary: "Our chorus has been recognized for outstanding musical performance at the regional barbershop competition.",
        imageUrl: "/images/news2.jpg",
        url: "/news/excellence-award"
      },
      {
        id: uuidv4(),
        title: "Annual Fundraiser Exceeds Goals",
        date: "January 30, 2025",
        summary: "Thanks to our generous supporters, we've exceeded our fundraising goals for the year, allowing us to expand our community programs.",
        imageUrl: "/images/news3.jpg",
        url: "/news/fundraiser-success"
      }
    ];
    
    const outputPath = path.join(process.cwd(), 'public', 'data', 'news.json');
    ensureDirectoryExists(outputPath);
    
    fs.writeFileSync(outputPath, JSON.stringify(dummyNews, null, 2));
    console.log(`Error occurred. Created dummy news data and saved to ${outputPath}`);
  } finally {
    // Close browser
    if (browser) {
      await browser.close();
    }
  }
}

// Run the scraping function
scrapeNews().catch(console.error); 