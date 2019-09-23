// Generated by BUCKLESCRIPT VERSION 5.0.6, PLEASE EDIT WITH CARE
'use strict';

var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");

function avg(a, b) {
  return (a + b) / 2.0;
}

var result = (3.0 + 4.5) / 2.0;

console.log(result);

function payment(principal, apr, years) {
  var r = apr / 12.0 / 100.0;
  var n = Caml_int32.imul(years, 12);
  var powerTerm = Math.pow(1.0 + r, n);
  return principal * (r * powerTerm) / (powerTerm - 1.0);
}

var amount = payment(10000.0, 5.0, 30);

console.log("Amount per month: $", amount);

console.log("Amount per month: $", amount.toFixed(2));

console.log("this is reason");

(( console.log('here is some javascript for you') ));

exports.avg = avg;
exports.result = result;
exports.payment = payment;
exports.amount = amount;
/*  Not a pure module */