import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema.js';
import { ParaDocument, Paragraph } from '../para.schema.js';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(Paragraph.name) private paragraphModel: Model<ParaDocument>
  ) {}

  async createNotification(userId: string, message: string, paragraphId: string): Promise<Notification> {
    const notification = new this.notificationModel({ userId, message, paragraphId });
    await this.paragraphModel.updateOne({ _id: paragraphId }, { isNotified: false }).exec(); // Set isNotified to false
    return notification.save();
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).exec();
  }

  async markNotificationAsReceived(paragraphId: string): Promise<void> {
    const para = await this.paragraphModel.find({ _id: paragraphId }).exec();
    await this.paragraphModel.updateOne({ _id: paragraphId }, { isNotified: true }).exec(); // Update isNotified to true
    console.log(para, 'para')
  }

  async deleteNotificationsForUser(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({ userId }).exec();
  }
}