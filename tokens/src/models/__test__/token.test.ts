import { Token } from '../token';

it('implements optimistic concurrency control', async () => {
    // Create an instsance of a token
    const token = Token.build({
        title: 'cencert',
        price: 5,
        userId: '123',
    });

    // Save the token to the database
    await token.save();

    // Fetch the token twice
    const firstInstance = await Token.findById(token.id);
    const secondInstance = await Token.findById(token.id);

    // make two separate changes to the tokens we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched token
    await firstInstance!.save();

    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }
    // save the second fetched token and expect an error

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const token = Token.build({
        title: 'concert',
        price: 20,
        userId: '123',
    });

    await token.save();
    expect(token.version).toEqual(0);
    await token.save();
    expect(token.version).toEqual(1);
    await token.save();
    expect(token.version).toEqual(2);
});
