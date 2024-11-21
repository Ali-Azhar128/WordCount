
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

    async findByIp(ip: string): Promise<ParaDocument[]> {
        return await this.paraModel.find({ ip }).exec();
    }
}