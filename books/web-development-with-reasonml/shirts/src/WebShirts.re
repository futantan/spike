module D = Webapi.Dom;
module Doc = Webapi.Dom.Document;
module Elem = Webapi.Dom.Element;

type shirtSize =
  | Small
  | Medium
  | Large
  | XLarge(int);

let price = (size: shirtSize): float => {
  switch (size) {
  | Small => 11.00
  | Medium => 12.50
  | Large => 14.00
  | XLarge(n) => 16.00 +. float_of_int(n - 1) *. 0.50
  };
};

let stringOfShirtSize = (size: shirtSize): string => {
  switch (size) {
  | Small => "S"
  | Medium => "M"
  | Large => "L"
  | XLarge(n) => String.make(n, 'X') ++ "L"
  };
};

let shirtSizeOfString = (str: string): option(shirtSize) => {
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

let getValue = (element: option(Elem.t)): option(string) => {
  element
  |> Belt.Option.map(_, Elem.unsafeAsHtmlElement)
  |> Belt.Option.map(_, D.HtmlElement.value);
};

let toInt = (s: string): option(int) => {
  switch (int_of_string(s)) {
  | result => Some(result)
  | exception (Failure("int_of_string")) => None
  };
};

let calculate = (_: Dom.event): unit => {
  let quantity =
    getValue(Doc.getElementById("quantity", D.document))
    |> Belt.Option.flatMap(_, toInt);

  let unitPrice =
    getValue(Doc.getElementById("size", D.document))
    |> Belt.Option.flatMap(_, shirtSizeOfString)
    |> Belt.Option.map(_, price);

  let totalPrice =
    switch (unitPrice, quantity) {
    | (Some(uPrice), Some(qty)) => Some(uPrice *. float_of_int(qty))
    | (_, _) => None
    };

  let priceString =
    switch (totalPrice) {
    | Some(total) => Js.Float.toFixedWithPrecision(total, ~digits=2)
    | None => ""
    };

  let _ =
    Doc.getElementById("price", D.document)
    |> Belt.Option.map(_, Elem.setInnerText(_, priceString));
  ();
};

let calcButton = Doc.getElementById("calculate", D.document);

switch (calcButton) {
| Some(element) =>
  D.EventTarget.addEventListener(
    "click",
    calculate,
    Elem.asEventTarget(element),
  )
| None => ()
};
