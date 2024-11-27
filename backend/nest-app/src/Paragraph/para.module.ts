import { Module } from "@nestjs/common";
import { ParaController } from "./para.controller.js";
import { ParaService } from "./para.service.js";
import { Paragraph, ParaSchema } from "./para.schema.js";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { PdfService } from "./pdf.service.js";
import { ParaDOW } from "./paragraphDow.service.js";
import { NotificationGateway } from "./notification.gateway.js";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Paragraph.name, schema: ParaSchema }])
    ],
    controllers: [ParaController],
    providers: [ParaService, PdfService, ParaDOW, NotificationGateway]
})

export class ParaModule{}