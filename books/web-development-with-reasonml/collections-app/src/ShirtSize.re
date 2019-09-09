type shirtSize =
  | Small
  | Medium
  | Large
  | XLarge(int);

type t = shirtSize;

let price = (size: shirtSize): float => {
  switch (size) {
  | Small => 11.00
  | Medium => 12.50
  | Large => 14.00
  | XLarge(n) => 16.00 +. float_of_int(n - 1) *. 0.50
  };
};
let toString = (size: shirtSize): string => {
  switch (size) {
  | Small => "S"
  | Medium => "M"
  | Large => "L"
  | XLarge(n) => String.make(n, 'X') ++ "L"
  };
};
let fromString = (str: string): option(shirtSize) => {
  switch (str) {
  | "S" => Some(Small)
  | "M" => Some(Medium)
  | "L" => Some(Large)
  | "XL" => Some(XLarge(1))
  | "XXL" => Some(XLarge(2))
  | "XXXL" => Some(XLarge(3))
  | "XXXXL" => Some(XLarge(4))
  | _ => None
  };
};
let toFixed = Js.Float.toFixedWithPrecision;
