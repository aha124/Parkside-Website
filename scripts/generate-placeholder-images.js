const fs = require('fs');
const path = require('path');

// Create the images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create a simple HTML file with placeholder image information
function createPlaceholderImage(filename, width, height, text) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${text}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100vh;
      background-color: #${Math.floor(Math.random()*16777215).toString(16)};
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    .container {
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${text}</h1>
    <p>${width}x${height}</p>
    <p>Replace with actual image</p>
  </div>
</body>
</html>
  `;

  const filePath = path.join(imagesDir, filename);
  fs.writeFileSync(filePath, htmlContent);
  console.log(`Created placeholder: ${filename}`);
}

// Generate placeholder images
const placeholders = [
  { filename: 'harmony-bg.jpg', width: 1200, height: 800, text: 'Parkside Harmony Background' },
  { filename: 'melody-bg.jpg', width: 1200, height: 800, text: 'Parkside Melody Background' },
  { filename: 'parkside-logo.png', width: 200, height: 200, text: 'Parkside Logo' },
  { filename: 'hero-bg.jpg', width: 1920, height: 1080, text: 'Hero Background' },
  { filename: 'event1.jpg', width: 600, height: 400, text: 'Community Gathering' },
  { filename: 'event2.jpg', width: 600, height: 400, text: 'Music Festival' },
  { filename: 'event3.jpg', width: 600, height: 400, text: 'Volunteer Day' },
  { filename: 'news1.jpg', width: 800, height: 600, text: 'New Community Center' },
  { filename: 'news2.jpg', width: 800, height: 600, text: 'Parkside Award' },
];

placeholders.forEach(({ filename, width, height, text }) => {
  createPlaceholderImage(filename, width, height, text);
});

console.log('All placeholder images created successfully!');
console.log('Note: These are HTML files with .jpg/.png extensions. Replace them with actual images for production.'); 