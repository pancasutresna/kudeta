import { OrderCancelledEvent } from '@kudeta.app/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Message } from 'node-nats-streaming';
import { Token } from '../../../models/token';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const token = Token.build({
        title: 'concert',
        price: 20,
        userId: 'asdf',
    });

    token.set({ orderId });
    await token.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        token: {
            id: token.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, token, orderId, listener };
};

it('updates the token, publishes an event, and acks the message', async () => {
    const { msg, data, token, orderId, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedToken = await Token.findById(token.id);
    expect(updatedToken?.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
