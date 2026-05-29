export class Portfolio {
    constructor(id, user, coinName, symbol, quantity, buyPrice, currentPrice) {
        this.id = id;
        this.user = user;
        this.coinName = coinName;
        this.symbol = symbol;
        this.quantity = quantity;
        this.buyPrice = buyPrice;
        this.currentPrice = currentPrice;
    }

    getCurrentValue() {
        return this.quantity * this.currentPrice;
    }

    getProfitLoss() {
        return this.getCurrentValue() - this.quantity * this.buyPrice;
    }
}