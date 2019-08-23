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

  this.parseTickers = function() {};
  this.processTickers = function() {};
};

module.exports = Stockfetch;
