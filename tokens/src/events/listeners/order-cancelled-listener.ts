import { Listener, OrderCancelledEvent, Subjects } from '@kudeta.app/common';
import { Message } from 'node-nats-streaming';
import { Token } from '../../models/token';
import { TokenUpdatedPublisher } from '../publishers/token-updated-publisher';
import { queueGroupName } from './queue-group_name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const token = await Token.findById(data.token.id);

        if (!token) {
            throw new Error('Token not found');
        }

        token.set({ orderId: undefined });
        await token.save();

        await new TokenUpdatedPublisher(this.client).publish({
            id: token.id,
            orderId: token.orderId,
            userId: token.userId,
            price: token.price,
            title: token.title,
            version: token.version,
        });

        msg.ack();
    }
}
