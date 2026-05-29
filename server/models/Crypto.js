const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        symbol: {
            type: String,
            required: true,
            unique: true
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

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Crypto", cryptoSchema);