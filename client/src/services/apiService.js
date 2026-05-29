import axios from "axios";

const API_URL = "https://cryptoxchange.onrender.com/api";

export const apiService = {
    registerUser: (userData) => {
        return axios.post(`${API_URL}/users/register`, userData);
    },

    loginUser: (loginData) => {
        return axios.post(`${API_URL}/users/login`, loginData);
    },

    getPortfolio: (userId) => {
        return axios.get(`${API_URL}/portfolio/user/${userId}`);
    },

    addPortfolioItem: (portfolioData) => {
        return axios.post(`${API_URL}/portfolio`, portfolioData);
    },

    deletePortfolioItem: (id) => {
        return axios.delete(`${API_URL}/portfolio/${id}`);
    },

    getFeedback: () => {
        return axios.get(`${API_URL}/feedback`);
    },

    createFeedback: (feedbackData) => {
        return axios.post(`${API_URL}/feedback`, feedbackData);
    },

    getActivityLogs: () => {
        return axios.get(`${API_URL}/activity-logs`);
    }
};