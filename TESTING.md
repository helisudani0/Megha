# Testing & Debugging Guide

Complete guide for testing and debugging the "27 Chapters of Rain" experience.

## Testing Checklist

### Browser Compatibility Testing

#### Desktop Browsers
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

#### Mobile Browsers
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Firefox Android
- [ ] Samsung Internet

### Functionality Testing

#### Scene 1: Galaxy Intro
- [ ] Preloader animates smoothly
- [ ] Stars render and twinkle
- [ ] Nebula colors are visible
- [ ] Text fades in properly
- [ ] Raindrop animation plays
- [ ] Camera drifts through space
- [ ] Transition to Scene 2 smooth

#### Scene 2: Earth Zoom
- [ ] Earth displays with texture
- [ ] Earth rotates smoothly
- [ ] Click detection works
- [ ] Camera zooms to Earth
- [ ] Atmosphere glow renders

#### Scene 3: Countryside
- [ ] Sunset sky displays
- [ ] House renders properly
- [ ] Book glows and animates
- [ ] Click detection works
- [ ] Wind sound plays
- [ ] Dust particles visible

#### Scene 4: Book
- [ ] Cover page displays
- [ ] Pages flip with animation
- [ ] Navigation buttons work
- [ ] Keyboard navigation works
- [ ] Touch/swipe works (mobile)
- [ ] Page counter updates
- [ ] Chapter info displays
- [ ] Close button works
- [ ] Page numbers glow

#### Scene 5: Final
- [ ] Fade to black works
- [ ] Final message displays
- [ ] Text glows properly
- [ ] Restart button appears

### Audio Testing

- [ ] Ambient music plays on start
- [ ] Mute button works
- [ ] Volume slider works (if added)
- [ ] Page flip sound plays
- [ ] Wind sound plays in Scene 3
- [ ] No audio errors in console
- [ ] Audio syncs with animation

### Performance Testing

- [ ] FPS stable at 60 (or consistent)
- [ ] No stuttering or jank
- [ ] Smooth animations
- [ ] Quick load time (<5 seconds)
- [ ] Low memory usage
- [ ] No console errors
- [ ] CPU usage reasonable

### Responsive Testing

- [ ] Works on screens 320px-3840px wide
- [ ] Touch targets are large enough (mobile)
- [ ] Text is readable at all sizes
- [ ] Layout adapts properly
- [ ] No horizontal scrolling
- [ ] Book pages readable on mobile

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Color contrast sufficient
- [ ] No flashing (photosensitive safety)
- [ ] Readable font sizes
- [ ] Alt text for important elements
- [ ] Focus indicators visible

---

## Debugging Guide

### Enable Debug Console

Open browser developer console:
- **Chrome/Edge**: F12 or Ctrl+Shift+J
- **Firefox**: F12 or Ctrl+Shift+K
- **Safari**: Cmd+Option+I

### Debug API Commands

```javascript
// View current application stats
MeghaApp.getStats()

// Skip to specific scene (1-4)
MeghaApp.skipToScene(2)

// Get current scene name
MeghaApp.getCurrentScene()

// Control audio
MeghaApp.toggleMute()
MeghaApp.setVolume(0.5)  // 0 = mute, 1 = max

// Jump to specific chapter (1-27)
MeghaApp.jumpToChapter(5)

// Force final scene
MeghaApp.goToFinal()

// Pause experience
MeghaApp.pauseExperience()

// Resume experience
MeghaApp.resumeExperience()

// Reload page
MeghaApp.reload()
```

### Common Issues & Solutions

#### Issue: Blank White Screen

**Diagnosis**:
```javascript
// Check for JavaScript errors
console.error()  // Look for errors

// Check if Three.js loaded
console.log(window.THREE)  // Should show THREE object

// Check if GSAP loaded
console.log(window.gsap)  // Should show GSAP object
```

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check console for specific errors
3. Verify CDN links in HTML:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
   ```
4. Try different browser
5. Check internet connection

#### Issue: Audio Not Playing

**Diagnosis**:
```javascript
// Check if audio elements exist
console.log(document.getElementById('ambient-music'))

// Check if audio can play
const audio = document.getElementById('ambient-music');
console.log(audio.canPlayType('audio/mpeg'))  // Should return "maybe" or "probably"

// Check audio file path
console.log(audio.src)
```

**Solutions**:
1. Verify audio files exist: `assets/audio/ambient-music.mp3`
2. Check file format is MP3 (not WAV, OGG)
3. Use Chrome DevTools Network tab to see if files load
4. Check audio context isn't suspended (user interaction required)
5. Test with: `document.querySelector('audio').play()`

#### Issue: Low Performance / Laggy

**Diagnosis**:
```javascript
// Open Chrome DevTools Performance tab
// Record 5-10 seconds of activity
// Check for long tasks (>50ms)

// Check frame rate
// Press Escape in DevTools → Open More Tools → Rendering
// Check "Paint flashing" and "FPS meter"

// Check particle count
console.log(particleSystem.particles)
```

**Solutions**:
1. Reduce particle count in config.js:
   ```javascript
   PARTICLES: {
       STAR_COUNT: 400,  // Reduce from 800
       RAIN_COUNT: 75,   // Reduce from 150
       DUST_COUNT: 100,  // Reduce from 200
   }
   ```
2. Disable features not needed:
   ```javascript
   FEATURES: {
       ENABLE_PARTICLES: false,  // Disable particles
       ENABLE_FOG: false,        // Disable fog
   }
   ```
3. Check browser hardware acceleration is on
4. Use Chrome instead of Firefox (usually faster WebGL)
5. Close other browser tabs/apps

#### Issue: Book Pages Not Showing

**Diagnosis**:
```javascript
// Check if book data loaded
console.log(BOOK_DATA)

// Check if book manager initialized
console.log(bookManager)

// Check book pages in DOM
console.log(document.querySelectorAll('.book-page').length)
```

**Solutions**:
1. Verify `book-data.js` is loaded before `book-manager.js`
2. Check HTML script tags order
3. Clear browser cache
4. Check console for syntax errors
5. Reload page

#### Issue: Camera Not Zooming

**Diagnosis**:
```javascript
// Check camera position
console.log(threeScenesManager.camera.position)

// Check if camera updates (should increment z value)
setInterval(() => {
    console.log(threeScenesManager.camera.position.z)
}, 500)

// Check GSAP timeline
console.log(threeScenesManager.camera.position)
```

**Solutions**:
1. Verify animations.js loaded correctly
2. Check GSAP is available: `console.log(gsap)`
3. Check browser supports requestAnimationFrame
4. Test in Chrome first (easiest to debug)

#### Issue: Particles Not Rendering

**Diagnosis**:
```javascript
// Check if particles enabled
console.log(CONFIG.FEATURES.ENABLE_PARTICLES)

// Check particle count
console.log(particleSystem.particles)

// Check scene has particle group
console.log(threeScenesManager.scenes.galaxy.scene.children)
```

**Solutions**:
1. Enable particles: `CONFIG.FEATURES.ENABLE_PARTICLES = true`
2. Increase particle count in config
3. Check WebGL supports geometry
4. Verify material is correct

#### Issue: Mobile Touch Not Working

**Diagnosis**:
```javascript
// Check touch event listeners attached
document.addEventListener('touchstart', (e) => {
    console.log('Touch detected:', e)
})

// Check button is clickable
const btn = document.getElementById('next-page')
console.log(btn.onclick || btn.addEventListener)
```

**Solutions**:
1. Ensure buttons have `pointer-events: auto`
2. Check CSS doesn't hide buttons
3. Use `touch-action: manipulation` in CSS
4. Test on actual device (desktop Chrome emulation differs)
5. Verify viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

### Performance Profiling

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with site for 10 seconds
5. Click Stop
6. Analysis:
   - Look for red bars (dropped frames)
   - Check "Main" thread usage
   - Identify long tasks

**Firefox DevTools**:
1. Open Tools → Browser Tools → Web Developer
2. Performance tab
3. Click Start Recording
4. Interact for 10 seconds
5. Analyze frame rate and memory

### Memory Leaks

**Check for memory leaks**:
```javascript
// Open DevTools → Memory tab
// Take heap snapshot
// Compare before/after interaction
// Look for objects that don't get garbage collected

// In console:
performance.memory.usedJSHeapSize  // Current memory
performance.memory.jsHeapSizeLimit  // Memory limit
```

### Network Performance

**Check network**:
1. Open DevTools → Network tab
2. Reload page
3. Sort by size (largest files first)
4. Look for:
   - Slow-loading files (>2s)
   - Large files (>1MB)
   - Failed requests (red)

**Solutions**:
1. Compress images
2. Use CDN for Three.js/GSAP
3. Enable gzip compression on server
4. Defer non-critical JS

---

## Testing on Different Devices

### iPhone Testing

```bash
# Run on local network
npm start

# Access from iPhone:
# http://YOUR_LAPTOP_IP:8000
```

### Android Testing

1. Enable USB Debugging on phone
2. Connect to computer
3. `chrome://inspect` in Chrome
4. Click "inspect" on device URL
5. Test in real time

### Screen Sizes to Test

- 320×568 (iPhone SE)
- 375×667 (iPhone 8)
- 414×896 (iPhone 11 Pro Max)
- 768×1024 (iPad)
- 1024×768 (Tablet landscape)
- 1366×768 (Laptop)
- 1920×1080 (Desktop)
- 2560×1440 (4K monitor)

---

## Performance Benchmarks

Target metrics:

| Metric | Target | Actual |
|--------|--------|--------|
| First Load | <3s | __ |
| Time to Interactive | <5s | __ |
| Frame Rate | 60 FPS | __ |
| Memory Usage | <100MB | __ |
| Audio Latency | <100ms | __ |
| Click Response | <100ms | __ |

---

## Logging & Debugging

### Add Console Logging

```javascript
// In js/main.js
function logDebug(category, message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${category}] ${message}`, data || '');
}

// Usage:
logDebug('SCENE', 'Galaxy intro started');
logDebug('PARTICLES', 'Rain particles created', { count: 150 });
```

### Create Debug Panel (Optional)

```javascript
// Add floating debug info
const debugPanel = document.createElement('div');
debugPanel.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #0f0;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    max-width: 300px;
    border-radius: 4px;
`;

function updateDebugPanel() {
    debugPanel.innerHTML = `
        Scene: ${MeghaApp.getCurrentScene()}<br>
        FPS: ${~~(1000/16)}<br>
        Memory: ${(performance.memory?.usedJSHeapSize / 1048576).toFixed(1)}MB
    `;
}

document.body.appendChild(debugPanel);
setInterval(updateDebugPanel, 100);
```

---

## Reporting Issues

When reporting bugs, include:

1. **Browser & OS**
   - Chrome 120 on Windows 10
   - Safari on iOS 17.2

2. **Description**
   - What happened
   - What should have happened

3. **Steps to Reproduce**
   - 1. Open website
   - 2. Click Earth
   - 3. Error occurs

4. **Console Output**
   - Copy error message
   - Include stack trace

5. **Screenshot/Video**
   - Visual proof of issue

---

**Debug wisely, test thoroughly, enjoy the experience!**
