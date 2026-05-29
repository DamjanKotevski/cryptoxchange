import { useEffect, useState } from "react";
import axios from "axios";

function HistoryPage() {
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState("");

    const role = localStorage.getItem("loggedRole");

    useEffect(() => {
        if (role !== "Admin") {
            setMessage("Access denied. Only Admin users can view history.");
            return;
        }

        loadHistory();
    }, []);

    async function loadHistory() {
        try {
            const response = await axios.get(
    "http://localhost:3000/api/activity-logs",
    {
        headers: {
            Authorization:
                `Bearer ${localStorage.getItem("token")}`
        }
    }
);

            setLogs(response.data);
        } catch (error) {
            setMessage("Error loading activity logs.");
        }
    }

    return (
        <div>
            <h1 className="page-title">
                Activity History
            </h1>

            {message && (
                <div className="alert alert-warning">
                    {message}
                </div>
            )}

            {role === "Admin" && (
                <div className="card p-4">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >
                                        No activity logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id}>
                                        <td>
                                            {new Date(
                                                log.createdAt
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {log.user
                                                ? log.user.name
                                                : "Guest"}
                                        </td>

                                        <td>
                                            {log.action}
                                        </td>

                                        <td>
                                            {log.details || "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HistoryPage;