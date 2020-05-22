const auth = require("./auth.js");
const study_regime = require("./study_regime.js");
const uuidv4 = require("uuid/v4");
const moduleModel = require("./module_model.js");
const cardModel = require("./card_model.js");
const notificationModel = require("./notification_model.js");
const clientInterface = require("./imgsearch.js");
const notifications = require("./notifications.js");
const constants = require("./constants.js");

const cardsArr3 = [
  {
    term: "Stage 1 ( were to repeat a long time ago )",
    defenition: "Stage 1 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 1,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 2 ( expired )",
    defenition: "Stage 2 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 2,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 900000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 3 ( expired )",
    defenition: "Stage 3 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 3,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 3600000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 4 ( expired )",
    defenition: "Stage 4 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 4,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 10800000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 5 ( expired )",
    defenition: "Stage 5 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 5,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 86400000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 6 ( expired )",
    defenition: "Stage 6 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 6,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 172800000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 7 ( expired )",
    defenition: "Stage 7 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 7,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 345600000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 8 ( expired )",
    defenition: "Stage 8 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 8,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 604800000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 9 ( expired )",
    defenition: "Stage 9 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 9,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 1209600000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 10 ( expired )",
    defenition: "Stage 10 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 10,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 2419200000),
    prevStage: new Date(Date.now() - 1209600000),
  },
  {
    term: "Stage 11 ( expired )",
    defenition: "Stage 11 ( expired )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 11,
    creation_date: new Date(),
    nextRep: new Date(Date.now() - 1209600000 - 4838400000),
    prevStage: new Date(Date.now() - 1209600000),
  },
];

const cardsArr2 = [
  {
    term: "Stage 1 ( were to repeat a long time ago )",
    defenition: "Stage 1 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 1,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now()),
  },
  {
    term: "Stage 2 ( were to repeat a long time ago )",
    defenition: "Stage 2 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 2,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 900000),
  },
  {
    term: "Stage 3 ( were to repeat a long time ago )",
    defenition: "Stage 3 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 3,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 3600000),
  },
  {
    term: "Stage 4 ( were to repeat a long time ago )",
    defenition: "Stage 4 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 4,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 10800000),
  },
  {
    term: "Stage 5 ( were to repeat a long time ago )",
    defenition: "Stage 5 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 5,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 86400000),
  },
  {
    term: "Stage 6 ( were to repeat a long time ago )",
    defenition: "Stage 6 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 6,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 172800000),
  },
  {
    term: "Stage 7 ( were to repeat a long time ago )",
    defenition: "Stage 7 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 7,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 345600000),
  },
  {
    term: "Stage 8 ( were to repeat a long time ago )",
    defenition: "Stage 8 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 8,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 604800000),
  },
  {
    term: "Stage 9 ( were to repeat a long time ago )",
    defenition: "Stage 9 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 9,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 1209600000),
  },
  {
    term: "Stage 10 ( were to repeat a long time ago )",
    defenition: "Stage 10 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 10,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 2419200000),
  },
  {
    term: "Stage 11 ( were to repeat a long time ago )",
    defenition: "Stage 11 ( were to repeat a long time ago )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 11,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(Date.now() + 4838400000),
  },
];

const cardsArr = [
  {
    term: "Stage 1 ( yet to repeat )",
    defenition: "Stage 1 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 1,
    creation_date: new Date(),
    nextRep: new Date(),
    prevStage: new Date(),
  },
  {
    term: "Stage 2 ( yet to repeat )",
    defenition: "Stage 2 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 2,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 900000),
    prevStage: new Date(Date.now() + 1800000),
  },
  {
    term: "Stage 3 ( yet to repeat )",
    defenition: "Stage 3 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 3,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 3600000),
    prevStage: new Date(Date.now() + 7200000),
  },
  {
    term: "Stage 4 ( yet to repeat )",
    defenition: "Stage 4 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 4,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 10800000),
    prevStage: new Date(Date.now() + 21600000),
  },
  {
    term: "Stage 5 ( yet to repeat )",
    defenition: "Stage 5 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 5,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 86400000),
    prevStage: new Date(Date.now() + 172800000),
  },
  {
    term: "Stage 6 ( yet to repeat )",
    defenition: "Stage 6 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 6,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 172800000),
    prevStage: new Date(Date.now() + 345600000),
  },
  {
    term: "Stage 7 ( yet to repeat )",
    defenition: "Stage 7 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 7,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 345600000),
    prevStage: new Date(Date.now() + 691200000),
  },
  {
    term: "Stage 8 ( yet to repeat )",
    defenition: "Stage 8 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 8,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 604800000),
    prevStage: new Date(Date.now() + 1209600000),
  },
  {
    term: "Stage 9 ( yet to repeat )",
    defenition: "Stage 9 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 9,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 1209600000),
    prevStage: new Date(Date.now() + 2419200000),
  },
  {
    term: "Stage 10 ( yet to repeat )",
    defenition: "Stage 10 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 10,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 2419200000),
    prevStage: new Date(Date.now() + 4838400000),
  },
  {
    term: "Stage 11 ( yet to repeat )",
    defenition: "Stage 11 ( yet to repeat )",
    imgurl: "http://samanthavanrijs.nl/wp-content/uploads/2017/01/test.png",
    stage: 11,
    creation_date: new Date(),
    nextRep: new Date(Date.now() + 4838400000),
    prevStage: new Date(Date.now() + 9676800000),
  },
];

const edit = {
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
        case "/get_module":
          user = await auth.init(req);
          let module;
          if (user) {
            module = await this.getModule(user, reqData);

            if (!module) {
              this.respose(404, res, { msg: "Not found" });
              return;
            }

            this.respose(200, res, module);
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/get_cards":
          user = await auth.init(req);
          let cards;
          if (user) {
            cards = await this.getCards(user, reqData.moduleID);

            if (!cards) {
              this.respose(404, res, { msg: "Not found" });
              return;
            }

            this.respose(200, res, cards);
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/edit":
          user = await auth.init(req);

          if (user) {
            let result = await this.edit(reqData, user);

            if (result) {
              this.respose(200, res, false);

              await notifications.notificationTimeout(user);
            } else {
              this.respose(500, res, { msg: "Server error" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/create_card":
          user = await auth.init(req);

          if (user) {
            let card = await this.addCard(reqData._id, user);

            if (card) {
              this.respose(200, res, card);
            } else {
              this.respose(500, res, { msg: "Server error" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/delete_card":
          user = await auth.init(req);

          if (user) {
            let result = await this.deleteCard(reqData, user);
            if (result) {
              this.respose(200, res, { msg: "Deleted successfully" });

              await notifications.notificationTimeout(user);
            } else {
              this.respose(500, res, { msg: "Server error" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/save_draft":
          user = await auth.init(req);

          if (user) {
            let result = await this.saveDraft(reqData.title, user);
            if (result) {
              this.respose(200, res, { msg: "Draft saved" });
            } else {
              this.respose(400, res, { msg: "Bad Request" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/imgsearch":
          user = await auth.init(req);
          if (user) {
            if (reqData.inquiry === "") {
              this.respose(400, res, { msg: "Bad Request" });
              break;
            }

            let searchResults = await clientInterface.search(reqData.inquiry);
            if (searchResults) {
              this.respose(200, res, searchResults);
            } else {
              this.respose(503, res, { msg: "Service Unavailable" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }

          break;

        case "/clearcollections":
          user = await auth.init(req);
          if (user) {
            let result = this.removeAllItems(user);
            if (result) {
              this.respose(200, res, { msg: "All data has been deleted" });
            } else {
              this.respose(500, res, { msg: "Something went wrong" });
            }
          } else {
            this.respose(401, res, { msg: "Failed to authorize" });
          }
          break;

        case "/delete_module":
          user = await auth.init(req);

          if (user) {
            let result = await this.deleteModule(reqData._id, user);
            if (result) {
              this.respose(200, res, { msg: "Deleted successfully" });

              await notifications.notificationTimeout(user);
            } else {
              this.respose(500, res, { msg: "Something went wrong" });
            }
          } else {
            this.respose(401, res, "Failed to authorize");
          }
          break;

        case "/study_regime_test1":
          user = await auth.init(req);

          if (user) {
            let result = await this.studyRegimeTest1(user, reqData);
            if (result) {
              this.respose(200, res, { msg: "Created successfully", result });
            } else {
              this.respose(500, res, { msg: "Something went wrong" });
            }
          } else {
            this.respose(401, res, "Failed to authorize");
          }
          break;

        default:
      }
    });
  },

  async createModule(user) {
    let model = moduleModel(user.username);

    let reqData = {
      title: "",
      author: user.username,
      author_id: user.server_id,
      number: 5,
      //cards,
      creation_date: new Date(),
      draft: true,
    };

    try {
      let newModule = await model.create(reqData);

      return newModule;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async createCards(number, user, moduleID, data = {}) {
    let model = cardModel(user.username);
    let cardsID = [];
    let cards = [];

    let { term = "", defenition = "", imgurl = "" } = data;

    for (let i = 1; i <= number; i++) {
      try {
        let reqData = {
          moduleID,
          term,
          defenition,
          imgurl,
          creation_date: new Date(),
          studyRegime: false,
          stage: 1,
          nextRep: new Date(),
          prevStage: new Date(),
        };

        let newCard = await model.create(reqData);
        cardsID.push(newCard._id);
        cards.push(newCard);
      } catch (err) {
        console.log(err);
      }
    }

    return { cardsID, cards };
  },

  // Testing code ---------------------------------------

  async createCustomModule(user, number) {
    let model = moduleModel(user.username);

    let reqData = {
      title: "studyRegimeTest1",
      author: user.username,
      author_id: user.server_id,
      number,
      creation_date: new Date(),
      draft: false,
    };

    try {
      let newModule = await model.create(reqData);

      return newModule;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async createCustomCards(user, moduleID, cards) {
    let model = cardModel(user.username);

    let result = [];

    for (let card of cards) {
      let {
        term = "",
        defenition = "",
        imgurl = "",
        stage,
        creation_date,
        nextRep,
        prevStage,
      } = card;

      try {
        let reqData = {
          moduleID,
          term,
          defenition,
          imgurl,
          creation_date,
          studyRegime: true,
          stage,
          nextRep,
          prevStage,
        };

        let newCard = await model.create(reqData);
        result.push(newCard);
      } catch (err) {
        console.log(err);
      }
    }

    return result;
  },

  async studyRegimeTest1(user, data) {
    let { option } = data;
    let module = await this.createCustomModule(user, cardsArr.length);
    let cards;
    if (option === 1) {
      cards = await this.createCustomCards(user, module._id, cardsArr);
    } else if (option === 2) {
      cards = await this.createCustomCards(user, module._id, cardsArr2);
    } else if (option === 3) {
      cards = await this.createCustomCards(user, module._id, cardsArr3);
    }

    return { module, cards };
  },

  // Testing code ---------------------------------------

  async deleteCard({ moduleID, _id }, user) {
    let newModuleModel = moduleModel(user.username);
    let newCardModel = cardModel(user.username);

    try {
      let module = await newModuleModel.findOne({
        _id: moduleID,
      });

      let card = await newCardModel.findOne({
        _id,
      });

      // console.log(module, card);

      let index = module.cards.indexOf(_id);

      if (index) {
        module.cards.splice(index, 1);
        module.number = module.number - 1;
        await module.save();
      }

      if (card) {
        await card.deleteOne();
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async addCard(_id, user, data) {
    let newModuleModel = moduleModel(user.username);

    try {
      let module = await newModuleModel.findOne({
        _id,
      });

      let { cards } = await this.createCards(1, user, _id, data);

      let card = cards[0];

      module.cards.push(card._id);
      module.number = module.number + 1;

      await module.save();

      return card;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async getModule(user, { _id, draft }) {
    let newModuleModel = moduleModel(user.username);
    let newCardModel = cardModel(user.username);

    let module;
    let newModule;
    try {
      if (draft) {
        module = await newModuleModel.findOne({
          draft: true,
        });

        if (!module) {
          newModule = await this.createModule(user);

          let moduleID = newModule._id;

          let { cardsID } = await this.createCards(5, user, moduleID);

          newModule.cards = cardsID;

          module = await newModule.save();
        }
      } else {
        module = await newModuleModel.findOne({
          _id,
        });
      }

      return module;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async getCards(user, moduleID) {
    let newCardModel = cardModel(user.username);

    try {
      let cards = await newCardModel.find({
        moduleID,
      });

      return cards;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async edit(data, user) {
    let { _id, title, cards, draft } = data;

    if (!draft && title == "") {
      return false;
    }

    try {
      let oldModule = await this.getModule(user, data);
      let oldCards = await this.getCards(user, _id);

      for (let card of cards) {
        if (!card._id) {
          await this.addCard(_id, user, card);
        } else {
          let oldCard = oldCards.find((item) => {
            return item._id == card._id;
          });

          oldCard.term = card.term;
          oldCard.defenition = card.defenition;
          oldCard.imgurl = card.imgurl;

          // await study_regime.dropSR(oldCard);
          if (card.dropSR) {
            oldCard.stage = 1;
            oldCard.nextRep = new Date();
            oldCard.prevStage = new Date();
          }

          await oldCard.save();
        }
      }

      if (oldCards.length > cards.length) {
        for (let card of oldCards) {
          let match = cards.find((item) => {
            return item._id == card._id;
          });

          if (!match) {
            await this.deleteCard({ moduleID: _id, _id: card._id }, user);
          }
        }
      }

      oldModule.title = title;
      oldModule.number = cards.length;

      await oldModule.save();
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  },

  async saveDraft(title, user) {
    let newModuleModel = moduleModel(user.username);
    if (title == "") {
      return false;
    }

    try {
      let module = await newModuleModel.findOne({
        draft: true,
      });

      module.draft = false;

      module.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async deleteModule(_id, user) {
    let newModuleModel = moduleModel(user.username);
    let newCardModel = cardModel(user.username);

    try {
      await newModuleModel.deleteOne({ _id });
      await newCardModel.deleteMany({ moduleID: _id });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async removeAllItems(user) {
    try {
      let newModuleModel = moduleModel(user.username);
      let newCardModel = cardModel(user.username);

      await newModuleModel.deleteMany({});
      await newCardModel.deleteMany({});
      await notificationModel.deleteMany({ user_id: user._id });
      return true;
    } catch (err) {
      return false;
      console.log(err);
    }
  },
};

module.exports = edit;
