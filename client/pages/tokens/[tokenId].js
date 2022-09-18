import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const TokenShow = ({ token }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders/',
        method: 'post',
        body: {
            tokenId: token.id,
        },
        onSuccess: (order) =>
            Router.push('/orders/[orderId]', `/orders/${order.id}`),
    });

    return (
        <div>
            <h1>{token.title}</h1>
            <h4>{token.price}</h4>
            {errors}
            <button onClick={() => doRequest()} className="btn btn-primary">
                Purchase
            </button>
        </div>
    );
};

TokenShow.getInitialProps = async (context, client) => {
    const { tokenId } = context.query;
    const { data } = await client.get(`/api/tokens/${tokenId}`);

    return { token: data };
};

export default TokenShow;
