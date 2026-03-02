/**
 * BOOK-MANAGER.JS - Chapter Book Display
 * Gift mode only: chapters are loaded from book-data.js and asset files.
 */

class BookManager {
    constructor() {
        this.bookContainer = document.getElementById('book-container');
        this.pageCounter = document.getElementById('page-counter');
        this.currentChapterDisplay = document.getElementById('current-chapter');

        this.chapterPart = document.getElementById('chapter-part');
        this.chapterTitle = document.getElementById('chapter-title');
        this.chapterContent = document.getElementById('chapter-content');
        this.chapterContinued = document.getElementById('chapter-continued');
        this.chapterImage = document.getElementById('chapter-image');
        this.chapterImageLabel = document.getElementById('chapter-image-label');

        this.chapters = this.normalizeChapters(BOOK_DATA.chapters || []);
        this.currentChapter = 1;

        if (this.chapters.length === 0) {
            this.chapters = [{
                id: 1,
                partNumber: 1,
                title: 'Chapter 1',
                text: 'Your story begins here.',
                imageFile: '',
            }];
        }

        this.syncGlobalBookData();
        this.attachEventListeners();
        this.displayChapter(1);
    }

    /**
     * Ensure chapter objects follow a consistent schema.
     */
    normalizeChapterText(chapter) {
        const source = chapter.rawText ?? chapter.text ?? chapter.content ?? '';
        if (Array.isArray(source)) {
            return source
                .map((paragraph) => String(paragraph || '').trim())
                .filter(Boolean)
                .join('\n\n');
        }
        return String(source);
    }

    normalizeChapters(chapters) {
        return chapters.map((chapter, index) => {
            const id = Number(chapter.id) || (index + 1);
            return {
                id,
                partNumber: Number(chapter.partNumber) || this.getPartNumberForId(id),
                title: chapter.title || `Chapter ${id}`,
                text: this.normalizeChapterText(chapter),
                imageFile: chapter.imageFile || '',
            };
        });
    }

    /**
     * Keep global data in sync.
     */
    syncGlobalBookData() {
        BOOK_DATA.chapters = this.chapters.map((chapter) => ({ ...chapter }));
        BOOK_DATA.totalChapters = this.chapters.length;
    }

    /**
     * Determine part number by chapter id.
     */
    getPartNumberForId(id) {
        if (id <= 8) return 1;
        if (id <= 16) return 2;
        return 3;
    }

    /**
     * Resolve local or remote media source.
     */
    resolveMediaSource(filePath, fallbackBasePath) {
        if (!filePath) return '';

        if (/^(data:|blob:|https?:\/\/|\/)/i.test(filePath)) {
            return filePath;
        }

        if (filePath.includes('/')) {
            return filePath;
        }

        return `${fallbackBasePath}${filePath}`;
    }

    /**
     * Cute placeholder palette per chapter.
     */
    getPlaceholderTheme(chapterId) {
        const themes = [
            { a: '#ffe8f0', b: '#ffd8ee', c: '#f9d7ff', label: 'Sweet memory spot' },
            { a: '#fff1df', b: '#ffe1c5', c: '#ffd3ea', label: 'Birthday photo corner' },
            { a: '#e8f7ff', b: '#d6eeff', c: '#e7dcff', label: 'Rainy smile frame' },
            { a: '#f1ffe5', b: '#dbffd5', c: '#d8f4ff', label: 'Little joy frame' },
            { a: '#fff5db', b: '#ffe5b8', c: '#ffd8c7', label: 'Golden memory box' },
        ];
        return themes[(chapterId - 1) % themes.length];
    }

    /**
     * Split chapter content across two visible pages.
     */
    splitChapterText(text) {
        const value = (text || '').trim();
        if (!value) {
            return ['No chapter text yet.', ''];
        }

        const paragraphs = value
            .split(/\n\s*\n/)
            .map((line) => line.trim())
            .filter(Boolean);

        if (paragraphs.length <= 1) {
            const words = value.split(/\s+/);
            if (words.length < 30) {
                return [value, ''];
            }

            const sentenceChunks = value.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
            if (sentenceChunks.length > 1) {
                const total = sentenceChunks.reduce((sum, sentence) => sum + sentence.length, 0);
                const target = total * 0.54;
                let running = 0;
                let splitAt = 1;

                for (let i = 0; i < sentenceChunks.length; i += 1) {
                    running += sentenceChunks[i].length;
                    if (running >= target) {
                        splitAt = i + 1;
                        break;
                    }
                }

                return [
                    sentenceChunks.slice(0, splitAt).join('').trim(),
                    sentenceChunks.slice(splitAt).join('').trim(),
                ];
            }

            const midpoint = Math.ceil(words.length / 2);
            return [
                words.slice(0, midpoint).join(' '),
                words.slice(midpoint).join(' '),
            ];
        }

        if (paragraphs.length === 1) {
            return [value, ''];
        }

        const totalChars = paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0);
        const target = totalChars * 0.54;
        let runningChars = 0;
        let splitIndex = 1;

        for (let i = 0; i < paragraphs.length; i += 1) {
            runningChars += paragraphs[i].length;
            if (runningChars >= target) {
                splitIndex = i + 1;
                break;
            }
        }

        const left = paragraphs.slice(0, splitIndex).join('\n\n').trim();
        const right = paragraphs.slice(splitIndex).join('\n\n').trim();
        return [left, right];
    }

    /**
     * Render text to a page container.
     */
    renderPageText(container, text) {
        if (!container) return;
        container.innerHTML = '';
        const paragraph = document.createElement('p');
        paragraph.className = 'chapter-page-text';
        paragraph.textContent = text || ' ';
        container.appendChild(paragraph);
    }

    /**
     * Render chapter image with fallback placeholder.
     */
    renderChapterImage(chapter) {
        if (!this.chapterImage || !this.chapterImageLabel) return;

        const source = this.resolveMediaSource(chapter.imageFile, 'assets/images/');
        if (source) {
            const safeSource = source.replace(/'/g, '%27');
            this.chapterImage.style.display = 'flex';
            this.chapterImage.style.backgroundImage = `url('${safeSource}')`;
            this.chapterImage.classList.remove('chapter-image-placeholder');
            this.chapterImageLabel.textContent = 'Memory snapshot';
            return;
        }
        this.chapterImage.style.display = 'none';
    }

    /**
     * Display a specific chapter.
     */
    displayChapter(chapterNumber) {
        const numericChapter = Number(chapterNumber);
        if (!Number.isInteger(numericChapter) || numericChapter < 1 || numericChapter > this.chapters.length) {
            console.warn('Invalid chapter number:', chapterNumber);
            return;
        }

        this.currentChapter = numericChapter;
        const chapter = this.chapters[this.currentChapter - 1];

        if (this.chapterPart) {
            this.chapterPart.textContent = `Part ${chapter.partNumber} - Chapter ${chapter.id}`;
        }

        if (this.chapterTitle) {
            this.chapterTitle.textContent = `Chapter ${chapter.id}: ${chapter.title}`;
        }

        const [leftText, rightText] = this.splitChapterText(chapter.text);
        this.renderPageText(this.chapterContent, leftText);
        this.renderPageText(this.chapterContinued, rightText);

        this.renderChapterImage(chapter);
        this.updatePageDisplay();
    }

    /**
     * Update navigation and page counters.
     */
    updatePageDisplay() {
        const totalPages = this.chapters.length * 2;
        const currentStartPage = (this.currentChapter - 1) * 2 + 1;

        if (this.pageCounter) {
            const currentEndPage = Math.min(currentStartPage + 1, totalPages);
            this.pageCounter.textContent = `Pages ${currentStartPage}-${currentEndPage} of ${totalPages}`;
        }

        const chapter = this.chapters[this.currentChapter - 1];
        if (this.currentChapterDisplay && chapter) {
            this.currentChapterDisplay.textContent = `Chapter ${chapter.id}: ${chapter.title}`;
        }

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (prevBtn) {
            prevBtn.disabled = this.currentChapter === 1;
            prevBtn.style.display = this.chapters.length > 1 ? 'inline-flex' : 'none';
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentChapter === this.chapters.length;
            nextBtn.style.display = this.chapters.length > 1 ? 'inline-flex' : 'none';
        }
    }

    /**
     * Go to next chapter.
     */
    nextChapter() {
        if (this.currentChapter < this.chapters.length) {
            this.displayChapter(this.currentChapter + 1);
            this.playFlipSound();
        }
    }

    /**
     * Go to previous chapter.
     */
    previousChapter() {
        if (this.currentChapter > 1) {
            this.displayChapter(this.currentChapter - 1);
            this.playFlipSound();
        }
    }

    /**
     * Jump to a specific chapter by index (1-based).
     */
    jumpToChapter(chapterNumber) {
        this.displayChapter(chapterNumber);
    }

    /**
     * Open book overlay.
     */
    openBook() {
        if (!this.bookContainer) return;
        this.bookContainer.classList.remove('hidden');
        document.body.classList.add('no-scroll');
        this.displayChapter(this.currentChapter || 1);
        this.playFlipSound();
    }

    /**
     * Close book overlay and continue to final scene.
     */
    closeBook() {
        if (!this.bookContainer) return;
        this.bookContainer.classList.add('hidden');
        document.body.classList.remove('no-scroll');

        if (window.sceneManager && typeof window.sceneManager.showChoiceHub === 'function') {
            window.sceneManager.showChoiceHub();
        }
    }

    /**
     * Attach navigation events.
     */
    attachEventListeners() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const closeBtn = document.getElementById('close-book');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousChapter());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextChapter());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeBook());

        document.addEventListener('keydown', (event) => {
            if (!this.bookContainer || this.bookContainer.classList.contains('hidden')) return;
            if (event.key === 'ArrowLeft') this.previousChapter();
            if (event.key === 'ArrowRight') this.nextChapter();
            if (event.key === 'Escape') this.closeBook();
        });
    }

    /**
     * Play page flip effect.
     */
    playFlipSound() {
        if (window.audioManager && typeof window.audioManager.playFlipSound === 'function') {
            window.audioManager.playFlipSound();
            return;
        }

        const audio = document.getElementById('flip-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }
}
