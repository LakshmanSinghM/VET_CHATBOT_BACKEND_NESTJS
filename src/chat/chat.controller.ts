import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post()
    async chat(@Body() body: { message: string; sessionId: string; context?: any }) {
        if (!body.sessionId) {
            throw new BadRequestException('Session ID is required');
        }
        return this.chatService.processMessage(body.sessionId, body.message, body.context);
    }
}