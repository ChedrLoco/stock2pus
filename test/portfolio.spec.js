/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const Portfolio = require('../lib/portfolio');

describe('Portfolio', () => {
  describe('constructor', () => {
    it('should construct a new Portfolio object', () => {
      const p1 = new Portfolio('tech');
      expect(p1.name).to.equal('tech');
      expect(p1.stocks).to.have.length(0);
    });
  });

  describe('#position', () => {
    it('should get the position of a portfolio', () => {
      const p1 = new Portfolio('tech');
      const s1 = new Stock('aapl');
      s1.shares = 10;
      s1.purchasePricePerShare = 5;
      p1.stocks.push(s1);
      expect(p1.stocks).to.have.length(1);
      expect(p1.position()).to.equal(50);
    });
  });
});
