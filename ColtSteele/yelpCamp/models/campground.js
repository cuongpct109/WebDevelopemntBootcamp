const mongoose = require("mongoose");
const Review = require("./review");

const { Schema } = mongoose;

function arrayLimit(val) {
  return val.length <= 10;
}

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    images: {
      type: [ImageSchema],
      validate: [arrayLimit, "Can not upload more than 5 images"],
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
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
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <h6><strong><a href="/campgrounds/${this._id}">${this.title}</a></strong></h6>
  <h6>${this.description.substring(0, 20)}...</h6>`;
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
