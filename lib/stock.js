/* eslint-disable func-names, consistent-return */

const request = require('request');

function Stock(symbol) {
  this.symbol = symbol;
}

Stock.getQuote = function (symbol, cb) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${symbol.toUpperCase()}`;
  request({ url, json: true }, (err, rsp, body) => {
    cb(err, body);
  });
};

Stock.prototype.purchase = function (quantity, cb) {
  Stock.getQuote(this.symbol, (err, quote) => {
    this.purchasePricePerShare = quote.LastPrice;
    this.name = quote.Name;
    this.shares = quantity;
    this.purchaseDate = new Date();
    const totalPaid = this.shares * this.purchasePricePerShare;
    cb(null, totalPaid);
  });
};

Stock.prototype.sell = function (quantity, cb) {
  if (quantity > this.shares) return cb(new Error('Not enough shares'));

  Stock.getQuote(this.symbol, (err, quote) => {
    const cashReceived = quote.LastPrice * quantity;
    this.shares -= quantity;
    cb(null, cashReceived);
  });
};

module.exports = Stock;
