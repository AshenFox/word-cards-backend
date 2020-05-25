const auth = require("./auth.js");
const userModel = require("./user_model.js");
const moduleModel = require("./module_model.js");
const cardModel = require("./card_model.js");
const notificationModel = require("./notification_model.js");
const notifications = require("./notifications.js");
const constants = require("./constants.js");

const { stages } = constants;

let usersNotifTimers = {};

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
        case "/answer":
          user = await auth.init(req);

          if (user) {
            let result = await this.answer(reqData, user);

            if (result) {
              console.log(user);
              this.respose(200, res, { msg: "Answer accepted", result });

              await notifications.notificationTimeout(user);
            } else {
              this.respose(500, res, { msg: "Server error" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/control":
          user = await auth.init(req);

          if (user) {
            let result = await this.controlSR(reqData, user);

            if (result) {
              this.respose(200, res, { msg: "Regime is switched" });

              await notifications.notificationTimeout(user);
            } else {
              this.respose(500, res, { msg: "Server error" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/get_cards":
          user = await auth.init(req);

          if (user) {
            let result = await this.getCards(user);

            if (result) {
              this.respose(200, res, { ...result });
            } else {
              this.respose(500, res, { msg: "Server error" });
            }
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
    let { moduleID, cardID, value } = data;

    try {
      if (moduleID) {
        let cards = await newCardModel.find({
          moduleID,
        });

        // console.log(cards);

        for (let card of cards) {
          card.studyRegime = value;
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

  async getCards(user) {
    let newCardModel = cardModel(user.username);

    try {
      let cards = await newCardModel.find({
        studyRegime: true,
      });

      let result = {
        numberSR: cards.length,
        repeat: [],
        repeatInTime: [],
      };

      for (let card of cards) {
        if (
          (Date.now() - card.nextRep.getTime() > 0 &&
            Date.now() - card.prevStage.getTime() <= 0) ||
          card.stage === 1
        ) {
          result.repeat.push(card);
        } else if (Date.now() - card.prevStage.getTime() >= 0) {
          this.determineStage(card);
          this.setTimelines(card, true);
          await card.save();
          result.repeat.push(card);
        } else if (Date.now() - card.nextRep.getTime() <= 0) {
          result.repeatInTime.push(card);
        }
      }

      result.repeat.sort((a, b) => a.nextRep.getTime() - b.nextRep.getTime());
      result.repeatInTime.sort(
        (a, b) => a.nextRep.getTime() - b.nextRep.getTime()
      );

      // let cards = await newCardModel.find({});

      // console.log(cards);

      return result;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async answer(data, user) {
    let { _id, answer } = data;

    let newCardModel = cardModel(user.username);

    try {
      let card = await newCardModel.findOne({
        _id,
      });

      if (answer) {
        if (card.stage === 11) {
          card.studyRegime = false;
          card.stage = 1;
          this.setTimelines(card);
        } else {
          card.stage++;
          this.setTimelines(card);
        }
      } else {
        card.stage--;
        if (card.stage <= 0) card.stage = 1;
        this.setTimelines(card);
      }

      await card.save();

      return card;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  setTimelines(card, repeatNow) {
    let stage = card.stage;
    console.log(`setTimelines Stage:${stage}`);

    card.lastRep = new Date();

    if (stage === 1) {
      card.nextRep = new Date();
      card.prevStage = new Date();
    } else if (stage === 2) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[0].prevStage / 2); // 1800000
      } else {
        card.nextRep = new Date(Date.now() + stages[0].nextRep); // 900000
        card.prevStage = new Date(Date.now() + stages[0].prevStage); // 1800000
      }
    } else if (stage === 3) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[1].prevStage / 2); // 7200000
      } else {
        card.nextRep = new Date(Date.now() + stages[1].nextRep); // 3600000
        card.prevStage = new Date(Date.now() + stages[1].prevStage); // 7200000
      }
    } else if (stage === 4) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[2].prevStage / 2); // 21600000
      } else {
        card.nextRep = new Date(Date.now() + stages[2].nextRep); // 10800000
        card.prevStage = new Date(Date.now() + stages[2].prevStage); // 21600000
      }
    } else if (stage === 5) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[3].prevStage / 2); // 172800000
      } else {
        card.nextRep = new Date(Date.now() + stages[3].nextRep); // 86400000
        card.prevStage = new Date(Date.now() + stages[3].prevStage); // 172800000
      }
    } else if (stage === 6) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[4].prevStage / 2); // 345600000
      } else {
        card.nextRep = new Date(Date.now() + stages[4].nextRep); // 172800000
        card.prevStage = new Date(Date.now() + stages[4].prevStage); // 345600000
      }
    } else if (stage === 7) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[5].prevStage / 2); // 691200000
      } else {
        card.nextRep = new Date(Date.now() + stages[5].nextRep); // 345600000
        card.prevStage = new Date(Date.now() + stages[5].prevStage); // 691200000
      }
    } else if (stage === 8) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[6].prevStage / 2); // 1209600000
      } else {
        card.nextRep = new Date(Date.now() + stages[6].nextRep); // 604800000
        card.prevStage = new Date(Date.now() + stages[6].prevStage); // 1209600000
      }
    } else if (stage === 9) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[7].prevStage / 2); // 2419200000
      } else {
        card.nextRep = new Date(Date.now() + stages[7].nextRep); // 1209600000
        card.prevStage = new Date(Date.now() + stages[7].prevStage); // 2419200000
      }
    } else if (stage === 10) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[8].prevStage / 2); // 4838400000
      } else {
        card.nextRep = new Date(Date.now() + stages[8].nextRep); // 2419200000
        card.prevStage = new Date(Date.now() + stages[8].prevStage); // 4838400000
      }
    } else if (stage === 11) {
      if (repeatNow) {
        card.nextRep = new Date();
        card.prevStage = new Date(Date.now() + stages[9].prevStage / 2); // 2 * 4 * 7 * 24 * 60 * 60 * 1000 * 2
      } else {
        card.nextRep = new Date(Date.now() + stages[9].nextRep); // 2 * 4 * 7 * 24 * 60 * 60 * 1000
        card.prevStage = new Date(Date.now() + stages[9].prevStage); // 2 * 4 * 7 * 24 * 60 * 60 * 1000 * 2
      }
    }
  },

  determineStage(card) {
    let delay = Date.now() - card.prevStage.getTime();
    let stage = card.stage;

    // `determineStage --- initial delay:${delay} --- initial stage:${stage}`
    // console.log(`Calculations start!!!!!!!!!!!!!!!!!!!!`);
    for (let i = stage - 3; i >= 0; i--) {
      // console.log(`determineStage --- delay1:${delay} i:${stages[i].stage}`);
      delay = delay - stages[i].prevStage;
      // console.log(`determineStage --- delay2:${delay}`);
      if (delay <= 0) {
        card.stage = stages[i].stage;
        break;
      }
    }

    if (delay > 0) card.stage = 1;

    // console.log(`Final stage:${card.stage}`);
  },
};

module.exports = study_regime;
