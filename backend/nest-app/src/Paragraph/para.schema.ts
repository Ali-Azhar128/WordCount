import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ParaDocument = Paragraph & Document

@Schema({ timestamps: true })
export class Paragraph{
    @Prop({ required: true })
  paragraph: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  count: number;

  @Prop()
  pdfLink?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  language: string;

  @Prop({ default: false, required: true })
  isFlagged: boolean;

  @Prop()
  createdBy: string

  @Prop()
  type: string

  @Prop({ default: false })
  isNotified: boolean

  @Prop()
  username: string

  @Prop({ default: false })
  isPublic: boolean
}

export const ParaSchema = SchemaFactory.createForClass(Paragraph)