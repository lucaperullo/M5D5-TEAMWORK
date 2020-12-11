const express = require("express");
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling");

const server = express();
const port = process.env.PORT || 3007;

server.use(express.json());

server.use("/files", require("./files"));
//importing the errorhandlers
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);
//giving the port and a cute message to the console
server.listen(port, () => {
  console.log(
    "Amazon server is running on port :",
    process.env.PORT,
    ", abadabbadul huhu"
  );
});
