const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const moduleSchema = new Schema({
    title: String,
    author: String,
    author_id: String,
    cards: Schema.Types.Mixed,
    number: Number,
    creation_date: String,
    draft: Boolean,
})

function moduleModel(username) {
    return mongoose.model(`${username}'s module`, moduleSchema );
}

module.exports = moduleModel;