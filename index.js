// npx nodemon - to start renewable server
const http = require("http"),
  path = require("path"),
  fs = require("fs");

const mongoose = require("mongoose");

const sign_up = require("./ref/sign_up.js");
const log_in = require("./ref/log_in.js");
const home = require("./ref/home.js");
const edit = require("./ref/edit.js");
const config = require("config");

let loadedData = [];

const PORT = process.env.PORT || 5000;
const server = http.createServer();

server.on("request", router);
start();

function router(req, res) {
  let url = req.url;
  let { route, method } = urlParse(url);

  switch (route) {
    case "/sign_up":
      sign_up.manage(method, req, res);
      break;

    case "/log_in":
      log_in.manage(method, req, res);
      break;

    case "/home":
      home.manage(method, req, res);
      break;

    case "/edit":
      edit.manage(method, req, res);
      break;

    default:
      res.writeHead(200);
      res.write("Welcome to the server!");
      res.end();
  }
}

function urlParse(url) {
  let route;

  if (url == "/") {
    route = url;
  } else {
    route = url.slice(url.indexOf("/", 0), url.indexOf("/", 1));
  }

  let method = url.slice(url.indexOf("/", 1));

  return {
    route,
    method,
  };
}

async function start() {
  try {
    await mongoose.connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true, // might cause problems?
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
