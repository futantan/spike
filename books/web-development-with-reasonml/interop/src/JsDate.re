type t;
[@bs.new] external createDate: unit => t = "Date";
[@bs.scope "Date"] [@bs.val] external now: unit => float = "now";
[@bs.scope "Date"] [@bs.val] external jsDateParse: string => float = "parse";
[@bs.send] external toString: t => string = "toString";
[@bs.send] external getFullYear: t => float = "getFullYear";

let parse = (s: string): option(float) => {
  let result = jsDateParse(s);
  if (Js.Float.isNaN(result)) {
    None;
  } else {
    Some(result);
  };
};
