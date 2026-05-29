import { useEffect, useState } from "react";
import { marketService } from "../services/marketService";

function SearchPage() {
    const [coins, setCoins] = useState([]);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadCoins();
    }, []);

    async function loadCoins() {
        const response = await marketService.getTopCoins(30);
        setCoins(response.data);
    }

    const filteredCoins = coins.filter((coin) =>
        coin.name.toLowerCase().includes(keyword.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div>
            <h1 className="page-title">Search Cryptocurrencies</h1>

            <div className="card p-4 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or symbol..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredCoins.map((coin) => (
                    <div className="col-md-4 mb-4" key={coin.id}>
                        <div className="card p-3 h-100">
                            <h4>{coin.name}</h4>
                            <p><strong>Symbol:</strong> {coin.symbol.toUpperCase()}</p>
                            <p><strong>Price:</strong> ${coin.current_price.toLocaleString()}</p>
                            <img src={coin.image} className="crypto-logo" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPage;