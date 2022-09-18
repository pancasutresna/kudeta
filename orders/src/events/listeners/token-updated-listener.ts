import { Message } from 'node-nats-streaming';
import {
    Subjects,
    Listener,
    TokenUpdatedEvent,
    NotFoundError,
} from '@kudeta.app/common';
import { Token } from '../../models/token';
import { queueGroupName } from './queue-group-name';

export class TokenUpdatedListener extends Listener<TokenUpdatedEvent> {
    subject: Subjects.TokenUpdated = Subjects.TokenUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TokenUpdatedEvent['data'], msg: Message) {
        const token = await Token.findByEvent(data);

        if (!token) {
            throw new Error('Token not found');
        }

        const { title, price } = data;
        token.set({ title, price });
        await token.save();

        msg.ack();
    }
}
