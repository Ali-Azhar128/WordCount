import { Module } from "@nestjs/common";
import { ParaController } from "./para.controller.js";
import { ParaService } from "./para.service.js";
import { Paragraph, ParaSchema } from "./para.schema.js";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { PdfService } from "./pdf.service.js";
import { ParaDOW } from "./paragraphDow.service.js";
import { NotificationGateway } from "./notification.gateway.js";
import { NotificationService } from "./Notifications/notification.service.js";
import { Notification, NotificationSchema } from "./Notifications/notification.schema.js";
import { AuthModule } from "../Auth/auth.module.js";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../Auth/auth.guard.js";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Paragraph.name, schema: ParaSchema }]),
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        AuthModule
    ],
    controllers: [ParaController],
    providers: [ParaService, PdfService, ParaDOW, NotificationGateway, NotificationService, { provide: APP_GUARD, useClass: RolesGuard}]
})

export class ParaModule{}