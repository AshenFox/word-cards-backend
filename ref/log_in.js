const userModel = require("./user_model.js");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const config = require("config");
const auth = require("./auth.js");

const log_in = {
  userRegExp: /[A-z0-9]/,
  passRegExp: /[A-z0-9"!#$%&'()*+,.:;<=>?@\]\[^_`{}~"\/\\\-]/,

  respose(status, res, data) {
    res.writeHead(status, {
      "Access-Control-Allow-Origin": "https://hoarfox.github.io", //'http://127.0.0.1:8080'
      "Access-Control-Allow-Credentials": true,
    });
    if (data) res.write(data);
    res.end();
  },

  manage(method, req, res) {
    let reqData = [];
    let resData;

    req.on("data", (chunk) => {
      reqData.push(chunk);
    });

    req.on("end", async () => {
      reqData = JSON.parse(Buffer.concat(reqData).toString());

      switch (method) {
        case "/no_user":
          resData = await this.noUser(reqData.data);
          this.respose(200, res, resData);

          break;

        case "/invalid_char/username":
          resData = this.invalidChar(reqData.data, this.userRegExp);
          this.respose(200, res, resData);

          break;

        case "/invalid_char/password":
          resData = this.invalidChar(reqData.data, this.passRegExp);
          this.respose(200, res, resData);

          break;

        case "/is_empty":
          resData = this.isEmpty(reqData.data);
          this.respose(200, res, resData);

          break;

        case "/incorrect_password":
          resData = await this.incorrectPassword(
            reqData.username,
            reqData.password
          );
          this.respose(200, res, resData);

          break;

        case "/log_in":
          if (await this.log_in(reqData, res)) {
            this.respose(200, res);
          } else {
            this.respose(401, res);
          }
          break;

        case "/test":
          resData = await this.test();
          this.respose(200, res, resData);

          break;

        default:
      }
    });
  },

  async test() {
    try {
      return JSON.stringify(
        await userModel.find({
          username: "ansdkdnfkf",
        })
      );
    } catch (err) {
      console.log(err);
    }
  },

  invalidChar(str, allowed, opt) {
    let obj = {
      result: false,
    };

    let arr = [...str];

    for (let i = 0; i < arr.length; i++) {
      if (!allowed.test(arr[i])) {
        obj.result = true;
      }
    }

    if (opt) {
      return obj.result;
    }
    return JSON.stringify(obj);
  },

  async noUser(str, opt) {
    try {
      let obj = {
        result: false,
      };

      let resData = await userModel.find({
        username: str,
      });

      if (!resData.length) {
        obj.result = true;
      }
      if (opt) {
        return obj.result;
      }

      return JSON.stringify(obj);
    } catch (err) {
      console.log(err);
    }
  },

  async incorrectPassword(username, password, opt) {
    try {
      let obj = {
        result: false,
      };

      let resData = await userModel.find({
        username: username,
        // password: password
      });

      if (!(await bcrypt.compare(password, resData[0].password))) {
        obj.result = true;
      }

      if (opt) {
        return obj.result;
      }

      return JSON.stringify(obj);
    } catch (err) {
      console.log(err);
    }
  },

  isEmpty(str, opt) {
    // might not work

    let obj = {
      result: false,
    };

    if (!str) {
      obj.result = true;
    }

    if (opt) {
      return obj.result;
    }

    return JSON.stringify(obj);
  },

  async checkUser(username, password) {
    if (
      !(await this.noUser(username, true)) &&
      !this.invalidChar(username, this.userRegExp, true) &&
      !this.invalidChar(password, this.passRegExp, true) &&
      !this.isEmpty(username, true) &&
      !this.isEmpty(password, true) &&
      !(await this.incorrectPassword(username, password, true))
    ) {
      return true;
    }

    return false;
  },

  async log_in(data, res) {
    let { username, password } = data;

    if (await this.checkUser(username, password)) {
      let userID = await auth.fetchUserID(username);
      let token = await auth.createToken(userID);
      auth.setCookie(res, token);
      console.log(`A user has logged in!`);
      return true;
    } else {
      console.log(`The user doesn't meet all the requirements!`);
      return false;
    }
  },
};

module.exports = log_in;
