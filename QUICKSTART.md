# Quick Start Guide

Get the "27 Chapters of Rain" experience running in minutes!

## 🚀 For Users (Experiencing the Website)

### Opening the Website

#### Option 1: Online (Easiest)
1. Visit the deployed website URL
2. Allow browser to access fullscreen (optional)
3. Click anywhere to start
4. Follow on-screen instructions

#### Option 2: Local (Development)

**Windows**:
```bash
# Open PowerShell in project folder
cd c:\Users\heli3\Megha
node server.js
# Visit http://localhost:8000/
```

**Mac/Linux**:
```bash
cd ~/Megha
python3 -m http.server 8000
# Visit http://localhost:8000/
```

### Navigating the Experience

#### Scene 1: Galaxy (Auto-plays)
- Just watch the magic unfold
- Lasts about 8 seconds
- Ambient music begins

#### Scene 2: Earth (Click to Interact)
- Watch Earth
- **Click the Earth** when ready
- Camera zooms in smoothly

#### Scene 3: Countryside (Click to Interact)
- See a beautiful sunset
- Hear wind sounds
- **Click the book** to open it

#### Scene 4: Reading the Book
- Use **Arrow Keys** or **Buttons** to turn pages
- **Swipe Left/Right** on mobile
- **Press Escape** or click ✕ to close book

#### Scene 5: Final Message
- Beautiful ending
- Message appears
- **Click Restart** to experience again

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **M** | Toggle Mute/Unmute |
| **F11** | Fullscreen |
| **Arrow Keys** | Turn book pages |
| **Escape** | Close book |
| **D** | Debug information (in console) |

### Mobile Tips

- Tap to interact with elements
- Swipe left/right to turn pages
- Turn device to landscape for better view
- Allow fullscreen for immersive experience
- Use Wi-Fi for smooth audio streaming

### Troubleshooting

**No Sound?**
- Check device volume is on
- Check browser volume (some browsers have per-tab volume)
- Refresh page
- Website works fine without sound too!

**Blurry Graphics?**
- Check browser zoom is at 100% (Ctrl+0)
- Fullscreen mode usually clearer
- Try different browser

**Pages Not Turning?**
- Make sure book is open
- Try keyboard arrow keys
- Try clicking buttons
- Refresh page if stuck

---

## 💻 For Developers (Setting Up)

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, etc.)
- Node.js (optional, for local server)

### Installation (5 minutes)

1. **Clone/Download Project**
   ```bash
   # Using Git
   git clone https://github.com/yourusername/megha-birthday.git
   cd megha-birthday
   
   # Or extract ZIP file
   # Navigate to folder in terminal
   ```

2. **Install Dependencies**
   ```bash
   npm install  # Only if using package.json dependencies
   ```

3. **Add Audio Files** (Optional)
   - Download audio files
   - Place in `assets/audio/`
   - Files: `ambient-music.mp3`, `wind-ambient.mp3`, `page-flip.mp3`

4. **Start Development Server**
   ```bash
   npm start
   # or
   node server.js
   # or
   python3 -m http.server 8000
   ```

5. **Open in Browser**
   ```
   http://localhost:8000/
   ```

### Project Structure Walkthrough

```
📁 Megha/
├── index.html           ← Main HTML file
├── style.css           ← All styling
├── 📁 js/             ← JavaScript modules
│   ├── main.js        ← Entry point
│   ├── config.js      ← Configuration
│   ├── scene-manager.js ← Scene orchestration
│   ├── three-scenes.js ← 3D setup
│   ├── particles.js    ← Particle effects
│   ├── animations.js   ← GSAP animations
│   ├── book-manager.js ← Book interaction
│   ├── audio-manager.js ← Sound control
│   └── book-data.js    ← 27 chapters content
├── 📁 assets/
│   ├── 📁 audio/      ← Sound files here
│   └── 📁 images/     ← Images here (optional)
├── README.md          ← Full documentation
├── DEPLOYMENT.md      ← How to deploy
├── TESTING.md         ← Testing guide
└── package.json       ← Project metadata
```

### Quick Edits

#### Change Colors

Edit `js/config.js`:

```javascript
COLORS: {
    SPACE_BG: 0x050811,      // Change space background
    NEBULA: 0x4a2f6d,        // Change nebula color
    GLOW: 0xb19cd9,          // Change glow color
    // 0x + RGB hex values
}
```

**Hex Color Reference**:
- Purple: `0x8b5a8c` or `0xb19cd9`
- Blue: `0x4a90e2` or `0x87ceeb`
- Gold: `0xd4af37` or `0xf4a460`

#### Change Timing

Edit `js/config.js`:

```javascript
TIMING: {
    PRELOADER: 3,           // Preloader duration
    GALAXY_INTRO: 8,        // Scene 1 duration
    EARTH_ZOOM: 4,          // Scene 2 duration
    // Times in seconds
}
```

#### Add Custom Text

Edit `js/book-data.js`:

```javascript
chapters: [
    {
        id: 1,
        partNumber: 1,
        title: "Custom Title",
        text: "Your custom text here...",
        audioFile: "chapter-01.mp3",
    },
    // Add or modify chapters
]
```

#### Change Font

Edit `style.css`:

```css
body {
    font-family: 'Georgia', serif;  /* Change this */
}

.book-page-title {
    font-family: 'Georgia', serif;  /* Change this */
}

.book-page-text {
    font-family: 'Brush Script MT', cursive, serif;  /* Change this */
}
```

### Common Customizations

#### 1. Change Background Music

```javascript
// In HTML, change src:
<audio id="ambient-music" preload="auto" loop>
    <source src="assets/audio/your-music.mp3" type="audio/mpeg">
</audio>
```

#### 2. Disable Sound Effects

```javascript
// In js/config.js
FEATURES: {
    ENABLE_SOUND: false,  // Disable all audio
}
```

#### 3. Reduce/Increase Particles

```javascript
// In js/config.js
PARTICLES: {
    STAR_COUNT: 400,      // Fewer stars (was 800)
    RAIN_COUNT: 75,       // Less rain (was 150)
    DUST_COUNT: 100,      // Less dust (was 200)
}
```

#### 4. Speed Up Animation

```javascript
// In js/config.js - reduce times in seconds
TIMING: {
    GALAXY_INTRO: 5,      // Was 8 (faster)
    COUNTRY_TRANSITION: 3, // Was 6 (faster)
}
```

### Testing Changes

After editing:

1. **Save file** (Ctrl+S)
2. **Refresh browser** (F5 or Cmd+R)
3. **Hard refresh** (Ctrl+Shift+R) if cache persists
4. **Check console** (F12) for errors

### Debug Console Commands

Open browser console (F12) and try:

```javascript
// View all settings
MeghaApp.getStats()

// Jump to specific scene
MeghaApp.skipToScene(3)

// Mute/unmute
MeghaApp.toggleMute()

// Change volume (0-1)
MeghaApp.setVolume(0.5)

// Jump to chapter
MeghaApp.jumpToChapter(10)

// End experience
MeghaApp.goToFinal()
```

---

## 📱 Deployment in 60 Seconds

### Using Netlify (Recommended)

1. **Create Netlify Account**
   - Go to netlify.com
   - Sign up with GitHub

2. **Deploy Site**
   - Click "New site from Git"
   - Select your GitHub repo
   - Click Deploy
   - **Done!** Your site is live

3. **Custom Domain**
   - Go to Site Settings
   - Click "Change Site Name"
   - Or add custom domain

### Using GitHub Pages

1. **Create GitHub Repo**
   ```bash
   git init
   git add .
   git commit -m "Initial"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Enable Pages**
   - GitHub > Settings > Pages
   - Source: main branch
   - Save

3. **Access**
   - `https://yourusername.github.io/megha-birthday/`

### Using Vercel

1. **Create Account**
   - vercel.com
   - Sign up

2. **Deploy**
   - Import Git repo
   - Click Deploy
   - Live in seconds!

---

## 🎨 Customization Ideas

### Easy Customizations
- [ ] Change colors to match theme
- [ ] Adjust animation speeds
- [ ] Modify chapter content
- [ ] Add custom fonts
- [ ] Change particle counts

### Medium Customizations
- [ ] Add chapter images
- [ ] Create custom audio
- [ ] Modify 3D models
- [ ] Change lighting
- [ ] Create alternate color schemes

### Advanced Customizations
- [ ] Add interactive elements
- [ ] Modify 3D scenes
- [ ] Add special effects
- [ ] Implement social sharing
- [ ] Add gallery features

---

## ❓ FAQ

**Q: Do I need audio files?**
A: No! The website works perfectly without audio. Audio enhances the experience but isn't required.

**Q: Can I add more chapters?**
A: Yes! Edit `js/book-data.js` and add new chapters. Also update total chapters count in `config.js`.

**Q: How do I change the names?**
A: All names are in `js/book-data.js`. Update as needed!

**Q: Can I use this on my domain?**
A: Yes! Netlify, Vercel, or any hosting will work. See DEPLOYMENT.md for full instructions.

**Q: What if I don't have Node.js?**
A: Use Python instead: `python3 -m http.server 8000`

**Q: Is it mobile friendly?**
A: Yes! Fully responsive from 320px to 4K screens.

**Q: Can I share a link?**
A: Yes! Once deployed, share the URL with anyone.

---

## 🆘 Getting Help

### Documentation
- **README.md** - Complete reference
- **DEPLOYMENT.md** - Deployment guide
- **TESTING.md** - Testing & debugging
- **This file** - Quick start

### Debug Commands
```javascript
// Open console (F12) and run:
MeghaApp.getStats()  // View all info
```

### Common Solutions

| Problem | Solution |
|---------|----------|
| Blank page | Hard refresh (Ctrl+Shift+R) |
| No audio | Check `assets/audio/` folder |
| Slow performance | Reduce particles in config |
| Text isn't updating | Hard refresh, check syntax |
| Mobile issues | Test in Chrome DevTools mobile |

---

## 🎉 You're Ready!

Congratulations! You now have a fully functional cinematic 3D birthday experience.

**Next Steps**:
1. Add audio files (optional)
2. Customize chapter content
3. Test on different devices
4. Deploy to production
5. Share with Megha! 🎊

---

**Enjoy creating magic!** ✨

For detailed information, see:
- [README.md](README.md) - Full documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - How to deploy
- [TESTING.md](TESTING.md) - Testing & debugging
