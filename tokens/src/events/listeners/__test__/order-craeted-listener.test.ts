import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Token } from '../../../models/token';
import { OrderCreatedEvent, OrderStatus } from '@kudeta.app/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

// jest.setTimeout(20000);

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a token
    const token = Token.build({
        title: 'concert',
        price: 99,
        userId: 'asdf',
    });

    await token.save();

    // create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdf',
        expiresAt: 'asdf',
        token: {
            id: token.id,
            price: token.price,
        },
    };

    // create the fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, token, data, msg };
};

it('sets the userId of the token', async () => {
    const { listener, token, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedToken = await Token.findById(token.id);

    expect(updatedToken!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, token, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publish a token updated event', async () => {
    const { listener, token, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('publishes a token updated event', async () => {
    const { listener, token, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const tokenUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
});
