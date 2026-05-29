import { useEffect, useState } from "react";
import axios from "axios";

import PortfolioModal from "../components/PortfolioModal";

import { validators } from "../pipes/validators";

function MarketPage() {
    const [coins, setCoins] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadMarketData();
    }, []);

    async function loadMarketData() {
        try {
            const response = await axios.get(
                "https://api.coingecko.com/api/v3/coins/markets",
                {
                    params: {
                        vs_currency: "usd",
                        order: "market_cap_desc",
                        per_page: 30,
                        page: 1,
                        sparkline: false
                    }
                }
            );

            setCoins(response.data);

        } catch (error) {
            setMessage("Error loading market data.");
        }
    }

    function openAddForm(coin) {
        setSelectedCoin(coin);
        setQuantity("");
        setBuyPrice(coin.current_price);
        setMessage("");
    }

    async function addToPortfolio(e) {

        e.preventDefault();

        if (!validators.positiveNumber.test(quantity)) {
            setMessage("Quantity must be a positive number.");
            return;
        }

        if (!validators.positiveNumber.test(buyPrice)) {
            setMessage("Buy price must be a positive number.");
            return;
        }

        const userId = localStorage.getItem("loggedUserId");

        if (!userId) {
            setMessage("You must be logged in to add coins to portfolio.");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:3000/api/portfolio",
                {
                    user: userId,
                    coinName: selectedCoin.name,
                    symbol: selectedCoin.symbol.toUpperCase(),
                    currentPrice: selectedCoin.current_price,
                    marketCap: selectedCoin.market_cap,
                    change24h: selectedCoin.price_change_percentage_24h,
                    image: selectedCoin.image,
                    quantity: Number(quantity),
                    buyPrice: Number(buyPrice)
                }
            );

            setMessage(response.data.message);

            setSelectedCoin(null);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Error adding coin to portfolio."
            );

        }
    }

    return (
        <div>

            <h1 className="page-title">
                Market API
            </h1>

            <div className="card p-4 mb-4">

                <h3>
                    CoinGecko Live Market Data
                </h3>

                <p>
                    This page loads the top 30 cryptocurrencies
                    from the external CoinGecko API.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={loadMarketData}
                >
                    Refresh Market Data
                </button>

            </div>

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            <PortfolioModal
                selectedCoin={selectedCoin}
                quantity={quantity}
                buyPrice={buyPrice}
                setQuantity={setQuantity}
                setBuyPrice={setBuyPrice}
                onConfirm={addToPortfolio}
                onClose={() => setSelectedCoin(null)}
            />

            <div className="row">

                {coins.map((coin) => (

                    <div
                        className="col-md-4 mb-4"
                        key={coin.id}
                    >

                        <div className="card p-3 h-100">

                            <div className="d-flex align-items-center justify-content-between">

                                <div>

                                    <h4>
                                        {coin.name}
                                    </h4>

                                    <p>
                                        <strong>Symbol:</strong>{" "}
                                        {coin.symbol.toUpperCase()}
                                    </p>

                                    <p>
                                        <strong>Price:</strong>{" "}
                                        ${coin.current_price.toLocaleString()}
                                    </p>

                                    <p
                                        className={
                                            coin.price_change_percentage_24h >= 0
                                                ? "text-success"
                                                : "text-danger"
                                        }
                                    >
                                        <strong>24h Change:</strong>{" "}
                                        {coin.price_change_percentage_24h?.toFixed(2)}%
                                    </p>

                                    <p>
                                        <strong>Market Cap:</strong>{" "}
                                        ${coin.market_cap.toLocaleString()}
                                    </p>

                                </div>

                                <img
                                    src={coin.image}
                                    alt={coin.name}
                                    className="crypto-logo"
                                />

                            </div>

                            <button
                                className="btn btn-primary btn-sm mt-3"
                                onClick={() => openAddForm(coin)}
                            >
                                Add to Portfolio
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default MarketPage;