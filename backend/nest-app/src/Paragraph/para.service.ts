import { Injectable } from "@nestjs/common";
import { CreateParaDto } from "./create-para.dto";
import { ParaDocument, Paragraph } from "./para.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as winkTokenizer from 'wink-tokenizer'
import * as TinySegmenter from 'tiny-segmenter'
import * as nodejieba from 'nodejieba';
import * as contractions from 'contractions';

interface Token {
    value: string,
    tag: string
}

@Injectable()
export class ParaService {
    private tokenizer: winkTokenizer
    private segmenter: any
    private specialCharacters: string[]

    constructor(@InjectModel(Paragraph.name) private paraModel: Model<ParaDocument>) {
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

    async getCount(createParaDto: CreateParaDto): Promise<{ count: number }> {
        const { paragraph, ip } = createParaDto;
        const preprocessedParagraph = contractions.expand(paragraph);
        let tokens: string[] = [];

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
        const createdPara = new this.paraModel({
            para: paragraph, ip, count
        });
        await createdPara.save();
        return { count };
    }

    async getAllDocs(): Promise<{para: string, createdAt: Date}[]>{
        const docs = await this.paraModel.find({})
        let data: {para: string, createdAt: Date}[] = [];
        docs.map((d) => data.push({para: d.para, createdAt: d.createdAt}));
        return data
    }

    async searchDocs(keyword: string): Promise<ParaDocument[]> {
        const regex = new RegExp(keyword, 'i'); 
        return this.paraModel.find({ para: { $regex: regex } }).exec();
      }  
      
    async getPage(page: number): Promise<ParaDocument[]> {
        const perPage = 5;
        return this.paraModel.find({}).skip((page - 1) * perPage).limit(perPage).exec();

    }
}