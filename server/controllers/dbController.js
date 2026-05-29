const Crypto = require("../models/Crypto");
const User = require("../models/User");

exports.seedDatabase = async (req, res) => {
    try {

        await Crypto.deleteMany();
        await User.deleteMany();

        const cryptos = [

            {
                name: "Bitcoin",
                symbol: "BTC",
                currentPrice: 65000,
                marketCap: 1200000000,
                change24h: 2.5,
                description: "Largest cryptocurrency"
            },

            {
                name: "Ethereum",
                symbol: "ETH",
                currentPrice: 3200,
                marketCap: 500000000,
                change24h: 1.2,
                description: "Smart contracts platform"
            },

            {
                name: "Solana",
                symbol: "SOL",
                currentPrice: 145,
                marketCap: 65000000,
                change24h: 4.1,
                description: "High-speed blockchain"
            }

        ];

        await Crypto.insertMany(cryptos);

        const users = [

            {
                name: "Admin User",
                email: "admin@crypto.com",
                password: "123456",
                role: "Admin"
            },

            {
                name: "Normal User",
                email: "user@crypto.com",
                password: "123456",
                role: "User"
            }

        ];

        await User.insertMany(users);

        res.json({
            message: "Database seeded successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.clearDatabase = async (req, res) => {
    try {

        await Crypto.deleteMany();
        await User.deleteMany();

        res.json({
            message: "Database cleared successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};