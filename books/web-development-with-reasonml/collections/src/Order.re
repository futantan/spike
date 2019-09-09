type order = (int, ShirtSize.t);

let order1 = (3, ShirtSize.Medium);
let order2 = (5, ShirtSize.XLarge(3));
let toString = ((qty, size): order): string =>
  string_of_int(qty) ++ " " ++ ShirtSize.toString(size);

Js.log(toString(order1));
Js.log(toString(order2));
