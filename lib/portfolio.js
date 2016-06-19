/* eslint-disable func-names */

function Portfolio(name) {
  this.name = name;
  this.stocks = [];
}

module.exports = Portfolio;

Portfolio.prototype.position = function () {
  return this.stocks.reduce((t, s) => t + (s.shares * s.purchasePricePerShare), 0);
};
