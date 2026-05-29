const express = require("express");

const router = express.Router();

const portfolioController = require("../controllers/portfolioController");

router.get("/", portfolioController.getAllPortfolioItems);

router.get("/user/:userId", portfolioController.getUserPortfolio);

router.post("/", portfolioController.addPortfolioItem);

router.delete("/:id", portfolioController.deletePortfolioItem);

module.exports = router;