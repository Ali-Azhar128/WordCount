import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User{
    @Prop({ required: true })
    username: string

    @Prop()
    password: string

    @Prop()
    createdAt: string

    @Prop()
    role: string

    @Prop()
    email: string

}

export const UserSchema = SchemaFactory.createForClass(User)