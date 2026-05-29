import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function DashboardPage() {
    const [coins, setCoins] = useState([]);
    const [visibleCoins, setVisibleCoins] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [selectedChartCoin, setSelectedChartCoin] = useState("bitcoin");

    useEffect(() => {
        loadMarketCards();
    }, []);

    useEffect(() => {
        loadCoinChart(selectedChartCoin);
    }, [selectedChartCoin]);

    useEffect(() => {
        if (coins.length === 0) return;

        const interval = setInterval(() => {
            showNextCoins();
        }, 5000);

        return () => clearInterval(interval);
    }, [coins, startIndex]);

    async function loadMarketCards() {
        try {
            const response = await axios.get(
                "https://api.coingecko.com/api/v3/coins/markets",
                {
                    params: {
                        vs_currency: "usd",
                        order: "market_cap_desc",
                        per_page: 10,
                        page: 1,
                        sparkline: false
                    }
                }
            );

            setCoins(response.data);
            setVisibleCoins(response.data.slice(0, 3));
            setStartIndex(3);
        } catch (error) {
            console.log("Market data error", error);
        }
    }

    function showNextCoins() {
        let nextCoins = coins.slice(startIndex, startIndex + 3);
        let nextIndex = startIndex + 3;

        if (nextCoins.length < 3) {
            nextCoins = coins.slice(0, 3);
            nextIndex = 3;
        }

        setVisibleCoins(nextCoins);
        setStartIndex(nextIndex);
    }

    async function loadCoinChart(coinId) {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
                {
                    params: {
                        vs_currency: "usd",
                        days: 7
                    }
                }
            );

            const labels = response.data.prices.map((item) => {
                const date = new Date(item[0]);

                return date.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric"
                });
            });

            const prices = response.data.prices.map((item) => item[1]);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: `${coinId.toUpperCase()} price in USD - last 7 days`,
                        data: prices,
                        borderColor: "#00f5d4",
                        backgroundColor: "rgba(0,245,212,0.2)",
                        tension: 0.4
                    }
                ]
            });
        } catch (error) {
            console.log("Chart error", error);
        }
    }

    return (
        <div>
            <h1 className="page-title">
                Crypto Market Dashboard
            </h1>

            <div className="row">
                {visibleCoins.map((coin) => (
                    <div
                        className="col-md-4 mb-4"
                        key={coin.id}
                    >
                        <div className="card p-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4>{coin.name}</h4>

                                    <h5>
                                        ${coin.current_price.toLocaleString()}
                                    </h5>

                                    <p
                                        className={
                                            coin.price_change_percentage_24h >= 0
                                                ? "text-success"
                                                : "text-danger"
                                        }
                                    >
                                        {coin.price_change_percentage_24h?.toFixed(2)}% today
                                    </p>
                                </div>

                                <img
                                    src={coin.image}
                                    alt={coin.name}
                                    className="crypto-logo"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card p-4 mt-4">
                <h3>Market Overview</h3>

                <p>
                    Data is loaded live from CoinGecko API.
                </p>
            </div>

            <div className="card p-4 mt-4 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h3>
                        Real 7-Day Price Chart
                    </h3>

                    <select
                        className="form-select w-auto"
                        value={selectedChartCoin}
                        onChange={(e) => setSelectedChartCoin(e.target.value)}
                    >
                        <option value="bitcoin">Bitcoin</option>
                        <option value="ethereum">Ethereum</option>
                        <option value="solana">Solana</option>
                        <option value="ripple">XRP</option>
                        <option value="cardano">Cardano</option>
                    </select>

                </div>

                {chartData ? (
                    <Line data={chartData} />
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;