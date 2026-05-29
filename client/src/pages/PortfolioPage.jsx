import { useEffect, useState } from "react";
import axios from "axios";

function PortfolioPage() {
    const [portfolio, setPortfolio] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadPortfolio();
    }, []);

    async function loadPortfolio() {
    const userId = localStorage.getItem("loggedUserId");

    if (!userId) {
        setMessage("Please login to view your portfolio.");
        return;
    }

    try {
        const response = await axios.get(
    `https://cryptoxchange.onrender.com/api/portfolio/user/${userId}`
);
        setPortfolio(response.data);
    } catch (error) {
        setMessage("Error loading portfolio.");
    }
}

    async function deletePortfolioItem(id) {
        try {
            await axios.delete(
                `https://cryptoxchange.onrender.com/api/portfolio/${id}`
            );

            setMessage("Portfolio item deleted successfully.");
            loadPortfolio();
        } catch (error) {
            setMessage("Error deleting portfolio item.");
        }
    }

    return (
        <div>
            <h1 className="page-title">
                My Crypto Portfolio
            </h1>

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            <div className="card p-4">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Coin</th>
                            <th>Symbol</th>
                            <th>Quantity</th>
                            <th>Buy Price</th>
                            <th>Current Price</th>
                            <th>Current Value</th>
                            <th>Profit/Loss</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {portfolio.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center"
                                >
                                    No portfolio items found.
                                </td>
                            </tr>
                        ) : (
                            portfolio.map((item) => {
                                const currentValue =
                                    item.quantity *
                                    item.currentPrice;

                                const invested =
                                    item.quantity *
                                    item.buyPrice;

                                const profit =
                                    currentValue - invested;

                                return (
                                    <tr key={item._id}>
                                        <td>
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.coinName}
                                                    width="25"
                                                    className="me-2"
                                                />
                                            )}

                                            {item.coinName}
                                        </td>

                                        <td>{item.symbol}</td>

                                        <td>{item.quantity}</td>

                                        <td>
                                            $
                                            {item.buyPrice.toLocaleString()}
                                        </td>

                                        <td>
                                            $
                                            {item.currentPrice.toLocaleString()}
                                        </td>

                                        <td>
                                            $
                                            {currentValue.toFixed(2)}
                                        </td>

                                        <td
                                            className={
                                                profit >= 0
                                                    ? "text-success"
                                                    : "text-danger"
                                            }
                                        >
                                            {profit >= 0 ? "+" : ""}
                                            ${profit.toFixed(2)}
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    deletePortfolioItem(
                                                        item._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PortfolioPage;