/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Client = require('../lib/client');
const Portfolio = require('../lib/portfolio');
const Stock = require('../lib/stock');
const nock = require('nock');

describe('Client', () => {
  before(() => {
    nock('http://dev.markitondemand.com')
    .persist()
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });
  after(() => {
    nock.cleanAll();
  });

  describe('constructor', () => {
    it('should construct a new Client object', () => {
      const c1 = new Client('Sara');
      expect(c1.name).to.equal('Sara');
      expect(c1.balance).to.equal(0);
      expect(c1.portfolios).to.have.length(0);
    });
  });

  describe('#deposit', () => {
    it('should deposit money into client', () => {
      const c1 = new Client('Sara');
      c1.deposit(25);
      expect(c1.balance).to.equal(25);
    });
  });

  describe('#positon', () => {
    it('should get the position from the client', () => {
      const c1 = new Client('Sara');
      const p1 = new Portfolio('tech');
      const s1 = new Stock('aapl');
      c1.portfolios.push(p1);
      p1.stocks.push(s1);
      s1.shares = 10;
      s1.purchasePricePerShare = 15;
      expect(c1.position()).to.equal(150);
    });
  });

  describe('#withdraw', () => {
    it('should withdraw money from client', () => {
      const c1 = new Client('Sara');
      c1.deposit(25);
      c1.withdraw(10);
      expect(c1.balance).to.equal(15);
    });

    it('should not withdraw money from client', () => {
      const c1 = new Client('Sara');
      c1.deposit(25);
      c1.withdraw(35);
      expect(c1.balance).to.equal(25);
    });
  });

  describe('#purchaseStock', () => {
    it('should purchase stock and create new portfolio', (done) => {
      const c1 = new Client('Sara');
      c1.deposit(5000);
      c1.purchaseStock('aapl', 10, 'tech', (err, totalPaid) => {
        expect(c1.balance).to.equal(4000);
        expect(c1.portfolios).to.have.length(1);
        expect(totalPaid).to.equal(1000);
        done();
      });
    });

    it('should purchase stock and use existing portfolio', (done) => {
      const c1 = new Client('Sara');
      const p1 = new Portfolio('tech');
      c1.portfolios.push(p1);
      c1.deposit(5000);
      c1.purchaseStock('aapl', 10, 'tech', (err, totalPaid) => {
        expect(c1.balance).to.equal(4000);
        expect(c1.portfolios).to.have.length(1);
        expect(totalPaid).to.equal(1000);
        done();
      });
    });

    it('should not purchase stock - not enough money', (done) => {
      const c1 = new Client('Sara');
      c1.deposit(5);
      c1.purchaseStock('aapl', 10, 'tech', (err) => {
        expect(err.message).to.equal('Insufficient Funds');
        expect(c1.balance).to.equal(5);
        expect(c1.portfolios).to.have.length(0);
        done();
      });
    });
  });

  describe('#sellStock', () => {
    it('should sell stock', (done) => {
      const c1 = new Client('Sara');
      const p1 = new Portfolio('tech');
      const s1 = new Stock('aapl');
      const s2 = new Stock('goog');
      const s3 = new Stock('aapl');
      c1.portfolios.push(p1);
      p1.stocks.push(s1, s2, s3);
      s1.shares = 10;
      s1.purchasePricePerShare = 15;
      s2.shares = 20;
      s2.purchasePricePerShare = 25;
      s3.shares = 30;
      s3.purchasePricePerShare = 35;
      c1.sellStock('aapl', 11, 'tech', (err, amountMade) => {
        expect(amountMade).to.equal(1100);
        expect(c1.balance).to.equal(1100);
        expect(c1.portfolios[0].stocks).to.have.length(2);
        done();
      });
    });
  });
});
