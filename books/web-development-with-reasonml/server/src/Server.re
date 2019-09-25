let onListen = e =>
  switch (e) {
  | exception (Js.Exn.Error(e)) =>
    Js.log(e);
    Node.Process.exit(1);
  | _ => Js.log("Listening at http://127.0.0.1:3000")
  };

let app = Express.express();
let server = Express.App.listen(app);
