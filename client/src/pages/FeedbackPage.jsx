import { useEffect, useState } from "react";
import axios from "axios";
import { validators } from "../pipes/validators";

function FeedbackPage() {
    const [feedback, setFeedback] = useState([]);
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [info, setInfo] = useState("");

    useEffect(() => {
        loadFeedback();
    }, []);

    async function loadFeedback() {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/feedback"
            );

            setFeedback(response.data);
        } catch (error) {
            setInfo("Error loading feedback.");
        }
    }

    async function submitFeedback(e) {
        e.preventDefault();
        
        if (!validators.feedbackMessage.test(message)) {
    setInfo("Feedback must be between 3 and 300 characters.");
    return;
}

if (!validators.rating.test(String(rating))) {
    setInfo("Rating must be between 1 and 5.");
    return;
}

        const userId = localStorage.getItem("loggedUserId");

        try {
            await axios.post(
                "http://localhost:3000/api/feedback",
                {
                    user: userId,
                    message: message,
                    rating: Number(rating)
                }
            );

            setInfo("Feedback submitted successfully.");
            setMessage("");
            setRating(5);

            loadFeedback();

        } catch (error) {
            setInfo(
                error.response?.data?.message ||
                "Error submitting feedback."
            );
        }
    }

    return (
        <div>
            <h1 className="page-title">
                User Feedback
            </h1>

            {info && (
                <div className="alert alert-info">
                    {info}
                </div>
            )}

            <div className="card p-4 mb-4">
                <form onSubmit={submitFeedback}>
                    <div className="mb-3">
                        <label>Your Feedback</label>

                        <textarea
                            className="form-control"
                            rows="5"
                            required
                            minLength="3"
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label>Rating</label>

                        <select
                            className="form-select"
                            required
                            value={rating}
                            onChange={(e) =>
                                setRating(e.target.value)
                            }
                        >
                            <option value="5">
                                5 - Excellent
                            </option>

                            <option value="4">
                                4 - Very Good
                            </option>

                            <option value="3">
                                3 - Good
                            </option>

                            <option value="2">
                                2 - Fair
                            </option>

                            <option value="1">
                                1 - Poor
                            </option>
                        </select>
                    </div>

                    <button className="btn btn-success">
                        Submit Feedback
                    </button>
                </form>
            </div>

            <div className="card p-4">
                <h4>User Comments</h4>

                {feedback.length === 0 ? (
                    <p>No feedback yet.</p>
                ) : (
                    feedback.map((item) => (
                        <div
                            className="border-bottom py-3"
                            key={item._id}
                        >
                            <p>
                                <strong>
                                    {item.user
                                        ? item.user.name
                                        : "Guest"}
                                </strong>{" "}
                                - Rating: {item.rating}/5
                            </p>

                            <p>{item.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FeedbackPage;