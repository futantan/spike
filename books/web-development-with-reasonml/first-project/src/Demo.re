let qty = 7;
let price = 14.50;
let discount = qty < 10 ? 0.05 : 0.10;
let total = float_of_int(qty) *. price;
let afterDiscount = total *. (1.0 -. discount);
Js.log({js|Prix avant xxxxx:|js} ++ Js.Float.toString(total) ++ {js|€|js});
Js.log({js|Prix avant xxxxx|js} ++ Js.Float.toString(total) ++ "€");

let str = "door" ++ "bell";