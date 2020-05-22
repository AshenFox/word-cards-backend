const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  server_id: String,
  username: String,
  email: String,
  password: String,
  registration_date: Date,
  subscriptions: {
    pc: Object,
    tablet: Object,
    mobile: Object,
  },
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
