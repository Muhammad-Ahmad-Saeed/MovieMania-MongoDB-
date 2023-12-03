const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  title: String,
  Duration: Number,
  Cast: [String],
  Genre: {
    type: String,
    lowercase: true,
  },
});

const movieModel = mongoose.model("Movies", movieSchema, "Movies");
module.exports = movieModel;
