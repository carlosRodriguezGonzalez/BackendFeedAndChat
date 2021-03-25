const { Schema, model } = require("mongoose");

const SessionSchema = Schema({
  dateStart: {
    type: Date,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

SessionSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Session", SessionSchema);
