import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = localStorage.getItem("loggedUser");
    const role = localStorage.getItem("loggedRole");

    function logout() {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("loggedEmail");
        localStorage.removeItem("loggedRole");
        localStorage.removeItem("loggedUserId");

        navigate("/login");
        window.location.reload();
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">
                    CryptoXchange
                </Link>

                <div className="navbar-nav ms-auto align-items-center">
                    <span className="badge bg-secondary me-3">
                        {role || "Guest"}
                    </span>

                    <Link className="nav-link" to="/dashboard">
                        Dashboard
                    </Link>

                    <Link className="nav-link" to="/market">
                        Market API
                    </Link>

                    <Link className="nav-link" to="/search">
                        Search
                    </Link>

                    <Link className="nav-link" to="/portfolio">
                        My Portfolio
                    </Link>

                    <Link className="nav-link" to="/report">
                        Report
                    </Link>

                    <Link className="nav-link" to="/feedback">
                        Feedback
                    </Link>

                    {role === "Admin" && (
                        <>
                            <Link className="nav-link" to="/history">
                                History
                            </Link>

                            <Link className="nav-link" to="/db">
                                DB
                            </Link>
                        </>
                    )}

                    {user ? (
                        <>
                            <span className="text-info ms-3 me-2">
                                {user}
                            </span>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>

                            <Link className="nav-link" to="/register">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;