import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Session, SessionSchema } from './schemas/session.schema';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Session.name, schema: SessionSchema },
            { name: Appointment.name, schema: AppointmentSchema },
        ]),
    ],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule { }
