# Image Assets Guide

This directory is for images that can be optionally added to enhance the experience.

## Current Implementation

The website currently uses **procedurally generated 3D textures** created with HTML5 Canvas, so external image files are not required for the website to work fully.

Each book page has a placeholder image area that displays:
- Gradient backgrounds
- Emotionally-appropriate colors
- Dashed borders indicating where images could go

## Optional Image Additions

### Chapter Cover Images

You can add custom images for each chapter:

**Dimensions**: 
- Web: 800px × 400px (or aspect ratio 2:1)
- Mobile: 400px × 200px
- Format: JPG or WebP (optimized)

**Suggested Content** (by chapter):

**Part I: Childhood**
1. Monsoon rain falling on earth
2. Newborn baby's hand
3. Child walking through fields
4. Child speaking/learning
5. Children playing
6. School ribbons/books
7. Two best friends together
8. Child looking at stars

**Part II: Teen Years**
9. Butterfly or bird wings
10. Silhouette in darkness
11. Complicated maze or pattern
12. Art palette and brushes
13. Person looking at night sky
14. Mountain or strong landscape
15. Protective embrace
16. Rising sun or dawn

**Part III: Adulthood**
17. Microphone or speech bubble
18. Office or workspace
19. Mirror reflection
20. Woman portrait
21. Sky and rainclouds meeting
22. Constellation stars
23. Peaceful water reflection
24. Future/horizon landscape
25. Healing hands or light
26. Number 27 artistic
27. Rain and sky combined

## How to Add Images

### Option 1: Use Stock Photos

Popular sites:
- **Unsplash** (unsplash.com) - High quality, free
- **Pexels** (pexels.com) - Diverse selection
- **Pixabay** (pixabay.com) - Large collection
- **Shutterstock** (shutterstock.com) - Professional
- **iStock** (istockphoto.com) - Curated
- **Adobe Stock** (stock.adobe.com) - Premium

### Option 2: Create Custom Images

- **Photography**: Take custom photos
- **Digital Art**: Create illustrations in Photoshop/Procreate
- **Design Software**: Use Canva or Figma
- **AI Tools**: Try Midjourney, DALL-E, or Stable Diffusion

### Option 3: Generate Procedurally

Current code already creates nice gradient backgrounds. You can enhance by:
- Adding textures programmatically
- Using Canvas for custom graphics
- Blending multiple gradients

## Implementation

To add images to chapters:

### Step 1: Prepare Images
```
Place images in: assets/images/
Names: chapter-01.jpg, chapter-02.jpg, etc.
OR: part1-childhood-01.jpg, etc.
```

### Step 2: Update Book Manager

Edit `js/book-manager.js`, in the `createChapterPages()` method:

**Current code**:
```html
<div class="book-page-image">
    <span style="color: #8b7355; font-size: 14px;">
        [Image: Chapter ${chapter.id}]
    </span>
</div>
```

**With images**:
```html
<div class="book-page-image" style="
    background-image: url('assets/images/chapter-${String(chapter.id).padStart(2, '0')}.jpg');
    background-size: cover;
    background-position: center;
    border-image: none;
">
</div>
```

### Step 3: Update CSS (Optional)

Add to `style.css`:

```css
.book-page-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.3s ease;
}

.book-page-image:hover {
    transform: scale(1.02);
}
```

## Image Optimization

**File Sizes** (Target):
- Desktop images: 100-300 KB
- Mobile images: 50-150 KB
- Total images size: Under 10 MB

**Tools for Optimization**:
- **TinyPNG** (tinypng.com) - Compress PNG/JPG
- **ImageOptim** (imageoptim.com) - Batch optimization
- **Squoosh** (squoosh.app) - Google's tool
- **FFmpeg** - Convert to WebP

**Format Recommendations**:
1. **WebP** - Best compression (if not supporting older browsers)
2. **JPG** - Good balance, widely supported
3. **PNG** - For images with transparency
4. **AVIF** - Newest, best compression (limited support)

## Color Palette for Images

To maintain aesthetic consistency, use these colors:

- **Primary**: #2d1b4e (Deep purple)
- **Secondary**: #4a2f6d (Lighter purple)
- **Accent**: #b19cd9 (Glow purple)
- **Gold**: #d4af37 (Warm gold)
- **Sky Blue**: #87ceeb (Light blue)
- **Gold**: #f4a460 (Sandy orange)
- **Paper**: #f5f1e8 (Warm white)

## Advanced: Animated Images

You can use animated GIFs or WebP for dynamic imagery:

```javascript
// Example: Use GIF for rain animation
<div class="book-page-image" style="
    background-image: url('assets/images/chapter-animated.gif');
    animation: fadeIn 0.5s ease;
">
</div>
```

## Responsive Images

The CSS already handles responsive images:

```css
.book-page-image {
    width: 100%;
    height: 200px;
    background-size: cover;
    /* Mobile: auto-adjusts */
}

@media (max-width: 768px) {
    .book-page-image {
        height: 150px;
    }
}
```

## Without Images

The website **works perfectly well without images**:
- Gradient backgrounds are beautiful
- Text is clear and readable
- Imagination can fill in visuals
- Reduces file size significantly
- Faster load times

Current implementation is production-ready without images!

---

**Tip**: A well-written story with beautiful typography can be more powerful than images. Consider keeping minimalist text-only design for a more literary feel.
