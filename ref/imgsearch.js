const imageSearch = require("image-search-google");
// const options = { page: 1 };

const cse_id = "014021038602380498207:bkyupulicud";
const keyArr = [
  "AIzaSyB-4XnR-3_cOaaB9-_nbzu8RW-5_0utf3I",
  "AIzaSyDc9kt0SEkSWtPHJ0wwROvHoOlToZUSYe4",
  "AIzaSyCLIrnPD4TcMO6sd13NOI2_oz10scQQ12g",
  "AIzaSyBh8xHsNP0HsyW04mBEVMqS8EEO0L8SxE4",
  "AIzaSyC4It5s2ZLsqB-pnVMofYwdFGoPWhUmHic",
];

let clientInterface = {
  clientArr: [],

  async search(inquiry) {
    for (let client of this.clientArr) {
      this.errCheck(client);

      if (!client.error) {
        try {
          let response = await client.search(`${inquiry}`, {
            page: 1,
            size: "medium",
          });

          // throw new Error("Some error");
          return response;
        } catch (err) {
          if (!client.error) client.createError();
          console.log(err);
        }
      }
    }

    return null;
  },

  errCheck(client) {
    if (client.error && new Date() - client.errorDate > 88200000) {
      client.error = false;
      client.errorDate = null;
    }
  },
};

class Client extends imageSearch {
  constructor(id, key) {
    super(id, key);
    this.error = false;
  }

  createError() {
    this.error = true;
    this.errorDate = new Date();
  }
}

keyArr.forEach((key) => {
  clientInterface.clientArr.push(new Client(cse_id, key));
});

module.exports = clientInterface;
