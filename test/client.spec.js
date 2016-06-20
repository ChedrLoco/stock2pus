/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Client = require('../lib/client');
const Portfolio = require('../lib/portfolio');
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
});
