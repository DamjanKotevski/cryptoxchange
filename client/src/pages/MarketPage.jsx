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

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const coinsPerPage = 9;

    useEffect(() => {
        loadMarketData();
    }, []);

    async function loadMarketData() {
        try {
            setMessage("");

            const response = await axios.get(
                "https://api.coingecko.com/api/v3/coins/markets",
                {
                    params: {
                        vs_currency: "usd",
                        order: "market_cap_desc",
                        per_page: 50,
                        page: 1,
                        sparkline: false
                    }
                }
            );

            setCoins(response.data);
            setCurrentPage(1);

        } catch (error) {
            console.error(error);
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
                    symbol: selectedCoin.symbol.toUpperCase(),
                    currentPrice: selectedCoin.current_price,
                    marketCap: selectedCoin.market_cap,
                    change24h:
                        selectedCoin.price_change_percentage_24h,
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

    // =========================
    // SEARCH
    // =========================

    const filteredCoins = coins.filter((coin) => {
        const search = searchTerm.toLowerCase();

        return (
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        );
    });

    // =========================
    // PAGINATION
    // =========================

    const totalPages = Math.ceil(
        filteredCoins.length / coinsPerPage
    );

    const indexOfLastCoin =
        currentPage * coinsPerPage;

    const indexOfFirstCoin =
        indexOfLastCoin - coinsPerPage;

    const currentCoins = filteredCoins.slice(
        indexOfFirstCoin,
        indexOfLastCoin
    );

    function changePage(pageNumber) {
        setCurrentPage(pageNumber);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function handleSearch(e) {
        setSearchTerm(e.target.value);

        // Return to first page whenever search changes
        setCurrentPage(1);
    }

    return (
        <div>

            <h1 className="page-title">
                Crypto Market
            </h1>

            {/* MARKET INFORMATION */}

            <div className="card p-4 mb-4">

                <div
                    className="
                        d-flex
                        justify-content-between
                        align-items-center
                        flex-wrap
                        gap-3
                    "
                >

                    <div>
                        <h3>
                            CoinGecko Live Market Data
                        </h3>

                        <p className="mb-0">
                            Explore the top 50 cryptocurrencies
                            ranked by market capitalization.
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={loadMarketData}
                    >
                        Refresh Market Data
                    </button>

                </div>

            </div>

            {/* SEARCH BAR */}

            <div className="card p-3 mb-4">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by cryptocurrency name or symbol..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

            </div>

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
                onClose={() => setSelectedCoin(null)}
            />

            {/* NUMBER OF RESULTS */}

            <div className="mb-3">

                <small className="text-secondary">

                    Showing {currentCoins.length} of{" "}
                    {filteredCoins.length} cryptocurrencies

                </small>

            </div>

            {/* CRYPTO CARDS */}

            <div className="row">

                {currentCoins.length === 0 ? (

                    <div className="col-12">

                        <div
                            className="
                                card
                                p-4
                                text-center
                            "
                        >
                            <h5>
                                No cryptocurrencies found.
                            </h5>

                            <p className="mb-0">
                                Try searching for another
                                cryptocurrency.
                            </p>
                        </div>

                    </div>

                ) : (

                    currentCoins.map((coin) => (

                        <div
                            className="col-md-4 mb-4"
                            key={coin.id}
                        >

                            <div className="card p-3 h-100">

                                <div
                                    className="
                                        d-flex
                                        align-items-center
                                        justify-content-between
                                    "
                                >

                                    <div>

                                        <h4>
                                            {coin.name}
                                        </h4>

                                        <p>
                                            <strong>
                                                Symbol:
                                            </strong>{" "}
                                            {coin.symbol.toUpperCase()}
                                        </p>

                                        <p>
                                            <strong>
                                                Price:
                                            </strong>{" "}
                                            $
                                            {coin.current_price
                                                ?.toLocaleString()}
                                        </p>

                                        <p
                                            className={
                                                coin
                                                    .price_change_percentage_24h >=
                                                0
                                                    ? "text-success"
                                                    : "text-danger"
                                            }
                                        >
                                            <strong>
                                                24h Change:
                                            </strong>{" "}

                                            {coin
                                                .price_change_percentage_24h
                                                ?.toFixed(2)}
                                            %
                                        </p>

                                        <p>
                                            <strong>
                                                Market Cap:
                                            </strong>{" "}
                                            $
                                            {coin.market_cap
                                                ?.toLocaleString()}
                                        </p>

                                    </div>

                                    <img
                                        src={coin.image}
                                        alt={coin.name}
                                        className="crypto-logo"
                                    />

                                </div>

                                <button
                                    className="
                                        btn
                                        btn-primary
                                        btn-sm
                                        mt-3
                                    "
                                    onClick={() =>
                                        openAddForm(coin)
                                    }
                                >
                                    Add to Portfolio
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

                <div
                    className="
                        d-flex
                        justify-content-center
                        align-items-center
                        mt-4
                        mb-4
                    "
                >

                    <nav>
                        <ul className="pagination">

                            {/* PREVIOUS */}

                            <li
                                className={
                                    currentPage === 1
                                        ? "page-item disabled"
                                        : "page-item"
                                }
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        changePage(
                                            currentPage - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>
                            </li>

                            {/* PAGE NUMBERS */}

                            {Array.from(
                                { length: totalPages },
                                (_, index) => {

                                    const pageNumber =
                                        index + 1;

                                    return (
                                        <li
                                            key={pageNumber}
                                            className={
                                                currentPage ===
                                                pageNumber
                                                    ? "page-item active"
                                                    : "page-item"
                                            }
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    changePage(
                                                        pageNumber
                                                    )
                                                }
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    );
                                }
                            )}

                            {/* NEXT */}

                            <li
                                className={
                                    currentPage === totalPages
                                        ? "page-item disabled"
                                        : "page-item"
                                }
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        changePage(
                                            currentPage + 1
                                        )
                                    }
                                >
                                    Next
                                </button>
                            </li>

                        </ul>
                    </nav>

                </div>

            )}

        </div>
    );
}

export default MarketPage;