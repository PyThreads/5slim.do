import puppeteer from 'puppeteer';

export async function generarFacturaPDF({
  html,
  margin = {
    top: '1cm',
    bottom: '1cm',
    left: '1cm',
    right: '1cm',
  },
}: {
  html: string;
  margin?: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
}): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html,{ waitUntil: 'load' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin,
  });

  await browser.close();

  // 💡 Conversión segura
  const base64PDF = Buffer.from(pdfBuffer).toString("base64");

  return base64PDF;
}

export async function generarLabelPDF({ html, filename = 'label' }: { html: string; filename?: string }): Promise<{ base64: string; filename: string }> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 384, height: 288 }); // 4in x 3in at 96 DPI
  await page.setContent(html, { waitUntil: 'load' });

  const pdfBuffer = await page.pdf({
    width: '4in',
    height: '3in',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await browser.close();

  const base64PDF = Buffer.from(pdfBuffer).toString("base64");
  return { base64: base64PDF, filename: `${filename}.pdf` };
}

export async function generar4x3PDF({ html, filename = 'factura-4x3' }: { html: string; filename?: string }): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });

  const pdfBuffer = await page.pdf({
    width: '4in',
    height: '3in',
    printBackground: true,
    margin: { top: '0.1in', bottom: '0.1in', left: '0.1in', right: '0.1in' },
  });

  await browser.close();

  const base64PDF = Buffer.from(pdfBuffer).toString("base64");
  return base64PDF;
}
