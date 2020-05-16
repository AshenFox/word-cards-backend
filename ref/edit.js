const auth = require("./auth.js");
// const study_regime = require("./study_regime.js");
const uuidv4 = require("uuid/v4");
const moduleModel = require("./module_model.js");
const cardModel = require("./card_model.js");
const clientInterface = require("./imgsearch.js");
const constants = require("./constants.js");

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
      return true;
    } catch (err) {
      return false;
      console.log(err);
    }
  },
};

module.exports = edit;
