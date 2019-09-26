const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  datePost: Date,
  neighborhood: String,
  url: String,
  jobDescription: String,
  compensation: String
});

const Jobs = mongoose.model("Jobs", schema);

module.exports = { Jobs };
