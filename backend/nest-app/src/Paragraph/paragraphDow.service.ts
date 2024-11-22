
// dow/para.dow.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParaEntity, ParaDTO } from './Types/para.types';
import { ParaDocument, Paragraph } from './para.schema.js';

@Injectable()
export class ParaDOW {
    constructor(
        @InjectModel(Paragraph.name) private readonly paraModel: Model<ParaDocument>
    ) {}

    async create(paraData: Partial<ParaDocument>): Promise<ParaDocument> {
        const createdPara = new this.paraModel(paraData);
        return await createdPara.save();
    }

    async update(id: string, data: Partial<ParaDocument>): Promise<ParaDocument> {
        return await this.paraModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
    }

    async find(id: string | {id: string}): Promise<ParaDocument>{
        return await this.paraModel.findById(id).exec();
    }

    async delete(id: string | {id: string}): Promise<any>{
        const doc = await this.paraModel.findByIdAndDelete(id).exec();
        if(!doc){
            throw new Error('Document not found');
        }
        return 'Document deleted!';

    }

   
}