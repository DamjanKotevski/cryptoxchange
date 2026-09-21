import axios from "axios";

const COINGECKO_URL = "https://api.coingecko.com/api/v3";

export const marketService = {

    // Get top cryptocurrencies
    getTopCoins: (limit = 50) => {
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

    // Get detailed information for one cryptocurrency
    getCoinDetails: (coinId) => {
        return axios.get(`${COINGECKO_URL}/coins/${coinId}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: false
            }
        });
    },

    // Get 7-day chart data
    getCoinChart: (coinId) => {
        return axios.get(
            `${COINGECKO_URL}/coins/${coinId}/market_chart`,
            {
                params: {
                    vs_currency: "usd",
                    days: 7
                }
            }
        );
    }
};