/* eslint-disable func-names, consistent-return, no-param-reassign */

const Stock = require('./stock');
const Portfolio = require('./portfolio');
const async = require('async');

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

Client.prototype.position = function () {
  return this.portfolios.reduce((t, p) => t + p.position(), 0);
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

Client.prototype.sellStock = function (symbol, quantity, portfolioName, cb) {
  const portfolio = this.portfolios.find(p => p.name === portfolioName);

  if (!portfolio) return cb(new Error('Portfolio does not exist'));

  function iterator(stock, fn) {
    if (stock.symbol !== symbol || !quantity) return fn(null, 0);
    const amountToSell = quantity > stock.shares ? stock.shares : quantity;
    quantity -= amountToSell;
    stock.sell(amountToSell, fn);
  }

  function finalizer(err, amountsMade) {
    portfolio.stocks = portfolio.stocks.filter(s => s.shares);
    const amountMade = amountsMade.reduce((a, n) => a + n);
    this.balance += amountMade;
    return cb(null, amountMade);
  }

  async.map(portfolio.stocks, iterator, finalizer.bind(this));
};
