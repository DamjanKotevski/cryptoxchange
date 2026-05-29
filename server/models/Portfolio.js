const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        coinName: {
            type: String,
            required: true
        },

        symbol: {
            type: String,
            required: true
        },

        currentPrice: {
            type: Number,
            required: true
        },

        marketCap: {
            type: Number,
            default: 0
        },

        change24h: {
            type: Number,
            default: 0
        },

        image: {
            type: String
        },

        quantity: {
            type: Number,
            required: true
        },

        buyPrice: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);