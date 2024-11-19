import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ParaDocument = Paragraph & Document

@Schema({ timestamps: true })
export class Paragraph{
    @Prop({required: true})
    para: string

    @Prop({required: true})
    ip: string

    @Prop({ required: true })
    count: number

    @Prop()
    createdAt: Date
}

export const ParaSchema = SchemaFactory.createForClass(Paragraph)