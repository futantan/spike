const fs = require('fs');
const http = require('http')

const Stockfetch = function() {
  this.readTickersFile = function(filename, onError) {
    const self = this;
    const processResponse = (err, data) => {
      if (err) {
        onError("Error reading file: " + filename);
      } else {
        const tickers = self.parseTickers(data.toString());
        if (tickers.length === 0) {
          onError("File " + filename + " has invalid content");
        } else {
          self.processTickers(tickers);
        }
      }
    };
    fs.readFile(filename, processResponse);
  };

  this.parseTickers = function(content) {
    const isInRightFormat = (str) => str.trim().length !== 0 && str.indexOf(' ') < 0
    return content.split('\n').filter(isInRightFormat)
  };

  this.processTickers = function(tickers) {
    const self = this
    self.tickersCount = tickers.length;
    tickers.forEach((ticker) => self.getPrice(ticker))
  };

  this.tickersCount = 0

  this.http = http
  this.getPrice = function(symbol) {
    const url = 'http://ichart.finance.yahoo.com/table.csv?s=' + symbol
    this.http.get(url, this.processResponse.bind(this, symbol))
             .on('error', this.processHttpError.bind(this, symbol))
  }
  this.processResponse = function() {}
  this.processHttpError = function() {}
};

module.exports = Stockfetch;
