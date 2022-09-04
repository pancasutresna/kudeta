const doRequest = async () => {
    const { data } = await axios.post(
        `https://kudeta.dev/api/tickets`,
        { title: 'ticket', price: 5 },
        {
            headers: { cookie },
        }
    );

    await axios.put(
        `https://kudeta.dev/api/tickets${data.id}`,
        { title: 'ticket', price: 10 },
        { headers: { cookie } }
    );

    axios.put(
        `https://kudeta.dev/api/tickets${data.id}`,
        { title: 'ticket', price: 15 },
        { headers: { cookie } }
    );

    console.log('Request complete');
};

async () => {
    for (let i = 0; i < 400; i++) {
        doRequest();
    }
};
