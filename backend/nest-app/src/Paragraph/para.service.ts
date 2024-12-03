import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateParaDto } from './create-para.dto.js';
import { ParaDocument, Paragraph } from './para.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import winkTokenizer from 'wink-tokenizer';
import TinySegmenter from 'tiny-segmenter';
import nodejieba from 'nodejieba';
import contractions from 'contractions';
import { ParaDOW } from './paragraphDow.service.js';
import { franc } from 'franc';
import { iso6392 } from 'iso-639-2';
import { NotificationGateway } from './notification.gateway.js';
import { Request } from 'express';
import { extractTokenFromRequest } from './Utils/auth.utils.js';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/users.schema.js';
import {
  getAdminDocs,
  getGuestDocs,
  getUserDocs,
} from './Utils/getDocs.utils.js';
import { splitMixedText } from './Utils/text-utils.js';
import { containsSpecialCharEng } from './Utils/token-utils.js';
import { specialCharacters } from './Utils/special-characters.js';

interface Token {
  value: string;
  tag: string;
}

@Injectable()
export class ParaService {
  private tokenizer: winkTokenizer;
  private segmenter: any;

  constructor(
    @InjectModel(Paragraph.name) private paraModel: Model<ParaDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly paraDow: ParaDOW,
    private readonly notificationGateway: NotificationGateway,
    private readonly jwtService: JwtService,
  ) {
    this.tokenizer = new winkTokenizer();
    this.segmenter = new TinySegmenter();
  }

  containsSpecialChar = (arr: string[]): string[] => {
    let i = 0;
    const result: string[] = [];

    while (i < arr.length) {
      if (
        arr[i] === '[' &&
        i + 2 < arr.length &&
        arr[i + 2] === ']' &&
        /^\d+$/.test(arr[i + 1])
      ) {
        i += 3;
        continue;
      }

      if (!specialCharacters.includes(arr[i])) {
        result.push(arr[i]);
      }
      i++;
    }
    return result;
  };

  async getCount(
    createParaDto: CreateParaDto,
  ): Promise<{ count: number; id: string }> {
    const { paragraph, ip, user, type } = createParaDto;
    const { username } = await this.userModel.findById(user).exec();
    console.log(type, 'type');
    const preprocessedParagraph = contractions.expand(paragraph);
    let tokens: string[] = [];

    const languageCode = franc(preprocessedParagraph);
    console.log(languageCode, 'code');
    const languageObj = iso6392.find((lang) => lang.iso6392B === languageCode);
    const language = languageObj ? languageObj.name : 'unknown';
    console.log(`Detected language: ${language}`);

    // Split the text into language segments
    const segments = splitMixedText(preprocessedParagraph);

    // Process Chinese segments
    for (const segment of segments.chinese) {
      const chineseTokens = nodejieba.cut(segment);
      tokens = tokens.concat(this.containsSpecialChar(chineseTokens));
    }

    // Process Japanese segments
    for (const segment of segments.japanese) {
      const japaneseTokens = this.segmenter.segment(segment);
      tokens = tokens.concat(this.containsSpecialChar(japaneseTokens));
    }

    // Process English segments
    for (const segment of segments.english) {
      const tokenized: Token[] = this.tokenizer.tokenize(segment);
      const englishTokens = containsSpecialCharEng(tokenized, specialCharacters)
        .filter((token) => token.tag === 'word' || token.tag === 'number')
        .map((token) => token.value);
      tokens = tokens.concat(englishTokens);
    }

    console.log(tokens);
    let count = tokens.length;

    const savedPara = await this.paraDow.create({
      paragraph,
      ip,
      count,
      language,
      isFlagged: false,
      createdBy: user,
      type: type,
      isNotified: false,
      username: username,
    });
    await savedPara.save();
    return { count, id: savedPara.id };
  }

  async getAllDocs(): Promise<{ para: string; createdAt: Date }[]> {
    const docs = await this.paraModel.find({});
    let data: { para: string; createdAt: Date }[] = [];
    docs.map((d) => data.push({ para: d.paragraph, createdAt: d.createdAt }));
    return data;
  }

  async getDocsWithPagination(
    page: number = 1,
    perPage: number = 5,
    req: Request,
  ): Promise<any> {
    const token = extractTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET || 'abc123',
    });
    const { role } = payload;

    if (role === 'admin') {
      return getAdminDocs(this.paraModel, page, perPage);
    } else if (role === 'user') {
      return getUserDocs(this.paraModel, page, perPage, payload.sub);
    } else {
      return getGuestDocs(this.paraModel, page, perPage);
    }
  }

  async searchDocsWithPagination(
    keyword: string,
    page: number = 1,
    perPage: number = 5,
    userId: string,
    role: string,
  ): Promise<{ docs: ParaDocument[]; totalPages: number }> {
    const regex = new RegExp(keyword, 'i');
    let totalDocs;
    let docs;
    if (role === 'admin') {
      totalDocs = await this.paraModel
        .countDocuments({ paragraph: { $regex: regex } })
        .exec();
      docs = await this.paraModel
        .aggregate([
          { $skip: (page - 1) * perPage },
          { $match: { paragraph: { $regex: regex } } },
          { $limit: perPage },
        ])
        .exec();
    } else {
      totalDocs = await this.paraModel
        .countDocuments({ paragraph: { $regex: regex }, createdBy: userId })
        .exec();
      docs = await this.paraModel
        .aggregate([
          { $skip: (page - 1) * perPage },
          { $match: { paragraph: { $regex: regex }, createdBy: userId } },
          { $limit: perPage },
        ])
        .exec();
    }

    const totalPages = Math.ceil(totalDocs / perPage);
    return { docs, totalPages };
  }

  async flagItem(id: string): Promise<string> {
    const doc = await this.paraDow.find(id);
    if (!doc) {
      throw new Error('Document not found');
    }
    doc.isFlagged = !doc.isFlagged;
    await doc.save();
    console.log(doc.createdBy, 'Sending notification to:');
    this.notificationGateway.sendNotification({
      userId: doc.createdBy,
      message: 'Your paragraph has been flagged.',
      id: doc._id as string,
    });
    if (doc.isFlagged) {
      return 'Document flagged';
    } else {
      return 'Document unflagged';
    }
  }

  async deleteItem(id: string): Promise<any> {
    const res = await this.paraDow.delete(id);
    return res;
  }

  async findById(id: string): Promise<ParaDocument> {
    return this.paraModel.findById(id).exec();
  }

  async togglePublic(id: string, userId: string): Promise<string> {
    const doc = await this.paraDow.find(id);
    if (doc.createdBy !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this document',
      );
    }
    if (!doc) {
      throw new Error('Document not found');
    }
    doc.isPublic = !doc.isPublic;
    doc.save();
    return 'Document updated';
  }
}
