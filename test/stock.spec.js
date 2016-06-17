/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');

describe('Stock', () => {
  describe('constructor', () => {
    it('should construct a new Stock object', () => {
      const s1 = new Stock('aapl');
      expect(s1.symbol).to.equal('AAPL');
    });
  });

  describe('#purchase', () => {
    it('should purchase stock', (done) => {
      const s1 = new Stock('aapl');
      s1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.be.above(0);
        expect(s1.shares).to.equal(50);
        expect(s1.name).to.have.length.above(0);
        expect(s1.purchasePricePerShare).to.be.above(0);
        done();
      });
    });
  });

  describe('#sell', () => {
    it('should sell stock', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 100;
      s1.purchasePricePerShare = 50;
      s1.sell(25, (err, cashEarned) => {
        expect(err).to.be.null;
        expect(cashEarned).to.be.above(0);
        expect(s1.shares).to.equal(75);
        done();
      });
    });

    it('should not sell stock', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 10;
      s1.purchasePricePerShare = 50;
      s1.sell(25, (err) => {
        expect(err.message).to.equal('Not enough shares.');
        expect(s1.shares).to.equal(10);
        done();
      });
    });
  });
});
