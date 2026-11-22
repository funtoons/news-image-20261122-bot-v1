// Minimal raster canvas + PNG encoder, standard library only.
// Writes a true-colour (RGB) PNG with no ancillary chunks, so the bytes
// depend only on the pixels drawn: fully deterministic.

import { deflateSync } from 'node:zlib';
import { glyphFor, textWidth } from './font.ts';

export type RGB = [number, number, number];

export class Canvas {
  readonly w: number;
  readonly h: number;
  private px: Uint8Array;

  constructor(w: number, h: number, bg: RGB) {
    this.w = w;
    this.h = h;
    this.px = new Uint8Array(w * h * 3);
    this.fill(bg);
  }

  fill(c: RGB): void {
    for (let i = 0; i < this.px.length; i += 3) {
      this.px[i] = c[0];
      this.px[i + 1] = c[1];
      this.px[i + 2] = c[2];
    }
  }

  set(x: number, y: number, c: RGB): void {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 3;
    this.px[i] = c[0];
    this.px[i + 1] = c[1];
    this.px[i + 2] = c[2];
  }

  rect(x: number, y: number, w: number, h: number, c: RGB): void {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) this.set(xx, yy, c);
    }
  }

  // Filled rectangle with a 1px border of another colour.
  box(x: number, y: number, w: number, h: number, fill: RGB, border: RGB): void {
    this.rect(x, y, w, h, border);
    this.rect(x + 1, y + 1, w - 2, h - 2, fill);
  }

  hline(x0: number, x1: number, y: number, c: RGB, thick = 1): void {
    for (let t = 0; t < thick; t++) {
      for (let x = x0; x <= x1; x++) this.set(x, y + t, c);
    }
  }

  vline(x: number, y0: number, y1: number, c: RGB, thick = 1): void {
    for (let t = 0; t < thick; t++) {
      for (let y = y0; y <= y1; y++) this.set(x + t, y, c);
    }
  }

  line(x0: number, y0: number, x1: number, y1: number, c: RGB): void {
    // Round up front: fractional endpoints can never be reached by
    // integer steps, which would loop forever.
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    let x = x0;
    let y = y0;
    for (;;) {
      this.set(x, y, c);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
  }

  circle(cx: number, cy: number, r: number, c: RGB, filled: boolean): void {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        const d = x * x + y * y;
        if (filled ? d <= r * r : d <= r * r && d >= (r - 1) * (r - 1)) {
          this.set(cx + x, cy + y, c);
        }
      }
    }
  }

  // Filled or outline ellipse (rx, ry in pixels).
  ellipse(cx: number, cy: number, rx: number, ry: number, c: RGB, filled: boolean): void {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        const d = (x * x) / (rx * rx) + (y * y) / (ry * ry);
        if (filled ? d <= 1 : d <= 1 && d >= 0.72) {
          this.set(cx + x, cy + y, c);
        }
      }
    }
  }

  // Draw one glyph at integer scale.
  drawChar(ch: string, x: number, y: number, scale: number, c: RGB): void {
    const g = glyphFor(ch);
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (g[row][col] === '#') {
          this.rect(x + col * scale, y + row * scale, scale, scale, c);
        }
      }
    }
  }

  drawText(text: string, x: number, y: number, scale: number, c: RGB): number {
    let cx = x;
    for (const ch of text) {
      this.drawChar(ch, cx, y, scale, c);
      cx += 6 * scale;
    }
    return cx;
  }

  // Word-wrap text into lines that fit maxWidth pixels; returns line count.
  drawWrapped(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    scale: number,
    c: RGB,
    lineGap = 2,
  ): number {
    const words = text.split(' ');
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const trial = cur === '' ? w : cur + ' ' + w;
      if (textWidth(trial, scale) <= maxWidth || cur === '') {
        cur = trial;
      } else {
        lines.push(cur);
        cur = w;
      }
    }
    if (cur !== '') lines.push(cur);
    const lh = 7 * scale + lineGap;
    lines.forEach((ln, i) => this.drawText(ln, x, y + i * lh, scale, c));
    return lines.length;
  }

  toPNG(): Buffer {
    const w = this.w;
    const h = this.h;
    const raw = Buffer.alloc((w * 3 + 1) * h);
    for (let y = 0; y < h; y++) {
      raw[y * (w * 3 + 1)] = 0; // filter: none
      raw.set(this.px.subarray(y * w * 3, (y + 1) * w * 3), y * (w * 3 + 1) + 1);
    }
    const idat = deflateSync(raw, { level: 9 });
    const chunks: Buffer[] = [];
    chunks.push(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // colour type RGB
    chunks.push(chunk('IHDR', ihdr));
    chunks.push(chunk('IDAT', idat));
    chunks.push(chunk('IEND', Buffer.alloc(0)));
    return Buffer.concat(chunks);
  }
}

function crc32(buf: Buffer): number {
  let table = CRC_TABLE;
  if (!table) {
    table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
    CRC_TABLE = table;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}
let CRC_TABLE: Int32Array | null = null;

function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  const crcBuf = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  out.writeUInt32BE(crc32(crcBuf), 8 + data.length);
  return out;
}
