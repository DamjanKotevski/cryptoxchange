import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MarketPage from "./pages/MarketPage";
import PortfolioPage from "./pages/PortfolioPage";
import FeedbackPage from "./pages/FeedbackPage";
import HistoryPage from "./pages/HistoryPage";
import SearchPage from "./pages/SearchPage";
import ReportPage from "./pages/ReportPage";
import DbPage from "./pages/DbPage";
import CryptoDetailsPage from "./pages/CryptoDetailsPage";
function App() {
    return (
        <>
            <Navbar />

            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />

                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/market" element={<MarketPage />} />

                    <Route path="/portfolio" element={<PortfolioPage />} />

                    <Route path="/feedback" element={<FeedbackPage />} />

                    <Route path="/history" element={<HistoryPage />} />

                    <Route path="/search" element={<SearchPage />} />

                    <Route path="/report" element={<ReportPage />} />

                    <Route path="/db" element={<DbPage />} />
                    
                    <Route path="/crypto/:coinId" element={<CryptoDetailsPage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;