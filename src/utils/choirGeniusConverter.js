/**
 * Utility to convert ChoirGenius CSV exports to the Events JSON format
 * 
 * This script can be run with Node.js to convert a CSV export from ChoirGenius
 * to the JSON format used by the EventsList component.
 * 
 * Usage:
 * 1. Export events from ChoirGenius as CSV
 * 2. Run this script with Node.js:
 *    node choirGeniusConverter.js path/to/exported.csv path/to/output.json
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // You may need to install this: npm install uuid

// Default image paths for different chorus types
const DEFAULT_IMAGES = {
  'Harmony': '/images/harmony-event.jpg',
  'Melody': '/images/melody-event.jpg',
  'Both': '/images/parkside-event.jpg',
  'default': '/images/event-default.jpg'
};

/**
 * Parse CSV data into an array of objects
 * @param {string} csvData - The CSV data as a string
 * @returns {Array} Array of objects representing the CSV rows
 */
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    // Handle commas within quoted fields
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    values.push(currentValue.trim());
    
    // Create object from headers and values
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    return obj;
  });
}

/**
 * Determine which chorus an event belongs to based on its description or title
 * @param {Object} event - The event object
 * @returns {string} 'Harmony', 'Melody', or 'Both'
 */
function determineChorus(event) {
  const text = `${event.Title || ''} ${event.Description || ''}`.toLowerCase();
  
  const harmonyKeywords = ['men', 'harmony', 'barbershop', 'male'];
  const melodyKeywords = ['women', 'melody', 'treble', 'female'];
  
  const isHarmony = harmonyKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  const isMelody = melodyKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  
  if (isHarmony && isMelody) return 'Both';
  if (isHarmony) return 'Harmony';
  if (isMelody) return 'Melody';
  
  return 'Both'; // Default to both if unclear
}

/**
 * Convert ChoirGenius CSV data to our Events JSON format
 * @param {string} csvData - The CSV data as a string
 * @returns {Array} Array of event objects in our format
 */
function convertChoirGeniusToEvents(csvData) {
  const choirGeniusEvents = parseCSV(csvData);
  
  return choirGeniusEvents.map(event => {
    const chorus = determineChorus(event);
    
    // Format the date
    let formattedDate = event['Start Date'] || '';
    if (event['End Date'] && event['End Date'] !== event['Start Date']) {
      formattedDate = `${formattedDate} - ${event['End Date']}`;
    }
    
    return {
      id: uuidv4(),
      title: event.Title || 'Untitled Event',
      date: formattedDate,
      description: event.Description || '',
      imageUrl: DEFAULT_IMAGES[chorus] || DEFAULT_IMAGES.default,
      location: event.Location || '',
      chorus: chorus,
      url: event.URL || `/events/${event.Title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'event'}`
    };
  });
}

/**
 * Main function to convert a CSV file to JSON
 * @param {string} inputPath - Path to the input CSV file
 * @param {string} outputPath - Path to the output JSON file
 */
function convertFile(inputPath, outputPath) {
  try {
    const csvData = fs.readFileSync(inputPath, 'utf8');
    const events = convertChoirGeniusToEvents(csvData);
    
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
    console.log(`Successfully converted ${events.length} events to ${outputPath}`);
  } catch (error) {
    console.error('Error converting file:', error);
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node choirGeniusConverter.js <input-csv-path> <output-json-path>');
    process.exit(1);
  }
  
  convertFile(args[0], args[1]);
}

module.exports = {
  convertChoirGeniusToEvents,
  convertFile
}; 