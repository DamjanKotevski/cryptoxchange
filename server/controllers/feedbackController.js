const Feedback = require("../models/Feedback");

function validateFeedbackData(data) {
    if (!data.message) {
        return "Feedback message is required.";
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
        return "Rating must be between 1 and 5.";
    }

    return null;
}

exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate("user", "name email role");

        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching feedback",
            error: error.message
        });
    }
};

exports.createFeedback = async (req, res) => {
    try {
        const validationError = validateFeedbackData(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const newFeedback = new Feedback(req.body);
        const savedFeedback = await newFeedback.save();

        res.status(201).json({
            message: "Feedback created successfully",
            data: savedFeedback
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating feedback",
            error: error.message
        });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

        if (!deletedFeedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting feedback",
            error: error.message
        });
    }
};