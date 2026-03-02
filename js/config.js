/**
 * CONFIG.JS - Global Configuration
 * Configuration constants and settings for the entire application
 */

const CONFIG = {
    // Canvas settings
    CANVAS: {
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight,
        DPR: window.devicePixelRatio || 1,
    },

    // Camera settings
    CAMERA: {
        FOV: 75,
        NEAR: 0.1,
        FAR: 100000,
    },

    // Scene colors
    COLORS: {
        SPACE_BG: 0x050811,
        NEBULA: 0x4a2f6d,
        STAR: 0xffffff,
        RAINDROP: 0x87ceeb,
        EARTH: 0x2e7d32,
        GLOW: 0xb19cd9,
    },

    // Animation timings (in seconds)
    TIMING: {
        PRELOADER: 3,
        GALAXY_INTRO: 8,
        RAIN_FALL: 5,
        EARTH_ZOOM: 4,
        EARTH_TO_EARTH: 6,
        INDIA_ZOOM: 5,
        COUNTRY_TRANSITION: 6,
        FINAL_FADE: 3,
    },

    // Particle settings
    PARTICLES: {
        STAR_COUNT: 800,
        RAIN_COUNT: 150,
        DUST_COUNT: 200,
    },

    // Book settings
    BOOK: {
        PAGES_COUNT: 54, // 27 chapters * 2 (left + right pages)
        CHAPTERS_COUNT: 27,
        PAGE_WIDTH: 800,
        PAGE_HEIGHT: 600,
    },

    // Audio settings
    AUDIO: {
        AMBIENT_VOLUME: 0.4,
        WIND_VOLUME: 0.3,
        FLIP_VOLUME: 0.8,
        MASTER_VOLUME: 1,
    },

    // Feature flags
    FEATURES: {
        AUTO_ROTATE_EARTH: true,
        ENABLE_SOUND: true,
        ENABLE_PARTICLES: true,
        ENABLE_FOG: true,
        ENABLE_BLOOM: false,
    },

    // Performance
    PERFORMANCE: {
        MAX_PARTICLES: 500,
        USE_LOD: true,
        TARGET_FPS: 60,
    },
};

// Handle window resize
window.addEventListener('resize', () => {
    CONFIG.CANVAS.WIDTH = window.innerWidth;
    CONFIG.CANVAS.HEIGHT = window.innerHeight;
    CONFIG.CANVAS.DPR = window.devicePixelRatio || 1;
    // Dispatch custom event for listeners
    window.dispatchEvent(new Event('configUpdated'));
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
