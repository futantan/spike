module.exports = function () {
  this.f2c = function(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
}