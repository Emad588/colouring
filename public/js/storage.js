/* ==========================================================================
   State & LocalStorage Persistence Engine
   Handles per-picture coloring state, undo/redo stacks, and gallery previews.
   ========================================================================== */

const STORAGE_KEY_PREFIX = 'abs_colour_page_';

export class ArtState {
  static getPageData(pageId) {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${pageId}`);
      if (!raw) return { fills: {}, stickers: [], drawDataUrl: null };
      return JSON.parse(raw);
    } catch {
      return { fills: {}, stickers: [], drawDataUrl: null };
    }
  }

  static savePageData(pageId, data) {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${pageId}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  static clearPageData(pageId) {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${pageId}`);
    } catch (e) {
      console.warn('Could not clear page data', e);
    }
  }

  static isPageColored(pageId) {
    const data = this.getPageData(pageId);
    const fillsCount = Object.keys(data.fills || {}).length;
    const stickersCount = (data.stickers || []).length;
    const hasDraw = Boolean(data.drawDataUrl);
    return fillsCount > 0 || stickersCount > 0 || hasDraw;
  }
}

export class HistoryManager {
  constructor(onChange) {
    this.undoStack = [];
    this.redoStack = [];
    this.onChange = onChange;
  }

  reset() {
    this.undoStack = [];
    this.redoStack = [];
    if (this.onChange) this.onChange();
  }

  push(action) {
    this.undoStack.push(action);
    this.redoStack = []; // Clear redo on new action
    if (this.undoStack.length > 50) this.undoStack.shift(); // Limit to 50 steps
    if (this.onChange) this.onChange();
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  undo() {
    if (!this.canUndo()) return null;
    const action = this.undoStack.pop();
    this.redoStack.push(action);
    if (this.onChange) this.onChange();
    return action;
  }

  redo() {
    if (!this.canRedo()) return null;
    const action = this.redoStack.pop();
    this.undoStack.push(action);
    if (this.onChange) this.onChange();
    return action;
  }
}
