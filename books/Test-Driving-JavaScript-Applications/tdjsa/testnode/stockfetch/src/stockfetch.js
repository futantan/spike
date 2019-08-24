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
  this.processResponse = function(symbol, response) {
    const self = this
    if(response.statusCode === 200) {
      let data = ''
      response.on('data', (chunk) => data += chunk)
      response.on('end', () => self.parsePrice(symbol, data))
    } else {
      self.processError(symbol, response.statusCode)
    }
  }
  this.parsePrice = function() {}
  this.processError = function() {}
  this.processHttpError = function(ticker, error) {
    this.processError(ticker, error.code)
  }
};

module.exports = Stockfetch;
