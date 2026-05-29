import axios from "axios";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

export const marketService = {
    getTopCoins: (limit = 30) => {
        return axios.get(`${COINGECKO_URL}/coins/markets`, {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: limit,
                page: 1,
                sparkline: false
            }
        });
    },

    getCoinChart: (coinId) => {
        return axios.get(`${COINGECKO_URL}/coins/${coinId}/market_chart`, {
            params: {
                vs_currency: "usd",
                days: 7
            }
        });
    }
};