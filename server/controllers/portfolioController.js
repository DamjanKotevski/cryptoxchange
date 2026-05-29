const Portfolio = require("../models/Portfolio");

function validatePortfolioData(data) {
    if (
        !data.user ||
        !data.coinName ||
        !data.symbol ||
        !data.currentPrice ||
        !data.quantity ||
        !data.buyPrice
    ) {
        return "User, coinName, symbol, currentPrice, quantity and buyPrice are required.";
    }

    if (Number(data.quantity) <= 0) {
        return "Quantity must be greater than 0.";
    }

    if (Number(data.buyPrice) <= 0) {
        return "Buy price must be greater than 0.";
    }

    return null;
}

exports.getAllPortfolioItems = async (req, res) => {
    try {
        const items = await Portfolio.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching portfolio items",
            error: error.message
        });
    }
};

exports.getUserPortfolio = async (req, res) => {
    try {
        const items = await Portfolio.find({
            user: req.params.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user portfolio",
            error: error.message
        });
    }
};

exports.addPortfolioItem = async (req, res) => {
    try {
        const validationError = validatePortfolioData(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const exists = await Portfolio.findOne({
            user: req.body.user,
            symbol: req.body.symbol
        });

        if (exists) {
            return res.status(409).json({
                message: "This coin already exists in portfolio."
            });
        }

        const item = new Portfolio(req.body);
        const savedItem = await item.save();

        res.status(201).json({
            message: "Portfolio item added successfully",
            data: savedItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding portfolio item",
            error: error.message
        });
    }
};

exports.deletePortfolioItem = async (req, res) => {
    try {
        const deletedItem = await Portfolio.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({
                message: "Portfolio item not found"
            });
        }

        res.status(200).json({
            message: "Portfolio item deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting portfolio item",
            error: error.message
        });
    }
};