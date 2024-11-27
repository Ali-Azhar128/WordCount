import { Injectable } from "@nestjs/common";
import { CreateParaDto } from "./create-para.dto.js";
import { ParaDocument, Paragraph } from "./para.schema.js";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import winkTokenizer from 'wink-tokenizer'
import TinySegmenter from 'tiny-segmenter'
import nodejieba from 'nodejieba';
import contractions from 'contractions';
import { ParaDOW } from "./paragraphDow.service.js";
import { franc } from "franc";
import {iso6392} from 'iso-639-2'
import { NotificationGateway } from "./notification.gateway.js";

interface Token {
    value: string,
    tag: string
}

@Injectable()
export class ParaService {
    private tokenizer: winkTokenizer
    private segmenter: any
    private specialCharacters: string[]

    constructor
    (@InjectModel(Paragraph.name) private paraModel: Model<ParaDocument>,
     private readonly paraDow: ParaDOW,
     private readonly notificationGateway: NotificationGateway
    ) {

        this.tokenizer = new winkTokenizer()
        this.segmenter = new TinySegmenter()
        this.specialCharacters = ['\n', '!', '？', ',', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '\\', '|', ';', ':', '\'', '"', ',', '.', '<', '>', '/', '?', '`', '~', '，'];
    }

    containsSpecialChar = (arr: string[]): string[] => {
        let i = 0;
        const result: string[] = [];
        
        while (i < arr.length) {
            if (arr[i] === '[' && i + 2 < arr.length && arr[i + 2] === ']' && /^\d+$/.test(arr[i + 1])) {
                i += 3;
                continue;
            }
            
            if (!this.specialCharacters.includes(arr[i])) {
                result.push(arr[i]);
            }
            i++;
        }
        return result;
    }

    containsSpecialCharEng = (arr: Token[]): Token[] => {
        let i = 0;
        const result: Token[] = [];
        
        while (i < arr.length) {
            if (
                arr[i].value === '[' && 
                i + 2 < arr.length && 
                arr[i + 2].value === ']' && 
                /^\d+$/.test(arr[i + 1].value)
            ) {
                i += 3;
                continue;
            }
            
            if (arr[i].tag !== 'punctuation' && !this.specialCharacters.includes(arr[i].value)) {
                result.push(arr[i]);
            }
            i++;
        }
        return result;
    }

    private splitMixedText(text: string): { chinese: string[], japanese: string[], english: string[] } {
        const segments: { chinese: string[], japanese: string[], english: string[] } = {
            chinese: [],
            japanese: [],
            english: []
        };
        
        let currentSegment = '';
        let currentType = 'english';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const isChineseChar = /[\u4e00-\u9fa5]/.test(char);
            const isJapaneseChar = /[\u3040-\u30ff\u31f0-\u31ff]/.test(char);
            
            // Determine the type of the current character
            let charType = 'english';
            if (isChineseChar) charType = 'chinese';
            else if (isJapaneseChar) charType = 'japanese';
            
            // If type changes or we hit a space, process the current segment
            if (charType !== currentType || char === ' ') {
                if (currentSegment) {
                    if (currentType === 'chinese') segments.chinese.push(currentSegment);
                    else if (currentType === 'japanese') segments.japanese.push(currentSegment);
                    else if (currentSegment.trim()) segments.english.push(currentSegment.trim());
                }
                currentSegment = '';
                currentType = charType;
            }
            
            currentSegment += char;
        }
        
        // Process the last segment
        if (currentSegment) {
            if (currentType === 'chinese') segments.chinese.push(currentSegment);
            else if (currentType === 'japanese') segments.japanese.push(currentSegment);
            else if (currentSegment.trim()) segments.english.push(currentSegment.trim());
        }
        
        return segments;
    }

    async getCount(createParaDto: CreateParaDto): Promise<{ count: number, id: string }> {
        const { paragraph, ip, user } = createParaDto;
        const preprocessedParagraph = contractions.expand(paragraph);
        let tokens: string[] = [];

        const languageCode = franc(preprocessedParagraph);
        console.log(languageCode, 'code')
        const languageObj = iso6392.find(lang => lang.iso6392B === languageCode);
        const language = languageObj ? languageObj.name : 'unknown';
        console.log(`Detected language: ${language}`);


        // Split the text into language segments
        const segments = this.splitMixedText(preprocessedParagraph);
        
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
            const englishTokens = this.containsSpecialCharEng(tokenized)
                .filter(token => (token.tag === 'word' || token.tag === 'number'))
                .map(token => token.value);
            tokens = tokens.concat(englishTokens);
        }

        console.log(tokens);
        let count = tokens.length;

        const savedPara = await this.paraDow.create({ paragraph, ip, count, language, isFlagged: false, createdBy: user });
        await savedPara.save();
        return { count, id: savedPara.id };
    }

    async getAllDocs(): Promise<{para: string, createdAt: Date}[]>{
        const docs = await this.paraModel.find({})
        let data: {para: string, createdAt: Date}[] = [];
        docs.map((d) => data.push({para: d.paragraph, createdAt: d.createdAt}));
        return data
    }

    async searchDocs(keyword: string): Promise<ParaDocument[]> {
        const regex = new RegExp(keyword, 'i'); 
        return this.paraModel.find({ paragraph: { $regex: regex } }).exec();
      }  
      
    async getPage(page: number): Promise<ParaDocument[]> {
        const perPage = 5;
        return this.paraModel.find({}).skip((page - 1) * perPage).limit(perPage).exec();

    }

    async getDocsWithPagination(page: number = 1, perPage: number = 5): Promise<any> {
        const totalDocs = await this.paraModel.countDocuments().exec();
        const docs = await this.paraModel
          .find()
          .skip((page - 1) * perPage)
          .limit(perPage)
          .exec();
          const totalPages = Math.ceil(totalDocs / perPage);
        return {docs, totalPages}; 
      }

      async searchDocsWithPagination(keyword: string, page: number = 1, perPage: number = 5): Promise<{ docs: ParaDocument[], totalPages: number }> {
        const regex = new RegExp(keyword, 'i');
        
        const totalDocs = await this.paraModel.countDocuments({ paragraph: { $regex: regex } }).exec();
        
        const totalPages = Math.ceil(totalDocs / perPage);
        
        const docs = await this.paraModel.aggregate([
            { $skip: (page - 1) * perPage },
            { $match: { paragraph: { $regex: regex } } },
            { $limit: perPage }
          ]).exec();
        
        return { docs, totalPages };
    }

    async flagItem(id: string): Promise<string> {
        const doc = await this.paraDow.find(id); 
        if (!doc) {
            throw new Error('Document not found');
        }
        doc.isFlagged = !doc.isFlagged;
        await doc.save();
        console.log(doc.createdBy, 'Sending notification to:')
        this.notificationGateway.sendNotification({userId: doc.createdBy, message: 'Your paragraph has been flagged.', id: doc._id as string});
        return 'Document flagged';
    }

    async deleteItem(id: string): Promise<any>{
        const res = await this.paraDow.delete(id)
        return res
    }

    async findById(id: string): Promise<ParaDocument> {
        return this.paraModel.findById(id).exec();
    }
}