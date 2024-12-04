import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ParaService } from './para.service.js';
import { CreateParaDto } from './create-para.dto.js';
import { Request, Response } from 'express';
import { NoSpecialCharactersGuard } from './Guards/no-special-char-guard.guard.js';
import { PdfService } from './pdf.service.js';
import { JwtAuthGuard } from '../Auth/jwt/jwt-auth.guard.js';
import { Roles } from './Decorators/roles.decorator.js';
import { RolesGuard } from '../Auth/jwt/roles.guard.js';
import { RequestWithUser } from '../Auth/Interface/request-with-user.interface.js';

@Controller()
export class ParaController {
  constructor(
    private readonly paraService: ParaService,
    private readonly pdfService: PdfService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('/getCount')
  @UseGuards(NoSpecialCharactersGuard)
  async getCount(
    @Body() createparaDto: CreateParaDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const { count, id } = await this.paraService.getCount(createparaDto, req);
      const filename = await this.pdfService.generatePDF(
        id,
        createparaDto.paragraph,
        count,
      );
      const pdfDownloadLink = `/public/PDFs/${filename}`;
      console.log(pdfDownloadLink, 'pdfDownloadLink');
      return res.json({ count, pdfDownloadLink });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  @Get('/getAll')
  async getAllDocs(@Res() res: Response): Promise<any> {
    try {
      const docs = await this.paraService.getAllDocs();
      res.json(docs);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('searchPage')
  async searchDocsWithPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 5,
    @Query('userId') userId: string,
    @Query('role') role: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    try {
      let docs;
      if (!keyword) {
        docs = await this.paraService.getDocsWithPagination(
          Number(page),
          Number(perPage),
          req,
        );
      } else {
        docs = await this.paraService.searchDocsWithPagination(
          keyword,
          Number(page),
          Number(perPage),
          userId,
          role,
        );
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('flagItem')
  async flagItem(
    @Body() body: { id: string },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.paraService.flagItem(body.id);
      res.status(200).json(result);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('deleteItem')
  async deleteItem(
    @Body() body: { id: string },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.paraService.deleteItem(body.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  @Get('findById')
  async findById(@Query('id') id: string, @Res() res: Response): Promise<any> {
    try {
      const result = await this.paraService.findById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('togglePublic')
  async togglePublic(
    @Body() Body: { id: string },
    @Res() res: Response,
    @Req() req: RequestWithUser,
  ) {
    try {
      const result = await this.paraService.togglePublic(Body.id, req.user.sub);
      res.status(200).json(result);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
