import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validators } from "../pipes/validators";

function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function loginUser(e) {

        e.preventDefault();
        
        if (!validators.email.test(email)) {
    alert("Please enter a valid email address.");
    return;
}

if (!validators.password.test(password)) {
    alert("Password must be at least 6 characters long.");
    return;
}

        try {

            const response = await axios.post(
                "http://localhost:3000/api/users/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "loggedUser",
                response.data.user.name
            );

            localStorage.setItem(
                "loggedEmail",
                response.data.user.email
            );

            localStorage.setItem(
                "loggedRole",
                response.data.user.role
            );

            localStorage.setItem(
                "loggedUserId",
                response.data.user.id
            );

            localStorage.setItem(
    "token",
    response.data.token
);

            navigate("/dashboard");

            window.location.reload();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    }

    return (
        <div className="row justify-content-center">

            <div className="col-md-5">

                <div className="card p-4">

                    <h1 className="page-title">
                        Login
                    </h1>

                    <form onSubmit={loginUser}>

                        <div className="mb-3">

                            <label>Email</label>

                            <input
                                type="email"
                                className="form-control"
                                required
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <label>Password</label>

                            <input
                                type="password"
                                className="form-control"
                                required
                                minLength="6"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default LoginPage;