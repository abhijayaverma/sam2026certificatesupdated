import { createCanvas, loadImage } from 'canvas';

type CertificateTextOptions = {
  xRatio: number;
  yRatio: number;
  maxWidthRatio: number;
  fontSizeRatio: number;
  minFontSize: number;
  fontSizePx?: number;
  color: string;
};

function readNumberEnv(name: string, fallback: number) {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getTextOptions(): CertificateTextOptions {
  return {
    xRatio: readNumberEnv('CERT_NAME_X_RATIO', 0.5),
    yRatio: readNumberEnv('CERT_NAME_Y_RATIO', 0.56),
    maxWidthRatio: readNumberEnv('CERT_NAME_MAX_WIDTH_RATIO', 0.68),
    fontSizeRatio: readNumberEnv('CERT_NAME_FONT_SIZE_RATIO', 0.055),
    minFontSize: readNumberEnv('CERT_NAME_MIN_FONT_SIZE', 16),
    fontSizePx: process.env.CERT_NAME_FONT_SIZE_PX
      ? readNumberEnv('CERT_NAME_FONT_SIZE_PX', 0)
      : undefined,
    color: process.env.CERT_NAME_COLOR || '#1f2937',
  };
}

export async function renderCertificate(template: ArrayBuffer, name: string) {
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
    ctx.font = `700 ${size}px Georgia, Times New Roman, serif`;
    if (ctx.measureText(name).width <= maxWidth) break;
    size -= 2;
  } while (size > options.minFontSize);

  ctx.fillText(name, img.width * options.xRatio, img.height * options.yRatio);

  return canvas.toBuffer('image/png');
}