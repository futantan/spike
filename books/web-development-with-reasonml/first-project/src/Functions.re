let avg = (a, b) => {
  (a +. b) /. 2.0;
};

let result = avg(3.0, 4.5);
Js.log(result);

let payment = (principal, apr, years) => {
  let r = apr /. 12.0 /. 100.0;
  let n = float_of_int(years * 12);
  let powerTerm = (1.0 +. r) ** n;
  principal *. (r *. powerTerm) /. (powerTerm -. 1.0);
};

let amount = payment(10000.0, 5.0, 30);
Js.log2("Amount per month: $", amount);

Js.log2(
  "Amount per month: $",
  Js.Float.toFixedWithPrecision(amount, ~digits=2),
);

Js.log("this is reason");

[%bs.raw {| console.log('here is some javascript for you') |}];