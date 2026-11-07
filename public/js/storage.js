/* ==========================================================================
   State & LocalStorage Persistence Engine
   Handles per-picture coloring state, undo/redo stacks, and gallery previews.
   ========================================================================== */

const STORAGE_KEY_PREFIX = 'abs_colour_page_';
const SCORE_STORAGE_KEY = 'abs_colour_score_data';
const BOARD_STORAGE_PREFIX = 'abs_board_';

export class ScoreManager {
  static getData() {
    try {
      const raw = localStorage.getItem(SCORE_STORAGE_KEY);
      if (!raw) return { points: 0, stars: 0, completed: [] };
      return JSON.parse(raw);
    } catch {
      return { points: 0, stars: 0, completed: [] };
    }
  }

  static saveData(data) {
    try {
      localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save score', e);
    }
  }

  static isPageCompleted(pageId) {
    const data = this.getData();
    return (data.completed || []).includes(pageId);
  }

  static completePage(pageId) {
    const data = this.getData();
    if (!Array.isArray(data.completed)) data.completed = [];
    const isFirstTime = !data.completed.includes(pageId);
    const pointsEarned = isFirstTime ? 100 : 20;
    const starsEarned = isFirstTime ? 3 : 1;

    if (isFirstTime) {
      data.completed.push(pageId);
    }
    data.points = (data.points || 0) + pointsEarned;
    data.stars = (data.stars || 0) + starsEarned;

    this.saveData(data);
    return {
      isFirstTime,
      pointsEarned,
      starsEarned,
      totalPoints: data.points,
      totalStars: data.stars,
      completedCount: data.completed.length,
    };
  }

  static getPoints() {
    return this.getData().points || 0;
  }

  static getStars() {
    return this.getData().stars || 0;
  }
}

export class BoardState {
  static getBoard(type) {
    try {
      return localStorage.getItem(`${BOARD_STORAGE_PREFIX}${type}`);
    } catch {
      return null;
    }
  }

  static saveBoard(type, dataUrl) {
    try {
      localStorage.setItem(`${BOARD_STORAGE_PREFIX}${type}`, dataUrl);
    } catch (e) {
      console.warn('Failed to save board', e);
    }
  }

  static clearBoard(type) {
    try {
      localStorage.removeItem(`${BOARD_STORAGE_PREFIX}${type}`);
    } catch (e) {
      console.warn('Failed to clear board', e);
    }
  }
}


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
