const fs = require('fs');
const path = require('path');

/**
 * Script to copy existing placeholder images to create additional news images
 * This is a temporary solution until real images are available
 */

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

// Main function
async function generateNewsImages() {
  console.log('Generating news placeholder images...');
  
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    // Check if news1.jpg exists
    const news1Path = path.join(imagesDir, 'news1.jpg');
    if (!fs.existsSync(news1Path)) {
      console.error('Source image news1.jpg not found!');
      return;
    }
    
    // Read the source image
    const sourceImage = fs.readFileSync(news1Path);
    
    // Create news3.jpg, news4.jpg, and news5.jpg if they don't exist
    for (let i = 3; i <= 5; i++) {
      const targetPath = path.join(imagesDir, `news${i}.jpg`);
      
      if (!fs.existsSync(targetPath)) {
        console.log(`Creating ${targetPath}...`);
        fs.writeFileSync(targetPath, sourceImage);
      } else {
        console.log(`${targetPath} already exists.`);
      }
    }
    
    console.log('News placeholder images generated successfully!');
  } catch (error) {
    console.error('Error generating news placeholder images:', error);
  }
}

// Run the function
generateNewsImages().catch(console.error); 