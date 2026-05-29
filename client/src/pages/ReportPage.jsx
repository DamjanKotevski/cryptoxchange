import { useEffect, useState } from "react";
import { apiService } from "../services/apiService";

function ReportPage() {
    const [portfolio, setPortfolio] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadPortfolio();
    }, []);

    async function loadPortfolio() {
        const userId = localStorage.getItem("loggedUserId");

        if (!userId) {
            setMessage("Please login to generate portfolio report.");
            return;
        }

        try {
            const response = await apiService.getPortfolio(userId);
            setPortfolio(response.data);
        } catch (error) {
            setMessage("Error loading portfolio data.");
        }
    }

    const totalValue = portfolio.reduce(
        (sum, item) => sum + item.quantity * item.currentPrice,
        0
    );

    const totalInvested = portfolio.reduce(
        (sum, item) => sum + item.quantity * item.buyPrice,
        0
    );

    const profit = totalValue - totalInvested;

    function generateReport() {
        const user = localStorage.getItem("loggedUser") || "Guest";

        let reportText = `
CryptoXchange Portfolio Report
Generated for: ${user}
Date: ${new Date().toLocaleString()}

--------------------------------
Portfolio Summary
--------------------------------
Total Portfolio Value: $${totalValue.toFixed(2)}
Total Invested: $${totalInvested.toFixed(2)}
Total Profit/Loss: ${profit >= 0 ? "+" : ""}$${profit.toFixed(2)}

--------------------------------
Portfolio Items
--------------------------------
`;

        if (portfolio.length === 0) {
            reportText += "No portfolio items found.\n";
        } else {
            portfolio.forEach((item, index) => {
                const currentValue = item.quantity * item.currentPrice;
                const invested = item.quantity * item.buyPrice;
                const itemProfit = currentValue - invested;

                reportText += `
${index + 1}. ${item.coinName} (${item.symbol})
Quantity: ${item.quantity}
Buy Price: $${item.buyPrice}
Current Price: $${item.currentPrice}
Current Value: $${currentValue.toFixed(2)}
Profit/Loss: ${itemProfit >= 0 ? "+" : ""}$${itemProfit.toFixed(2)}
`;
            });
        }

        const blob = new Blob([reportText], {
            type: "text/plain"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "CryptoXchange_Portfolio_Report.txt";
        link.click();

        URL.revokeObjectURL(url);

        setMessage("Report generated successfully.");
    }

    return (
        <div>
            <h1 className="page-title">Portfolio Report</h1>

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            <div className="card p-4">
                <h3>Investment Summary</h3>

                <p>
                    <strong>Total Portfolio Value:</strong>{" "}
                    ${totalValue.toFixed(2)}
                </p>

                <p>
                    <strong>Total Invested:</strong>{" "}
                    ${totalInvested.toFixed(2)}
                </p>

                <p className={profit >= 0 ? "text-success" : "text-danger"}>
                    <strong>Total Profit/Loss:</strong>{" "}
                    {profit >= 0 ? "+" : ""}${profit.toFixed(2)}
                </p>

                <button
                    className="btn btn-warning"
                    onClick={generateReport}
                    disabled={portfolio.length === 0}
                >
                    Generate Report
                </button>
            </div>
        </div>
    );
}

export default ReportPage;