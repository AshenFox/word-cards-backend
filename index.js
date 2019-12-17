// npx nodemon - to start renewable server
const http = require("http"),
    path = require("path"),
    fs = require("fs");

const mongoose = require("mongoose");

const sign_up = require("./ref/sign_up.js");
const log_in = require("./ref/log_in.js");
const config = require("config");

let loadedData = [];








// ===== MongoDB


// const schema = new Schema({
//     tilte: String,
//     cards: Schema.Types.Mixed,
//     author: String,
//     date: Date,
// });

// const modelToStore = mongoose.model('ModulesStorage', schema );
// const draftModel = mongoose.model('DraftModule', schema );

// ===== Actual server

const PORT = process.env.PORT || 5000;
const server = http.createServer();

server.on('request', router);
start();


function router(req, res) {

    let url = req.url;
    let { route, method } = urlParse(url);

    switch(route) {

        case '/sign_up':
            
            sign_up.manage(method, req, res);
            break;

        case '/log_in':
            
            log_in.manage(method, req, res);
            break;

        default:

            res.writeHead(400);
            res.write("Error");
            res.end();
    }
};

function urlParse(url) {
    let route;

    if (url == '/') {
        route = url;
    } else {
        route = url.slice(url.indexOf('/', 0), url.indexOf('/', 1));
    }

    let method = url.slice(url.indexOf('/', 1));

    return {
        route,
        method
    }
}

async function start() {
    try {

        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true, // might cause problems?
        });

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    } catch (err) {
        console.log(err)
    };
}




















































//     if (req.method == "POST") {

//         req.on('data', chunk => {
//             loadedData.push(chunk);
//         });

//         req.on('end', () => {
//             loadedData = JSON.parse(Buffer.concat(loadedData).toString());

//             let method = loadedData.param.method;

//             determineMethod(method);

//             res.setHeader('Access-Control-Allow-Origin', '*');
//             res.write("Server handled the request");
//             res.end();
//             loadedData = [];
//         });
//     };








// function determineMethod(method) {

//     if ( method == "moduleSubmition") {
//         console.log('The method is the module submition!');
//         submitModule(loadedData, modelToStore);
//     } else if ( method == "draftModuleSubmition") {
//         console.log('The method is the draft module submition!');
//         submitModule(loadedData, draftModel);
//     }
// };

// async function submitModule(data, modelType) {
//     let module = data.module;

//     module.date = new Date();

//     console.log(`This data are going to be submited: ${JSON.stringify(module)}`);

//     // Trying out to connect to my database

//     await modelType.create(module, (err) => {
//         console.log(err);
//     });

// };






// await model.find({ cards: {'$elemMatch': { id: 2 }}}, '', (err, data) => {
//     console.log(err);
//     console.log(data);
// });






//     console.log(req.method);

//     if (req.method == 'GET') {

//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.write(data);
//         res.end();
//     };

//     req.on('error', (err) => {
//         console.log('err');
//         console.log(err);
//     });

//     req.on('data', (data) => {
//         console.log('data');
//         console.log(data);
//         console.log(data.toString());
//         console.log(JSON.parse(data.toString()));
//     });

//     req.on('end', (data) => {
//         console.log('end');
//         console.log(data);
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.write('Data recived');
//         res.end();
//     });

//     console.log(req.method);