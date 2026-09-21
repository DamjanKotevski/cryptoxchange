import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { marketService } from "../services/marketService";

function SearchPage() {
    const [coins, setCoins] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCoins();
    }, []);

    async function loadCoins() {
        try {
            setLoading(true);
            setError("");

            const response =
                await marketService.getTopCoins(50);

            setCoins(response.data);

        } catch (error) {
            console.error(error);
            setError("Error loading cryptocurrencies.");

        } finally {
            setLoading(false);
        }
    }

    const filteredCoins = coins.filter((coin) => {
        if (!keyword.trim()) {
            return false;
        }

        const search = keyword.toLowerCase().trim();

        return (
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        );
    });

    return (
        <div>

            <h1 className="page-title">
                Search Cryptocurrencies
            </h1>

            {/* SEARCH */}

            <div className="card p-4 mb-4">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Bitcoin, BTC, Ethereum, ETH..."
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                />

                <small className="text-secondary mt-3">
                    Search for a cryptocurrency to view
                    detailed market information.
                </small>

            </div>

            {/* ERROR */}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* LOADING */}

            {loading && (
                <div className="text-center mt-4">
                    <p>Loading cryptocurrencies...</p>
                </div>
            )}

            {/* BEFORE SEARCH */}

            {!loading && !keyword.trim() && (

                <div className="card p-5 text-center">

                    <h3>
                        Find a Cryptocurrency
                    </h3>

                    <p className="text-secondary mb-0">
                        Enter a cryptocurrency name or symbol
                        in the search box above.
                    </p>

                </div>

            )}

            {/* NO RESULTS */}

            {!loading &&
                keyword.trim() &&
                filteredCoins.length === 0 && (

                    <div className="card p-4 text-center">

                        <h4>
                            No cryptocurrency found
                        </h4>

                        <p className="text-secondary mb-0">
                            Try another cryptocurrency name
                            or symbol.
                        </p>

                    </div>

                )}

            {/* SEARCH RESULTS */}

            {!loading &&
                keyword.trim() &&
                filteredCoins.length > 0 && (

                    <div>

                        <div className="mb-3">

                            <small className="text-secondary">
                                Found{" "}
                                {filteredCoins.length}{" "}
                                result
                                {filteredCoins.length !== 1
                                    ? "s"
                                    : ""}
                            </small>

                        </div>

                        {filteredCoins.map((coin) => (

                            <div
                                className="card p-3 mb-3"
                                key={coin.id}
                            >

                                <div
                                    className="
                                        d-flex
                                        justify-content-between
                                        align-items-center
                                        flex-wrap
                                        gap-3
                                    "
                                >

                                    {/* COIN */}

                                    <div
                                        className="
                                            d-flex
                                            align-items-center
                                            gap-3
                                        "
                                    >

                                        <img
                                            src={coin.image}
                                            alt={coin.name}
                                            style={{
                                                width: "50px",
                                                height: "50px"
                                            }}
                                        />

                                        <div>

                                            <h4 className="mb-1">
                                                {coin.name}
                                            </h4>

                                            <span className="text-secondary">
                                                {coin.symbol.toUpperCase()}
                                            </span>

                                        </div>

                                    </div>

                                    {/* PRICE */}

                                    <div>

                                        <small className="text-secondary">
                                            Current Price
                                        </small>

                                        <h5 className="mb-0">
                                            $
                                            {coin.current_price
                                                ?.toLocaleString()}
                                        </h5>

                                    </div>

                                    {/* 24H CHANGE */}

                                    <div>

                                        <small className="text-secondary">
                                            24h Change
                                        </small>

                                        <h5
                                            className={
                                                coin
                                                    .price_change_percentage_24h >=
                                                0
                                                    ? "text-success mb-0"
                                                    : "text-danger mb-0"
                                            }
                                        >
                                            {coin
                                                .price_change_percentage_24h >=
                                            0
                                                ? "+"
                                                : ""}

                                            {coin
                                                .price_change_percentage_24h
                                                ?.toFixed(2)}
                                            %
                                        </h5>

                                    </div>

                                    {/* DETAILS */}

                                    <Link
                                        to={`/crypto/${coin.id}`}
                                        className="btn btn-primary"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
}

export default SearchPage;