import { useState } from "react";
import axios from "axios";

function DbPage() {
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("loggedRole");

    async function seedDatabase() {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/db/seed",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Error seeding database."
            );
        }
    }

    async function clearDatabase() {
        try {
            const response = await axios.delete(
                "http://localhost:3000/api/db/clear",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.clear();

            setMessage(response.data.message + " Please login again.");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Error clearing database."
            );
        }
    }

    if (role !== "Admin") {
        return (
            <div>
                <h1 className="page-title">Database Management</h1>

                <div className="alert alert-danger">
                    Admin access required.
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Database Management</h1>

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            <div className="card p-4 mb-4">
                <h3>Seed Initial Data</h3>
                <p>Insert demo users and cryptocurrencies into MongoDB.</p>

                <button
                    className="btn btn-success"
                    onClick={seedDatabase}
                >
                    Seed Database
                </button>
            </div>

            <div className="card p-4">
                <h3>Clear Database</h3>
                <p>Delete all existing data from MongoDB.</p>

                <button
                    className="btn btn-danger"
                    onClick={clearDatabase}
                >
                    Clear Database
                </button>
            </div>
        </div>
    );
}

export default DbPage;