import { Injectable } from '@nestjs/common';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { ParaDOW } from './paragraphDow.service.js';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class PdfService {
  constructor(private readonly paraDOW: ParaDOW) {}
  async generatePDF(
    paraId: string,
    paragraph: string,
    count: number,
  ): Promise<string> {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const templatePath = path.join(
        __dirname,
        '../../src/Paragraph/Template/pdfTemplate.ejs',
      );
      const content = await ejs.renderFile(templatePath, {
        paragraph,
        wordCount: count,
      });
      await page.setContent(content);
      const uniqueFilename = `paragraph_${uuidv4()}.pdf`;
      const filePath = path.join(
        __dirname,
        '../../../../frontend/public/PDFs',
        uniqueFilename,
      );
      await page.pdf({ path: filePath, format: 'A4' });
      const link = `http://localhost:3000/public/PDFs/${uniqueFilename}`;
      await browser.close();
      const updated = await this.paraDOW.update(paraId, { pdfLink: link });
      return uniqueFilename;
    } catch (error) {
      console.log(error);
    }
  }
}
