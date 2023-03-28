const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const router2 = jsonServer.router("history.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use("", router);
server.use("", router2);
server.listen(process.env.PORT || 5000, () => {
  console.log("JSON Server is running");
});
