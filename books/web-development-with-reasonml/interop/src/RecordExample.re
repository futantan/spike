[@bs.deriving abstract]
type meta = {
  delimiter: string,
  linebreak: string,
  aborted: bool,
  fields: array(string),
  truncated: bool,
};

let metaData =
  meta(
    ~delimiter=",",
    ~aborted=false,
    ~linebreak="\n",
    ~truncated=false,
    ~fields=[|"Quantity", "Size", "Color"|],
  );

Js.log(fieldsGet(metaData)); /* ["Quantity", "Size", "Color"] */
Js.log(truncatedGet(metaData)); /* false */

[@bs.deriving abstract]
type error = {
  [@bs.as "type"]
  type_: string,
  code: string,
  message: string,
  row: int,
  index: int,
};

let errExample =
  error(
    ~code="InvalidQuotes",
    ~type_="Quotes",
    ~row=1,
    ~index=30,
    ~message="Trailing quote on quoted field is malformed",
  );

Js.log(type_Get(errExample)); /* "Quotes" */
