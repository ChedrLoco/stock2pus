/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const nock = require('nock');
const sinon = require('sinon');
let clock;

describe('Stock', () => {
  before(() => {
    nock('http://dev.markitondemand.com')
    .persist()
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });
  after(() => {
    nock.cleanAll();
  });

  describe('constructor', () => {
    it('should construct a new Stock object', () => {
      const s1 = new Stock('aapl');
      expect(s1.symbol).to.equal('AAPL');
    });
  });

  describe('#purchase', () => {
    it('should purchase stock', (done) => {
      const s1 = new Stock('aapl');
      clock.tick(150);
      s1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.equal(5000);
        expect(s1.shares).to.equal(50);
        expect(s1.purchaseDate.getTime()).to.equal(150);
        expect(s1.name).to.equal('Apple');
        expect(s1.purchasePricePerShare).to.equal(100);
        done();
      });
    });
  });

  describe('#sell', () => {
    it('should sell stock', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 300;
      s1.sell(5, (err, cashReceived) => {
        expect(err).to.be.null;
        expect(cashReceived).to.equal(500);
        expect(s1.shares).to.equal(295);
        done();
      });
    });

    it('should not sell stock', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 10;
      s1.sell(25, (err) => {
        expect(err.message).to.equal('Not enough shares');
        expect(s1.shares).to.equal(10);
        done();
      });
    });
  });
});
