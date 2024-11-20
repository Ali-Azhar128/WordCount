import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ParaService } from "./para.service";
import { CreateParaDto } from "./create-para.dto";
import { Request, Response } from "express";
import { NoSpecialCharactersGuard } from "./Guards/no-special-char-guard.guard";
import { PdfService } from "./pdf.service";

@Controller()
export class ParaController{
    constructor(
        private readonly paraService: ParaService,
        private readonly pdfService: PdfService
    ) {}

    //Controller Decorators
    @Post('/getCount')
    @UseGuards(NoSpecialCharactersGuard)
    async getCount(

        @Body() createparaDto: CreateParaDto, 
        @Req() req: Request, 
        @Res() res: Response):
        
        Promise<any> {
        try {
            const { count, id } = await this.paraService.getCount(createparaDto)
            const filename = await this.pdfService.generatePDF(id, createparaDto.paragraph, count)
            const pdfDownloadLink = `/public/PDFs/${filename}`
            console.log(pdfDownloadLink, 'pdfDownloadLink')
            return res.json({count, pdfDownloadLink})
        } catch (error) {
        return res.status(500).json(error)
       }
    }

    @Get('/getAll')
    async getAllDocs(@Res() res:Response):Promise<any> {
        try {
            const docs = await this.paraService.getAllDocs()
            res.json(docs)
        } catch (error) {
            console.log(error)
        }
    }

    @Get('/search')
    async searchDocs(@Query('keyword') keyword: string, @Res() res: Response): Promise<any> {
    try {
    const docs = await this.paraService.searchDocs(keyword);
    res.json(docs);
    } catch (error) {
    console.log(error);
    return res.status(500).json(error);
    }}

    @Get('/getPage')
    async getPage(@Query('page') page: number, @Res() res: Response): Promise<any> {
    try {
    const docs = await this.paraService.getPage(page);
    res.json(docs);
    } catch (error) {
    console.log(error);
    return res.status(500).json(error);
    }}

    @Get('searchPage')
  async searchDocsWithPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 5,
    @Res() res: Response
  ): Promise<any> {
    try {
      let docs;
      if (!keyword) {
        docs = await this.paraService.getDocsWithPagination(Number(page), Number(perPage));
      } else {
        docs = await this.paraService.searchDocsWithPagination(keyword, Number(page), Number(perPage));
      }
      res.json(docs);
    } catch (error) {
      console.error('Search with pagination error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

    

}

