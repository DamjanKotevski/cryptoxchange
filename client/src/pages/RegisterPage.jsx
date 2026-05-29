import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validators } from "../pipes/validators";

function RegisterPage() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("User");

    async function registerUser(e) {

        e.preventDefault();
        if (!validators.name.test(name)) {
    alert("Name must contain only letters and be 2-40 characters long.");
    return;
}

if (!validators.email.test(email)) {
    alert("Please enter a valid email address.");
    return;
}

if (!validators.password.test(password)) {
    alert("Password must be at least 6 characters long.");
    return;
}

if (!validators.role.test(role)) {
    alert("Invalid role selected.");
    return;
}

        try {

            await axios.post(
                "https://cryptoxchange.onrender.com/api/users/register",
                {
                    name,
                    email,
                    password,
                    role
                }
            );

            alert(
                "Registration successful! Confirmation email sent."
            );

            navigate("/login");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        }
    }

    return (
        <div className="row justify-content-center">

            <div className="col-md-5">

                <div className="card p-4">

                    <h1 className="page-title">
                        Register
                    </h1>

                    <form onSubmit={registerUser}>

                        <div className="mb-3">

                            <label>Full Name</label>

                            <input
                                type="text"
                                className="form-control"
                                required
                                minLength="2"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />

                        </div>

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

                        <div className="mb-3">

                            <label>Role</label>

                            <select
                                className="form-select"
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                            >

                                <option value="User">
                                    User
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>

                            </select>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100"
                        >
                            Register
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default RegisterPage;