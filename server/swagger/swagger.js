const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CryptoXchange REST API",
            version: "1.0.0",
            description: "REST API documentation for CryptoXchange application"
        },
        servers: [
            {
                url: "https://cryptoxchange.onrender.com",
                description: "Local development server"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;