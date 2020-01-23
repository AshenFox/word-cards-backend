// const jwt = require("jsonwebtoken");
// const config = require("config");
// const userModel = require("./db_models.js");
const auth = require("./auth.js");
const moduleModel = require("./module_model.js");


const home = {

    
    respose(status, res, data) {
        res.writeHead(status, {
            'Access-Control-Allow-Origin': 'https://hoarfox.github.io',//'null'
            'Access-Control-Allow-Credentials': true
        });
        if(data) res.write(data);
        res.end();
    },

    manage(method, req, res) {

        let reqData = [];
        let resData;
        let user;
        

        req.on('data', chunk => {
            reqData.push(chunk);
        });

        req.on('end', async () => {

            if(reqData.length) {
                reqData = JSON.parse(Buffer.concat(reqData).toString());
            }

            switch(method) {

                case '/get_user_data':

                    user = await auth.init(req);

                    if (user) {
                        this.respose(200, res, await this.getUserData(user));
                    } else {
                        this.respose(401, res, 'Failed to authorize');
                    };
                    break;

                case '/get_module':

                    user = await auth.init(req);

                    if (user) {
                        this.respose(200, res, JSON.stringify(await this.getModule(user, reqData.id)));
                    } else {
                        this.respose(401, res, 'Failed to authorize');
                    };
                    break;

                case '/auth':

                    if (await auth.init(req)) {
                        this.respose(200, res, false);
                    } else {
                        auth.setCookie(res, false, true);
                        this.respose(401, res, 'Failed to authorize');
                    };
                    break;

                case '/log-out':

                    if (await auth.init(req)) {
                        auth.setCookie(res, false, true);
                        this.respose(200, res, false);
                    } else {
                        this.respose(401, res, 'Failed to authorize');
                    };
                    break;
                
                default:

            };
        });
    },

    async getUserData(user) {
        

        
        let model = moduleModel(user.username);
        let userModules = await model.find({
            author_id: user.server_id
        });

        let data = {
            username: user.username,
            modules: userModules,
        };

        return JSON.stringify(data);
    },

    async getModule(user, id) {  // I think I dn't need this one
        let model = moduleModel(user.username);
        let module = await model.findOne({
            _id: id
        });

        return module;
    },
};

module.exports = home;