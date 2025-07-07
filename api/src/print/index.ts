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
  await page.setContent(html, { waitUntil: 'networkidle0' });

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
