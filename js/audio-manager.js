/**
 * AUDIO-MANAGER.JS - Audio and Sound Management
 * Handles background music, sound effects, and audio controls
 */

class AudioManager {
    constructor() {
        this.spotifyPlayer = document.getElementById('spotify-bg-player');
        this.windSound = document.getElementById('wind-sound');
        this.flipSound = document.getElementById('flip-sound');

        this.spotifyTrackId = this.spotifyPlayer?.dataset?.trackId || '';
        this.spotifyEmbedBase = this.spotifyTrackId
            ? `https://open.spotify.com/embed/track/${this.spotifyTrackId}`
            : '';
        this.spotifyAutoplayRequested = false;

        this.isMuted = false;
        this.masterVolume = CONFIG.AUDIO.MASTER_VOLUME;

        this.init();
    }

    /**
     * Initialize audio
     */
    init() {
        // Set volumes
        this.setAmbientVolume(CONFIG.AUDIO.AMBIENT_VOLUME);
        this.setWindVolume(CONFIG.AUDIO.WIND_VOLUME);
        this.setFlipVolume(CONFIG.AUDIO.FLIP_VOLUME);

        // Retry audio start when user interacts (browser autoplay policies).
        document.addEventListener('click', () => this.resumeAudioContext());
        document.addEventListener('touchstart', () => this.resumeAudioContext());
    }

    /**
     * Resume audio context if suspended
     */
    resumeAudioContext() {
        if (!CONFIG.FEATURES.ENABLE_SOUND || this.isMuted) {
            return;
        }
        this.playAmbientMusic(true);
    }

    /**
     * Play ambient background music
     */
    playAmbientMusic(forceReload = false) {
        if (!CONFIG.FEATURES.ENABLE_SOUND) return;

        if (!this.spotifyPlayer || !this.spotifyEmbedBase) return;
        if (this.isMuted) return;
        if (this.spotifyAutoplayRequested && !forceReload) return;

        const autoplaySrc = `${this.spotifyEmbedBase}?utm_source=generator&autoplay=1&cb=${Date.now()}`;

        if (this.spotifyPlayer.src !== autoplaySrc) {
            this.spotifyPlayer.src = autoplaySrc;
        }

        this.spotifyAutoplayRequested = true;
    }

    /**
     * Stop ambient music
     */
    stopAmbientMusic() {
        if (this.spotifyPlayer) {
            this.spotifyPlayer.src = 'about:blank';
            this.spotifyAutoplayRequested = false;
        }
    }

    /**
     * Set ambient music volume
     */
    setAmbientVolume(volume) {
        void volume;
        // Spotify embed does not expose programmatic volume controls.
    }

    /**
     * Play wind sound
     */
    playWindSound() {
        if (!CONFIG.FEATURES.ENABLE_SOUND) return;
        
        if (this.windSound) {
            this.windSound.loop = true;
            this.windSound.volume = CONFIG.AUDIO.WIND_VOLUME * this.masterVolume;
            this.windSound.play().catch(() => {});
        }
    }

    /**
     * Stop wind sound
     */
    stopWindSound() {
        if (this.windSound) {
            this.windSound.pause();
            this.windSound.currentTime = 0;
        }
    }

    /**
     * Set wind sound volume
     */
    setWindVolume(volume) {
        if (this.windSound) {
            this.windSound.volume = volume * this.masterVolume;
        }
    }

    /**
     * Play page flip sound
     */
    playFlipSound() {
        if (!CONFIG.FEATURES.ENABLE_SOUND) return;
        
        if (this.flipSound) {
            this.flipSound.volume = CONFIG.AUDIO.FLIP_VOLUME * this.masterVolume;
            this.flipSound.currentTime = 0;
            this.flipSound.play().catch(() => {});
        }
    }

    /**
     * Set flip sound volume
     */
    setFlipVolume(volume) {
        if (this.flipSound) {
            this.flipSound.volume = volume * this.masterVolume;
        }
    }

    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        this.setAmbientVolume(CONFIG.AUDIO.AMBIENT_VOLUME);
        this.setWindVolume(CONFIG.AUDIO.WIND_VOLUME);
        this.setFlipVolume(CONFIG.AUDIO.FLIP_VOLUME);
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopAmbientMusic();
            this.stopWindSound();
        } else {
            this.playAmbientMusic(true);
        }

        return this.isMuted;
    }

    /**
     * Fade audio
     */
    fadeAudio(audio, targetVolume, duration = 1) {
        if (!audio) return;

        const startVolume = audio.volume;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);

            audio.volume = startVolume + (targetVolume - startVolume) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Cross-fade between audio tracks
     */
    crossFade(fromAudio, toAudio, duration = 2) {
        this.fadeAudio(fromAudio, 0, duration);
        this.fadeAudio(toAudio, CONFIG.AUDIO.AMBIENT_VOLUME * this.masterVolume, duration);
    }
}
