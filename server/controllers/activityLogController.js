const ActivityLog = require("../models/ActivityLog");

exports.getAllActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching activity logs",
            error: error.message
        });
    }
};

exports.createActivityLog = async (req, res) => {
    try {
        if (!req.body.action) {
            return res.status(400).json({
                message: "Action is required."
            });
        }

        const log = new ActivityLog(req.body);
        const savedLog = await log.save();

        res.status(201).json({
            message: "Activity log created successfully",
            data: savedLog
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating activity log",
            error: error.message
        });
    }
};

exports.deleteActivityLog = async (req, res) => {
    try {
        const deletedLog = await ActivityLog.findByIdAndDelete(req.params.id);

        if (!deletedLog) {
            return res.status(404).json({
                message: "Activity log not found"
            });
        }

        res.status(200).json({
            message: "Activity log deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting activity log",
            error: error.message
        });
    }
};