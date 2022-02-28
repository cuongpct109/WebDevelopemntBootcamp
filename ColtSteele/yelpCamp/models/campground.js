const mongoose = require("mongoose");
const Review = require("./review");

const { Schema } = mongoose;

function arrayLimit(val) {
  return val.length <= 5;
}

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  images: {
    type: [{ url: String, filename: String }],
    validate: [arrayLimit, "Can not upload more than 5 images"],
  },
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
