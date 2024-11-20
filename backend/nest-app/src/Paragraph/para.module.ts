import { Module } from "@nestjs/common";
import { ParaController } from "./para.controller";
import { ParaService } from "./para.service";
import { Paragraph, ParaSchema } from "./para.schema";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { PdfService } from "./pdf.service";
import { ParaDOW } from "./paragraphDow.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Paragraph.name, schema: ParaSchema }])
    ],
    controllers: [ParaController],
    providers: [ParaService, PdfService, ParaDOW]
})

export class ParaModule{}