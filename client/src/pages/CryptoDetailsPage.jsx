import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { marketService } from "../services/marketService";

function CryptoDetailsPage() {
    const { coinId } = useParams();
    const [coin, setCoin] = useState(null);

    useEffect(() => {
        loadCoin();
    }, [coinId]);

    async function loadCoin() {
        const response = await marketService.getTopCoins(30);

        const selected = response.data.find(
            (item) => item.id === coinId
        );

        setCoin(selected);
    }

    if (!coin) {
        return <p>Loading details...</p>;
    }

    return (
        <div>
            <h1 className="page-title">
                {coin.name} Details
            </h1>

            <div className="card p-4">
                <img src={coin.image} className="crypto-logo mb-3" />

                <h3>{coin.name} ({coin.symbol.toUpperCase()})</h3>

                <p><strong>Current Price:</strong> ${coin.current_price.toLocaleString()}</p>
                <p><strong>Market Cap:</strong> ${coin.market_cap.toLocaleString()}</p>
                <p><strong>Rank:</strong> #{coin.market_cap_rank}</p>

                <p className={coin.price_change_percentage_24h >= 0 ? "text-success" : "text-danger"}>
                    <strong>24h Change:</strong> {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
            </div>
        </div>
    );
}

export default CryptoDetailsPage;