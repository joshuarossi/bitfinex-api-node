/* jshint -W030 */
var expect = require('chai').expect,
  BFX = require('../index'),
  _ = require('lodash'),
  ws_test = require('./ws-test'),
  keys = require('./keys.json');

describe("Errors", function() {
  var bfx = new BFX();
  var bfx_rest = bfx.rest;
  this.timeout(5000);
  it("should error out if a bad endpoint is given", function() {
    expect(bfx_rest.make_public_request).to.throw(Error)
  });
  it("should fail on authenticated requests if no api_key and api_secret", function() {
    expect(bfx_rest.account_infos).to.throw(Error)
  })
});
describe("Public Endpoints", function() {
  var bfx = new BFX();
  var bfx_rest = bfx.rest;
  this.timeout(5000);
  it("should get a ticker", function(done) {
    bfx_rest.ticker('BTCUSD', function(error, data) {
      expect(data).to.exist;
      expect(_.has(data, ['mid',
        'bid',
        'ask',
        'last_price',
        'low',
        'high',
        'volume',
        'timestamp'
      ]));
      done()
    })
  });
  it("should get the today endpoint", function(done) {
    bfx_rest.today("BTCUSD", function(error, data) {
      expect(data).to.exist;
      done();
    })
  });
  it("should get the stats", function(done) {
    bfx_rest.stats("BTCUSD", function(error, data) {
      expect(data).to.exist;
      expect(_.has(data[0], ['period', 'volume']));
      expect(_.has(data[1], ['period', 'volume']));
      expect(_.has(data[2], ['period', 'volume']));
      done()
    })
  });
  it("should get the fundingbook", function(done) {
    bfx_rest.fundingbook("USD", function(error, data) {
      expect(data).to.exist;
      expect(_.has(data, ['bids', 'asks']));
      expect(_.keys(data.bids[0])).is.eql(['rate', 'amount', 'period', 'timestamp', 'frr']);
      expect(_.keys(data.asks[0])).is.eql(['rate', 'amount', 'period', 'timestamp', 'frr']);
      expect(
        _.every(
          [data.asks[0] + data.bids[0]]
        ), !NaN).ok;
      done()
    });
  });
  it("should get the fundingbook asks, zero bids, 100 asks", function(done) {
    bfx_rest.fundingbook("USD", {
      limit_bids: 0,
      limit_asks: 100
    }, function(error, data) {
      expect(data).to.exist;
      expect(_.has(data, ['bids', 'asks']));
      done()
    });
  });
  it("should get the orderbook", function(done) {
    bfx_rest.orderbook("BTCUSD", function(error, data) {
      expect(data).to.exist;
      expect(_.keys(data)).is.eql(['bids', 'asks']);
      expect(_.keys(data.bids[0])).is.eql(['price', 'amount', 'timestamp']);
      expect(_.keys(data.asks[0])).is.eql(['price', 'amount', 'timestamp']);
      expect(
        _.every(
          [data.asks[0] + data.bids[0]]
        ), !NaN).ok;
      done()
    })
  });
  //TODO API returns 1000 instead of 50`
  it("should get recent trades", function(done) {
    bfx_rest.trades("BTCUSD", function(error, data) {
      expect(data).is.an.array;
      expect(_.keys(data[0])).to.eql(['timestamp', 'tid', 'price', 'amount', 'exchange', 'type']);
      expect(
        _.map(
          _.values(
            data[0]
          ),
          function(v) {
            return typeof(v)
          }
        )).is.eql(['number', 'number', 'string', 'string', 'string', 'string']);
      done();
    })
  });
  it("should get recent lends", function(done) {
    bfx_rest.lends("USD", function(error, data) {
      expect(data).to.exist;
      expect(data).is.an.array;
      expect(data.length).to.eql(50);
      expect(_.keys(data[0])).to.eql(['rate', 'amount_lent', 'amount_used', 'timestamp']);
      expect(
        _.map(
          _.values(
            data[0]
          ),
          function(v) {
            return typeof(v)
          }
        )).is.eql(['string', 'string', 'string', 'number']);
      done();
    })
  });
  it("should get symbols", function(done) {
    bfx_rest.get_symbols(function(error, data) {
      expect(data).to.eql(["btcusd", "ltcusd", "ltcbtc", "ethusd", "ethbtc", "etcbtc", "etcusd", "bfxusd", "bfxbtc"])
      done();
    })
  });
  it("should get symbol details", function(done) {
    bfx_rest.symbols_details(function(error, data) {
      expect(data).to.exist;
      expect(data).to.eql([{
        "pair": "btcusd",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "ltcusd",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "ltcbtc",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "ethusd",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "ethbtc",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "etcbtc",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "etcusd",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "bfxusd",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }, {
        "pair": "bfxbtc",
        "price_precision": 5,
        "initial_margin": "30.0",
        "minimum_margin": "15.0",
        "maximum_order_size": "2000.0",
        "minimum_order_size": "0.001",
        "expiration": "NA"
      }]);
      done()
    })
  });
});
describe("Authenticated Endpoints: standard key", function() {
  this.timeout(5000);
  var key = keys.standard.api_key;
  var secret = keys.standard.api_secret;
  var bfx = new BFX(key, secret);
  var bfx_rest = bfx.rest;
  it("should get account info", function(done) {
    bfx_rest.account_infos(function(error, data) {
      expect(data).to.exist;
      done();
    })
  });
  it.skip("should get a deposit address", function(done) {
    bfx_rest.new_deposit("BTC", "bitcoin", "exchange", function(err, data) {
      expect(data.result).to.eql('success');
      done();
    })
  });
  describe("orders", function() {
    it("should place a new order", function(done) {
      var errCB = function(err, value) {
        expect(value).ok
        return done();
      };
      bfx_rest.new_order("BTCUSD", "0.01", "0.01", "bitfinex", "buy", "exchange limit", false, errCB)
    });
    it("should place multiple orders", function(done) {
      var errCB = function(err, value) {
        expect(value).ok;
        return done();
      };
      var orders = [{
        "symbol": "BTCUSD",
        "amount": "0.01",
        "price": "0.01",
        "exchange": "bitfinex",
        "side": "buy",
        "type": "exchange limit"
      }, {
        "symbol": "BTCUSD",
        "amount": "0.02",
        "price": "0.03",
        "exchange": "bitfinex",
        "side": "buy",
        "type": "exchange limit"
      }];
      bfx_rest.multiple_new_orders(orders, errCB)
    });
    it("should cancel an order", function(done) {
      var cb = function(err, value) {
        expect(value).ok
        return done();
      };
      bfx.rest.active_orders(function(err, orders) {
        bfx.rest.cancel_order(orders[0].id, cb)
      })
    });
    //TODO API needs to be fixed, never throws error
    it("should cancel multiple orders", function(done) {
      var cb = function(err, value) {
        expect(value).ok;
        return done();
      };
      bfx_rest.active_orders(function(err, orders){
        bfx_rest.cancel_multiple_orders([orders[0].id, orders[1].id], cb)
      })
    });
    it("should replace an order", function(done) {
      var cb  = function(err, value) {
        expect(value).ok;
        return done();
      };
      bfx_rest.active_orders(function(err, orders){
        bfx_rest.replace_order(orders[0].id, "BTCUSD", "0.01", "0.01", "bitfinex", "buy", "exchange limit", cb)
      })
    });
    //TODO API needs to be fixed, never throws error
    it("should cancel all orders", function(done) {
      var errCB = function(err, value) {
        expect(value).ok;
        return done();
      };
      bfx_rest.cancel_all_orders(errCB);
    });
    //TODO throws 404 error, is that intentional?
    it("should get an orders status", function(done) {
      var cb = function(err, value) {
        expect(value).ok
        return done();
      };
      bfx_rest.active_orders(function(err, orders){
        bfx_rest.order_status(orders[0].id, cb)
      })
    });
    it("should get active orders", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        return done();
      };
      bfx_rest.active_orders(cb);
    });
  });
  describe("positions", function() {
    it("should get active positions", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).is.empty;
        return done();
      };
      bfx_rest.active_positions(cb);
    });
    //TODO returns 404 instead of JSON on failure
    it.skip("should claim a position", function(done) {
      var errCB = function(err, data) {
        expect(err instanceof Error).ok;
        expect(err.toString()).is.eql('Error: Order could not be cancelled.');
        return done();
      };
      bfx_rest.claim_position(12345, errCB);
    });
  });
  describe("historical data", function() {
    it("should get balance history", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        return done();
      };
      bfx_rest.balance_history("USD", {}, cb);
    });
    it("should get deposit/withdrawal history", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        return done();
      };
      bfx_rest.movements("USD", {}, cb);
    });
    it("should get past trades", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        return done();
      };
      bfx_rest.past_trades("BTCUSD", {}, cb);
    });
  });
  describe("margin funding", function() {
    it("should place a new offer", function(done) {
      var errCB = function(err, data) {
        expect(err instanceof Error).ok;
        expect(err.toString()).is.eql('Error: Invalid offer: not enough balance');
        return done();
      };
      bfx_rest.new_offer("USD", "0.01", "0.02", 2, "lend", errCB);
    });
    it("should cancel an offer", function(done) {
      var errCB = function(err, data) {
        expect(err instanceof Error).ok;
        expect(err.toString()).is.eql('Error: Offer could not be cancelled.');
        return done();
      };
      bfx_rest.cancel_offer(12345, errCB);
    });
    //TODO returns 404
    it("should get an offer status", function(done) {
      var errCB = function(err, data) {
        expect(err instanceof Error).ok;
        expect(err.toString()).is.eql('Error: 404');
        return done();
      };
      bfx_rest.offer_status(12345, errCB);
    });
    it("should get active credits", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        return done();
      };
      bfx_rest.active_credits(cb);
    });
    it("should get active funding used in a margin position", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        return done();
      };
      bfx_rest.taken_swaps(cb);
    });
    it("should get total taken funds", function(done) {
      var cb = function(err, data) {
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        return done();
      };
      bfx_rest.total_taken_swaps(cb);
    });
  });
  it("should get wallet balances", function(done) {
    var cb = function(err, data) {
      expect(data).to.be.an.array;
      return done();
    };
    bfx_rest.wallet_balances(cb);
  });
  it("should get margin information", function(done) {
    var cb = function(err, data) {
      expect(data[0]).to.be.an.array;
      expect(_.keys(data[0])).to.eql(
        [
          'margin_balance',
          'tradable_balance',
          'unrealized_pl',
          'unrealized_swap',
          'net_value',
          'required_margin',
          'leverage',
          'margin_requirement',
          'margin_limits',
          'message'
        ]);
      return done();
    };
    bfx_rest.margin_infos(cb);
  });
  it("should transfer between wallets", function(done) {
    var cb = function(err, data) {
      expect(data).ok
      return done();
    };
    bfx_rest.transfer('0.01', "BTC", "exchange", "trading", cb);
  });
  it("should submit a withdrawal", function(done) {
    var errCB = function(err, data) {
      expect(data).ok
      return done();
    };
    bfx_rest.withdraw('bitcoin', "exchange", '0.01', "abc", errCB);
  });
});
