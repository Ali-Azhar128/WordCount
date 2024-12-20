import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  paragraphId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  received: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);