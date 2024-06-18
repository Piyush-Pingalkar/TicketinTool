const mongoose = require('mongoose');

const clientschema = new mongoose.Schema({
  ticketId: String,
  ClientCode: String,
  mobile: String,
  department: String,
  date: Date,
  query: String
});

module.exports = mongoose.model("data", clientschema);
 