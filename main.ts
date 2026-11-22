// News-image entry: "The World Today" - one-page newspaper summing up
// Sunday 22 November 2026. Pure TypeScript, standard library only.
// Draws a 1024x1024 PNG with a bitmap font and a hand-rolled PNG encoder.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Canvas, type RGB } from './canvas.ts';
import { textWidth } from './font.ts';
import { HERO, FEATURED, COMPACT, ALL_STORIES } from './stories.ts';

const W = 1024;
const H = 1024;
const PAPER: RGB = [247, 242, 231];
const INK: RGB = [20, 20, 20];
const RED: RGB = [176, 42, 30];
const BLUE: RGB = [30, 74, 122];
const GREEN: RGB = [74, 124, 89];
const SKY: RGB = [220, 232, 240];
const SEA: RGB = [58, 110, 160];
const GOLD: RGB = [198, 148, 52];
const GREY: RGB = [110, 108, 100];
const LIGHT: RGB = [232, 226, 210];

const TOTAL = ALL_STORIES.length;

// ---- small pictograms, one per story category ---------------------------

function icon(c: Canvas, kind: string, x: number, y: number, s: number, col: RGB): void {
  const u = Math.max(1, Math.round(s / 12));
  switch (kind) {
    case 'blast': {
      c.circle(x + 6 * u, y + 6 * u, 3 * u, col, true);
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        c.line(
          x + 6 * u + Math.round(Math.cos(a) * 4 * u),
          y + 6 * u + Math.round(Math.sin(a) * 4 * u),
          x + 6 * u + Math.round(Math.cos(a) * 6 * u),
          y + 6 * u + Math.round(Math.sin(a) * 6 * u),
          col,
        );
      }
      break;
    }
    case 'globe': {
      c.circle(x + 6 * u, y + 6 * u, 5 * u, col, false);
      c.circle(x + 6 * u, y + 6 * u, 5 * u, col, false);
      c.line(x + u, y + 6 * u, x + 11 * u, y + 6 * u, col);
      c.line(x + 6 * u, y + u, x + 6 * u, y + 11 * u, col);
      break;
    }
    case 'shield': {
      c.rect(x + 2 * u, y + u, 8 * u, 9 * u, col);
      c.rect(x + 3 * u, y + 2 * u, 6 * u, 7 * u, PAPER);
      c.line(x + 4 * u, y + 6 * u, x + 6 * u, y + 8 * u, col);
      c.line(x + 6 * u, y + 8 * u, x + 9 * u, y + 4 * u, col);
      break;
    }
    case 'cross': {
      c.circle(x + 6 * u, y + 6 * u, 5 * u, col, false);
      c.rect(x + 5 * u, y + 3 * u, 2 * u, 6 * u, col);
      c.rect(x + 3 * u, y + 5 * u, 6 * u, 2 * u, col);
      break;
    }
    case 'vote': {
      c.rect(x + u, y + 5 * u, 10 * u, 6 * u, col);
      c.rect(x + 2 * u, y + 6 * u, 8 * u, 4 * u, PAPER);
      c.line(x + 4 * u, y + 2 * u, x + 6 * u, y + 4 * u, col);
      c.line(x + 6 * u, y + 4 * u, x + 10 * u, y, col);
      break;
    }
    case 'ball': {
      c.circle(x + 6 * u, y + 6 * u, 5 * u, col, false);
      c.line(x + 6 * u, y + u, x + 6 * u, y + 11 * u, col);
      c.line(x + u, y + 6 * u, x + 11 * u, y + 6 * u, col);
      c.line(x + 2 * u, y + 2 * u, x + 10 * u, y + 10 * u, col);
      c.line(x + 10 * u, y + 2 * u, x + 2 * u, y + 10 * u, col);
      break;
    }
    case 'chart': {
      c.line(x + u, y + 11 * u, x + u, y + u, col);
      c.line(x + u, y + 11 * u, x + 11 * u, y + 11 * u, col);
      c.line(x + 2 * u, y + 9 * u, x + 5 * u, y + 6 * u, col);
      c.line(x + 5 * u, y + 6 * u, x + 8 * u, y + 7 * u, col);
      c.line(x + 8 * u, y + 7 * u, x + 11 * u, y + 2 * u, col);
      break;
    }
    case 'storm': {
      c.circle(x + 4 * u, y + 4 * u, 3 * u, col, true);
      c.circle(x + 8 * u, y + 4 * u, 3 * u, col, true);
      c.rect(x + 2 * u, y + 4 * u, 8 * u, 3 * u, col);
      c.line(x + 6 * u, y + 7 * u, x + 4 * u, y + 10 * u, col);
      c.line(x + 4 * u, y + 10 * u, x + 7 * u, y + 10 * u, col);
      c.line(x + 7 * u, y + 10 * u, x + 5 * u, y + 12 * u, col);
      break;
    }
    case 'quake': {
      c.line(x + u, y + 6 * u, x + 4 * u, y + 3 * u, col);
      c.line(x + 4 * u, y + 3 * u, x + 6 * u, y + 9 * u, col);
      c.line(x + 6 * u, y + 9 * u, x + 9 * u, y + 4 * u, col);
      c.line(x + 9 * u, y + 4 * u, x + 11 * u, y + 7 * u, col);
      break;
    }
    case 'court': {
      c.rect(x + 2 * u, y + 2 * u, 5 * u, 3 * u, col);
      c.line(x + 7 * u, y + 3 * u, x + 11 * u, y + 7 * u, col);
      c.rect(x + 8 * u, y + 8 * u, 4 * u, 2 * u, col);
      break;
    }
    case 'flood': {
      for (let r = 0; r < 3; r++) {
        const yy = y + (3 + r * 3) * u;
        for (let xx = x; xx < x + 12 * u; xx += 2) {
          c.set(xx, yy + (xx % 4 === 0 ? 0 : u), col);
        }
      }
      break;
    }
    case 'diplomacy': {
      c.line(x + u, y + 11 * u, x + u, y + u, col);
      c.rect(x + u, y + u, 8 * u, 4 * u, col);
      c.rect(x + 2 * u, y + 2 * u, 6 * u, 2 * u, PAPER);
      break;
    }
    case 'ship': {
      c.rect(x + u, y + 8 * u, 10 * u, 3 * u, col);
      c.line(x + 6 * u, y + 8 * u, x + 6 * u, y + u, col);
      c.rect(x + 7 * u, y + 2 * u, 4 * u, 5 * u, col);
      break;
    }
    case 'film': {
      c.rect(x + u, y + 2 * u, 10 * u, 8 * u, col);
      c.rect(x + 3 * u, y + 4 * u, 6 * u, 4 * u, PAPER);
      c.rect(x + 5 * u, y + 5 * u, 2 * u, 2 * u, col);
      break;
    }
    case 'plane': {
      c.line(x + u, y + 6 * u, x + 11 * u, y + 6 * u, col);
      c.line(x + 6 * u, y + 2 * u, x + 6 * u, y + 10 * u, col);
      c.line(x + 4 * u, y + 4 * u, x + 8 * u, y + 4 * u, col);
      c.line(x + 4 * u, y + 8 * u, x + 8 * u, y + 8 * u, col);
      break;
    }
    default: {
      c.circle(x + 6 * u, y + 6 * u, 5 * u, col, false);
    }
  }
}

// ---- world map -----------------------------------------------------------

const DOTS: Array<[number, number]> = [
  [50.5, 26.2], [30.7, 36.9], [-107.4, 25.6], [-47.9, -15.8], [-53.8, -29.0],
  [-75.2, -11.2], [-63.6, 44.6], [-77.1, 38.9], [-81.4, 28.5], [-83.7, 42.3],
  [-84.3, 30.4], [-83.9, 35.9], [-3.2, 51.5], [103.8, 1.35], [93.9, 24.7],
  [77.6, 34.2], [90.4, 23.8], [113.3, 23.1], [4.35, 50.85], [9.2, 45.5],
  [28.05, -26.1], [114.2, 22.3], [-75.2, 40.0], [-0.1, 51.5], [-74.0, 40.7],
  [-118.2, 34.05], [139.7, 35.7], [-0.1, 51.5],
];

function drawMap(c: Canvas, x0: number, y0: number, w: number, h: number): void {
  c.rect(x0, y0, w, h, SKY);
  // Continents as wide flat ellipses (the strip is ~13x wider than tall):
  // [x fraction of width, y fraction of height, rx fraction of width, ry fraction of height]
  const blobs: Array<[number, number, number, number]> = [
    // North America
    [0.13, 0.3, 0.09, 0.34], [0.2, 0.22, 0.05, 0.24], [0.225, 0.42, 0.035, 0.2],
    [0.06, 0.26, 0.035, 0.2],
    // Greenland
    [0.285, 0.1, 0.018, 0.12],
    // South America
    [0.295, 0.6, 0.032, 0.3], [0.31, 0.8, 0.018, 0.14],
    // Europe
    [0.485, 0.22, 0.028, 0.18], [0.508, 0.3, 0.018, 0.12],
    // Africa
    [0.493, 0.5, 0.042, 0.3], [0.508, 0.68, 0.028, 0.17],
    // Asia
    [0.6, 0.2, 0.085, 0.3], [0.68, 0.22, 0.065, 0.25], [0.74, 0.27, 0.045, 0.2],
    [0.6, 0.46, 0.026, 0.14], [0.665, 0.42, 0.026, 0.12], [0.725, 0.4, 0.022, 0.12],
    [0.8, 0.3, 0.013, 0.1],
    // Australia
    [0.83, 0.72, 0.032, 0.15], [0.855, 0.7, 0.018, 0.1],
  ];
  for (const [fx, fy, frx, fry] of blobs) {
    c.ellipse(
      Math.round(x0 + fx * w),
      Math.round(y0 + fy * h),
      Math.round(frx * w),
      Math.round(fry * h),
      GREEN,
      true,
    );
  }
  for (const [lon, lat] of DOTS) {
    const dx = Math.round(x0 + ((lon + 180) / 360) * w);
    const dy = Math.round(y0 + ((80 - lat) / 140) * h);
    c.circle(dx, dy, 3, RED, true);
    c.circle(dx, dy, 5, RED, false);
  }
}

// ---- hero illustration ---------------------------------------------------

function drawHeroArt(c: Canvas, x0: number, y0: number, w: number, h: number): void {
  // dusk sky over the Gulf: banded sky, sun, sea, skyline, globe, arcs
  for (let i = 0; i < 5; i++) {
    const band: RGB = [
      245 - i * 8,
      214 - i * 14,
      168 - i * 10,
    ];
    c.rect(x0, y0 + Math.floor((i * h) / 5), w, Math.ceil(h / 5) + 1, band);
  }
  c.circle(x0 + Math.floor(w * 0.78), y0 + 34, 16, GOLD, true);
  // sea
  c.rect(x0, y0 + h - 34, w, 34, SEA);
  c.hline(x0, x0 + w - 1, y0 + h - 34, [255, 255, 255]);
  // skyline silhouette
  const towers = [0.04, 0.1, 0.08, 0.16, 0.07, 0.12, 0.09, 0.14, 0.06, 0.11];
  let tx = x0 + 6;
  for (const th of towers) {
    const tw = Math.floor(w / towers.length) - 4;
    const thPx = Math.floor(th * h);
    c.rect(tx, y0 + h - 34 - thPx, tw, thPx, INK);
    tx += tw + 4;
  }
  // globe
  const gx = x0 + Math.floor(w * 0.32);
  const gy = y0 + Math.floor(h * 0.42);
  const gr = 62;
  c.circle(gx, gy, gr, BLUE, true);
  c.circle(gx, gy, gr, INK, false);
  c.circle(gx - 18, gy - 12, 16, GREEN, true);
  c.circle(gx + 20, gy + 8, 14, GREEN, true);
  c.circle(gx + 6, gy - 26, 10, GREEN, true);
  c.line(gx - gr, gy, gx + gr, gy, [255, 255, 255]);
  c.line(gx, gy - gr, gx, gy + gr, [255, 255, 255]);
  // missile arcs toward the globe
  const arcs: Array<[number, number, number, number]> = [
    [x0 + 12, y0 + h - 40, gx - 40, gy + 30],
    [x0 + w - 12, y0 + h - 40, gx + 42, gy + 26],
    [x0 + w - 40, y0 + 12, gx + 30, gy - 40],
  ];
  for (const [ax, ay, bx, by] of arcs) {
    const mx = Math.round((ax + bx) / 2);
    const myy = Math.min(ay, by) - 18;
    c.line(ax, ay, mx, myy, RED);
    c.line(mx, myy, bx, by, RED);
    c.circle(bx, by, 4, RED, true);
  }
  // starburst over the globe
  const sx = gx + 44;
  const sy = gy - 34;
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    c.line(
      sx + Math.round(Math.cos(a) * 5),
      sy + Math.round(Math.sin(a) * 5),
      sx + Math.round(Math.cos(a) * 13),
      sy + Math.round(Math.sin(a) * 13),
      RED,
    );
  }
  c.circle(sx, sy, 4, RED, true);
}

// ---- layout --------------------------------------------------------------

function center(c: Canvas, text: string, y: number, scale: number, col: RGB): void {
  const tw = textWidth(text, scale);
  c.drawText(text, Math.floor((W - tw) / 2), y, scale, col);
}

function render(): Canvas {
  const c = new Canvas(W, H, PAPER);
  // border frame
  c.rect(0, 0, W, 6, INK);
  c.rect(0, H - 6, W, 6, INK);
  c.rect(0, 0, 6, H, INK);
  c.rect(W - 6, 0, 6, H, INK);

  // masthead
  center(c, 'THE WORLD TODAY', 18, 4, INK);
  c.hline(16, W - 17, 58, INK, 2);
  center(c, 'SUNDAY 22 NOVEMBER 2026', 64, 2, RED);
  c.drawText('NO. 326', 18, 66, 1, GREY);
  const right = 'ONE DAY - ONE PAGE';
  c.drawText(right, W - 18 - textWidth(right, 1), 66, 1, GREY);
  c.hline(16, W - 17, 88, INK, 3);

  // red kicker band
  c.rect(16, 94, W - 32, 20, RED);
  center(
    c,
    `${TOTAL} STORIES FROM 7 REGIONS - EVERY EVENT OF THIS SUNDAY`,
    99,
    1,
    [255, 255, 255],
  );

  // hero
  const hy = 122;
  const hh = 208;
  c.box(16, hy, 384, hh, PAPER, INK);
  drawHeroArt(c, 18, hy + 2, 380, hh - 4);
  c.drawText(HERO.tag, 416, hy + 4, 2, RED);
  c.hline(416, W - 17, hy + 26, INK, 1);
  const hl = c.drawWrapped(HERO.headline, 416, hy + 34, W - 17 - 416, 3, INK, 4);
  c.drawWrapped(
    HERO.summary,
    416,
    hy + 34 + hl * (7 * 3 + 4) + 8,
    W - 17 - 416,
    2,
    INK,
    3,
  );
  c.drawText('BAHRAIN - THE GULF', 416, hy + hh - 16, 1, GREY);

  // map strip
  const my = 342;
  c.drawText('WHERE THE NEWS HAPPENED', 16, my, 1, BLUE);
  c.drawText('EACH DOT IS A STORY ON THIS PAGE', W - 18 - textWidth('EACH DOT IS A STORY ON THIS PAGE', 1), my, 1, GREY);
  drawMap(c, 16, my + 12, W - 32, 78);
  c.rect(16, my + 12, W - 32, 1, INK);
  c.rect(16, my + 89, W - 32, 1, INK);
  c.rect(16, my + 12, 1, 78, INK);
  c.rect(W - 17, my + 12, 1, 78, INK);

  // top stories
  const ty = 448;
  c.drawText('TOP STORIES', 16, ty, 2, INK);
  c.hline(16, W - 17, ty + 20, INK, 2);
  const cw = 320;
  const ch = 100;
  const gx0 = 16;
  const gy0 = ty + 28;
  FEATURED.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = gx0 + col * (cw + 16);
    const y = gy0 + row * (ch + 10);
    c.box(x, y, cw, ch, [255, 255, 255], INK);
    icon(c, s.icon, x + 8, y + 8, 36, RED);
    c.drawText(s.tag, x + 52, y + 8, 1, RED);
    c.drawWrapped(s.headline, x + 52, y + 20, cw - 60, 2, INK, 2);
    c.drawWrapped(s.summary, x + 8, y + 74, cw - 16, 1, INK, 1);
  });

  // compact list
  const cy = gy0 + 2 * (ch + 10) + 8;
  c.drawText('ALSO TODAY', 16, cy, 2, INK);
  c.hline(16, W - 17, cy + 20, INK, 2);
  const ly = cy + 28;
  const colW = 320;
  const perCol = Math.ceil(COMPACT.length / 3);
  COMPACT.forEach((s, i) => {
    const col = Math.floor(i / perCol);
    const row = i % perCol;
    const x = 16 + col * (colW + 16);
    const y = ly + row * 30;
    icon(c, s.icon, x, y, 18, BLUE);
    c.drawText(`${s.tag} -`, x + 27, y + 1, 1, RED);
    c.drawWrapped(s.headline, x + 27, y + 11, colW - 27, 1, INK, 1);
  });

  // footer
  const fy = H - 30;
  c.hline(16, W - 17, fy, INK, 2);
  center(
    c,
    'ALL EVENTS OF SUNDAY 22 NOVEMBER 2026 - REPORTED BY REUTERS, AP, AFP AND OTHERS',
    fy + 8,
    1,
    GREY,
  );
  return c;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const png = render().toPNG();
writeFileSync(join(outDir, 'entry.png'), png);
