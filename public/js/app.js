/* ==========================================================================
   Absolute Colouring — Main Application Controller
   Enhanced with Whiteboard, Blackboard, Glowing Colours, Scratch Art,
   and strict Completion Cheering & Points logic.
   ========================================================================== */

import { PAGES, PAGE_BY_ID, CATEGORIES } from './art.js';
import { CRAYONS, WATERCOLOURS, SPRAYS, RAINBOW, THEMES } from './palettes.js';
import { sound } from './audio.js';
import { confetti } from './confetti.js';
import { ScoreManager, BoardState, ArtState, HistoryManager } from './storage.js';
import { SCRATCH_THEMES, getScratchUnderlayerSVG } from './scratch-art.js';

class ColouringApp {
  constructor() {
    this.currentMode = 'colouring'; // 'colouring' | 'whiteboard' | 'blackboard' | 'scratch'
    this.currentView = 'gallery';
    this.currentPage = null;
    this.currentCategory = 'all';

    // Tool state
    this.activeTool = 'bucket'; // 'bucket' | 'draw' | 'glow' | 'sticker' | 'eraser'
    this.brushType = 'crayon'; // 'crayon' | 'marker' | 'sparkle'
    this.brushSize = 16;
    this.activePaletteTab = 'crayons';
    this.activeColor = CRAYONS[0].hex;
    this.activeColorName = CRAYONS[0].name;
    this.isRainbow = false;
    this.rainbowIndex = 0;
    this.rainbowPalette = ['#FF5F6D', '#FFC371', '#F9F871', '#6EE7B7', '#5BC0EB', '#9B7BFF', '#F472B6'];

    // Scratch art state
    this.scratchTheme = 'rainbow';
    this.scratchRevealPct = 0;
    this.scratchCelebrated = false;
    this.lastRevealCheckTime = 0;

    // Completion tracking
    this.completionThreshold = 85; // Must fill >= 85% of areas to earn cheering & points

    // Sticker state
    this.stickers = ['⭐', '❤️', '🌸', '🌈', '👑', '🐾', '🦋', '🎈', '🍩', '🚀', '💎', '🍄', '✨', '🍦', '☀️', '🐱'];
    this.activeSticker = '⭐';

    // Canvas drawing state
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    // History
    this.history = new HistoryManager(() => this.updateHistoryButtons());

    // DOM references
    this.dom = {};
  }

  init() {
    this.bindDOM();
    this.setupConfetti();
    this.setupAudio();
    this.setupScoreDisplay();
    this.setupEventListeners();
    this.renderCategoryBar();
    this.renderGalleryGrid();
    this.renderSwatches();
    this.renderMagicThemesModal();
    this.renderStickerTray();
    this.updateActiveColorDisplay();
    this.updateToolUI();

    // Check URL parameters for direct picture linking (e.g. ?pic=fox)
    const params = new URLSearchParams(window.location.search);
    const picParam = params.get('pic');
    const modeParam = params.get('mode');

    if (modeParam && ['colouring', 'whiteboard', 'blackboard', 'scratch'].includes(modeParam)) {
      this.switchMode(modeParam);
    } else if (picParam && PAGE_BY_ID[picParam]) {
      this.switchMode('colouring');
      this.openStudio(PAGE_BY_ID[picParam]);
    } else {
      this.showGallery();
    }
  }

  bindDOM() {
    this.dom.galleryView = document.getElementById('gallery-view');
    this.dom.studioView = document.getElementById('studio-view');
    this.dom.categoryBar = document.getElementById('category-bar');
    this.dom.pictureGrid = document.getElementById('picture-grid');

    // Studio DOM
    this.dom.canvasFrame = document.getElementById('canvas-frame');
    this.dom.artContainer = document.getElementById('art-container');
    this.dom.scratchUnderlayer = document.getElementById('scratch-underlayer');
    this.dom.drawCanvas = document.getElementById('draw-canvas');
    this.dom.studioTitle = document.getElementById('studio-title');
    this.dom.studioBadge = document.getElementById('studio-badge');
    this.dom.pageCounter = document.getElementById('page-counter');
    this.dom.studioPaging = document.getElementById('studio-paging');
    this.dom.btnBackGallery = document.getElementById('btn-back-gallery');

    // Completion progress DOM
    this.dom.completionPill = document.getElementById('completion-pill');
    this.dom.completionBarFill = document.getElementById('completion-bar-fill');
    this.dom.completionBadge = document.getElementById('completion-badge');

    // Scratch controls DOM
    this.dom.scratchControls = document.getElementById('scratch-controls');
    this.dom.scratchThemeSelect = document.getElementById('scratch-theme-select');
    this.dom.btnNewScratch = document.getElementById('btn-new-scratch');
    this.dom.scratchRevealBadge = document.getElementById('scratch-reveal-badge');

    // Palette & Tools DOM
    this.dom.palettePanel = document.getElementById('studio-palette-panel');
    this.dom.swatchesGrid = document.getElementById('swatches-grid');
    this.dom.activeSwatch = document.getElementById('active-swatch');
    this.dom.activeColorName = document.getElementById('active-color-name');
    this.dom.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.dom.soundIcon = document.getElementById('sound-icon');
    this.dom.themesModal = document.getElementById('themes-modal');
    this.dom.themesGrid = document.getElementById('themes-grid');
    this.dom.stickerTray = document.getElementById('sticker-tray');
    this.dom.brushOptions = document.getElementById('brush-options');

    // Score badge
    this.dom.scoreBadge = document.getElementById('score-badge');
    this.dom.scorePoints = document.getElementById('score-points');

    // Modals
    this.dom.rewardModal = document.getElementById('reward-modal');
    this.dom.encourageModal = document.getElementById('encourage-modal');
    this.dom.encouragePct = document.getElementById('encourage-pct');
    this.dom.encourageProgressFill = document.getElementById('encourage-progress-fill');
    this.dom.rewardTitle = document.getElementById('reward-title');
    this.dom.rewardDesc = document.getElementById('reward-desc');
    this.dom.rewardPointsValue = document.getElementById('reward-points-value');
    this.dom.rewardTotalLabel = document.getElementById('reward-total-label');

    // Action buttons
    this.dom.undoBtn = document.getElementById('btn-undo');
    this.dom.redoBtn = document.getElementById('btn-redo');

    // Tool buttons & labels
    this.dom.toolBtnBucket = document.getElementById('tool-btn-bucket');
    this.dom.toolBtnDraw = document.getElementById('tool-btn-draw');
    this.dom.toolIconDraw = document.getElementById('tool-icon-draw');
    this.dom.toolLabelDraw = document.getElementById('tool-label-draw');
    this.dom.toolBtnGlow = document.getElementById('tool-btn-glow');
    this.dom.toolBtnSticker = document.getElementById('tool-btn-sticker');
    this.dom.toolBtnEraser = document.getElementById('tool-btn-eraser');
    this.dom.toolIconEraser = document.getElementById('tool-icon-eraser');
    this.dom.toolLabelEraser = document.getElementById('tool-label-eraser');
    this.dom.btnMagicThemes = document.getElementById('btn-magic-themes');

    // Canvas context
    if (this.dom.drawCanvas) {
      this.ctx = this.dom.drawCanvas.getContext('2d', { willReadFrequently: true });
    }
  }

  setupConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      confetti.init(canvas);
    }
  }

  setupAudio() {
    this.updateSoundButtonState();
    this.dom.soundToggleBtn.addEventListener('click', () => {
      sound.init();
      const muted = sound.toggleMute();
      this.updateSoundButtonState();
      if (!muted) sound.playPop();
    });
  }

  setupScoreDisplay() {
    const points = ScoreManager.getPoints();
    if (this.dom.scorePoints) {
      this.dom.scorePoints.textContent = points;
    }
  }

  updateSoundButtonState() {
    const muted = sound.isMuted();
    this.dom.soundIcon.textContent = muted ? '🔇' : '🔊';
    this.dom.soundToggleBtn.setAttribute('aria-label', muted ? 'Unmute Sound' : 'Mute Sound');
  }

  setupEventListeners() {
    // Mode switcher buttons
    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        sound.playPop();
        const mode = tab.dataset.mode;
        this.switchMode(mode);
      });
    });

    // Logo returns to current mode home / gallery
    document.getElementById('app-logo').addEventListener('click', (e) => {
      e.preventDefault();
      sound.playPop();
      if (this.currentMode === 'colouring') {
        this.showGallery();
      } else {
        this.switchMode('colouring');
      }
    });

    // Surprise Me / Random Picture
    document.getElementById('btn-random').addEventListener('click', () => {
      sound.playSparkle();
      if (this.currentMode !== 'colouring') {
        this.switchMode('colouring');
      }
      const randomPage = PAGES[Math.floor(Math.random() * PAGES.length)];
      this.openStudio(randomPage);
    });

    // Studio Back button
    this.dom.btnBackGallery.addEventListener('click', () => {
      sound.playPop();
      this.showGallery();
    });

    // Navigation Prev / Next
    document.getElementById('btn-prev-page').addEventListener('click', () => {
      this.navigatePage(-1);
    });
    document.getElementById('btn-next-page').addEventListener('click', () => {
      this.navigatePage(1);
    });

    // Tool switching
    document.querySelectorAll('.tool-btn[data-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        sound.playPop();
        this.setTool(tool);
      });
    });

    // Brush sizes
    document.querySelectorAll('.size-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        sound.playPop();
        document.querySelectorAll('.size-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.brushSize = Number(pill.dataset.size || 16);
      });
    });

    // Palette tab switching
    document.querySelectorAll('.palette-tab-btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        sound.playPop();
        document.querySelectorAll('.palette-tab-btn').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        this.activePaletteTab = tab.dataset.tab;
        this.renderSwatches();
      });
    });

    // Scratch theme selector & New Sheet button
    if (this.dom.scratchThemeSelect) {
      this.dom.scratchThemeSelect.addEventListener('change', (e) => {
        sound.playPop();
        this.scratchTheme = e.target.value;
        this.resetScratchCard();
      });
    }

    if (this.dom.btnNewScratch) {
      this.dom.btnNewScratch.addEventListener('click', () => {
        sound.playSparkle();
        this.resetScratchCard();
      });
    }

    // Magic Themes Modal triggers
    this.dom.btnMagicThemes.addEventListener('click', () => {
      sound.playPop();
      this.openMagicThemesModal();
    });
    document.getElementById('btn-close-themes').addEventListener('click', () => {
      sound.playPop();
      this.closeMagicThemesModal();
    });
    this.dom.themesModal.addEventListener('click', (e) => {
      if (e.target === this.dom.themesModal) {
        this.closeMagicThemesModal();
      }
    });

    // Reward modal buttons
    const btnRewardSave = document.getElementById('btn-reward-save');
    const btnRewardNext = document.getElementById('btn-reward-next');
    const btnRewardClose = document.getElementById('btn-reward-close');

    if (btnRewardSave) {
      btnRewardSave.addEventListener('click', () => {
        sound.playPop();
        this.closeRewardModal();
        this.handleSaveImage();
      });
    }
    if (btnRewardNext) {
      btnRewardNext.addEventListener('click', () => {
        sound.playPop();
        this.closeRewardModal();
        this.navigatePage(1);
      });
    }
    if (btnRewardClose) {
      btnRewardClose.addEventListener('click', () => {
        sound.playPop();
        this.closeRewardModal();
      });
    }

    // Encouragement modal button
    const btnEncourageKeep = document.getElementById('btn-encourage-keep');
    if (btnEncourageKeep) {
      btnEncourageKeep.addEventListener('click', () => {
        sound.playPop();
        this.closeEncourageModal();
      });
    }

    // Undo / Redo
    this.dom.undoBtn.addEventListener('click', () => this.handleUndo());
    this.dom.redoBtn.addEventListener('click', () => this.handleRedo());

    // Clear / Reset
    document.getElementById('btn-clear-page').addEventListener('click', () => {
      this.handleClearPage();
    });

    // Save Picture
    document.getElementById('btn-save-image').addEventListener('click', () => {
      this.handleSaveImage();
    });

    // Print Sheet
    document.getElementById('btn-print-sheet').addEventListener('click', () => {
      sound.playPop();
      window.print();
    });

    // Tada! Celebration button (Strict completion check!)
    document.getElementById('btn-celebrate').addEventListener('click', () => {
      this.handleTadaClick();
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) this.handleRedo();
        else this.handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        this.handleRedo();
      }
    });

    // Setup freehand canvas listeners
    this.setupCanvasDrawing();
  }

  /* ==========================================================================
     MODE SWITCHING: COLOURING / WHITEBOARD / BLACKBOARD / SCRATCH ART
     ========================================================================== */
  switchMode(mode) {
    this.currentMode = mode;

    // Update active tab in header
    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    // Remove any mode class from body
    document.body.classList.remove('mode-colouring', 'mode-whiteboard', 'mode-blackboard', 'mode-scratch');
    document.body.classList.add(`mode-${mode}`);

    // Reset frame class
    this.dom.canvasFrame.className = 'canvas-frame';

    if (mode === 'colouring') {
      this.dom.scratchUnderlayer.style.display = 'none';
      this.dom.artContainer.style.display = 'block';
      this.dom.scratchControls.style.display = 'none';
      this.dom.completionPill.style.display = 'inline-flex';
      this.dom.studioPaging.style.display = 'flex';
      this.dom.btnBackGallery.style.display = 'inline-flex';
      this.dom.palettePanel.style.display = 'flex';

      // Restore tool buttons
      this.dom.toolBtnBucket.style.display = 'flex';
      this.dom.btnMagicThemes.style.display = 'flex';
      this.dom.toolIconDraw.textContent = '🖍️';
      this.dom.toolLabelDraw.textContent = 'Draw';
      this.dom.toolIconEraser.textContent = '🧽';
      this.dom.toolLabelEraser.textContent = 'Eraser';

      if (this.currentPage) {
        this.openStudio(this.currentPage);
      } else {
        this.showGallery();
      }
    } else if (mode === 'whiteboard') {
      this.openWhiteboardStudio();
    } else if (mode === 'blackboard') {
      this.openBlackboardStudio();
    } else if (mode === 'scratch') {
      this.openScratchStudio();
    }
  }

  openWhiteboardStudio() {
    this.currentView = 'studio';
    this.dom.galleryView.style.display = 'none';
    this.dom.studioView.style.display = 'flex';

    // Frame styling
    this.dom.canvasFrame.className = 'canvas-frame frame-whiteboard';
    this.dom.artContainer.style.display = 'none';
    this.dom.scratchUnderlayer.style.display = 'none';

    // Nav controls
    this.dom.studioTitle.textContent = 'Shiny Whiteboard';
    this.dom.studioBadge.textContent = '📋 Marker Studio';
    this.dom.btnBackGallery.style.display = 'none';
    this.dom.studioPaging.style.display = 'none';
    this.dom.completionPill.style.display = 'none';
    this.dom.scratchControls.style.display = 'none';
    this.dom.palettePanel.style.display = 'flex';

    // Toolbox customization
    this.dom.toolBtnBucket.style.display = 'none';
    this.dom.btnMagicThemes.style.display = 'none';
    this.dom.toolIconDraw.textContent = '🖍️';
    this.dom.toolLabelDraw.textContent = 'Marker';
    this.dom.toolIconEraser.textContent = '🧽';
    this.dom.toolLabelEraser.textContent = 'Eraser';

    // Reset canvas & load saved board
    this.history.reset();
    this.resizeDrawCanvas();
    this.clearCanvas();

    const savedBoard = BoardState.getBoard('whiteboard');
    if (savedBoard) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, 1000, 760);
      };
      img.src = savedBoard;
    }

    this.setTool('draw');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openBlackboardStudio() {
    this.currentView = 'studio';
    this.dom.galleryView.style.display = 'none';
    this.dom.studioView.style.display = 'flex';

    // Frame styling
    this.dom.canvasFrame.className = 'canvas-frame frame-blackboard';
    this.dom.artContainer.style.display = 'none';
    this.dom.scratchUnderlayer.style.display = 'none';

    // Nav controls
    this.dom.studioTitle.textContent = 'Classic Chalkboard';
    this.dom.studioBadge.textContent = '⬛ Chalk Studio';
    this.dom.btnBackGallery.style.display = 'none';
    this.dom.studioPaging.style.display = 'none';
    this.dom.completionPill.style.display = 'none';
    this.dom.scratchControls.style.display = 'none';
    this.dom.palettePanel.style.display = 'flex';

    // Toolbox customization
    this.dom.toolBtnBucket.style.display = 'none';
    this.dom.btnMagicThemes.style.display = 'none';
    this.dom.toolIconDraw.textContent = '🖍️';
    this.dom.toolLabelDraw.textContent = 'Chalk';
    this.dom.toolIconEraser.textContent = '🧽';
    this.dom.toolLabelEraser.textContent = 'Duster';

    // Reset canvas & load saved board
    this.history.reset();
    this.resizeDrawCanvas();
    this.clearCanvas();

    const savedBoard = BoardState.getBoard('blackboard');
    if (savedBoard) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, 1000, 760);
      };
      img.src = savedBoard;
    }

    this.setTool('draw');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openScratchStudio() {
    this.currentView = 'studio';
    this.dom.galleryView.style.display = 'none';
    this.dom.studioView.style.display = 'flex';

    // Frame styling
    this.dom.canvasFrame.className = 'canvas-frame frame-scratch';
    this.dom.artContainer.style.display = 'none';
    this.dom.scratchUnderlayer.style.display = 'flex';

    // Nav controls
    this.dom.studioTitle.textContent = 'Magic Scratch Art';
    this.dom.studioBadge.textContent = '✨ Scratch to Reveal';
    this.dom.btnBackGallery.style.display = 'none';
    this.dom.studioPaging.style.display = 'none';
    this.dom.completionPill.style.display = 'none';
    this.dom.scratchControls.style.display = 'inline-flex';
    this.dom.palettePanel.style.display = 'none'; // Not needed when scratching

    // Toolbox customization
    this.dom.toolBtnBucket.style.display = 'none';
    this.dom.btnMagicThemes.style.display = 'none';
    this.dom.toolIconDraw.textContent = '✏️';
    this.dom.toolLabelDraw.textContent = 'Stylus';
    this.dom.toolIconEraser.textContent = '🪄';
    this.dom.toolLabelEraser.textContent = 'Scraper';

    // Initialize or reset scratch card
    this.resetScratchCard();
    this.setTool('draw');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetScratchCard() {
    this.history.reset();
    this.scratchCelebrated = false;
    this.scratchRevealPct = 0;
    this.updateScratchRevealBadge(0);

    // Mount underlayer SVG
    const underlayerSVG = getScratchUnderlayerSVG(this.scratchTheme);
    this.dom.scratchUnderlayer.innerHTML = underlayerSVG;

    // Reset draw canvas and coat with black scratch layer
    this.resizeDrawCanvas();
    this.coatCanvasWithBlack();
  }

  coatCanvasWithBlack() {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = '#14161F';
    this.ctx.fillRect(0, 0, 1000, 760);

    // Subtle metallic scratch sheen
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 1000;
      const y = Math.random() * 760;
      this.ctx.fillRect(x, y, 2, 2);
    }
    this.ctx.restore();
  }

  updateScratchRevealBadge(pct) {
    this.scratchRevealPct = pct;
    if (this.dom.scratchRevealBadge) {
      this.dom.scratchRevealBadge.textContent = `✨ ${pct}% revealed`;
    }
  }

  calculateScratchReveal() {
    if (!this.ctx || this.currentMode !== 'scratch') return;

    // Sample pixels across a 32x24 grid to measure transparency
    const stepX = 1000 / 32;
    const stepY = 760 / 24;
    let clearSamples = 0;
    const totalSamples = 32 * 24;

    try {
      const imgData = this.ctx.getImageData(0, 0, 1000, 760);
      const data = imgData.data;

      for (let y = 0; y < 24; y++) {
        for (let x = 0; x < 32; x++) {
          const px = Math.floor(x * stepX);
          const py = Math.floor(y * stepY);
          const idx = (py * 1000 + px) * 4;
          const alpha = data[idx + 3];
          if (alpha < 60) {
            clearSamples++;
          }
        }
      }

      const pct = Math.min(100, Math.round((clearSamples / totalSamples) * 100));
      this.updateScratchRevealBadge(pct);

      if (pct >= 75 && !this.scratchCelebrated) {
        this.scratchCelebrated = true;
        sound.playCelebration();
        sound.playPoints();
        confetti.burst(160);
        this.showToast('🌟 Wonderful Scratch Art! ✨');
      }
    } catch {
      // Canvas read error fallback
    }
  }

  /* ==========================================================================
     GALLERY VIEW LOGIC
     ========================================================================== */
  showGallery() {
    this.currentView = 'gallery';
    this.dom.studioView.style.display = 'none';
    this.dom.galleryView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderGalleryGrid();
  }

  renderCategoryBar() {
    this.dom.categoryBar.innerHTML = '';
    CATEGORIES.forEach((cat) => {
      const count =
        cat.id === 'all'
          ? PAGES.length
          : PAGES.filter((p) => p.category === cat.id).length;

      const pill = document.createElement('button');
      pill.className = `category-pill ${this.currentCategory === cat.id ? 'active' : ''}`;
      pill.innerHTML = `<span>${cat.emoji}</span><span>${cat.label}</span><span class="category-count">${count}</span>`;
      pill.addEventListener('click', () => {
        sound.playPop();
        this.currentCategory = cat.id;
        document.querySelectorAll('.category-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderGalleryGrid();
      });
      this.dom.categoryBar.appendChild(pill);
    });
  }

  renderGalleryGrid() {
    this.dom.pictureGrid.innerHTML = '';
    const filtered =
      this.currentCategory === 'all'
        ? PAGES
        : PAGES.filter((p) => p.category === this.currentCategory);

    filtered.forEach((page) => {
      const isColored = ArtState.isPageColored(page.id);
      const isCompleted = ScoreManager.isPageCompleted(page.id);
      const savedData = ArtState.getPageData(page.id);

      const card = document.createElement('div');
      card.className = 'picture-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="card-thumb-wrap">
          ${page.art}
          ${isCompleted ? '<div class="card-badge-status">⭐ Finished!</div>' : isColored ? '<div class="card-badge-status">In Progress</div>' : ''}
        </div>
        <div class="card-info">
          <div class="card-title-row">
            <h3 class="card-title">${page.title}</h3>
            <span class="card-tag">${page.categoryEmoji} ${page.categoryLabel}</span>
          </div>
          <p class="card-blurb">${page.blurb}</p>
        </div>
      `;

      // Apply saved colors to thumbnail SVG
      if (savedData.fills && Object.keys(savedData.fills).length > 0) {
        const regions = card.querySelectorAll('.card-thumb-wrap .region');
        Object.entries(savedData.fills).forEach(([idx, color]) => {
          if (regions[idx]) {
            regions[idx].style.fill = color;
          }
        });
      }

      const launch = () => {
        sound.playPop();
        this.openStudio(page);
      };

      card.addEventListener('click', launch);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          launch();
        }
      });

      this.dom.pictureGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     COLOURING STUDIO VIEW LOGIC
     ========================================================================== */
  openStudio(page) {
    this.currentPage = page;
    this.currentView = 'studio';
    this.currentMode = 'colouring';

    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.mode === 'colouring');
    });

    this.dom.galleryView.style.display = 'none';
    this.dom.studioView.style.display = 'flex';
    this.dom.canvasFrame.className = 'canvas-frame';
    this.dom.artContainer.style.display = 'block';
    this.dom.scratchUnderlayer.style.display = 'none';
    this.dom.scratchControls.style.display = 'none';
    this.dom.completionPill.style.display = 'inline-flex';
    this.dom.studioPaging.style.display = 'flex';
    this.dom.btnBackGallery.style.display = 'inline-flex';
    this.dom.palettePanel.style.display = 'flex';

    this.dom.toolBtnBucket.style.display = 'flex';
    this.dom.btnMagicThemes.style.display = 'flex';
    this.dom.toolIconDraw.textContent = '🖍️';
    this.dom.toolLabelDraw.textContent = 'Draw';
    this.dom.toolIconEraser.textContent = '🧽';
    this.dom.toolLabelEraser.textContent = 'Eraser';

    // Update nav headers
    this.dom.studioTitle.textContent = page.title;
    this.dom.studioBadge.textContent = `${page.categoryEmoji} ${page.categoryLabel}`;
    this.dom.pageCounter.textContent = `${page.number} / ${PAGES.length}`;

    // Reset history stack for this page
    this.history.reset();

    // Mount SVG into container
    this.dom.artContainer.innerHTML = page.art;

    // Load saved fills
    const savedData = ArtState.getPageData(page.id);
    const regions = this.dom.artContainer.querySelectorAll('.region');

    regions.forEach((region, index) => {
      region.dataset.regionIndex = index;
      if (savedData.fills && savedData.fills[index]) {
        region.style.fill = savedData.fills[index];
      } else {
        region.style.fill = '#FFFFFF';
      }

      // Add click handler for tap-to-fill
      region.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleRegionClick(region, index);
      });
    });

    // Reset and load drawing canvas
    this.resizeDrawCanvas();
    this.clearCanvas();
    if (savedData.drawDataUrl) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, 1000, 760);
      };
      img.src = savedData.drawDataUrl;
    }

    // Load stickers
    if (savedData.stickers && Array.isArray(savedData.stickers)) {
      savedData.stickers.forEach((s) => this.drawSticker(s.sticker, s.x, s.y, s.size, s.rot));
    }

    // Default tool
    this.setTool('bucket');
    this.updateCompletionProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigatePage(offset) {
    if (!this.currentPage) return;
    sound.playPop();
    const currentIndex = PAGES.findIndex((p) => p.id === this.currentPage.id);
    let newIndex = currentIndex + offset;
    if (newIndex < 0) newIndex = PAGES.length - 1;
    if (newIndex >= PAGES.length) newIndex = 0;
    this.openStudio(PAGES[newIndex]);
  }

  setTool(tool) {
    this.activeTool = tool;
    document.body.className = `tool-${tool} mode-${this.currentMode}`;

    document.querySelectorAll('.tool-btn[data-tool]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });

    // Show/hide brush size options
    if (this.dom.brushOptions) {
      this.dom.brushOptions.style.display = (tool === 'draw' || tool === 'glow') ? 'flex' : 'none';
    }

    // Open/close sticker tray
    if (this.dom.stickerTray) {
      this.dom.stickerTray.classList.toggle('open', tool === 'sticker');
    }
  }

  updateToolUI() {
    this.setTool(this.activeTool);
  }

  /* ==========================================================================
     TAP TO FILL & SVG INTERACTION
     ========================================================================== */
  handleRegionClick(region, index) {
    if (this.activeTool !== 'bucket' && this.activeTool !== 'eraser') return;

    const prevColor = region.style.fill || '#FFFFFF';
    let newColor = '#FFFFFF';

    if (this.activeTool === 'bucket') {
      if (this.isRainbow) {
        newColor = this.rainbowPalette[this.rainbowIndex % this.rainbowPalette.length];
        this.rainbowIndex += 1;
      } else {
        newColor = this.activeColor;
      }
    }

    if (prevColor === newColor) return;

    region.style.fill = newColor;
    sound.playFill();

    // Push action to history
    this.history.push({
      type: 'fill',
      index,
      prevColor,
      newColor,
    });

    this.saveCurrentPageState();
    this.updateCompletionProgress();
  }

  /* ==========================================================================
     COMPLETION TRACKING ("Only finishing colouring get cheering and points")
     ========================================================================== */
  calculateCompletion() {
    if (!this.dom.artContainer || this.currentMode !== 'colouring') return { pct: 0, colored: 0, total: 0 };
    const regions = this.dom.artContainer.querySelectorAll('.region');
    const total = regions.length;
    if (total === 0) return { pct: 0, colored: 0, total: 0 };

    let colored = 0;
    regions.forEach((r) => {
      const fill = (r.style.fill || '').toLowerCase().trim();
      if (fill && fill !== '#ffffff' && fill !== 'rgb(255, 255, 255)' && fill !== 'white') {
        colored++;
      }
    });

    const pct = Math.round((colored / total) * 100);
    return { pct, colored, total };
  }

  updateCompletionProgress() {
    if (this.currentMode !== 'colouring') return;
    const { pct } = this.calculateCompletion();

    if (this.dom.completionBarFill) {
      this.dom.completionBarFill.style.width = `${pct}%`;
    }

    if (this.dom.completionBadge) {
      if (pct >= this.completionThreshold) {
        this.dom.completionBadge.textContent = `⭐ ${pct}% Done!`;
        this.dom.completionPill.classList.add('finished');
      } else {
        this.dom.completionBadge.textContent = `${pct}% done`;
        this.dom.completionPill.classList.remove('finished');
      }
    }
  }

  handleTadaClick() {
    // For freehand boards (Whiteboard / Blackboard / Scratch), celebrate directly
    if (this.currentMode !== 'colouring') {
      sound.playCelebration();
      confetti.burst(150);
      this.showToast('🌟 Awesome Artwork! 🎨');
      return;
    }

    // STRICT CHECK FOR COLOURING BOOK
    const { pct, colored, total } = this.calculateCompletion();

    if (pct < this.completionThreshold) {
      // NOT FINISHED YET: No cheering, no confetti, no points awarded!
      sound.playNotice();
      this.openEncourageModal(pct);
    } else {
      // TRULY FINISHED: Fanfare, crystal points chime, confetti, points & stars!
      const result = ScoreManager.completePage(this.currentPage.id);
      this.setupScoreDisplay();

      // Bump animation on score badge
      if (this.dom.scoreBadge) {
        this.dom.scoreBadge.classList.remove('bump');
        void this.dom.scoreBadge.offsetWidth;
        this.dom.scoreBadge.classList.add('bump');
      }

      sound.playCelebration();
      setTimeout(() => sound.playPoints(), 400);
      confetti.burst(250);

      this.openRewardModal(result);
    }
  }

  openEncourageModal(pct) {
    if (this.dom.encouragePct) this.dom.encouragePct.textContent = `${pct}%`;
    if (this.dom.encourageProgressFill) this.dom.encourageProgressFill.style.width = `${pct}%`;
    if (this.dom.encourageModal) this.dom.encourageModal.classList.add('open');
  }

  closeEncourageModal() {
    if (this.dom.encourageModal) this.dom.encourageModal.classList.remove('open');
  }

  openRewardModal(result) {
    if (this.dom.rewardTitle) {
      this.dom.rewardTitle.textContent = result.isFirstTime
        ? '🎉 Masterpiece Finished! 🌟'
        : '🌟 Beautiful Replay! 🎨';
    }
    if (this.dom.rewardDesc) {
      this.dom.rewardDesc.textContent = `You completed "${this.currentPage.title}" with fantastic artist colours!`;
    }
    if (this.dom.rewardPointsValue) {
      this.dom.rewardPointsValue.textContent = `+${result.pointsEarned} Points ${result.isFirstTime ? '⭐⭐⭐' : '⭐'}`;
    }
    if (this.dom.rewardTotalLabel) {
      this.dom.rewardTotalLabel.textContent = `Total Score: ${result.totalPoints} pts (${result.totalStars} Stars)`;
    }
    if (this.dom.rewardModal) {
      this.dom.rewardModal.classList.add('open');
    }
  }

  closeRewardModal() {
    if (this.dom.rewardModal) this.dom.rewardModal.classList.remove('open');
  }

  /* ==========================================================================
     FREEHAND CANVAS DRAWING, GLOWING COLOURS & SCRATCH ART
     ========================================================================== */
  setupCanvasDrawing() {
    const canvas = this.dom.drawCanvas;
    if (!canvas) return;

    window.addEventListener('resize', () => this.resizeDrawCanvas());

    const getCanvasPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = 1000 / rect.width;
      const scaleY = 760 / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    canvas.addEventListener('pointerdown', (e) => {
      if (this.activeTool === 'sticker') {
        const pos = getCanvasPos(e);
        this.handleStickerStamp(pos.x, pos.y);
        return;
      }

      const validDrawTool = this.activeTool === 'draw' || this.activeTool === 'glow' || this.activeTool === 'eraser';
      if (!validDrawTool && this.currentMode !== 'scratch') return;

      this.isDrawing = true;
      const pos = getCanvasPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
      canvas.setPointerCapture(e.pointerId);

      // Save initial canvas state for undo
      this.canvasSnapshotBeforeStroke = this.ctx.getImageData(0, 0, 1000, 760);

      // Draw initial dot
      this.drawStroke(pos.x, pos.y);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!this.isDrawing) return;
      const pos = getCanvasPos(e);
      this.drawStroke(pos.x, pos.y);
      this.lastX = pos.x;
      this.lastY = pos.y;

      // Rate-limited scratch reveal measurement
      if (this.currentMode === 'scratch') {
        const now = Date.now();
        if (now - this.lastRevealCheckTime > 300) {
          this.lastRevealCheckTime = now;
          this.calculateScratchReveal();
        }
      }
    });

    const stopDrawing = (e) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      // Record canvas stroke action
      const afterStroke = this.ctx.getImageData(0, 0, 1000, 760);
      const beforeStroke = this.canvasSnapshotBeforeStroke;
      this.history.push({
        type: 'canvas',
        before: beforeStroke,
        after: afterStroke,
      });

      this.saveActiveBoardState();

      if (this.currentMode === 'scratch') {
        this.calculateScratchReveal();
      }
    };

    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
  }

  resizeDrawCanvas() {
    const canvas = this.dom.drawCanvas;
    if (!canvas) return;
    canvas.width = 1000;
    canvas.height = 760;
  }

  clearCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, 1000, 760);
  }

  drawStroke(x, y) {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // 1. SCRATCH ART MODE (Scratching away the black coating)
    if (this.currentMode === 'scratch') {
      this.ctx.globalCompositeOperation = 'destination-out';
      const stylusSize = this.activeTool === 'eraser' ? 52 : (this.brushSize * 1.8);
      this.ctx.lineWidth = stylusSize;

      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      sound.playScratch();
      this.ctx.restore();
      return;
    }

    // 2. ERASER TOOL
    if (this.activeTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = this.brushSize * 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.restore();
      return;
    }

    // 3. GLOW BRUSH (Neon glow aura + bright inner core)
    if (this.activeTool === 'glow') {
      const glowColor = this.isRainbow
        ? this.rainbowPalette[this.rainbowIndex % this.rainbowPalette.length]
        : this.activeColor;

      sound.playGlow();

      // Outer luminous glow
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.shadowBlur = 24;
      this.ctx.shadowColor = glowColor;
      this.ctx.strokeStyle = glowColor;
      this.ctx.lineWidth = this.brushSize;

      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      // Inner white/pale core for neon tube intensity
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = '#FFFFFF';
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = Math.max(3, this.brushSize * 0.35);

      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      this.ctx.restore();
      return;
    }

    // 4. BLACKBOARD CHALK BRUSH
    if (this.currentMode === 'blackboard') {
      this.ctx.globalCompositeOperation = 'source-over';
      const color = this.isRainbow
        ? this.rainbowPalette[Math.floor(Math.random() * this.rainbowPalette.length)]
        : this.activeColor;

      // Soft textured chalk stroke
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = this.brushSize;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = color;

      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      // Chalk dust speckles
      this.ctx.fillStyle = color;
      for (let i = 0; i < 2; i++) {
        const ox = (Math.random() - 0.5) * this.brushSize * 1.2;
        const oy = (Math.random() - 0.5) * this.brushSize * 1.2;
        this.ctx.fillRect(x + ox, y + oy, 2, 2);
      }

      this.ctx.restore();
      return;
    }

    // 5. REGULAR CRAYON / MARKER DRAWING
    this.ctx.globalCompositeOperation = 'source-over';
    const color = this.isRainbow
      ? this.rainbowPalette[Math.floor(Math.random() * this.rainbowPalette.length)]
      : this.activeColor;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = this.brushSize;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.ctx.restore();
  }

  handleStickerStamp(x, y) {
    const rot = (Math.random() - 0.5) * 0.4;
    const size = 54;
    const sticker = this.activeSticker;

    // Snapshot before sticker
    const beforeStroke = this.ctx.getImageData(0, 0, 1000, 760);
    this.drawSticker(sticker, x, y, size, rot);
    const afterStroke = this.ctx.getImageData(0, 0, 1000, 760);

    sound.playStamp();

    this.history.push({
      type: 'sticker',
      sticker,
      x,
      y,
      size,
      rot,
      before: beforeStroke,
      after: afterStroke,
    });

    this.saveActiveBoardState();
  }

  drawSticker(sticker, x, y, size = 54, rot = 0) {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rot);
    this.ctx.font = `${size}px system-ui, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(sticker, 0, 0);
    this.ctx.restore();
  }

  /* ==========================================================================
     MAGIC PALETTES (ONE-CLICK AUTO COLOUR)
     ========================================================================== */
  renderMagicThemesModal() {
    this.dom.themesGrid.innerHTML = '';
    THEMES.forEach((theme) => {
      const card = document.createElement('div');
      card.className = 'theme-card';
      card.innerHTML = `
        <div class="theme-card-header">
          <span>${theme.emoji}</span>
          <span>${theme.name}</span>
        </div>
        <div class="theme-preview-bars">
          <div class="theme-bar" style="background: ${theme.colors.bg}"></div>
          <div class="theme-bar" style="background: ${theme.colors[1]}"></div>
          <div class="theme-bar" style="background: ${theme.colors[2]}"></div>
          <div class="theme-bar" style="background: ${theme.colors[3]}"></div>
          <div class="theme-bar" style="background: ${theme.colors[4]}"></div>
          <div class="theme-bar" style="background: ${theme.colors[5]}"></div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.applyMagicTheme(theme);
        this.closeMagicThemesModal();
      });

      this.dom.themesGrid.appendChild(card);
    });
  }

  openMagicThemesModal() {
    this.dom.themesModal.classList.add('open');
  }

  closeMagicThemesModal() {
    this.dom.themesModal.classList.remove('open');
  }

  applyMagicTheme(theme) {
    if (this.currentMode !== 'colouring') return;
    const regions = this.dom.artContainer.querySelectorAll('.region');
    const prevFills = {};
    const newFills = {};

    regions.forEach((region, index) => {
      prevFills[index] = region.style.fill || '#FFFFFF';
      const tone = region.dataset.tone;
      const themeColor = theme.colors[tone] || '#FFFFFF';
      region.style.fill = themeColor;
      newFills[index] = themeColor;
    });

    sound.playSparkle();
    confetti.burst(60);

    this.history.push({
      type: 'magicTheme',
      prevFills,
      newFills,
    });

    this.saveCurrentPageState();
    this.updateCompletionProgress();
  }

  /* ==========================================================================
     PALETTE & SWATCHES
     ========================================================================== */
  renderSwatches() {
    this.dom.swatchesGrid.innerHTML = '';

    let list = [];
    if (this.activePaletteTab === 'crayons') list = CRAYONS;
    else if (this.activePaletteTab === 'watercolours') list = WATERCOLOURS;
    else if (this.activePaletteTab === 'sprays') list = SPRAYS;

    // Rainbow button always shown first
    const rainbowBtn = document.createElement('button');
    rainbowBtn.className = `swatch-item swatch-rainbow ${this.isRainbow ? 'active' : ''}`;
    rainbowBtn.setAttribute('title', 'Rainbow Magic');
    rainbowBtn.setAttribute('aria-label', 'Rainbow Magic Swatch');
    rainbowBtn.addEventListener('click', () => {
      sound.playPop();
      this.isRainbow = true;
      this.activeColorName = 'Rainbow Magic';
      this.updateActiveColorDisplay();
      document.querySelectorAll('.swatch-item').forEach((s) => s.classList.remove('active'));
      rainbowBtn.classList.add('active');
    });
    this.dom.swatchesGrid.appendChild(rainbowBtn);

    list.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = `swatch-item ${!this.isRainbow && this.activeColor === item.hex ? 'active' : ''}`;
      btn.style.backgroundColor = item.hex;
      btn.setAttribute('title', item.name);
      btn.setAttribute('aria-label', item.name);

      btn.addEventListener('click', () => {
        sound.playPop();
        this.selectColor(item.hex, item.name);
        document.querySelectorAll('.swatch-item').forEach((s) => s.classList.remove('active'));
        btn.classList.add('active');
      });

      this.dom.swatchesGrid.appendChild(btn);
    });
  }

  selectColor(hex, name) {
    this.isRainbow = false;
    this.activeColor = hex;
    this.activeColorName = name;
    this.updateActiveColorDisplay();
  }

  updateActiveColorDisplay() {
    if (this.isRainbow) {
      this.dom.activeSwatch.style.background = RAINBOW.swatch;
      this.dom.activeColorName.textContent = 'Rainbow Magic';
    } else {
      this.dom.activeSwatch.style.background = this.activeColor;
      this.dom.activeColorName.textContent = this.activeColorName;
    }
    this.dom.activeSwatch.classList.remove('bump');
    void this.dom.activeSwatch.offsetWidth;
    this.dom.activeSwatch.classList.add('bump');
  }

  renderStickerTray() {
    if (!this.dom.stickerTray) return;
    this.dom.stickerTray.innerHTML = '';
    this.stickers.forEach((sticker) => {
      const btn = document.createElement('button');
      btn.className = `sticker-item ${this.activeSticker === sticker ? 'active' : ''}`;
      btn.textContent = sticker;
      btn.addEventListener('click', () => {
        sound.playPop();
        this.activeSticker = sticker;
        document.querySelectorAll('.sticker-item').forEach((s) => s.classList.remove('active'));
        btn.classList.add('active');
      });
      this.dom.stickerTray.appendChild(btn);
    });
  }

  /* ==========================================================================
     UNDO, REDO & CLEAR
     ========================================================================== */
  updateHistoryButtons() {
    this.dom.undoBtn.disabled = !this.history.canUndo();
    this.dom.redoBtn.disabled = !this.history.canRedo();
  }

  handleUndo() {
    const action = this.history.undo();
    if (!action) return;

    sound.playUndo();

    if (action.type === 'fill') {
      const region = this.dom.artContainer.querySelector(`[data-region-index="${action.index}"]`);
      if (region) region.style.fill = action.prevColor;
      this.updateCompletionProgress();
    } else if (action.type === 'magicTheme') {
      const regions = this.dom.artContainer.querySelectorAll('.region');
      regions.forEach((region, index) => {
        if (action.prevFills[index]) {
          region.style.fill = action.prevFills[index];
        }
      });
      this.updateCompletionProgress();
    } else if (action.type === 'canvas' || action.type === 'sticker') {
      if (this.ctx && action.before) {
        this.ctx.putImageData(action.before, 0, 0);
      }
    }

    this.saveActiveBoardState();
  }

  handleRedo() {
    const action = this.history.redo();
    if (!action) return;

    sound.playPop();

    if (action.type === 'fill') {
      const region = this.dom.artContainer.querySelector(`[data-region-index="${action.index}"]`);
      if (region) region.style.fill = action.newColor;
      this.updateCompletionProgress();
    } else if (action.type === 'magicTheme') {
      const regions = this.dom.artContainer.querySelectorAll('.region');
      regions.forEach((region, index) => {
        if (action.newFills[index]) {
          region.style.fill = action.newFills[index];
        }
      });
      this.updateCompletionProgress();
    } else if (action.type === 'canvas' || action.type === 'sticker') {
      if (this.ctx && action.after) {
        this.ctx.putImageData(action.after, 0, 0);
      }
    }

    this.saveActiveBoardState();
  }

  handleClearPage() {
    sound.playUndo();

    if (this.currentMode === 'scratch') {
      this.resetScratchCard();
      return;
    }

    if (this.currentMode === 'colouring' && this.dom.artContainer) {
      const regions = this.dom.artContainer.querySelectorAll('.region');
      const prevFills = {};
      regions.forEach((region, index) => {
        prevFills[index] = region.style.fill || '#FFFFFF';
        region.style.fill = '#FFFFFF';
      });

      const beforeCanvas = this.ctx.getImageData(0, 0, 1000, 760);
      this.clearCanvas();

      this.history.push({
        type: 'clear',
        prevFills,
        beforeCanvas,
      });

      this.saveCurrentPageState();
      this.updateCompletionProgress();
    } else {
      // Whiteboard / Blackboard
      this.clearCanvas();
      BoardState.clearBoard(this.currentMode);
    }
  }

  /* ==========================================================================
     SAVING & EXPORT
     ========================================================================== */
  saveActiveBoardState() {
    if (this.currentMode === 'colouring') {
      this.saveCurrentPageState();
    } else if (this.currentMode === 'whiteboard' || this.currentMode === 'blackboard') {
      const dataUrl = this.dom.drawCanvas.toDataURL('image/png');
      BoardState.saveBoard(this.currentMode, dataUrl);
    }
  }

  saveCurrentPageState() {
    if (!this.currentPage || this.currentMode !== 'colouring') return;
    const regions = this.dom.artContainer.querySelectorAll('.region');
    const fills = {};
    regions.forEach((region, index) => {
      if (region.style.fill && region.style.fill !== '#FFFFFF' && region.style.fill !== 'rgb(255, 255, 255)') {
        fills[index] = region.style.fill;
      }
    });

    const drawDataUrl = this.dom.drawCanvas.toDataURL('image/png');

    ArtState.savePageData(this.currentPage.id, {
      fills,
      drawDataUrl,
    });
  }

  handleSaveImage() {
    sound.playCelebration();
    confetti.burst(80);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1000;
    exportCanvas.height = 760;
    const exportCtx = exportCanvas.getContext('2d');

    const downloadFileName =
      this.currentMode === 'colouring' && this.currentPage
        ? `${this.currentPage.id}-by-little-artist.png`
        : `${this.currentMode}-by-little-artist.png`;

    const finishDownload = () => {
      const link = document.createElement('a');
      link.download = downloadFileName;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };

    if (this.currentMode === 'scratch') {
      // For scratch: draw underlayer SVG, then draw remaining scratch canvas on top
      const svgElement = this.dom.scratchUnderlayer.querySelector('svg');
      const svgXml = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        exportCtx.drawImage(img, 0, 0, 1000, 760);
        exportCtx.drawImage(this.dom.drawCanvas, 0, 0, 1000, 760);
        URL.revokeObjectURL(blobURL);
        finishDownload();
      };
      img.src = blobURL;
      return;
    }

    if (this.currentMode === 'blackboard') {
      // Fill dark slate background
      exportCtx.fillStyle = '#1A232A';
      exportCtx.fillRect(0, 0, 1000, 760);
      exportCtx.drawImage(this.dom.drawCanvas, 0, 0, 1000, 760);
      finishDownload();
      return;
    }

    if (this.currentMode === 'whiteboard') {
      // Fill crisp white background
      exportCtx.fillStyle = '#FFFFFF';
      exportCtx.fillRect(0, 0, 1000, 760);
      exportCtx.drawImage(this.dom.drawCanvas, 0, 0, 1000, 760);
      finishDownload();
      return;
    }

    // Colouring mode: SVG + freehand drawing canvas
    exportCtx.fillStyle = '#FFFFFF';
    exportCtx.fillRect(0, 0, 1000, 760);

    const svgElement = this.dom.artContainer.querySelector('svg');
    if (!svgElement) {
      finishDownload();
      return;
    }

    const svgXml = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      exportCtx.drawImage(img, 0, 0, 1000, 760);
      exportCtx.drawImage(this.dom.drawCanvas, 0, 0, 1000, 760);
      URL.revokeObjectURL(blobURL);
      finishDownload();
    };
    img.src = blobURL;
  }

  showToast(message) {
    const toast = document.getElementById('celebration-toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }
}

// Instantiate and initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  const app = new ColouringApp();
  app.init();
  window.colouringApp = app;
});
