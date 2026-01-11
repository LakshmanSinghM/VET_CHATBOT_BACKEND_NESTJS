import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
class Message {
    @Prop({ required: true, enum: ['user', 'model'] })
    role: string;

    @Prop({ required: true })
    text: string;

    @Prop({ default: Date.now })
    timestamp: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Session {
    @Prop({ required: true, unique: true })
    sessionId: string;

    @Prop({ type: Object, default: {} })
    context: Record<string, any>;

    @Prop({ type: [MessageSchema], default: [] })
    messages: Message[];
}

export const SessionSchema = SchemaFactory.createForClass(Session);
