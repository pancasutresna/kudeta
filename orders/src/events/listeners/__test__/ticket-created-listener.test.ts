import mongoose from 'mongoose';
import { TokenCreatedEvent } from '@kudeta.app/common';
import { TokenCreatedListener } from '../token-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Token } from '../../../models/token';

const setup = async () => {
    // create an instance of the listener
    const listener = new TokenCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TokenCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('creates and saves a token', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a token was created!
    const token = await Token.findById(data.id);

    expect(token!).toBeDefined();
    expect(token!.title).toEqual(data.title);
    expect(token!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
