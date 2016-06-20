/* eslint-disable func-names */

function Brokerage(name) {
  this.name = name;
  this.clients = [];
}

module.exports = Brokerage;

Brokerage.prototype.position = function () {
  return this.clients.reduce((t, c) => t + c.position(), 0);
};
