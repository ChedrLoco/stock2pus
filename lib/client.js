/* eslint-disable func-names, consistent-return */

const Stock = require('./stock');
const Portfolio = require('./portfolio');

function Client(name) {
  this.name = name;
  this.portfolios = [];
  this.balance = 0;
}

module.exports = Client;

Client.prototype.deposit = function (amount) {
  this.balance += amount;
};

Client.prototype.withdraw = function (amount) {
  if (amount > this.balance) return;

  this.balance -= amount;
};

Client.prototype.purchaseStock = function (symbol, quantity, portfolioName, cb) {
  Stock.getQuote(symbol, (err1, quote) => {
    if (quote.LastPrice * quantity > this.balance) return cb(new Error('Insufficient Funds'));

    let portfolio = this.portfolios.find(p => p.name === portfolioName);

    if (!portfolio) {
      portfolio = new Portfolio(portfolioName);
      this.portfolios.push(portfolio);
    }

    const stock = new Stock(symbol);
    stock.purchase(quantity, (err2, totalPaid) => {
      portfolio.stocks.push(stock);
      this.balance -= totalPaid;
      return cb(null, totalPaid);
    });
  });
};
