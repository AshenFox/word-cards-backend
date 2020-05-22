const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  time: Date,
  number: Number,
  user_id: String,
});

// function notificationModel(username) {
//   return mongoose.model(`${username}'s notifications`, notificationSchema);
// }

const notificationModel = mongoose.model("Notifications", notificationSchema);

module.exports = notificationModel;
