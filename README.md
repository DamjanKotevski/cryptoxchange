# CryptoXchange

CryptoXchange is a web application prototype for tracking and managing cryptocurrencies.  
The project is structured using MVC architecture and served through a Node.js/Express backend.

## Project Structure

```text
cryptoxchange_part1/
│
├── client/
│   ├── dashboard.html
│   ├── login.html
│   ├── register.html
│   ├── crypto-list.html
│   ├── add-crypto.html
│   ├── edit-crypto.html
│   ├── delete-crypto.html
│   ├── crypto-details.html
│   ├── search.html
│   ├── external-api.html
│   ├── history.html
│   ├── report.html
│   ├── feedback.html
│   ├── style.css
│   └── script.js
│
├── server/
│   ├── controllers/
│   │   └── cryptoController.js
│   ├── models/
│   │   └── Crypto.js
│   ├── routes/
│   │   └── cryptoRoutes.js
│   ├── app.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md



## REST API Documentation

The application uses REST API endpoints for database access.

### Users API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login existing user |
| GET | `/api/users` | Get all users |
| DELETE | `/api/users/:id` | Delete user by ID |

Example register request:

```json
{
  "name": "Damjan",
  "email": "damjan@test.com",
  "password": "123456",
  "role": "Admin"
}# cryptoxchange
