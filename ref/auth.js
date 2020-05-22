const userModel = require("./user_model.js");
const jwt = require("jsonwebtoken");
const config = require("config");

const auth = {
  regexp: /(?<=value=)(.*)(?= )|(?<=value=)(.*)/,

  async fetchUserID(username) {
    let resData = await userModel.findOne({
      username,
    });
    return resData.server_id;
  },

  async createToken(id) {
    try {
      let token = await new Promise((resolve, reject) => {
        jwt.sign({ id }, config.get("jwtSecret"), (err, token) => {
          if (err) throw err;
          resolve(token);
        });
      });

      return token;
    } catch (err) {
      console.log(err);
    }
  },

  async init(req) {
    let header = req.headers.authorization;
    if (!header) return false;
    let token = header.split(" ")[1];

    if (!token) return false;
    let decoded = jwt.verify(token, config.get("jwtSecret"));
    let user = await userModel.findOne({
      server_id: decoded.id,
    });
    if (user) {
      return user;
    } else {
      return false;
    }
  },

  //   async init({ token }) {
  //     if (!token) return false;

  //     let decoded = jwt.verify(token, config.get("jwtSecret"));
  //     let user = await userModel.findOne({
  //       server_id: decoded.id,
  //     });
  //     if (user) {
  //       return user;
  //     } else {
  //       return false;
  //     }
  //   },

  // setCookie(res, token, expires) {
  //   let maxAge = 3600;
  //   if (expires) maxAge = 0;

  //   res.setHeader("Set-Cookie", `value=${token}; max-age=${maxAge}; path=/;`);
  //   // res.write(JSON.stringify({ token }));
  // },

  async verify() {},
};

module.exports = auth;
