module Size = {
  type t =
    | XSmall(int)
    | Small
    | Medium
    | Large
    | XLarge(int);

  let toString = (size: t): string => {
    switch (size) {
    | XSmall(n) => String.make(n, 'X') ++ "S"
    | Small => "S"
    | Medium => "M"
    | Large => "L"
    | XLarge(n) => String.make(n, 'X') ++ "L"
    };
  };

  let fromString = (str: string): option(t) => {
    switch (Js.String.toUpperCase(str)) {
    | "S" => Some(Small)
    | "M" => Some(Medium)
    | "L" => Some(Large)
    | s when Js.Re.test(s, [%re "/^X+S$/"]) =>
      Some(XSmall(String.length(s) - 1))
    | s when Js.Re.test(s, [%re "/^X+L$/"]) =>
      Some(XLarge(String.length(s) - 1))
    | _ => None
    };
  };
};

module Sleeve = {
  type t =
    | Short
    | Long
    | XLong; /* for tall people */

  let toString = (sleeve: t): string => {
    switch (sleeve) {
    | Short => "short sleeve"
    | Long => "long sleeve"
    | XLong => "extra-long sleeve"
    };
  };

  let fromString = (str: string): option(t) => {
    switch (Js.String.toLowerCase(str)) {
    | "short" => Some(Short)
    | "long" => Some(Long)
    | "xlong" => Some(XLong)
    | _ => None
    };
  };
};

module Color = {
  type t =
    | White
    | Blue
    | Red
    | Green
    | Brown;

  let toString = (color: t): string => {
    switch (color) {
    | White => "white"
    | Blue => "blue"
    | Red => "red"
    | Green => "green"
    | Brown => "brown"
    };
  };

  let fromString = (s: string): option(t) => {
    switch (Js.String.toLowerCase(s)) {
    | "white" => Some(White)
    | "blue" => Some(Blue)
    | "red" => Some(Red)
    | "green" => Some(Green)
    | "brown" => Some(Brown)
    | _ => None
    };
  };
};

module Pattern = {
  type t =
    | Solid
    | Pinstripe
    | Check;

  let toString = (pattern: t): string => {
    switch (pattern) {
    | Solid => "solid"
    | Pinstripe => "pinstripe"
    | Check => "check"
    };
  };

  let fromString = (s: string): option(t) => {
    switch (Js.String.toLowerCase(s)) {
    | "solid" => Some(Solid)
    | "pinstripe" => Some(Pinstripe)
    | "check"
    | "checked" => Some(Check)
    | _ => None
    };
  };
};

module Cuff = {
  type t =
    | Button
    | French
    | NoCuff;

  let toString = (cuff: t): string => {
    switch (cuff) {
    | Button => "button"
    | French => "french"
    | NoCuff => "none"
    };
  };

  let fromString = (s: string): option(t) => {
    switch (Js.String.toLowerCase(s)) {
    | "button" => Some(Button)
    | "french" => Some(French)
    | ""
    | "none"
    | "nocuff" => Some(NoCuff)
    | _ => None
    };
  };
};

module Collar = {
  type t =
    | Button
    | Straight
    | Spread;

  let toString = (collar: t): string => {
    switch (collar) {
    | Button => "button"
    | Straight => "straight"
    | Spread => "spread"
    };
  };

  let fromString = (s: string): option(t) => {
    switch (Js.String.toLowerCase(s)) {
    | "button" => Some(Button)
    | "straight" => Some(Straight)
    | "spread" => Some(Spread)
    | _ => None
    };
  };
};

type order = {
  quantity: int,
  size: Size.t,
  sleeve: Sleeve.t,
  color: Color.t,
  pattern: Pattern.t,
  cuff: Cuff.t,
  collar: Collar.t,
};

let myOrder = {
  quantity: 2,
  size: Medium,
  sleeve: Long,
  color: Blue,
  pattern: Solid,
  cuff: Button,
  collar: Button,
};

Js.log2("Sleeve:", myOrder.sleeve); /* 1 (Long) */

let otherOrder = {
  ...myOrder,

  color: White,
  cuff: French,
};

Js.log2("Cuff:", otherOrder.cuff); /* 1 (French) */