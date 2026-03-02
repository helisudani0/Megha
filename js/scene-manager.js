/**
 * SCENE-MANAGER.JS - Simplified flow
 * Scene 1 intro -> Choice hub -> Book / Notes / Family messages
 */

class SceneManager {
    constructor(threeScenesManager, animationController) {
        this.threeScenesManager = threeScenesManager;
        this.animationController = animationController;

        this.currentScene = null;
        this.isTransitioning = false;
        this.currentNoteIndex = 0;
        this.activePanel = null;
        this.notesData = [];

        this.choiceHub = document.getElementById('choice-hub');
        this.bookContainer = document.getElementById('book-container');
        this.notesContainer = document.getElementById('notes-container');
        this.messageContainer = document.getElementById('message-container');

        this.noteIndex = document.getElementById('note-index');
        this.noteTitle = document.getElementById('note-title');
        this.noteText = document.getElementById('note-text');
        this.notePrevBtn = document.getElementById('note-prev');
        this.noteNextBtn = document.getElementById('note-next');

        this.messageKicker = document.getElementById('message-kicker');
        this.messageTitle = document.getElementById('message-title');
        this.messageBody = document.getElementById('message-body');

        this.bindHubEvents();
    }

    /**
     * Toggle overlay active state by id.
     */
    setOverlayVisibility(overlayId, isActive) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;
        overlay.classList.toggle('active', Boolean(isActive));
    }

    /**
     * Disable intro overlays.
     */
    clearSceneOverlays() {
        this.setOverlayVisibility('scene1-overlay', false);
    }

    /**
     * Start the experience.
     */
    async startExperience() {
        try {
            const preloader = document.getElementById('preloader');
            preloader.classList.remove('hidden');

            await this.animationController.animatePreloader();
            await this.playScene1();
        } catch (error) {
            console.error('Experience error:', error);
        }
    }

    /**
     * Scene 1 intro only.
     */
    async playScene1() {
        this.currentScene = 'galaxy';
        console.log('Scene 1: Galaxy Intro Starting');

        const galaxyBg = document.getElementById('scene1-image-bg');
        this.clearSceneOverlays();

        if (window.audioManager) {
            window.audioManager.playAmbientMusic();
        }

        this.setOverlayVisibility('scene1-overlay', true);

        if (galaxyBg) {
            gsap.to(galaxyBg, {
                opacity: 1,
                duration: 1,
                ease: 'power2.inOut',
            });
        }

        await this.animationController.galaxyIntroAnimation();
        this.setOverlayVisibility('scene1-overlay', false);
        this.showChoiceHub();
    }

    /**
     * Bind all interaction buttons.
     */
    bindHubEvents() {
        const choiceBookBtn = document.getElementById('choice-book');
        const choiceNotesBtn = document.getElementById('choice-notes');
        const notesBackBtn = document.getElementById('notes-back-btn');
        const messageBackBtn = document.getElementById('message-back-btn');

        if (choiceBookBtn) choiceBookBtn.addEventListener('click', () => this.openBook());
        if (choiceNotesBtn) choiceNotesBtn.addEventListener('click', () => this.openNotes());
        if (notesBackBtn) notesBackBtn.addEventListener('click', () => this.closeNotes());
        if (messageBackBtn) messageBackBtn.addEventListener('click', () => this.closeMessage());
        if (this.notePrevBtn) this.notePrevBtn.addEventListener('click', () => this.previousNote());
        if (this.noteNextBtn) this.noteNextBtn.addEventListener('click', () => this.nextNote());

        document.querySelectorAll('[data-message-key]').forEach((button) => {
            button.addEventListener('click', () => {
                const key = button.getAttribute('data-message-key');
                this.openMessage(key);
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;

            if (this.activePanel === 'notes') {
                this.closeNotes();
                return;
            }

            if (this.activePanel === 'message') {
                this.closeMessage();
                return;
            }

            if (this.bookContainer && !this.bookContainer.classList.contains('hidden') && window.bookManager) {
                window.bookManager.closeBook();
            }
        });
    }

    /**
     * Show the selection hub.
     */
    showChoiceHub() {
        this.currentScene = 'hub';
        this.activePanel = null;
        this.hideNotesPanel();
        this.hideMessagePanel();

        if (!this.choiceHub) return;
        this.choiceHub.classList.remove('hidden');
        this.choiceHub.classList.add('active');
    }

    /**
     * Hide the selection hub.
     */
    hideChoiceHub() {
        if (!this.choiceHub) return;
        this.choiceHub.classList.remove('active');
        this.choiceHub.classList.add('hidden');
    }

    /**
     * Open chapter book.
     */
    openBook() {
        this.currentScene = 'book';
        this.activePanel = 'book';
        this.hideChoiceHub();

        if (window.bookManager) {
            window.bookManager.openBook();
        }
    }

    /**
     * Alias kept for compatibility with old calls.
     */
    openBookDirectly() {
        this.openBook();
    }

    /**
     * Notes source with 27 fallback notes.
     */
    getNotes() {
        if (BOOK_DATA && Array.isArray(BOOK_DATA.notes) && BOOK_DATA.notes.length > 0) {
            return BOOK_DATA.notes.map((note, index) => ({
                id: Number(note.id) || (index + 1),
                title: note.title || `Note ${index + 1}`,
                text: note.text || '',
            }));
        }

        return Array.from({ length: 27 }, (_, index) => ({
            id: index + 1,
            title: `Note ${index + 1}`,
            text: 'Write your note here.',
        }));
    }

    /**
     * Open notes panel.
     */
    openNotes() {
        this.currentScene = 'notes';
        this.activePanel = 'notes';
        this.hideChoiceHub();
        this.showNotesPanel();

        this.notesData = this.getNotes();
        this.currentNoteIndex = 0;
        this.renderCurrentNote();
    }

    /**
     * Render active note.
     */
    renderCurrentNote() {
        if (!this.notesData.length) return;
        const total = this.notesData.length;
        const note = this.notesData[this.currentNoteIndex];

        if (this.noteIndex) this.noteIndex.textContent = `Note ${this.currentNoteIndex + 1} of ${total}`;
        if (this.noteTitle) this.noteTitle.textContent = note.title;
        if (this.noteText) this.noteText.textContent = note.text;
        if (this.notePrevBtn) this.notePrevBtn.disabled = this.currentNoteIndex === 0;
        if (this.noteNextBtn) this.noteNextBtn.disabled = this.currentNoteIndex === total - 1;
    }

    /**
     * Next note.
     */
    nextNote() {
        if (this.currentNoteIndex >= this.notesData.length - 1) return;
        this.currentNoteIndex += 1;
        this.renderCurrentNote();
    }

    /**
     * Previous note.
     */
    previousNote() {
        if (this.currentNoteIndex <= 0) return;
        this.currentNoteIndex -= 1;
        this.renderCurrentNote();
    }

    /**
     * Close notes and return to choices.
     */
    closeNotes() {
        this.hideNotesPanel();
        this.showChoiceHub();
    }

    /**
     * Get family messages with defaults.
     */
    getFamilyMessages() {
        const defaults = {
            papa: {
                title: "Papa's Message",
                kicker: 'From Papa',
                text: 'Your courage made us proud every single day.',
            },
            mummy: {
                title: "Mummy's Message",
                kicker: 'From Mummy',
                text: 'My blessings are always with you.',
            },
            yashu: {
                title: "Yashu's Message",
                kicker: 'From Yashu',
                text: 'You are my blueprint, always.',
            },
        };

        const source = (BOOK_DATA && BOOK_DATA.familyMessages) || {};

        return {
            papa: { ...defaults.papa, ...(source.papa || {}) },
            mummy: { ...defaults.mummy, ...(source.mummy || {}) },
            yashu: { ...defaults.yashu, ...(source.yashu || {}) },
        };
    }

    /**
     * Open one family message panel.
     */
    openMessage(messageKey) {
        const messages = this.getFamilyMessages();
        const key = messages[messageKey] ? messageKey : 'papa';
        const selected = messages[key];

        this.currentScene = `message-${key}`;
        this.activePanel = 'message';
        this.hideChoiceHub();
        this.showMessagePanel();

        if (this.messageKicker) this.messageKicker.textContent = selected.kicker;
        if (this.messageTitle) this.messageTitle.textContent = selected.title;
        if (this.messageBody) this.messageBody.textContent = selected.text;
    }

    /**
     * Close message and return to choices.
     */
    closeMessage() {
        this.hideMessagePanel();
        this.showChoiceHub();
    }

    showNotesPanel() {
        if (!this.notesContainer) return;
        this.notesContainer.classList.remove('hidden');
        this.notesContainer.classList.add('active');
    }

    hideNotesPanel() {
        if (!this.notesContainer) return;
        this.notesContainer.classList.remove('active');
        this.notesContainer.classList.add('hidden');
    }

    showMessagePanel() {
        if (!this.messageContainer) return;
        this.messageContainer.classList.remove('hidden');
        this.messageContainer.classList.add('active');
    }

    hideMessagePanel() {
        if (!this.messageContainer) return;
        this.messageContainer.classList.remove('active');
        this.messageContainer.classList.add('hidden');
    }

    /**
     * Cleanup function.
     */
    cleanup() {}

    /**
     * Pause entire experience.
     */
    pause() {
        this.isTransitioning = true;
        if (window.audioManager) window.audioManager.stopAmbientMusic();
    }

    /**
     * Resume experience.
     */
    resume() {
        this.isTransitioning = false;
        if (window.audioManager) window.audioManager.playAmbientMusic(true);
    }

    /**
     * Skip to specific point (debug helper).
     */
    skipToScene(sceneNumber) {
        if (sceneNumber === 1) {
            this.playScene1();
            return;
        }
        this.showChoiceHub();
    }
}
