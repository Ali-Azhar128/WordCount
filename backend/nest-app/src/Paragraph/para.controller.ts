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
            const { count } = await this.paraService.getCount(createparaDto)
            const filename = await this.pdfService.generatePDF(createparaDto.paragraph, count)
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
    }
}

}

