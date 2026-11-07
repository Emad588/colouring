import { animalsPages } from './pages/animals.js';
import { dinosaurPages } from './pages/dinos.js';
import { vehiclePages } from './pages/vehicles.js';
import { oceanPages } from './pages/ocean.js';
import { spacePages } from './pages/space.js';
import { fairyPages } from './pages/fairy.js';
import { yummyPages } from './pages/yummy.js';
import { naturePages } from './pages/nature.js';

export const CATEGORIES = [
  { id: 'all', label: 'All pictures', emoji: '✨' },
  { id: 'animals', label: 'Animals', emoji: '🐻' },
  { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦕' },
  { id: 'vehicles', label: 'Things that go', emoji: '🚗' },
  { id: 'ocean', label: 'Under the sea', emoji: '🐠' },
  { id: 'space', label: 'Space', emoji: '🚀' },
  { id: 'fairy', label: 'Make believe', emoji: '🦄' },
  { id: 'yummy', label: 'Yummy', emoji: '🧁' },
  { id: 'nature', label: 'Nature', emoji: '🌈' },
];

const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const PAGES = [
  ...animalsPages,
  ...dinosaurPages,
  ...vehiclePages,
  ...oceanPages,
  ...spacePages,
  ...fairyPages,
  ...yummyPages,
  ...naturePages,
].map((page, index) => {
  const category = categoryMap[page.category];
  return {
    ...page,
    number: index + 1,
    categoryLabel: category ? category.label : 'Colouring',
    categoryEmoji: category ? category.emoji : '🎨',
  };
});

export const PAGE_BY_ID = Object.fromEntries(PAGES.map((page) => [page.id, page]));

export const CATEGORY_COUNTS = CATEGORIES.reduce((acc, category) => {
  acc[category.id] =
    category.id === 'all'
      ? PAGES.length
      : PAGES.filter((page) => page.category === category.id).length;
  return acc;
}, {});
