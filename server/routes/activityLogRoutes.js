const express = require("express");

const router = express.Router();

const activityLogController = require("../controllers/activityLogController");

const {
    verifyToken,
    verifyAdmin
} = require("../middleware/authMiddleware");

router.get(
    "/",
    verifyToken,
    verifyAdmin,
    activityLogController.getAllActivityLogs
);

router.post(
    "/",
    verifyToken,
    activityLogController.createActivityLog
);

router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    activityLogController.deleteActivityLog
);

module.exports = router;