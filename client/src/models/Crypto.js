export class Crypto {
    constructor(id, name, symbol, currentPrice, marketCap, change24h, image) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.currentPrice = currentPrice;
        this.marketCap = marketCap;
        this.change24h = change24h;
        this.image = image;
    }
}