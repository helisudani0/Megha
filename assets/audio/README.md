# Audio Files Setup Guide

This directory contains audio files needed for the 27 Chapters of Rain experience.

## Required Audio Files

### 1. Ambient Background Music
- **File**: `ambient-music.mp3`
- **Duration**: 2-3 minutes (will loop)
- **Style**: Cinematic, ethereal instrumental
- **Mood**: Magical, emotional, romantic
- **Suggested**: Piano, strings, synthesizer blend
- **Volume**: Normalized to -3dB

**Recommended Sources**:
- Epidemic Sound
- Artlist.io
- YouTube Audio Library
- Pixabay Music
- Free Music Archive

### 2. Wind Ambient Sound
- **File**: `wind-ambient.mp3`
- **Duration**: 1-2 minutes (will loop)
- **Style**: Gentle wind, countryside atmosphere
- **Mood**: Peaceful, nostalgic
- **Volume**: Normalized to -6dB

### 3. Page Flip Sound Effect
- **File**: `page-flip.mp3`
- **Duration**: 0.3-0.5 seconds
- **Style**: Soft paper flip sound
- **Mood**: Subtle, non-intrusive
- **Volume**: Normalized to -12dB

### 4. Chapter Audio (Optional)
- **Files**: `chapter-01.mp3` through `chapter-27.mp3`
- **Duration**: 30-60 seconds each
- **Style**: Poetic narration or voiceover
- **Mood**: Emotional, matching chapter content

## How to Add Audio Files

### Option 1: Use Online Audio Libraries (Recommended)

1. **Epidemic Sound** (subscription)
   - Search for "cinematic ambient"
   - Download in MP3 format
   - Rename to appropriate filename

2. **YouTube Audio Library** (free)
   - Go to youtube.com/audio_library
   - Search for "ambient music" or "wind sounds"
   - Download MP3
   - Rename to appropriate filename

3. **Pixabay Music** (free)
   - Visit pixabay.com/music
   - Search for ambient, cinematic, wind sounds
   - Download MP3
   - Rename appropriately

### Option 2: Create Custom Audio

Use Audacity (free) or other audio editors:

1. **For Ambient Music**:
   - Record or find instrumental
   - Add reverb/echo effects
   - Normalize levels
   - Export as MP3

2. **For Wind Sound**:
   - Record real wind (or find recording)
   - Apply EQ and normalization
   - Loop if needed
   - Export as MP3

3. **For Page Flip**:
   - Record paper flip sound
   - Use built-in sound effect
   - Clean up silence
   - Export as MP3

### Option 3: Use Free Resources

**Free Ambient Music Sites**:
- freepd.com
- incompetech.com
- bensound.com
- soundly.com

**Free Sound Effects**:
- freesound.org
- zapsplat.com
- notification sounds.com

## File Specifications

All files should be:

| Aspect | Requirement |
|--------|-------------|
| Format | MP3 or OGG |
| Bitrate | 128 kbps or higher |
| Sample Rate | 44.1 kHz or 48 kHz |
| Channels | Stereo |
| Duration | Ambient: 2-3 min, Effects: 0.3-1 sec |
| File Size | Keep under 1MB each |

## Audio Configuration

Audio volumes are configured in `js/config.js`:

```javascript
AUDIO: {
    AMBIENT_VOLUME: 0.4,    // 0-1 scale
    WIND_VOLUME: 0.3,
    FLIP_VOLUME: 0.8,
    MASTER_VOLUME: 1,
}
```

Adjust these values if audio is too loud or too soft.

## Testing Audio

After placing audio files:

1. Open browser developer console (F12)
2. Run: `MeghaApp.toggleMute()` to test mute
3. Run: `MeghaApp.setVolume(0.5)` to test volume
4. Navigate through scenes to verify audio plays

## Troubleshooting

**Audio Not Playing**:
- Verify files are in `/assets/audio/` directory
- Check file names match exactly
- Ensure server is running with CORS allowed
- Check browser console for errors
- Try different audio format (OGG instead of MP3)

**Audio Glitchy or Cutting Out**:
- Check audio file is properly encoded
- Increase file bitrate to 192 kbps
- Try normalizing audio levels
- Check browser audio context isn't suspended

**Volume Too Loud/Quiet**:
- Edit volume values in `config.js`
- Or use: `MeghaApp.setVolume(0.3)` in console
- Normalize audio files to -3dB

## Browser Audio Support

| Browser | MP3 | OGG | WebM |
|---------|-----|-----|------|
| Chrome  | ✅  | ✅  | ✅   |
| Firefox | ✅  | ✅  | ✅   |
| Safari  | ✅  | ❌  | ❌   |
| Edge    | ✅  | ❌  | ❌   |

**Recommendation**: Use MP3 for best compatibility.

## Credits & Licensing

When using audio from free libraries:
- Always check license terms
- Provide attribution if required
- For commercial use, verify license allows it
- Consider purchasing licenses from Epidemic Sound or Artlist for commercial projects

---

**Note**: The website works beautifully without audio. Sound enhances the experience but is not required.
