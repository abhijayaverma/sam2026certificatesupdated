import path from 'node:path';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';

let registeredFont = false;

function ensureCertificateFont() {
  if (registeredFont) return;

  GlobalFonts.registerFromPath(
    path.join(process.cwd(), 'assets/fonts/DejaVuSerif-Bold.ttf'),
    'CertificateSerif',
  );

  registeredFont = true;
}

type CertificateTextOptions = {
  xRatio: number;
  yRatio: number;
  maxWidthRatio: number;
  fontSizeRatio: number;
  minFontSize: number;
  fontSizePx?: number;
  color: string;
};

function getTextOptions(): CertificateTextOptions {
  return {
    xRatio: 0.5,
    yRatio: 0.552,
    maxWidthRatio: 0.58,
    fontSizeRatio: 0.025,
    minFontSize: 16,
    fontSizePx: 22,
    color: '#1f2937',
  };
}

export async function renderCertificate(template: ArrayBuffer, name: string) {
  ensureCertificateFont();

  const img = await loadImage(Buffer.from(template));
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  const options = getTextOptions();

  ctx.drawImage(img, 0, 0);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = options.color;

  const maxWidth = img.width * options.maxWidthRatio;
  let size = options.fontSizePx || Math.round(img.width * options.fontSizeRatio);

  do {
    ctx.font = `700 ${size}px CertificateSerif, DejaVu Serif, Georgia, Times New Roman, serif`;
    if (ctx.measureText(name).width <= maxWidth) break;
    size -= 2;
  } while (size > options.minFontSize);

  ctx.fillText(name, img.width * options.xRatio, img.height * options.yRatio);

  return canvas.toBuffer('image/png');
}

