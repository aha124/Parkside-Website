# Slideshow Image Instructions

## Image Requirements

For the home page slideshow, you'll need to prepare 5 images with the following specifications:

1. **Recommended Size**: 1920x1080 pixels (16:9 aspect ratio)
2. **Format**: JPG or PNG
3. **File Size**: Optimize images to be under 500KB each for better performance

## Image Naming and Placement

1. Create a folder named `slideshow` inside the `public/images` directory:
   ```
   parkside-website/public/images/slideshow/
   ```

2. Name your images according to this convention:
   - `slide1-main.jpg` - Main slide (Parkside Barbershop Harmony)
   - `slide2-donate.jpg` - Donation slide (Parkside Progression)
   - `slide3-events.jpg` - Events slide (Join Our Rehearsals)
   - `slide4-shop.jpg` - Shop slide (Parkside Gear)
   - `slide5-contact.jpg` - Contact slide (Get In Touch)

3. Place all images in the `slideshow` folder.

## Image Content Suggestions

For each slide, consider the following content suggestions:

1. **Main Slide**: A group photo of the entire chorus or a performance shot
2. **Donate Slide**: An image that represents the impact of donations or community support
3. **Events Slide**: A rehearsal or performance image that shows the joy of participation
4. **Shop Slide**: A photo featuring chorus merchandise or members wearing branded items
5. **Contact Slide**: A welcoming image that encourages communication

## Fallback Images

The slideshow component includes a fallback mechanism that will use existing images if the new slideshow images are not found:

- `slide1-main.jpg` → falls back to `/images/hero-bg.jpg`
- `slide2-donate.jpg` → falls back to `/images/harmony-bg.jpg`
- `slide3-events.jpg` → falls back to `/images/melody-bg.jpg`
- `slide4-shop.jpg` → falls back to `/images/harmony-bg.jpg`
- `slide5-contact.jpg` → falls back to `/images/melody-bg.jpg`

This ensures the slideshow will work even before you add all the custom images.

## Testing Your Images

After adding your images:

1. Start the development server:
   ```
   cd parkside-website
   npm run dev
   ```

2. Open your browser to `http://localhost:3000/home`

3. Verify that all slides display correctly and that the images transition smoothly.

## Troubleshooting

If images don't appear:
- Check that the file names match exactly (case-sensitive)
- Verify the images are in the correct folder
- Ensure the image files are not corrupted
- Check browser console for any errors

If you need to adjust the slideshow timing or other settings, you can modify the `HeroSlideshow` component in `src/components/home/HeroSlideshow.tsx`. 