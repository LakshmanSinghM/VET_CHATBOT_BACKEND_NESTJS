import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Session, SessionDocument } from './schemas/session.schema';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';

@Injectable()
export class ChatService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private readonly logger = new Logger(ChatService.name);

    private readonly VET_SYSTEM_PROMPT = `
You are a veterinary assistant AI. Your goal is to answer generic veterinary questions and help users book appointments.

RULES:
1. ONLY answer questions related to veterinary medicine, pet care, animal behavior, and appointment booking.
2. If a user asks about anything else (e.g., sports, coding, cooking), politely decline and state that you can only answer veterinary questions.
3. Be professional, empathetic, and concise.
4. If a condition sounds serious, ALWAYS advise the user to visit a vet immediately.

APPOINTMENT BOOKING:
You need to collect the following information from the user to book an appointment:
- Pet Owner Name
- Pet Name
- Phone Number
- Preferred Date & Time

If the user expresses intent to book an appointment (e.g., "I want to schedule a visit"), start the collection flow.
Ask for one piece of information at a time if it's missing.
Once you have all details, output a specific JSON block ONLY for the system to parse, while also confirming to the user in text.

JSON FORMAT for Appointment Ready (include this at the END of your response if all fields are present):
\`\`\`json
{
  "intent": "BOOK_APPOINTMENT",
  "data": {
    "ownerName": "...",
    "petName": "...",
    "phoneNumber": "...",
    "date": "..."
  }
}
\`\`\`
    `;

    constructor(
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
        @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
        private configService: ConfigService,) {
            
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async processMessage(sessionId: string, message: string, context: any = {}): Promise<{ reply: string }> {
        try {
            // Find or create session
            let session = await this.sessionModel.findOne({ sessionId });
            if (!session) {
                session = new this.sessionModel({ sessionId, context, messages: [] });
            }

            // Add user message
            session.messages.push({ role: 'user', text: message, timestamp: new Date() });

            // Prepare history for Gemini
            const history = [
                {
                    role: 'user',
                    parts: [{ text: this.VET_SYSTEM_PROMPT + `\n\nContext: ${JSON.stringify(session.context)}` }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Understood. I am ready to assist with veterinary questions and appointment bookings.' }],
                },
                ...session.messages.map((msg) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                })),
            ];

            // Call Gemini (remove last user message as it is sent in sendMessage)
            const chat = this.model.startChat({
                history: history.slice(0, -1), // Exclude the new message from history initialization
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            let replyText = response.text();

            // Check for JSON block (Appointment Intent)
            const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/);

            if (jsonMatch) {
                try {
                    const actionData = JSON.parse(jsonMatch[1]);
                    if (actionData.intent === 'BOOK_APPOINTMENT') {
                        const appointment = new this.appointmentModel({
                            ...actionData.data,
                            sessionId: sessionId,
                        });
                        await appointment.save();
                        this.logger.log('Appointment booked:', appointment);

                        // Clean up the response
                        replyText = replyText.replace(/```json\n[\s\S]*?\n```/, '').trim();
                        replyText += '\n\n(Appointment has been successfully recorded in our system!)';
                    }
                } catch (e) {
                    this.logger.error('Error parsing AI action JSON:', e);
                }
            }

            // Save model response
            session.messages.push({ role: 'model', text: replyText, timestamp: new Date() });
            await session.save();

            return { reply: replyText };
        } catch (error) {
            this.logger.error('Chat processing error', error);
            return { reply: "I apologize, but I'm having trouble connecting to my veterinary knowledge base right now." };
        }
    }
}
