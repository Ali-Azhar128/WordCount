import { Body, Controller, Delete, Get, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ParaService } from "./para.service.js";
import { CreateParaDto } from "./create-para.dto.js";
import { Request, Response } from "express";
import { NoSpecialCharactersGuard } from "./Guards/no-special-char-guard.guard.js";
import { PdfService } from "./pdf.service.js";

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

  @Put('flagItem')
  async flagItem(
    @Body() body: {id: string},
    @Res() res: Response
  ): Promise<any>{
    try {
      const result = await this.paraService.flagItem(body.id)
      res.status(200).json(result)
    } catch (error) {
      return res.status(400).json(error.message)
    }

  }

  @Delete('deleteItem')
  async deleteItem(
    @Body() body: {id: string},
    @Res() res: Response
  ): Promise<any>{
    try {
      const result = await this.paraService.deleteItem(body.id)
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json(error)
    }
  }

  @Get('findById')
  async findById(
    @Query('id') id: string,
    @Res() res: Response
  ): Promise<any>{
    try {
      const result = await this.paraService.findById(id)
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json(error)
    }
  }

    

}

