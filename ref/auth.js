const userModel = require("../ref/db_models.js");
const jwt = require("jsonwebtoken");
const config = require("config");

const auth = {

    async fetchUserID(username) {
        let resData = await userModel.findOne({
            username,
        });
        return resData.server_id;
    },

    async createToken(id) {
        try {
            let token = await new Promise((resolve, reject) => {
                jwt.sign({ id }, config.get('jwtSecret'), (err, token) => {
                    if(err) throw err;
                    resolve(token);
                });
            })

            return token;
        } catch(err) {
            console.log(err);
        };
    },

    async verify() {

    }
};

module.exports = auth;