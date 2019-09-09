let orderList = [
  (7, ShirtSize.Medium),
  (5, ShirtSize.XLarge(3)),
  (4, ShirtSize.Small),
  (6, ShirtSize.Large),
  (8, ShirtSize.Small),
  (2, ShirtSize.Large),
  (9, ShirtSize.Medium),
  (3, ShirtSize.XLarge(2)),
];
let onePrice = ((qty, size)): float => {
  float_of_int(qty) *. ShirtSize.price(size);
};
let priceList = Belt.List.map(orderList, onePrice);
let isMedium = ((_, size)): bool => size === ShirtSize.Medium;
let mediums = Belt.List.keep(orderList, isMedium);
Js.log(mediums);

let addPriceLogged = (runningTotal, orderItem) => {
  let price = onePrice(orderItem);
  runningTotal +. price;
};
let totalPrice = Belt.List.reduce(orderList, 0.0, addPriceLogged);
let addPriceToTotal = (runningTotal, price) => runningTotal +. price;
let totalPrice2 =
  orderList |> Belt.List.map(_, onePrice) |> Belt.List.reduce(_, 0.0, (+.));
