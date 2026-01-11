import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
    @Prop({ required: true })
    ownerName: string;

    @Prop({ required: true })
    petName: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    sessionId: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
