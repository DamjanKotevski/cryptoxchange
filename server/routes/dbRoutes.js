const express = require("express");

const router = express.Router();

const dbController = require("../controllers/dbController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

router.post(
    "/seed",
    verifyToken,
    verifyAdmin,
    dbController.seedDatabase
);

router.delete(
    "/clear",
    verifyToken,
    verifyAdmin,
    dbController.clearDatabase
);

module.exports = router;