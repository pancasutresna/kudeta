import Link from 'next/link';

const LandingPage = ({ currentUser, tokens }) => {
    const tokenList = tokens.map((token) => {
        return (
            <tr key={token.id}>
                <td>{token.title}</td>
                <td>{token.price}</td>
                <td>
                    <Link href="/tokens/[tokenId]" as={`/tokens/${token.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <h1>Tokens</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>{tokenList}</tbody>
            </table>
        </div>
    );

    // return currentUser ? (
    //     <h1>You are signed in</h1>
    // ) : (
    //     <h1>You are NOT signed in</h1>
    // );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tokens');

    return { tokens: data };
};

export default LandingPage;
