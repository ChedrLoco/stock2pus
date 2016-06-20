/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Brokerage = require('../lib/brokerage');
const Client = require('../lib/client');
const Portfolio = require('../lib/portfolio');
const Stock = require('../lib/stock');

describe('Brokerage', () => {
  describe('constructor', () => {
    it('should construct a new Brokerage object', () => {
      const b1 = new Brokerage('e-trade');
      expect(b1.name).to.equal('e-trade');
      expect(b1.clients).to.have.length(0);
    });
  });

  describe('#positon', () => {
    it('should get the position from the brokerage', () => {
      const b1 = new Brokerage('e-trade');
      const c1 = new Client('Sara');
      const p1 = new Portfolio('tech');
      const s1 = new Stock('aapl');
      b1.clients.push(c1);
      c1.portfolios.push(p1);
      p1.stocks.push(s1);
      s1.shares = 10;
      s1.purchasePricePerShare = 15;
      expect(b1.position()).to.equal(150);
    });
  });
});
