const express = require("express");

const router = express.Router();

const cryptoController = require("../controllers/cryptoController");

/**
 * @swagger
 * tags:
 *   name: Cryptos
 *   description: Cryptocurrency management API
 */

/**
 * @swagger
 * /api/cryptos:
 *   get:
 *     summary: Get all cryptocurrencies
 *     tags: [Cryptos]
 *     responses:
 *       200:
 *         description: List of cryptocurrencies
 */
router.get("/", cryptoController.getAllCryptos);

/**
 * @swagger
 * /api/cryptos/{id}:
 *   get:
 *     summary: Get cryptocurrency by ID
 *     tags: [Cryptos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cryptocurrency found
 *       404:
 *         description: Cryptocurrency not found
 */
router.get("/:id", cryptoController.getCryptoById);

/**
 * @swagger
 * /api/cryptos:
 *   post:
 *     summary: Create a new cryptocurrency
 *     tags: [Cryptos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - symbol
 *               - currentPrice
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               currentPrice:
 *                 type: number
 *               marketCap:
 *                 type: number
 *               change24h:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cryptocurrency created
 *       400:
 *         description: Validation error
 */
router.post("/", cryptoController.createCrypto);

/**
 * @swagger
 * /api/cryptos/{id}:
 *   put:
 *     summary: Update cryptocurrency by ID
 *     tags: [Cryptos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               currentPrice:
 *                 type: number
 *               marketCap:
 *                 type: number
 *               change24h:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cryptocurrency updated
 *       404:
 *         description: Cryptocurrency not found
 */
router.put("/:id", cryptoController.updateCrypto);

/**
 * @swagger
 * /api/cryptos/{id}:
 *   delete:
 *     summary: Delete cryptocurrency by ID
 *     tags: [Cryptos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cryptocurrency deleted
 *       404:
 *         description: Cryptocurrency not found
 */
router.delete("/:id", cryptoController.deleteCrypto);

module.exports = router;