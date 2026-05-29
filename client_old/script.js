// Initial crypto data
let cryptos = JSON.parse(localStorage.getItem("cryptos")) || [
    {
        id: 1,
        name: "Bitcoin",
        symbol: "BTC",
        price: 65200,
        change: 4.2,
        marketCap: "1.28T",
        description: "Bitcoin is the first decentralized cryptocurrency."
    },
    {
        id: 2,
        name: "Ethereum",
        symbol: "ETH",
        price: 3250,
        change: 2.1,
        marketCap: "390B",
        description: "Ethereum is a blockchain platform for smart contracts."
    },
    {
        id: 3,
        name: "Solana",
        symbol: "SOL",
        price: 145,
        change: -1.4,
        marketCap: "65B",
        description: "Solana is a fast blockchain for decentralized apps."
    }
];

localStorage.setItem("cryptos", JSON.stringify(cryptos));

function saveCryptos() {
    localStorage.setItem("cryptos", JSON.stringify(cryptos));
}

function addHistory(activity) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        date: new Date().toLocaleString(),
        user: localStorage.getItem("loggedUser") || "guest",
        activity: activity
    });

    localStorage.setItem("history", JSON.stringify(history));
}

// REGISTER
async function registerUser() {
    let name = document.getElementById("registerName").value;
    let email = document.getElementById("registerEmail").value;
    let password = document.getElementById("registerPassword").value;
    let role = document.getElementById("registerRole").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill all fields!");
        return;
    }

    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: role
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }
        await createActivityLog(
    "REGISTER",
    name + " created a new account"
);

        alert("Registration successful! Confirmation email sent.");
        window.location.href = "login.html";

    } catch (error) {
        alert("Registration error. Please try again.");
    }
}
// LOGIN
async function loginUser() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem("loggedUser", data.user.name);
        localStorage.setItem("loggedEmail", data.user.email);
        localStorage.setItem("loggedRole", data.user.role);
        localStorage.setItem("loggedUserId", data.user.id);

        await createActivityLog(
    "LOGIN",
    data.user.name + " logged into the application"
);

        window.location.href = "dashboard.html";

    } catch (error) {
        alert("Login error. Please try again.");
    }
}

// LOGOUT
async function logoutUser() {

    await createActivityLog(
        "LOGOUT",
        localStorage.getItem("loggedUser") +
        " logged out"
    );

    localStorage.removeItem("loggedUser");
    localStorage.removeItem("loggedEmail");
    localStorage.removeItem("loggedRole");
    localStorage.removeItem("loggedUserId");

    window.location.href = "login.html";
}

// ADD CRYPTO
function addCrypto() {
    let name = document.getElementById("cryptoName").value;
    let symbol = document.getElementById("cryptoSymbol").value;
    let price = document.getElementById("cryptoPrice").value;
    let marketCap = document.getElementById("cryptoMarketCap").value;
    let description = document.getElementById("cryptoDescription").value;

    if (name === "" || symbol === "" || price === "") {
        alert("Please fill required fields!");
        return;
    }

    let newCrypto = {
        id: Date.now(),
        name: name,
        symbol: symbol,
        price: Number(price),
        change: 0,
        marketCap: marketCap,
        description: description
    };

    cryptos.push(newCrypto);
    saveCryptos();
    addHistory("Added new cryptocurrency: " + name);

    window.location.href = "crypto-list.html";
}

// DISPLAY LIST
async function displayCryptoList() {
    let table = document.getElementById("cryptoTable");

    if (!table) return;

    let userId = localStorage.getItem("loggedUserId");

    if (!userId) {
        table.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    Please login to view your portfolio.
                </td>
            </tr>
        `;
        return;
    }

    const response = await fetch("/api/portfolio/user/" + userId);
    const portfolio = await response.json();

    table.innerHTML = "";

    portfolio.forEach(item => {
        let currentValue = item.quantity * item.currentPrice;
        let invested = item.quantity * item.buyPrice;
        let profit = currentValue - invested;

        table.innerHTML += `
            <tr>
                <td>
                    ${
                        item.image
                        ? `<img src="${item.image}" width="25" class="me-2">`
                        : ""
                    }
                    ${item.coinName}
                </td>
                <td>${item.symbol}</td>
                <td>${item.quantity}</td>
                <td>$${item.buyPrice}</td>
                <td>$${item.currentPrice}</td>
                <td>$${currentValue.toFixed(2)}</td>
                <td class="${profit >= 0 ? 'text-success' : 'text-danger'}">
                    ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}
                </td>
                <td>
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deletePortfolioItem('${item._id}')"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// DETAILS
function displayCryptoDetails() {
    let box = document.getElementById("detailsBox");
    if (!box) return;

    let id = new URLSearchParams(window.location.search).get("id");
    let crypto = cryptos.find(c => c.id == id);

    if (!crypto) {
        box.innerHTML = "<h3>Crypto not found!</h3>";
        return;
    }

    box.innerHTML = `
        <h2>${crypto.name} (${crypto.symbol})</h2>
        <p>${crypto.description}</p>

        <ul class="list-group mb-4">
            <li class="list-group-item"><strong>Current Price:</strong> $${crypto.price}</li>
            <li class="list-group-item"><strong>24h Change:</strong> ${crypto.change}%</li>
            <li class="list-group-item"><strong>Market Cap:</strong> ${crypto.marketCap}</li>
        </ul>

        <div class="border p-4 text-center bg-dark">
            Static chart placeholder for ${crypto.name}
        </div>

        <div class="mt-4">
            <a href="crypto-list.html" class="btn btn-secondary">Back</a>
            <a href="edit-crypto.html?id=${crypto.id}" class="btn btn-warning">Edit</a>
            <button class="btn btn-success" onclick="addHistory('Added ${crypto.name} to watchlist')">
                Add to Watchlist
            </button>
        </div>
    `;
}

// LOAD EDIT FORM
function loadEditCrypto() {
    let id = new URLSearchParams(window.location.search).get("id");
    let crypto = cryptos.find(c => c.id == id);

    if (!crypto) return;

    document.getElementById("editId").value = crypto.id;
    document.getElementById("editName").value = crypto.name;
    document.getElementById("editSymbol").value = crypto.symbol;
    document.getElementById("editPrice").value = crypto.price;
    document.getElementById("editMarketCap").value = crypto.marketCap;
    document.getElementById("editDescription").value = crypto.description;
}

// UPDATE CRYPTO
function updateCrypto() {
    let id = document.getElementById("editId").value;

    let crypto = cryptos.find(c => c.id == id);

    crypto.name = document.getElementById("editName").value;
    crypto.symbol = document.getElementById("editSymbol").value;
    crypto.price = Number(document.getElementById("editPrice").value);
    crypto.marketCap = document.getElementById("editMarketCap").value;
    crypto.description = document.getElementById("editDescription").value;

    saveCryptos();
    addHistory("Updated cryptocurrency: " + crypto.name);

    window.location.href = "crypto-list.html";
}

// DELETE PAGE
function loadDeleteCrypto() {
    let id = new URLSearchParams(window.location.search).get("id");
    let crypto = cryptos.find(c => c.id == id);

    if (!crypto) return;

    document.getElementById("deleteText").innerHTML =
        `Are you sure you want to delete <strong>${crypto.name} (${crypto.symbol})</strong>?`;

    document.getElementById("deleteBtn").setAttribute("onclick", `deleteCrypto(${crypto.id})`);
}

function deleteCrypto(id) {
    let crypto = cryptos.find(c => c.id == id);

    cryptos = cryptos.filter(c => c.id != id);

    saveCryptos();
    addHistory("Deleted cryptocurrency: " + crypto.name);

    window.location.href = "crypto-list.html";
}

// SEARCH
function searchCryptos() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let results = document.getElementById("searchResults");

    results.innerHTML = "";

    let filtered = cryptos.filter(c =>
        c.name.toLowerCase().includes(keyword) ||
        c.symbol.toLowerCase().includes(keyword)
    );

    filtered.forEach(crypto => {
        results.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card p-3">
                    <h4>${crypto.name}</h4>
                    <p><strong>Symbol:</strong> ${crypto.symbol}</p>
                    <p><strong>Price:</strong> $${crypto.price}</p>
                    <a href="crypto-details.html?id=${crypto.id}" class="btn btn-dark">
                        View Details
                    </a>
                </div>
            </div>
        `;
    });

    addHistory("Searched cryptocurrencies");
}

// HISTORY
function displayHistory() {
    let table = document.getElementById("historyTable");
    if (!table) return;

    let history = JSON.parse(localStorage.getItem("history")) || [];

    table.innerHTML = "";

    history.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.user}</td>
                <td>${item.activity}</td>
            </tr>
        `;
    });
}
function displayRole() {

    let roleBox =
        document.getElementById("roleBox");

    if (!roleBox) return;

    let role =
        localStorage.getItem("loggedRole");

    if (!role) {

        roleBox.innerHTML = `
            <span class="badge bg-secondary">
                Guest
            </span>
        `;

        return;
    }

    if (role === "Admin") {

        roleBox.innerHTML = `
            <span class="badge bg-danger">
                Admin
            </span>
        `;

    } else {

        roleBox.innerHTML = `
            <span class="badge bg-primary">
                User
            </span>
        `;
    }
}

function isAdmin() {

    return localStorage.getItem("loggedRole")
        === "Admin";
}

function displayAdminButtons() {

    let box =
        document.getElementById("adminButtons");

    if (!box) return;

    if (isAdmin()) {

        box.innerHTML = `
            <a
                href="add-crypto.html"
                class="btn btn-success mb-3"
            >
                Add New Crypto
            </a>
        `;
    }
}

function loadExternalCryptoData() {
    let container = document.getElementById("externalCryptoContainer");
    let status = document.getElementById("apiStatus");

    if (!container) return;

    container.innerHTML = "";
    status.innerHTML = "Loading data from CoinGecko API...";

    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=40&page=1&sparkline=false")
        .then(response => response.json())
        .then(data => {
            status.innerHTML = "Loaded live data from CoinGecko API.";

            data.forEach(coin => {
                container.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card p-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4>${coin.name}</h4>
                                    <p><strong>Symbol:</strong> ${coin.symbol.toUpperCase()}</p>
                                    <p><strong>Price:</strong> $${coin.current_price}</p>
                                    <p class="${coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger'}">
                                        <strong>24h Change:</strong>
                                        ${coin.price_change_percentage_24h.toFixed(2)}%
                                    </p>
                                    <p><strong>Market Cap:</strong> $${coin.market_cap.toLocaleString()}</p>
                                    <span class="badge bg-success">External API Data</span>
                                    <button
    class="btn btn-primary btn-sm mt-3"
    onclick="openPortfolioModal(
        '${coin.name}',
        '${coin.symbol.toUpperCase()}',
        ${coin.current_price},
        ${coin.market_cap},
        ${coin.price_change_percentage_24h},
        '${coin.image}'
    )"
>
    Add to Portfolio
</button>
                                </div>

                                <img src="${coin.image}" class="crypto-logo">
                            </div>
                        </div>
                    </div>
                `;
            });

            addHistory("Loaded live data from CoinGecko API");
        })
        .catch(error => {
            status.className = "alert alert-warning";
            status.innerHTML = "Market data is temporarily unavailable. Please refresh again later.";
        });
}

function logoutUser() {

    localStorage.removeItem("loggedUser");
    localStorage.removeItem("loggedRole");

    window.location.href = "dashboard.html";
}

function updateNavbar() {

    let authBox =
        document.getElementById("authButtons");

    if (!authBox) return;

    let user =
        localStorage.getItem("loggedUser");

    if (user) {

        authBox.innerHTML = `

            <span class="text-info me-3">
                ${user}
            </span>

            <button
                class="btn btn-danger btn-sm"
                onclick="logoutUser();"
            >
                Logout
            </button>

        `;

    } else {

        authBox.innerHTML = `

            <a
                class="nav-link"
                href="login.html"
            >
                Login
            </a>

            <a
                class="nav-link ms-2"
                href="register.html"
            >
                Register
            </a>

        `;
    }
}

function updateNavbar() {

    let authBox =
        document.getElementById("authButtons");

    if (!authBox) return;

    let user =
        localStorage.getItem("loggedUser");

    if (user) {

        authBox.innerHTML = `

            <li class="nav-item">

                <span class="nav-link text-info">

                    ${user}

                </span>

            </li>

            <li class="nav-item">

                <button
                    class="btn btn-danger ms-2"
                    onclick="logoutUser();"
                >
                    Logout
                </button>

            </li>

        `;

    } else {

        authBox.innerHTML = `

            <li class="nav-item">

                <a class="nav-link"
                   href="login.html">

                    Login

                </a>

            </li>

            <li class="nav-item">

                <a class="nav-link"
                   href="register.html">

                    Register

                </a>

            </li>

        `;
    }
}

let dashboardCoins = [];
let dashboardStartIndex = 0;

function loadDashboardMarketData() {
    let cardsContainer = document.getElementById("dashboardCryptoCards");

    if (!cardsContainer) return;

    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false")
        .then(response => response.json())
        .then(data => {
            dashboardCoins = data;
            showNextDashboardCoins();

            setInterval(() => {
                showNextDashboardCoins();
            }, 30000);
        })
        .catch(error => {
            cardsContainer.innerHTML = `
                <div class="alert alert-danger">
                    Could not load live market data.
                </div>
            `;
        });
}

function showNextDashboardCoins() {
    let cardsContainer = document.getElementById("dashboardCryptoCards");

    if (!cardsContainer || dashboardCoins.length === 0) return;

    cardsContainer.innerHTML = "";

    let selectedCoins = dashboardCoins.slice(
        dashboardStartIndex,
        dashboardStartIndex + 3
    );

    if (selectedCoins.length < 3) {
        selectedCoins = dashboardCoins.slice(0, 3);
        dashboardStartIndex = 0;
    }

    selectedCoins.forEach(coin => {
        cardsContainer.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <h4>${coin.name}</h4>
                            <h5>$${coin.current_price.toLocaleString()}</h5>
                            <p class="${coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger'}">
                                ${coin.price_change_percentage_24h.toFixed(2)}% today
                            </p>
                        </div>

                        <img src="${coin.image}" class="crypto-logo">
                    </div>
                </div>
            </div>
        `;
    });

    dashboardStartIndex += 3;

    if (dashboardStartIndex >= dashboardCoins.length) {
        dashboardStartIndex = 0;
    }
}
async function addApiCryptoToList(
    name,
    symbol,
    price,
    marketCap,
    change,
    image,
    quantity,
    buyPrice
) {
    let userId = localStorage.getItem("loggedUserId");

    if (!userId) {
        alert("You must be logged in to add coins to portfolio.");
        return;
    }

    try {
        const response = await fetch("/api/portfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: userId,
                coinName: name,
                symbol: symbol,
                currentPrice: Number(price),
                marketCap: Number(marketCap),
                change24h: Number(change),
                image: image,
                quantity: Number(quantity),
                buyPrice: Number(buyPrice)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showSuccessMessage(data.message);
            return;
        }

        await createActivityLog(
    "ADD_PORTFOLIO",
    name + " was added to portfolio"
);

        showSuccessMessage(name + " added to portfolio successfully!");

    } catch (error) {
        showSuccessMessage("Error adding coin to portfolio.");
    }
}
function updateHistoryNav() {

    let historyBox =
        document.getElementById("historyNavItem");

    if (!historyBox) return;

    let role =
        localStorage.getItem("loggedRole");

    if (role === "Admin") {

        historyBox.innerHTML = `

            <li class="nav-item">

                <a class="nav-link"
                   href="history.html">

                    History

                </a>

            </li>

        `;

    } else {

        historyBox.innerHTML = "";

    }
}

function loadNavbar() {

    let navbarContainer =
        document.getElementById("navbarContainer");

    if (!navbarContainer) return;

    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {

            navbarContainer.innerHTML = data;

            displayRole();

            updateNavbar();

            updateHistoryNav();

        });
}

function hideHistoryForNonAdmin() {
    let historyLink = document.getElementById("historyLink");

    if (!historyLink) return;

    let role = localStorage.getItem("loggedRole");

    if (role !== "Admin") {
        historyLink.style.display = "none";
    } else {
        historyLink.style.display = "block";
    }
}

let selectedCoinData = null;

function openPortfolioModal(
    name,
    symbol,
    price,
    marketCap,
    change,
    image
) {

    selectedCoinData = {
        name,
        symbol,
        price,
        marketCap,
        change,
        image
    };

    let modal =
        new bootstrap.Modal(
            document.getElementById("portfolioModal")
        );

    modal.show();
}

function confirmAddToPortfolio() {

    let quantity =
        document.getElementById("portfolioQuantity").value;

    let buyPrice =
        document.getElementById("portfolioBuyPrice").value;

    if (!quantity || !buyPrice) {

        alert("Please fill all fields.");

        return;
    }

    addApiCryptoToList(
        selectedCoinData.name,
        selectedCoinData.symbol,
        selectedCoinData.price,
        selectedCoinData.marketCap,
        selectedCoinData.change,
        selectedCoinData.image,
        quantity,
        buyPrice
    );

    bootstrap.Modal
        .getInstance(
            document.getElementById("portfolioModal")
        )
        .hide();
}

function showSuccessMessage(message) {
    let successBox = document.getElementById("successMessage");

    if (!successBox) return;

    successBox.innerHTML = `
        <div class="alert alert-success mt-3">
            ${message}
        </div>
    `;

    setTimeout(() => {
        successBox.innerHTML = "";
    }, 3000);
}

function loadRealBitcoinChart() {
    let chartCanvas = document.getElementById("cryptoChart");

    if (!chartCanvas) return;

    fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7")
        .then(response => response.json())
        .then(data => {

            let labels = data.prices.map(item => {
                let date = new Date(item[0]);

                return date.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric"
                });
            });

            let prices = data.prices.map(item => item[1]);

            new Chart(chartCanvas, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Bitcoin price in USD - last 7 days",
                        data: prices,
                        borderColor: "#00f5d4",
                        backgroundColor: "rgba(0,245,212,0.2)",
                        tension: 0.4
                    }]
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return "$" + context.raw.toFixed(2);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value) {
                                    return "$" + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.log("Chart data error:", error);
        });
}

async function deletePortfolioItem(id) {
    const response = await fetch("/api/portfolio/" + id, {
        method: "DELETE"
    });

    const data = await response.json();

    await createActivityLog(
        "DELETE_PORTFOLIO",
        "Portfolio item was deleted"
    );

    alert(data.message);

    displayCryptoList();
}

async function submitFeedback() {
    let message = document.getElementById("feedbackMessage").value;
    let rating = document.getElementById("feedbackRating").value;
    let userId = localStorage.getItem("loggedUserId");

    if (!message) {
        showFeedbackMessage("Please write feedback.");
        return;
    }

    try {
        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: userId,
                message: message,
                rating: Number(rating)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showFeedbackMessage(data.message);
            return;
        }

        document.getElementById("feedbackMessage").value = "";
        document.getElementById("feedbackRating").value = "5";

        showFeedbackMessage("Feedback submitted successfully!");
        await createActivityLog(
    "FEEDBACK",
    "User submitted feedback"
);
        loadFeedback();

    } catch (error) {
        showFeedbackMessage("Error submitting feedback.");
    }
}

async function loadFeedback() {
    let feedbackList = document.getElementById("feedbackList");

    if (!feedbackList) return;

    const response = await fetch("/api/feedback");
    const feedback = await response.json();

    feedbackList.innerHTML = "";

    if (feedback.length === 0) {
        feedbackList.innerHTML = "<p>No feedback yet.</p>";
        return;
    }

    feedback.forEach(item => {
        feedbackList.innerHTML += `
            <div class="border-bottom py-3">
                <p>
                    <strong>
                        ${item.user ? item.user.name : "Guest"}
                    </strong>
                    - Rating: ${item.rating}/5
                </p>

                <p>${item.message}</p>
            </div>
        `;
    });
}

function showFeedbackMessage(message) {
    let box = document.getElementById("feedbackMessageBox");

    if (!box) return;

    box.innerHTML = `
        <div class="alert alert-info">
            ${message}
        </div>
    `;

    setTimeout(() => {
        box.innerHTML = "";
    }, 3000);
}

async function createActivityLog(action, details = "") {
    let userId = localStorage.getItem("loggedUserId");

    try {
        await fetch("/api/activity-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: userId,
                action: action,
                details: details
            })
        });
    } catch (error) {
        console.log("Activity log error:", error);
    }
}

async function displayHistory() {
    let table = document.getElementById("historyTable");

    if (!table) return;

    const response = await fetch("/api/activity-logs");
    const logs = await response.json();

    table.innerHTML = "";

    if (logs.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No activity logs found.
                </td>
            </tr>
        `;
        return;
    }

    logs.forEach(log => {
        table.innerHTML += `
            <tr>
                <td>${new Date(log.createdAt).toLocaleString()}</td>
                <td>${log.user ? log.user.name : "Guest"}</td>
                <td>${log.action}</td>
                <td>${log.details || "-"}</td>
            </tr>
        `;
    });
}