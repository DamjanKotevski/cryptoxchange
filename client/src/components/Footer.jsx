import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="crypto-footer">
            <div className="container">

                <div className="footer-content">

                    <div className="footer-brand">
                        <Link to="/dashboard" className="footer-logo">
                            ◆ Crypto<span>Xchange</span>
                        </Link>

                        <p>
                            Track crypto markets, manage your portfolio
                            and explore real-time cryptocurrency data.
                        </p>
                    </div>

                    <div className="footer-links">
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/market">Market</Link>
                        <Link to="/portfolio">Portfolio</Link>
                        <Link to="/report">Reports</Link>
                        <Link to="/feedback">Feedback</Link>
                    </div>

                </div>

                <div className="footer-bottom">
                    <span>
                        © 2026 CryptoXchange. All rights reserved.
                    </span>

                    <span className="footer-project">
                        Cryptocurrency Market Platform
                    </span>
                </div>

            </div>
        </footer>
    );
}

export default Footer;