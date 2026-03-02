/**
 * MAIN.JS - Application Entry Point
 * Initializes all systems and starts the experience
 */

class Application {
    constructor() {
        this.initialized = false;
        this.animationFrameId = null;
    }

    /**
     * Initialize application
     */
    async init() {
        console.log('%c🌧️  27 Chapters of Rain', 'color: #b19cd9; font-size: 20px; font-weight: bold;');
        console.log('%cMegha Birthday Journey - A Cinematic 3D Experience', 'color: #87ceeb; font-size: 14px;');

        // Check browser compatibility
        if (!this.checkCompatibility()) {
            this.showCompatibilityError();
            return;
        }

        // Setup event listeners
        this.setupEventListeners();

        // Initialize Three.js and start rendering loop
        this.startRenderLoop();

        // Start the experience
        if (window.sceneManager) {
            await window.sceneManager.startExperience();
        }

        this.initialized = true;
    }

    /**
     * Check browser compatibility
     */
    checkCompatibility() {
        // Check for WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            console.error('WebGL not supported');
            return false;
        }

        // Check for required APIs
        if (!window.THREE || !window.gsap) {
            console.error('Required libraries not loaded');
            return false;
        }

        return true;
    }

    /**
     * Show compatibility error
     */
    showCompatibilityError() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: #0a0e27;
                color: #b19cd9;
                font-family: Georgia, serif;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <h1 style="font-size: 36px; margin-bottom: 20px;">Browser Not Supported</h1>
                    <p style="font-size: 18px; margin-bottom: 20px;">
                        This experience requires WebGL support and a modern browser.
                    </p>
                    <p style="font-size: 16px; color: #87ceeb;">
                        Please use Chrome, Firefox, Safari, or Edge.
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Prevent context menu (optional)
        // document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Disable scroll on body during experience
        const updateScroll = () => {
            if (document.body.classList.contains('no-scroll')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'hidden'; // Always hide for cinematic effect
            }
        };
        
        updateScroll();
        window.addEventListener('resize', updateScroll);

        // Keyboard shortcuts (for debugging/accessibility)
        document.addEventListener('keydown', (e) => {
            // F11: Toggle fullscreen
            if (e.key === 'F11') {
                this.toggleFullscreen();
            }
            
            // M: Toggle mute
            if (e.key === 'm' || e.key === 'M') {
                audioManager.toggleMute();
            }

            // D: Debug info
            if (e.key === 'd' || e.key === 'D') {
                console.log('Current Scene:', sceneManager.currentScene);
                console.log('Camera Position:', threeScenesManager.camera.position);
                console.log('Config:', CONFIG);
            }
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                sceneManager.pause();
            } else {
                sceneManager.resume();
            }
        });

        // Fullscreen change
        document.addEventListener('fullscreenchange', () => {
            console.log('Fullscreen:', document.fullscreenElement !== null);
        });
    }

    /**
     * Toggle fullscreen
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }

    /**
     * Start main render loop
     */
    startRenderLoop() {
        const render = () => {
            this.animationFrameId = requestAnimationFrame(render);

            // Update particle systems (only if initialized)
            if (window.particleSystem && window.particleSystem.updateParticles) {
                window.particleSystem.updateParticles();
            }

            // Render Three.js scene (only if initialized)
            if (window.threeScenesManager && window.threeScenesManager.render) {
                window.threeScenesManager.render();
            }
        };

        render();
    }

    /**
     * Stop render loop
     */
    stopRenderLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    /**
     * Get application stats
     */
    getStats() {
        return {
            initialized: this.initialized,
            currentScene: sceneManager.currentScene,
            audioEnabled: CONFIG.FEATURES.ENABLE_SOUND,
            particlesEnabled: CONFIG.FEATURES.ENABLE_PARTICLES,
            masterVolume: audioManager.masterVolume,
            cameraPosition: threeScenesManager.camera.position,
        };
    }

    /**
     * Dispose resources
     */
    dispose() {
        this.stopRenderLoop();
        audioManager.stopAmbientMusic();
        audioManager.stopWindSound();
        
        if (threeScenesManager && threeScenesManager.renderer) {
            threeScenesManager.renderer.dispose();
        }
    }
}

// ============================================
// INITIALIZE GLOBAL OBJECTS AND STARTUP
// ============================================

function initApp() {
    try {
        // Initialize managers in correct order
        // Skip Three.js manager for image-based scenes
        window.audioManager = new AudioManager();
        window.bookManager = new BookManager();
        
        // Create animation controller (simplified for image-based scenes)
        window.animationController = new AnimationController(null, null, window.audioManager);
        
        // Create scene manager that will use image backgrounds instead of 3D
        window.sceneManager = new SceneManager(null, window.animationController);
        
        // Create application
        window.application = new Application();

        // Initialize application
        window.application.init();

        // Setup debug API
        window.MeghaApp = {
            getStats: () => ({
                initialized: window.application.initialized,
                currentScene: window.sceneManager.currentScene,
                audioEnabled: CONFIG.FEATURES.ENABLE_SOUND,
            }),
            toggleMute: () => window.audioManager.toggleMute(),
            setVolume: (vol) => window.audioManager.setMasterVolume(vol),
            jumpToChapter: (chapter) => window.bookManager.jumpToChapter(chapter),
            reload: () => location.reload(),
        };

        console.log('%cDebug API Available', 'color: #d4af37; font-weight: bold;');
        console.log('Use window.MeghaApp to control the experience');

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (window.application) {
                window.application.dispose();
            }
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        console.error(error.stack);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
