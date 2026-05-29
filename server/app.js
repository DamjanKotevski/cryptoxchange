require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const dbRoutes = require("./routes/dbRoutes");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

dotenv.config();

const connectDB = require("./config/db");
const cryptoRoutes = require("./routes/cryptoRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/cryptos", cryptoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/db", dbRoutes);

app.get("/api/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const clientPath = path.join(__dirname, "..", "client");

app.use(express.static(clientPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(clientPath, "dashboard.html"));
});

const PORT = process.env.PORT || 3000;

app.get("/db", (req, res) => {
    res.sendFile(path.join(clientPath, "db.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});