// npx nodemon - to start renewable server
const http = require("http"),
  path = require("path"),
  fs = require("fs");

const mongoose = require("mongoose");
const nodeStatic = require("node-static");
const webpush = require("web-push");

const sign_up = require("./ref/sign_up.js");
const log_in = require("./ref/log_in.js");
const home = require("./ref/home.js");
const edit = require("./ref/edit.js");
const study_regime = require("./ref/study_regime.js");
const notifications = require("./ref/notifications.js");
const config = require("config");
const constants = require("./ref/constants.js");

let loadedData = [];

const publicVapidKey =
  "BO-nIcm9sOZzf2YK6W7YkQsPrxjeFwdjoBfETtk7Fu1WOXNATlphUt1Khu5vwZs9WcI9EbgxwPMUuoFLLgmumMc";
const privateVapidKey = "2ff0a8Wh7SJ6kCIOe67UUPVLm4KI225AmSqSVlS1fTo";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

const PORT = process.env.PORT || 5000;
const server = http.createServer();

const fileServer = new nodeStatic.Server("./static", { cache: 0 });

let pushInterval = setInterval(async () => {
  await notifications.sendNotifications();
  // console.log("Fire!");
}, 60000);

server.on("request", router);
start();

function router(req, res) {
  let url = req.url;
  let { route, method } = urlParse(url);

  const headers = {
    "Access-Control-Allow-Origin": `${constants.corsURL}`,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "authorization",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

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

    case "/study_regime":
      study_regime.manage(method, req, res);
      break;

    case "/notifications":
      notifications.manage(method, req, res);
      break;

    default:
      try {
        fileServer.serve(req, res);
      } catch (err) {
        console.log(err);
      }
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
