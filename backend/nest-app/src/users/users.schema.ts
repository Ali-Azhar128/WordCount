import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User{
    @Prop({ required: true })
    username: string

    @Prop({ required: true })
    password: string

    @Prop()
    createdAt: string

    @Prop()
    role: string

    @Prop({required: true})
    email: string
}

export const UserSchema = SchemaFactory.createForClass(User)