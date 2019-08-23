const fs = require("fs");

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

  this.getPrice = () => {}
};

module.exports = Stockfetch;
