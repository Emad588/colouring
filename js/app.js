/* ==========================================================================
   Absolute Colouring — Main Application Controller
   Complete interactive coloring game with tap-to-fill, magic themes,
   freehand crayon/sparkle drawing, sticker stamps, undo/redo, and audio.
   ========================================================================== */

import { PAGES, PAGE_BY_ID, CATEGORIES } from './art.js';
import { CRAYONS, WATERCOLOURS, SPRAYS, RAINBOW, THEMES } from './palettes.js';
import { sound } from './audio.js';
import { confetti } from './confetti.js';
import { ArtState, HistoryManager } from './storage.js';

class ColouringApp {
  constructor() {
    this.currentView = 'gallery';
    this.currentPage = null;
    this.currentCategory = 'all';

    // Tool state
    this.activeTool = 'bucket'; // 'bucket' | 'draw' | 'sticker' | 'eraser'
    this.brushType = 'crayon'; // 'crayon' | 'marker' | 'sparkle'
    this.brushSize = 16;
    this.activePaletteTab = 'crayons';
    this.activeColor = CRAYONS[0].hex;
    this.activeColorName = CRAYONS[0].name;
    this.isRainbow = false;
    this.rainbowIndex = 0;
    this.rainbowPalette = ['#FF5F6D', '#FFC371', '#F9F871', '#6EE7B7', '#5BC0EB', '#9B7BFF', '#F472B6'];

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
    if (picParam && PAGE_BY_ID[picParam]) {
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
    this.dom.artContainer = document.getElementById('art-container');
    this.dom.drawCanvas = document.getElementById('draw-canvas');
    this.dom.studioTitle = document.getElementById('studio-title');
    this.dom.studioBadge = document.getElementById('studio-badge');
    this.dom.pageCounter = document.getElementById('page-counter');

    // Palette & Tools DOM
    this.dom.swatchesGrid = document.getElementById('swatches-grid');
    this.dom.activeSwatch = document.getElementById('active-swatch');
    this.dom.activeColorName = document.getElementById('active-color-name');
    this.dom.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.dom.soundIcon = document.getElementById('sound-icon');
    this.dom.themesModal = document.getElementById('themes-modal');
    this.dom.themesGrid = document.getElementById('themes-grid');
    this.dom.stickerTray = document.getElementById('sticker-tray');
    this.dom.brushOptions = document.getElementById('brush-options');

    // Action buttons
    this.dom.undoBtn = document.getElementById('btn-undo');
    this.dom.redoBtn = document.getElementById('btn-redo');

    // Canvas context
    if (this.dom.drawCanvas) {
      this.ctx = this.dom.drawCanvas.getContext('2d');
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

  updateSoundButtonState() {
    const muted = sound.isMuted();
    this.dom.soundIcon.textContent = muted ? '🔇' : '🔊';
    this.dom.soundToggleBtn.setAttribute('aria-label', muted ? 'Unmute Sound' : 'Mute Sound');
  }

  setupEventListeners() {
    // Logo returns to gallery
    document.getElementById('app-logo').addEventListener('click', (e) => {
      e.preventDefault();
      sound.playPop();
      this.showGallery();
    });

    // Surprise Me / Random Picture
    document.getElementById('btn-random').addEventListener('click', () => {
      sound.playSparkle();
      const randomPage = PAGES[Math.floor(Math.random() * PAGES.length)];
      this.openStudio(randomPage);
    });

    // Studio Back button
    document.getElementById('btn-back-gallery').addEventListener('click', () => {
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

    // Magic Themes Modal triggers
    document.getElementById('btn-magic-themes').addEventListener('click', () => {
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

    // Tada! Celebration button
    document.getElementById('btn-celebrate').addEventListener('click', () => {
      this.handleCelebration();
    });

    // Custom color picker
    const customColorInput = document.getElementById('custom-color-input');
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        this.selectColor(e.target.value, 'Custom Color');
      });
    }

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
      const savedData = ArtState.getPageData(page.id);

      const card = document.createElement('div');
      card.className = 'picture-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="card-thumb-wrap">
          ${page.art}
          ${isColored ? '<div class="card-badge-status">⭐ Colored</div>' : ''}
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
     STUDIO VIEW LOGIC
     ========================================================================== */
  openStudio(page) {
    this.currentPage = page;
    this.currentView = 'studio';
    this.dom.galleryView.style.display = 'none';
    this.dom.studioView.style.display = 'flex';

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
    document.body.className = `tool-${tool}`;

    document.querySelectorAll('.tool-btn[data-tool]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });

    // Show/hide brush size options
    if (this.dom.brushOptions) {
      this.dom.brushOptions.style.display = tool === 'draw' ? 'flex' : 'none';
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
  }

  /* ==========================================================================
     FREEHAND CANVAS DRAWING & STICKERS
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

      if (this.activeTool !== 'draw' && this.activeTool !== 'eraser') return;

      this.isDrawing = true;
      const pos = getCanvasPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;
      canvas.setPointerCapture(e.pointerId);

      // Save initial canvas state for undo
      this.canvasSnapshotBeforeStroke = this.ctx.getImageData(0, 0, 1000, 760);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!this.isDrawing) return;
      const pos = getCanvasPos(e);
      this.drawStroke(pos.x, pos.y);
      this.lastX = pos.x;
      this.lastY = pos.y;
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

      this.saveCurrentPageState();
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
    this.ctx.lineWidth = this.brushSize;

    if (this.activeTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      const color = this.isRainbow
        ? this.rainbowPalette[Math.floor(Math.random() * this.rainbowPalette.length)]
        : this.activeColor;
      this.ctx.strokeStyle = color;

      // Draw smooth line
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      // Glitter effect
      if (this.brushType === 'sparkle') {
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * this.brushSize * 1.5;
          const offsetY = (Math.random() - 0.5) * this.brushSize * 1.5;
          const r = 2 + Math.random() * 3;
          this.ctx.beginPath();
          this.ctx.arc(x + offsetX, y + offsetY, r, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

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

    this.saveCurrentPageState();
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
    void this.dom.activeSwatch.offsetWidth; // Trigger reflow
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
    } else if (action.type === 'magicTheme') {
      const regions = this.dom.artContainer.querySelectorAll('.region');
      regions.forEach((region, index) => {
        if (action.prevFills[index]) {
          region.style.fill = action.prevFills[index];
        }
      });
    } else if (action.type === 'canvas' || action.type === 'sticker') {
      if (this.ctx && action.before) {
        this.ctx.putImageData(action.before, 0, 0);
      }
    }

    this.saveCurrentPageState();
  }

  handleRedo() {
    const action = this.history.redo();
    if (!action) return;

    sound.playPop();

    if (action.type === 'fill') {
      const region = this.dom.artContainer.querySelector(`[data-region-index="${action.index}"]`);
      if (region) region.style.fill = action.newColor;
    } else if (action.type === 'magicTheme') {
      const regions = this.dom.artContainer.querySelectorAll('.region');
      regions.forEach((region, index) => {
        if (action.newFills[index]) {
          region.style.fill = action.newFills[index];
        }
      });
    } else if (action.type === 'canvas' || action.type === 'sticker') {
      if (this.ctx && action.after) {
        this.ctx.putImageData(action.after, 0, 0);
      }
    }

    this.saveCurrentPageState();
  }

  handleClearPage() {
    sound.playUndo();
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
  }

  /* ==========================================================================
     SAVING & EXPORT
     ========================================================================== */
  saveCurrentPageState() {
    if (!this.currentPage) return;
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
    if (!this.currentPage) return;
    sound.playCelebration();
    confetti.burst(80);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1000;
    exportCanvas.height = 760;
    const exportCtx = exportCanvas.getContext('2d');

    // Fill white background
    exportCtx.fillStyle = '#FFFFFF';
    exportCtx.fillRect(0, 0, 1000, 760);

    const svgElement = this.dom.artContainer.querySelector('svg');
    const svgXml = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      exportCtx.drawImage(img, 0, 0, 1000, 760);
      // Layer freehand drawing & stickers canvas on top
      exportCtx.drawImage(this.dom.drawCanvas, 0, 0, 1000, 760);
      URL.revokeObjectURL(blobURL);

      // Trigger download
      const link = document.createElement('a');
      link.download = `${this.currentPage.id}-by-little-artist.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = blobURL;
  }

  handleCelebration() {
    sound.playCelebration();
    confetti.burst(180);

    const toast = document.getElementById('celebration-toast');
    if (toast) {
      const messages = ['🌟 Masterpiece! 🎨', '🎉 Super Artist! ✨', '💖 So Beautiful! 🌈', '🦄 Brilliant Work! 🌸'];
      toast.textContent = messages[Math.floor(Math.random() * messages.length)];
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
