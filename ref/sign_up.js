const uuidv4 = require("uuid/v4");
const userModel = require("./user_model.js");
const bcrypt = require("bcryptjs");
const auth = require("./auth.js");

const sign_up = {
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
        case "/min_length/username":
          resData = this.minLength(reqData.data, 5);
          this.respose(200, res, resData);

          break;

        case "/min_length/password":
          resData = this.minLength(reqData.data, 7);
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

        case "/user_exists":
          resData = await this.userExists(reqData.data);
          this.respose(200, res, resData);

          break;

        case "/email_format":
          resData = this.emailFormat(reqData.data);
          this.respose(200, res, resData);

          break;

        case "/email_taken":
          resData = await this.emailTaken(reqData.data);
          this.respose(200, res, resData);

          break;

        case "/one_uppercase":
          resData = this.oneUppercase(reqData.data);
          this.respose(200, res, resData);

          break;

        case "/sign_up":
          if (await this.sign_up(reqData, res)) {
            this.respose(200, res);
          } else {
            this.respose(400, res);
          }

          break;

        default:
      }
    });
  },

  // ===== User checks

  minLength(str, length, opt) {
    let obj = {
      result: false,
    };

    if (str.length <= length) {
      obj.result = true;
    }

    if (opt) {
      return obj.result;
    }
    return JSON.stringify(obj);
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

  async userExists(str, opt) {
    // =========== here
    try {
      let obj = {
        result: false,
      };

      let resData = await userModel.find({
        username: str,
      });

      if (resData.length) {
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

  // ===== Email checks

  emailFormat(str, opt) {
    let obj = {};
    let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    obj.result = !regexp.test(str);

    if (opt) {
      return obj.result;
    }
    return JSON.stringify(obj);
  },

  async emailTaken(str, opt) {
    // =========== here
    try {
      let obj = {
        result: false,
      };

      let resData = await userModel.find({
        email: str,
      });

      if (resData.length) {
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

  // ===== Password checks

  oneUppercase(str, opt) {
    let obj = {
      result: true,
    };

    let regexp = /[A-Z]/;

    let arr = [...str];
    for (let i = 0; i < arr.length; i++) {
      if (regexp.test(arr[i])) {
        obj.result = false;
      }
    }

    if (opt) {
      return obj.result;
    }
    return JSON.stringify(obj);
  },

  // ===== General user data check

  async checkUser(username, email, password) {
    if (
      !this.minLength(username, 5, true) &&
      !this.invalidChar(username, this.userRegExp, true) &&
      !(await this.userExists(username, true)) &&
      !this.emailFormat(email, true) &&
      !(await this.emailTaken(email, true)) &&
      !this.oneUppercase(password, true) &&
      !this.invalidChar(password, this.passRegExp, true) &&
      !this.minLength(password, 7, true)
    ) {
      return true;
    }

    return false;
  },

  // ===== Sign up a user

  async sign_up(data, res) {
    let { username, email, password } = data;

    if (await this.checkUser(username, email, password)) {
      let reqData = {
        server_id: uuidv4(),
        username,
        email,
        password,
        registration_date: new Date(),
      };

      // let salt = bcrypt.genSaltSync(10);
      // let hash = bcrypt.hashSync(reqData.password, salt);
      // reqData.password = hash;

      try {
        reqData.password = await new Promise((resolve, reject) => {
          bcrypt.hash(reqData.password, 10, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
          });
        });
      } catch (err) {
        console.log(err);
      }

      console.log(reqData.password);
      console.log("A new user has been signed up!");
      console.log(reqData);

      await userModel.create(reqData, (err) => {
        console.log(err);
      });

      // let token = await auth.createToken(reqData.server_id);
      // auth.setCookie(res, token);

      console.log("A new user has been signed up!");
      return true;
    } else {
      console.log(`The user doesn't meet all the requirements!`);
      return false;
    }
  },
};

module.exports = sign_up;

// async function submitModule(data, modelType) {
//     let module = data.module;

//     module.date = new Date();

//     console.log(`This data are going to be submited: ${JSON.stringify(module)}`);

//     // Trying out to connect to my database

//     await modelType.create(module, (err) => {
//         console.log(err);
//     });

// };
