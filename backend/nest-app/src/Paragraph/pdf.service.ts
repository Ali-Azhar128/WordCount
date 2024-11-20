import { Injectable } from "@nestjs/common";
import * as path from "path";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import { ParaDOW } from "./paragraphDow.service";

@Injectable()
export class PdfService{
  constructor(private readonly paraDOW: ParaDOW) {}
    async generatePDF(paraId: string, paragraph: string, count: number): Promise<string>{
        try {
                const browser = await puppeteer.launch()
                const page = await browser.newPage()

                const content = `
                <html>
                  <head>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        color: #333;
                        background-color: #f2f2f2;
                      }
                      .header {
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        font-size: 28px;
                        font-weight: bold;
                      }
                      .content {
                        padding: 40px;
                        font-size: 18px;
                        line-height: 1.6;
                      }
                      .footer {
                        position: fixed;
                        bottom: 0;
                        width: 100%;
                        background-color: #f2f2f2;
                        text-align: center;
                        padding: 10px;
                        font-size: 14px;
                        color: #777;
                      }
                      .word-count {
                        margin-top: 20px;
                        font-size: 20px;
                        font-weight: bold;
                        color: #4CAF50;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="header">Word Count Report</div>
                    <div class="content">
                      <p>${paragraph}</p>
                      <div class="word-count">Total Words: ${count}</div>
                    </div>
                    <div class="footer">Generated on: ${new Date().toLocaleDateString()}</div>
                  </body>
                </html>
              `;
            await page.setContent(content);
            const uniqueFilename = `paragraph_${uuidv4()}.pdf`;
            const filePath = path.join(__dirname, '../../../../frontend/public/PDFs', uniqueFilename);
            await page.pdf({ path: filePath, format: 'A4' });
            const link = `http://localhost:3000/public/PDFs/${uniqueFilename}`;
            await browser.close();
            console.log(paraId, 'paraId')
            const updated = await this.paraDOW.update(paraId, { pdfLink: link });
            return uniqueFilename;
        } catch (error) {
            console.log(error)
        }
    }
}