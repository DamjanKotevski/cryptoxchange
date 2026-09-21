import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { marketService } from "../services/marketService";
import PortfolioModal from "../components/PortfolioModal";
import { validators } from "../pipes/validators";

function CryptoDetailsPage() {
    const { coinId } = useParams();

    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCoin, setSelectedCoin] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadCoin();
    }, [coinId]);

    async function loadCoin() {
        try {
            setLoading(true);
            setError("");

            const response =
                await marketService.getCoinDetails(coinId);

            setCoin(response.data);

        } catch (error) {
            console.error(error);

            setError(
                "Unable to load cryptocurrency details."
            );

        } finally {
            setLoading(false);
        }
    }

    function formatCurrency(value) {
        if (value === null || value === undefined) {
            return "N/A";
        }

        return `$${Number(value).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        )}`;
    }

    function formatNumber(value) {
        if (value === null || value === undefined) {
            return "N/A";
        }

        return Number(value).toLocaleString("en-US");
    }

    function openAddForm() {
        if (!coin) {
            return;
        }

        setSelectedCoin({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image?.large,
            current_price:
                coin.market_data?.current_price?.usd,
            market_cap:
                coin.market_data?.market_cap?.usd,
            price_change_percentage_24h:
                coin.market_data
                    ?.price_change_percentage_24h
        });

        setQuantity("");

        setBuyPrice(
            coin.market_data?.current_price?.usd || ""
        );

        setMessage("");
    }

    async function addToPortfolio(e) {
        e.preventDefault();

        if (!validators.positiveNumber.test(quantity)) {
            setMessage(
                "Quantity must be a positive number."
            );
            return;
        }

        if (!validators.positiveNumber.test(buyPrice)) {
            setMessage(
                "Buy price must be a positive number."
            );
            return;
        }

        const userId =
    localStorage.getItem("loggedUserId");

if (!userId) {
    setSelectedCoin(null);

    setMessage(
        "You must be logged in to add coins to portfolio."
    );

    return;
}

        try {
            const response = await axios.post(
                "https://cryptoxchange.onrender.com/api/portfolio",
                {
                    user: userId,
                    coinName: selectedCoin.name,
                    symbol:
                        selectedCoin.symbol.toUpperCase(),
                    currentPrice:
                        selectedCoin.current_price,
                    marketCap:
                        selectedCoin.market_cap,
                    change24h:
                        selectedCoin
                            .price_change_percentage_24h,
                    image:
                        selectedCoin.image,
                    quantity:
                        Number(quantity),
                    buyPrice:
                        Number(buyPrice)
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

    if (loading) {
        return (
            <div className="card p-4 text-center">
                <h4>Loading cryptocurrency details...</h4>
            </div>
        );
    }

    if (error || !coin) {
        return (
            <div>

                <div className="alert alert-danger">
                    {error || "Cryptocurrency not found."}
                </div>

                <Link
                    to="/search"
                    className="btn btn-primary"
                >
                    Back to Search
                </Link>

            </div>
        );
    }

    const marketData = coin.market_data;

    const price =
        marketData?.current_price?.usd;

    const marketCap =
        marketData?.market_cap?.usd;

    const volume =
        marketData?.total_volume?.usd;

    const high24h =
        marketData?.high_24h?.usd;

    const low24h =
        marketData?.low_24h?.usd;

    const change24h =
        marketData?.price_change_percentage_24h;

    return (
        <div>

            {/* BACK BUTTON */}

            <div className="mb-4">

                <Link
                    to="/search"
                    className="btn btn-outline-primary btn-sm"
                >
                    ← Back to Search
                </Link>

            </div>

            {/* TITLE */}

            <h1 className="page-title">
                {coin.name} Details
            </h1>

            {/* MESSAGE */}

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            {/* PORTFOLIO MODAL */}

            <PortfolioModal
                selectedCoin={selectedCoin}
                quantity={quantity}
                buyPrice={buyPrice}
                setQuantity={setQuantity}
                setBuyPrice={setBuyPrice}
                onConfirm={addToPortfolio}
                onClose={() =>
                    setSelectedCoin(null)
                }
            />

            {/* MAIN INFORMATION */}

            <div className="card p-4 mb-4">

                <div
                    className="
                        d-flex
                        justify-content-between
                        align-items-start
                        flex-wrap
                        gap-4
                    "
                >

                    <div
                        className="
                            d-flex
                            align-items-center
                            gap-3
                        "
                    >

                        <img
                            src={coin.image?.large}
                            alt={coin.name}
                            style={{
                                width: "80px",
                                height: "80px"
                            }}
                        />

                        <div>

                            <h2 className="mb-1">
                                {coin.name}
                            </h2>

                            <span className="text-secondary">
                                {coin.symbol.toUpperCase()}
                            </span>

                            <div className="mt-2">

                                <span className="badge bg-secondary">
                                    Market Rank #
                                    {coin.market_cap_rank || "N/A"}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="text-end">

                        <h2>
                            {formatCurrency(price)}
                        </h2>

                        <p
                            className={
                                change24h >= 0
                                    ? "text-success"
                                    : "text-danger"
                            }
                        >
                            <strong>
                                {change24h >= 0
                                    ? "+"
                                    : ""}
                                {change24h?.toFixed(2) ||
                                    "0.00"}
                                %
                            </strong>{" "}
                            (24h)
                        </p>

                    </div>

                </div>

            </div>

            {/* MARKET STATISTICS */}

            <div className="card p-4 mb-4">

                <h3 className="mb-4">
                    Market Statistics
                </h3>

                <div className="row">

                    <div className="col-md-4 mb-4">
                        <small className="text-secondary">
                            Market Cap
                        </small>

                        <h5>
                            {formatCurrency(marketCap)}
                        </h5>
                    </div>

                    <div className="col-md-4 mb-4">
                        <small className="text-secondary">
                            24h Trading Volume
                        </small>

                        <h5>
                            {formatCurrency(volume)}
                        </h5>
                    </div>

                    <div className="col-md-4 mb-4">
                        <small className="text-secondary">
                            Market Cap Rank
                        </small>

                        <h5>
                            #
                            {coin.market_cap_rank ||
                                "N/A"}
                        </h5>
                    </div>

                    <div className="col-md-4 mb-4">
                        <small className="text-secondary">
                            24h High
                        </small>

                        <h5>
                            {formatCurrency(high24h)}
                        </h5>
                    </div>

                    <div className="col-md-4 mb-4">
                        <small className="text-secondary">
                            24h Low
                        </small>

                        <h5>
                            {formatCurrency(low24h)}
                        </h5>
                    </div>

                    <div className="col-md-4 mb-4">
                        <small className="text-secondary">
                            24h Change
                        </small>

                        <h5
                            className={
                                change24h >= 0
                                    ? "text-success"
                                    : "text-danger"
                            }
                        >
                            {change24h >= 0
                                ? "+"
                                : ""}
                            {change24h?.toFixed(2) ||
                                "0.00"}
                            %
                        </h5>
                    </div>

                </div>

            </div>

            {/* SUPPLY INFORMATION */}

            <div className="card p-4 mb-4">

                <h3 className="mb-4">
                    Supply Information
                </h3>

                <div className="row">

                    <div className="col-md-4 mb-3">

                        <small className="text-secondary">
                            Circulating Supply
                        </small>

                        <h5>
                            {formatNumber(
                                marketData
                                    ?.circulating_supply
                            )}{" "}
                            {coin.symbol.toUpperCase()}
                        </h5>

                    </div>

                    <div className="col-md-4 mb-3">

                        <small className="text-secondary">
                            Total Supply
                        </small>

                        <h5>
                            {formatNumber(
                                marketData
                                    ?.total_supply
                            )}{" "}
                            {coin.symbol.toUpperCase()}
                        </h5>

                    </div>

                    <div className="col-md-4 mb-3">

                        <small className="text-secondary">
                            Max Supply
                        </small>

                        <h5>
                            {formatNumber(
                                marketData
                                    ?.max_supply
                            )}{" "}
                            {coin.symbol.toUpperCase()}
                        </h5>

                    </div>

                </div>

            </div>

            {/* ADD TO PORTFOLIO */}

            <div className="d-flex justify-content-end mb-5">

                <button
                    className="btn btn-primary"
                    onClick={openAddForm}
                >
                    Add {coin.name} to Portfolio
                </button>

            </div>

        </div>
    );
}

export default CryptoDetailsPage;