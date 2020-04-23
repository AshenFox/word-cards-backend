const auth = require("./auth.js");
const moduleModel = require("./module_model.js");
const clientInterface = require("./imgsearch.js");
const constants = require("./constants.js");

const edit = {
  respose(status, res, data) {
    res.writeHead(status, {
      "Access-Control-Allow-Origin": `${constants.corsURL}`,
      "Access-Control-Allow-Credentials": true,
    });
    if (data) res.write(data);
    res.end();
  },

  manage(method, req, res) {
    let reqData = [];
    let resData;
    let user;

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

          if (user) {
            if (reqData.draft) {
              this.respose(200, res, JSON.stringify(await this.getDraft(user)));
            } else {
              this.respose(
                200,
                res,
                JSON.stringify(await this.getModule(user, reqData.id))
              );
            }
          } else {
            this.respose(401, res, "Failed to authorize");
          }
          break;

        case "/is_changed":
          user = await auth.init(req);

          if (user && (await this.isChanged(reqData, user))) {
            this.respose(200, res, false);
          } else {
            this.respose(500, res, false);
          }
          break;

        case "/edit":
          user = await auth.init(req);

          if (user) {
            if (await this.edit(reqData, user)) {
              this.respose(200, res, false);
            } else {
              this.respose(500, res, false);
            }
          } else {
            this.respose(401, res, "Failed to authorize");
          }
          break;

        case "/edit_draft":
          user = await auth.init(req);

          if (user) {
            await this.editDraft(reqData.draftData, user);
            this.respose(200, res, false);
          } else {
            this.respose(401, res, "Failed to authorize");
          }
          break;

        case "/delete":
          user = await auth.init(req);

          if (user) {
            console.log(reqData);
            await this.deleteModule(reqData._id, user);
            this.respose(200, res, false);
          } else {
            this.respose(401, res, "Failed to authorize");
          }
          break;

        case "/save_module": // create a new module with current author
          user = await auth.init(req);

          if (user) {
            if (await this.saveModule(reqData, user, false)) {
              await this.deleteDraft(user);
              this.respose(200, res, false);
            } else {
              this.respose(500, res, false);
            }
          } else {
            this.respose(401, res, "Failed to authorize");
          }
          break;

        case "/imgsearch":
          user = await auth.init(req);
          if (user) {
            if (reqData.inquiry === "") {
              this.respose(400, res, "Bad Request");
              break;
            }

            let searchResults = await clientInterface.search(reqData.inquiry);
            if (searchResults) {
              this.respose(200, res, JSON.stringify(searchResults));
            } else {
              this.respose(
                503,
                res,
                JSON.stringify({ msg: "Service Unavailable" })
              );
            }
          } else {
            this.respose(401, res, "Failed to authorize");
          }

          break;

        default:
      }
    });
  },

  async edit({ _id, module }, user) {
    if (module.title == "") return false;

    let oldModule = await this.getModule(user, _id);

    if (oldModule) {
      oldModule.title = module.title;
      oldModule.cards = module.cards;
      oldModule.number = module.cards.length; // EDIT ... nothing seeds to be changed
    }

    try {
      await oldModule.save();
    } catch (err) {
      console.log(err);
    }

    return true;
  },

  async editDraft(draftData, user) {
    // Change

    let draft = await this.getDraft(user);

    if (!draft) {
      this.saveModule(draftData, user, true);
      return;
    } else {
      draft.title = draftData.title;
      draft.cards = draftData.cards;
      draft.number = draftData.cards.length; // EDIT ... nothing needs to be changed
    }

    try {
      await draft.save();
    } catch (err) {
      console.log(err);
    }
  },

  async deleteModule(_id, user) {
    let module = await this.getModule(user, _id);
    if (module) {
      let model = moduleModel(user.username);
      model.deleteOne({ _id: module._id }, (err) => {
        console.log(err);
      });
    }
  },

  async deleteDraft(user) {
    console.log("fire!");
    let draft = await this.getDraft(user);
    if (draft) {
      let model = moduleModel(user.username);
      model.deleteOne({ draft: true }, (err) => {
        console.log(err);
      });
    }
  },

  async isChanged({ _id, module }, user) {
    let response = await this.getModule(user, _id);
    let title = response.title;
    let cards = response.cards;

    // console.log(
    //   module.title !== title || module.cards.length != response.cards.length,
    //   "First check"
    // );

    if (
      module.title !== title ||
      module.cards.length != response.cards.length
    ) {
      return true;
    }

    for (let i in module.cards) {
      let item = module.cards[i];

      // console.log(!cards[i], "Second check");

      if (!cards[i]) {
        return true;
      }
      // console.log(item);
      for (let property in item) {
        // console.log(item[property] !== cards[i][property]);
        if (item[property] !== cards[i][property]) {
          return true;
        }
      }

      // if (
      //   item.term !== cards[i].term || // Add a loop
      //   item.defenition !== cards[i].defenition // EDIT ... add url field
      // ) {
      //   return true;
      // }
    }

    return false;
  },

  async saveModule({ title, cards }, user, draft) {
    if (!draft && title == "") {
      return false;
    }

    let reqData = {
      title,
      author: user.username,
      author_id: user.server_id,
      cards,
      creation_date: new Date(),
      draft,
    };

    reqData.number = reqData.cards.length;

    let model = moduleModel(user.username);

    await model.create(reqData, (err) => {
      console.log(err);
    });

    return true;
  },

  async getModule(user, id) {
    let model = moduleModel(user.username);
    let module = await model.findOne({
      _id: id,
    });

    return module;
  },

  async getDraft(user) {
    let model = moduleModel(user.username);
    let module = await model.findOne({
      draft: true,
    });

    return module;
  },
};

module.exports = edit;
