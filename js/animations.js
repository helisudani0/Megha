/**
 * ANIMATIONS.JS - GSAP Animations and Scene Transitions
 * Handles all cinematic animations and transitions
 */

class AnimationController {
    constructor(threeScenesManager, particleSystem, audioManager) {
        this.threeScenesManager = threeScenesManager;
        this.particleSystem = particleSystem;
        this.audioManager = audioManager;
        
        this.timeline = null;
        this.currentScene = 'preloader';
    }

    /**
     * Animate preloader
     */
    animatePreloader() {
        return new Promise((resolve) => {
            gsap.to('.preloader-progress', {
                width: '100%',
                duration: CONFIG.TIMING.PRELOADER,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.to('.preloader', {
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            document.getElementById('preloader').classList.add('hidden');
                            resolve();
                        }
                    });
                }
            });
        });
    }

    /**
     * SCENE 1: Galaxy Intro Animation (Image-based)
     */
    galaxyIntroAnimation() {
        this.currentScene = 'galaxy';
        
        return new Promise((resolve) => {
            const scene1Overlay = document.getElementById('scene1-overlay');
            const constellationText = document.getElementById('constellation-text');
            const scene1Subtitle = document.getElementById('scene1-subtitle');
            const galaxyBg = document.getElementById('scene1-image-bg');

            gsap.timeline()
                // Fade in galaxy background
                .to(galaxyBg, {
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 0)

                // Fade in constellation text
                .to(constellationText, {
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.inOut'
                }, 0.5)

                // Glow effect on text
                .to(constellationText, {
                    textShadow: '0 0 50px rgba(177, 156, 217, 1), 0 0 100px rgba(138, 43, 226, 1)',
                    duration: 3,
                    repeat: 1,
                    yoyo: true,
                    ease: 'sine.inOut'
                }, 1)

                // Fade in subtitle
                .to(scene1Subtitle, {
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.inOut'
                }, 1.5)

                // Hold on text for 3 seconds
                .add(() => {
                    // Just wait
                }, 4)

                // Fade out text
                .to([constellationText, scene1Subtitle], {
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 6.5)

                // Resolve animation
                .add(() => {
                    console.log('✓ Galaxy intro animation complete');
                    resolve();
                }, 8);
        });
    }

    /**
     * SCENE 2: Galaxy to Earth Zoom (no clicks - automatic progression)
     */
    /**
     * SCENE 2: Epic journey - Space → Planets → Earth → India → Gujarat → Countryside
     */
    earthZoomAnimation() {
        this.currentScene = 'earth';
        
        return new Promise((resolve) => {
            const scene2Overlay = document.getElementById('scene2-overlay');
            const camera = this.threeScenesManager.camera;

            if (!scene2Overlay || !this.threeScenesManager || !camera) {
                resolve();
                return;
            }

            this.threeScenesManager.switchScene('earth');
            
            // Hide planets immediately - we only want Earth visible
            this.threeScenesManager.hidePlanets();

            gsap.timeline()
                // Phase 0: Set initial camera far in space
                .set(camera.position, {
                    x: 1000,
                    y: 500,
                    z: 1500
                }, 0)

                // Phase 1: Fly through space and planets (3 seconds)
                .to(scene2Overlay, {
                    opacity: 0.05,
                    duration: 0.5,
                    ease: 'power2.inOut'
                }, 0)

                .to(camera.position, {
                    x: 400,
                    y: 300,
                    z: 800,
                    duration: 3,
                    ease: 'power1.inOut',
                    onUpdate: () => {
                        camera.lookAt(0, 0, 0);
                    }
                }, 0)

                // Phase 2: Approach Earth from space (3 seconds) - see whole Earth
                .to(camera.position, {
                    x: 150,
                    y: 100,
                    z: 500,
                    duration: 3,
                    ease: 'power1.inOut',
                    onUpdate: () => {
                        camera.lookAt(0, 0, 0);
                    }
                }, 3)

                // Phase 3: Zoom into India region (2.5 seconds)
                .to(camera.position, {
                    x: 50,
                    y: 40,
                    z: 300,
                    duration: 2.5,
                    ease: 'power1.inOut',
                    onUpdate: () => {
                        camera.lookAt(15, 10, 0);
                    }
                }, 6)

                // Phase 4: Zoom closer into Gujarat (2 seconds)
                .to(camera.position, {
                    x: 30,
                    y: 25,
                    z: 180,
                    duration: 2,
                    ease: 'power1.inOut',
                    onUpdate: () => {
                        camera.lookAt(8, 5, 0);
                    }
                }, 8.5)

                // Phase 5: Dramatic zoom toward countryside (2 seconds)
                .to(camera.position, {
                    x: 0,
                    y: 0,
                    z: 80,
                    duration: 2,
                    ease: 'power2.in',
                    onUpdate: () => {
                        camera.lookAt(0, 0, 0);
                    }
                }, 10.5)

                // Fade overlay to black (complete transition)
                .to(scene2Overlay, {
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.inOut'
                }, 11.5)

                // Hide overlay and transition to scene 3
                .add(() => {
                    scene2Overlay.style.pointerEvents = 'none';
                    resolve();
                }, 12.8);
        });
    }

    /**
     * SCENE 3: Zoom to Countryside & Open Book (automatic, no clicks)
     */
    countryZoomAnimation() {
        this.currentScene = 'countryside';
        
        return new Promise((resolve) => {
            const scene3Overlay = document.getElementById('scene3-overlay');
            const camera = this.threeScenesManager.camera;

            if (!scene3Overlay || !this.threeScenesManager || !camera) {
                resolve();
                return;
            }

            this.threeScenesManager.switchScene('countryside');

            // Ensure overlay starts hidden
            scene3Overlay.style.opacity = '0';
            scene3Overlay.style.pointerEvents = 'none';

            gsap.timeline()
                // Fade in countryside (subtle fade to show transition)
                .to(scene3Overlay, {
                    opacity: 0.3,
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 0)

                // Zoom camera into countryside scene
                .to(camera.position, {
                    x: 0,
                    y: 20,
                    z: 120,
                    duration: 5,
                    ease: 'power1.inOut'
                }, 0.5)

                // Play wind sound
                .add(() => {
                    if (window.audioManager) window.audioManager.playWindSound();
                }, 1.5)

                // Fade out overlay completely
                .to(scene3Overlay, {
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 4.5)

                // Open the book automatically
                .add(() => {
                    scene3Overlay.style.pointerEvents = 'none';
                    
                    if (window.bookManager) {
                        const bookContainer = document.getElementById('book-container');
                        bookContainer.classList.remove('hidden');
                        bookContainer.style.display = 'flex';
                        bookContainer.style.zIndex = '1000';
                        window.bookManager.openBook();
                        console.log('✓ Book opened automatically');
                    }
                    resolve();
                }, 6.5);
        });
    }

    /**
     * Trigger book opening animation
     */
    triggerBookOpen() {
        const scene3Overlay = document.getElementById('scene3-overlay');
        clearTimeout(this.bookTimeout);

        const camera = this.threeScenesManager.camera;

        if (!scene3Overlay || !this.threeScenesManager || !camera) {
            if (window.bookManager) {
                window.bookManager.openBook();
            }
            return;
        }

        gsap.timeline()
            // Zoom to book
            .to(camera.position, {
                x: 30,
                y: -10,
                z: 30,
                duration: 2,
                ease: 'power2.inOut'
            }, 0)

            // Fade out countryside overlay
            .to(scene3Overlay, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut'
            }, 0)

            // Open book
            .add(() => {
                bookManager.openBook();
            }, 1);
    }

    /**
     * Scene transition with blur effect
     */
    transitionBetweenScenes(fromOverlay, toOverlay, duration = 1) {
        return gsap.timeline()
            .to(fromOverlay, {
                opacity: 0,
                filter: 'blur(10px)',
                duration: duration * 0.5,
                ease: 'power2.inOut'
            }, 0)
            .to(toOverlay, {
                opacity: 1,
                filter: 'blur(0px)',
                duration: duration * 0.5,
                ease: 'power2.inOut'
            }, duration * 0.5);
    }

    /**
     * Final scene animation (with end message)
     */
    finalSceneAnimation() {
        return new Promise((resolve) => {
            const finalScreen = document.getElementById('final-screen');
            audioManager.stopWindSound();

            if (!finalScreen) {
                resolve();
                return;
            }

            gsap.timeline()
                // Fade to final message
                .to(finalScreen, {
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.inOut'
                }, 0)

                // Animate text lines
                .to('.final-text-line', {
                    opacity: 1,
                    duration: 2,
                    stagger: 0.3,
                    ease: 'power2.inOut'
                }, 1)

                // Let user read
                .add(() => {
                    audioManager.playAmbientMusic();
                }, 2)

                // Final fade to black
                .to(finalScreen, {
                    opacity: 0,
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    duration: 4,
                    ease: 'power2.in',
                    delay: 4,
                    onComplete: () => {
                        resolve();
                    }
                });
        });
    }

    /**
     * Play smooth camera orbit animation
     */
    orbitCamera(centerX = 0, centerY = 0, centerZ = 0, radius = 100, duration = 15) {
        const camera = this.threeScenesManager.camera;
        const startPos = { angle: 0 };

        gsap.to(startPos, {
            angle: Math.PI * 2,
            duration: duration,
            ease: 'none',
            repeat: -1,
            onUpdate: () => {
                const angle = startPos.angle;
                camera.position.x = centerX + Math.cos(angle) * radius;
                camera.position.z = centerZ + Math.sin(angle) * radius;
                camera.position.y = centerY + Math.sin(angle * 0.5) * (radius * 0.3);
                camera.lookAt(centerX, centerY, centerZ);
            }
        });
    }

    /**
     * Create particle shower animation
     */
    particleShower(count = 50, duration = 3) {
        return new Promise((resolve) => {
            const particles = [];

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = 'rgba(177, 156, 217, 0.8)';
                particle.style.borderRadius = '50%';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '-10px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '50';
                document.body.appendChild(particle);

                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;

                gsap.to(particle, {
                    x: (Math.random() - 0.5) * 200,
                    y: window.innerHeight + 100,
                    opacity: 0,
                    duration: duration,
                    ease: 'power1.in',
                    onComplete: () => {
                        particle.remove();
                    }
                });

                particles.push(particle);
            }

            setTimeout(resolve, duration * 1000);
        });
    }
}
