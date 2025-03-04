const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');
const { v4: uuidv4 } = require('uuid');

/**
 * Script to fetch news articles from the Parkside Harmony website
 * This script will:
 * 1. Fetch HTML from https://parksideharmony.org/news
 * 2. Parse the HTML to extract news article information (title, date, summary, image URL, and link URL)
 * 3. Save the data to public/data/news.json
 * 
 * This script is used by the GitHub Actions workflow to automatically update the news data.
 * It replaces the previous scrapeNewsPage.js script with a more efficient implementation.
 */

// URL of the Parkside Harmony news page
const NEWS_URL = 'https://parksideharmony.org/news';
const OUTPUT_PATH = path.join(__dirname, '../public/data/news.json');

// Function to fetch HTML content from a URL
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to parse news items from HTML
function parseNewsItems(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Find all news items on the page
  const newsItems = Array.from(document.querySelectorAll('.view-content .views-row'));
  
  return newsItems.map(item => {
    // Extract the title and URL
    const titleElement = item.querySelector('.views-field-title a');
    const title = titleElement ? titleElement.textContent.trim() : 'Untitled News';
    const relativeUrl = titleElement ? titleElement.getAttribute('href') : '';
    const url = relativeUrl; // Keep the relative URL format (/node/XXXX)
    
    // Extract the date
    const dateElement = item.querySelector('.views-field-created .field-content');
    const date = dateElement ? dateElement.textContent.trim() : '';
    
    // Extract the image URL
    const imageElement = item.querySelector('img');
    const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
    
    // Extract the summary
    const summaryElement = item.querySelector('.views-field-body .field-content');
    const summary = summaryElement ? summaryElement.textContent.trim() : '';
    
    return {
      id: uuidv4(),
      title,
      date,
      summary,
      imageUrl,
      url
    };
  });
}

// Main function to fetch and save news
async function fetchAndSaveNews() {
  try {
    console.log('Fetching news from Parkside Harmony website...');
    const html = await fetchHtml(NEWS_URL);
    
    console.log('Parsing news items...');
    const newsItems = parseNewsItems(html);
    
    console.log(`Found ${newsItems.length} news items`);
    
    // Ensure the directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save to JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(newsItems, null, 2));
    
    console.log(`News data saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Run the script
fetchAndSaveNews(); 