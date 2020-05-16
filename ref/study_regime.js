const auth = require("./auth.js");
// const uuidv4 = require("uuid/v4");
const moduleModel = require("./module_model.js");
const cardModel = require("./card_model.js");
// const clientInterface = require("./imgsearch.js");
const constants = require("./constants.js");

const study_regime = {
  respose(status, res, data) {
    res.writeHead(status, {
      "Access-Control-Allow-Origin": `${constants.corsURL}`,
      "Access-Control-Allow-Credentials": true,
    });
    if (data) {
      res.write(JSON.stringify(data));
    }
    res.end();
  },

  manage(method, req, res) {
    let reqData = [];
    let resData;
    let user;

    console.log(method);

    req.on("data", (chunk) => {
      reqData.push(chunk);
    });

    req.on("end", async () => {
      if (reqData.length) {
        reqData = JSON.parse(Buffer.concat(reqData).toString());
      }

      switch (method) {
        case "/control":
          user = await auth.init(req);

          if (user) {
            let result = await this.controlSR(reqData, user);

            if (result) {
              this.respose(200, res, { msg: "All is working", reqData });
            } else {
              this.respose(500, res, { msg: "Server error" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/test":
          user = await auth.init(req);
          let cards;
          if (user) {
            this.respose(200, res, { msg: "All is working", reqData });
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        default:
      }
    });
  },

  async controlSR(data, user) {
    // let newModuleModel = moduleModel(user.username);
    let newCardModel = cardModel(user.username);
    let { moduleID, cardID } = data;

    try {
      if (moduleID) {
        let cards = await newCardModel.find({
          moduleID,
        });

        // console.log(cards);

        for (let card of cards) {
          card.studyRegime = !card.studyRegime;
          await card.save();
        }

        return true;
      } else if (cardID) {
        let card = await newCardModel.findOne({
          _id: cardID,
        });

        // console.log(card);

        card.studyRegime = !card.studyRegime;
        await card.save();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  // async dropSR(card) {
  //   try {
  //     card.stage = 1;
  //     card.nextRep = new Date();
  //     card.prevStage = new Date();

  //     await card.save();
  //     return true;
  //   } catch (err) {
  //     console.log(err);
  //     return false;
  //   }
  // },
};

module.exports = study_regime;
