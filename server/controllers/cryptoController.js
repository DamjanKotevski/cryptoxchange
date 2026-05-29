const Crypto = require("../models/Crypto");

function validateCryptoData(data) {
    if (!data.name || !data.symbol || !data.currentPrice) {
        return "Name, symbol and currentPrice are required.";
    }

    if (Number(data.currentPrice) <= 0) {
        return "Current price must be greater than 0.";
    }

    return null;
}

exports.getAllCryptos = async (req, res) => {
    try {
        const cryptos = await Crypto.find();

        res.status(200).json(cryptos);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching cryptocurrencies",
            error: error.message
        });
    }
};

exports.getCryptoById = async (req, res) => {
    try {
        const crypto = await Crypto.findById(req.params.id);

        if (!crypto) {
            return res.status(404).json({
                message: "Crypto not found"
            });
        }

        res.status(200).json(crypto);
    } catch (error) {
        res.status(400).json({
            message: "Invalid crypto ID",
            error: error.message
        });
    }
};

exports.createCrypto = async (req, res) => {
    try {
        const validationError = validateCryptoData(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const newCrypto = new Crypto(req.body);
        const savedCrypto = await newCrypto.save();

        res.status(201).json({
            message: "Crypto created successfully",
            data: savedCrypto
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating cryptocurrency",
            error: error.message
        });
    }
};

exports.updateCrypto = async (req, res) => {
    try {
        const validationError = validateCryptoData(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const updatedCrypto = await Crypto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedCrypto) {
            return res.status(404).json({
                message: "Crypto not found"
            });
        }

        res.status(200).json({
            message: "Crypto updated successfully",
            data: updatedCrypto
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating cryptocurrency",
            error: error.message
        });
    }
};

exports.deleteCrypto = async (req, res) => {
    try {
        const deletedCrypto = await Crypto.findByIdAndDelete(req.params.id);

        if (!deletedCrypto) {
            return res.status(404).json({
                message: "Crypto not found"
            });
        }

        res.status(200).json({
            message: "Crypto deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting cryptocurrency",
            error: error.message
        });
    }
};