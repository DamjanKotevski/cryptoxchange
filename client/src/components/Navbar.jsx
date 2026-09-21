import { NavLink, Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = localStorage.getItem("loggedUser");
    const role = localStorage.getItem("loggedRole");

    function logout() {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("loggedEmail");
        localStorage.removeItem("loggedRole");
        localStorage.removeItem("loggedUserId");
        localStorage.removeItem("token");

        navigate("/login");
        window.location.reload();
    }

    const navClass = ({ isActive }) =>
        isActive ? "nav-link active-link" : "nav-link";

    return (
        <nav className="crypto-navbar">
            <div className="container crypto-navbar-container">

                {/* LOGO */}
                <Link className="crypto-brand" to="/dashboard">
                    <span className="brand-icon">◆</span>

                    <span>
                        Crypto<span className="brand-highlight">Xchange</span>
                    </span>
                </Link>

                {/* NAVIGATION */}
                <div className="crypto-nav-links">

                    <NavLink className={navClass} to="/dashboard">
                        Dashboard
                    </NavLink>

                    <NavLink className={navClass} to="/market">
                        Market
                    </NavLink>

                    <NavLink className={navClass} to="/search">
                        Search
                    </NavLink>

                    <NavLink className={navClass} to="/portfolio">
                        Portfolio
                    </NavLink>

                    <NavLink className={navClass} to="/report">
                        Reports
                    </NavLink>

                    <NavLink className={navClass} to="/feedback">
                        Feedback
                    </NavLink>

                    {role === "Admin" && (
                        <>
                            <NavLink className={navClass} to="/history">
                                History
                            </NavLink>

                            <NavLink className={navClass} to="/db">
                                Database
                            </NavLink>
                        </>
                    )}

                </div>

                {/* USER AREA */}
                <div className="navbar-user-area">

                    <span
                        className={
                            role === "Admin"
                                ? "role-badge admin-role"
                                : "role-badge user-role"
                        }
                    >
                        {role || "Guest"}
                    </span>

                    {user ? (
                        <>
                            <div className="navbar-user">
    <span className="username">
        {user}
    </span>
</div>

                            <button
                                className="logout-button"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="auth-links">
                            <NavLink className={navClass} to="/login">
                                Login
                            </NavLink>

                            <NavLink
                                className="register-button"
                                to="/register"
                            >
                                Register
                            </NavLink>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;