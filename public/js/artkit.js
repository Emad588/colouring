/* ---------------------------------------------------------------
   Absolute Colouring — drawing helpers for original line art.
   Every scene sits on a 1000 x 760 canvas.
   A region's data-tone (1–6 or "bg") is used by the magic palettes.
   --------------------------------------------------------------- */

export const INK = '#293040';
export const W = 1000;
export const H = 760;

/* ---------- fillable regions ---------- */

export const R = (d, tone = 1, extra = '') =>
  `<path class="region" data-tone="${tone}" d="${d}" ${extra}/>`;

export const C = (cx, cy, r, tone = 1, extra = '') =>
  `<circle class="region" data-tone="${tone}" cx="${cx}" cy="${cy}" r="${r}" ${extra}/>`;

export const E = (cx, cy, rx, ry, tone = 1, extra = '') =>
  `<ellipse class="region" data-tone="${tone}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${extra}/>`;

export const B = (x, y, w, h, tone = 1, r = 0, extra = '') =>
  `<rect class="region" data-tone="${tone}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${extra}/>`;

export const P = (points, tone = 1, extra = '') =>
  `<polygon class="region" data-tone="${tone}" points="${points}" ${extra}/>`;

export const BG = () =>
  `<path class="region bg-region" data-tone="bg" d="M 0 0 H ${W} V ${H} H 0 Z"/>`;

export const BG_SHAPE = (d) =>
  `<path class="region bg-region" data-tone="bg" d="${d}"/>`;

/* ---------- ink details ---------- */

export const ink = (inner) =>
  `<g class="ink" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;

export const L = (d, extra = '') => `<path d="${d}" ${extra}/>`;

export const D = (d, fill = INK, extra = '') =>
  `<path d="${d}" fill="${fill}" stroke="none" ${extra}/>`;

/* ---------- little shapes ---------- */

export const sparkle = (x, y, s = 18) =>
  `<path d="M ${x} ${y - s} Q ${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q ${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q ${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q ${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z"/>`;

export function starPath(cx, cy, outer, inner = outer * 0.45, points = 5, rot = -Math.PI / 2) {
  const coords = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rot + (i * Math.PI) / points;
    coords.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M ${coords.join(' L ')} Z`;
}

export const star = (cx, cy, outer, tone = 3, inner) =>
  R(starPath(cx, cy, outer, inner), tone);

export const sun = (cx, cy, r) => C(cx, cy, r, 4);

export function sunRays(cx, cy, r) {
  let out = '';
  for (let i = 0; i < 10; i += 1) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const x1 = cx + Math.cos(a) * (r + 15);
    const y1 = cy + Math.sin(a) * (r + 15);
    const x2 = cx + Math.cos(a) * (r + 40);
    const y2 = cy + Math.sin(a) * (r + 40);
    out += L(`M ${x1} ${y1} L ${x2} ${y2}`);
  }
  return out;
}

export const cloudPath = (x, y, s = 1) =>
  `M ${x - 1.6 * s} ${y + 0.55 * s}
   C ${x - 2.1 * s} ${y + 0.1 * s} ${x - 1.8 * s} ${y - 0.5 * s} ${x - 1.2 * s} ${y - 0.55 * s}
   C ${x - 1.15 * s} ${y - 1.2 * s} ${x - 0.35 * s} ${y - 1.5 * s} ${x + 0.15 * s} ${y - 1.0 * s}
   C ${x + 0.55 * s} ${y - 1.55 * s} ${x + 1.35 * s} ${y - 1.35 * s} ${x + 1.45 * s} ${y - 0.65 * s}
   C ${x + 2.0 * s} ${y - 0.55 * s} ${x + 2.2 * s} ${y + 0.15 * s} ${x + 1.7 * s} ${y + 0.55 * s}
   C ${x + 1.3 * s} ${y + 0.9 * s} ${x - 1.3 * s} ${y + 0.95 * s} ${x - 1.6 * s} ${y + 0.55 * s} Z`;

export const cloud = (x, y, s = 1, tone = 6) => R(cloudPath(x, y, s), tone);

export const heart = (cx, cy, s = 1, tone = 3) =>
  R(
    `M ${cx} ${cy + 0.05 * s}
     C ${cx - 0.25 * s} ${cy - 0.35 * s} ${cx - 0.65 * s} ${cy - 0.55 * s} ${cx - 0.8 * s} ${cy - 0.2 * s}
     C ${cx - 0.95 * s} ${cy + 0.15 * s} ${cx - 0.45 * s} ${cy + 0.6 * s} ${cx} ${cy + 0.95 * s}
     C ${cx + 0.45 * s} ${cy + 0.6 * s} ${cx + 0.95 * s} ${cy + 0.15 * s} ${cx + 0.8 * s} ${cy - 0.2 * s}
     C ${cx + 0.65 * s} ${cy - 0.55 * s} ${cx + 0.25 * s} ${cy - 0.35 * s} ${cx} ${cy + 0.05 * s} Z`,
    tone,
  );

/* ---------- faces ---------- */

export const eyes = (cx, y, gap = 56, r = 12) =>
  `<ellipse cx="${cx - gap}" cy="${y}" rx="${r}" ry="${r * 1.12}" fill="${INK}" stroke="none"/>` +
  `<circle cx="${cx - gap + 4}" cy="${y - 4}" r="${r * 0.28}" fill="#fff" stroke="none"/>` +
  `<ellipse cx="${cx + gap}" cy="${y}" rx="${r}" ry="${r * 1.12}" fill="${INK}" stroke="none"/>` +
  `<circle cx="${cx + gap + 4}" cy="${y - 4}" r="${r * 0.28}" fill="#fff" stroke="none"/>`;

export const smile = (cx, y, width = 60, depth = 20) => {
  const h = width / 2;
  return L(`M ${cx - h} ${y} Q ${cx} ${y + depth} ${cx + h} ${y}`);
};

export const cheeks = (cx, y, gap = 76, rx = 17, ry = 10) =>
  `<ellipse cx="${cx - gap}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FF9EB1" stroke="none" opacity=".55"/>` +
  `<ellipse cx="${cx + gap}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FF9EB1" stroke="none" opacity=".55"/>`;

export const simpleFace = (cx, y, opts = {}) => {
  const gap = opts.gap ?? 56;
  const eyeR = opts.eyeR ?? 12;
  const smileW = opts.smileW ?? 60;
  const smileY = y + (opts.smileGap ?? 45);
  let out = eyes(cx, y, gap, eyeR);
  out += smile(cx, smileY, smileW, opts.depth ?? 20);
  if (opts.cheeks !== false) out += cheeks(cx, y + 38, gap + 34);
  return out;
};

/* ---------- scenery ---------- */

export const hill = (y = 610, tone = 5) =>
  R(
    `M 0 ${y} Q 140 ${y - 70} 300 ${y - 8} Q 480 ${y + 45} 650 ${y - 20} Q 820 ${y - 80} 1000 ${y - 5}
     L 1000 760 L 0 760 Z`,
    tone,
  );

export const grass = (x, y, s = 1) =>
  L(
    `M ${x} ${y} Q ${x - 8 * s} ${y - 26 * s} ${x - 22 * s} ${y - 40 * s}
     M ${x + 4 * s} ${y} Q ${x + 4 * s} ${y - 30 * s} ${x + 2 * s} ${y - 48 * s}
     M ${x + 10 * s} ${y} Q ${x + 22 * s} ${y - 26 * s} ${x + 32 * s} ${y - 36 * s}`,
  );

export function flower(x, y, s = 1, petalTone = 3, centerTone = 4) {
  const regions = [];
  const details = [];
  const stemTop = y + 30 * s;
  details.push(
    L(`M ${x} ${stemTop} Q ${x - 12 * s} ${y + 95 * s} ${x + 4 * s} ${y + 165 * s}`),
  );
  regions.push(
    R(
      `M ${x + 4 * s} ${y + 100 * s} Q ${x + 48 * s} ${y + 85 * s} ${x + 62 * s} ${y + 112 * s} Q ${x + 30 * s} ${y + 128 * s} ${x + 4 * s} ${y + 100 * s} Z`,
      5,
    ),
  );
  regions.push(
    R(
      `M ${x - 2 * s} ${y + 130 * s} Q ${x - 50 * s} ${y + 120 * s} ${x - 62 * s} ${y + 90 * s} Q ${x - 22 * s} ${y + 86 * s} ${x - 2 * s} ${y + 130 * s} Z`,
      5,
    ),
  );
  for (let i = 0; i < 6; i += 1) {
    const a = (i * Math.PI) / 3 - Math.PI / 2;
    const px = x + Math.cos(a) * 31 * s;
    const py = y + Math.sin(a) * 31 * s;
    const rot = (a * 180) / Math.PI + 90;
    regions.push(E(px, py, 28 * s, 17 * s, petalTone, `transform="rotate(${rot} ${px} ${py})"`));
  }
  regions.push(C(x, y, 22 * s, centerTone));
  details.push(
    simpleFace(x, y - 3 * s, { gap: 9 * s, eyeR: 3.2 * s, smileW: 16 * s, smileGap: 7 * s, depth: 5 * s, cheeks: false }),
  );
  return { regions: regions.join(''), details: details.join('') };
}

export function butterfly(x, y, s = 1) {
  const regions = [
    R(
      `M ${x - 5 * s} ${y} C ${x - 55 * s} ${y - 55 * s} ${x - 68 * s} ${y + 4 * s} ${x - 14 * s} ${y + 15 * s}
       C ${x - 52 * s} ${y + 34 * s} ${x - 38 * s} ${y + 62 * s} ${x - 4 * s} ${y + 18 * s} Z`,
      3,
    ),
    R(
      `M ${x + 5 * s} ${y} C ${x + 55 * s} ${y - 55 * s} ${x + 68 * s} ${y + 4 * s} ${x + 14 * s} ${y + 15 * s}
       C ${x + 52 * s} ${y + 34 * s} ${x + 38 * s} ${y + 62 * s} ${x + 4 * s} ${y + 18 * s} Z`,
      3,
    ),
  ];
  const details =
    D(`M ${x} ${y - 10 * s} Q ${x + 3 * s} ${y + 8 * s} ${x} ${y + 24 * s}`, INK, '') +
    L(`M ${x} ${y - 10 * s} Q ${x - 14 * s} ${y - 32 * s} ${x - 24 * s} ${y - 30 * s} M ${x} ${y - 10 * s} Q ${x + 14 * s} ${y - 32 * s} ${x + 24 * s} ${y - 30 * s}`);
  return { regions: regions.join(''), details };
}

export const birds = (points) =>
  points
    .map(
      ([x, y, s = 1]) =>
        L(
          `M ${x - 18 * s} ${y} Q ${x - 8 * s} ${y - 12 * s} ${x} ${y} Q ${x + 8 * s} ${y - 12 * s} ${x + 18 * s} ${y}`,
          'stroke-width="6"',
        ),
    )
    .join('');

export const pageSvg = (label, regions, details) =>
  `<svg class="art-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
    <g class="art-regions">${regions}</g>
    ${ink(details)}
  </svg>`;
