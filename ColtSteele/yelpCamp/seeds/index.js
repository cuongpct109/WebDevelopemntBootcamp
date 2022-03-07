if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const cities = require("./cities");
const { descriptors, places, imageUrls } = require("./seedHelpers");
const dbUrl = process.env.DB_URL;
// const dbUrl = "mongodb://localhost:27017/yelpcamp";
const { v4: uuidv4 } = require("uuid");

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany();
  await Review.deleteMany();
  for (let i = 0; i < 200; i++) {
    const city = sample(cities);
    const price = Math.floor(Math.random() * 20) + 10;
    const randomImages = [];
    for (let j = 0; j < 4; j++) {
      randomImages.push({
        url: sample(imageUrls),
        filename: "Unsplash-" + uuidv4(),
      });
    }
    const campground = await new Campground({
      author: (await User.findOne({ name: "cuong" }))._id,
      location: `${city.city}, ${city.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "A great place to visit when traveling in the world. Located in Tho Quang ward, Son Tra district, the Son Tra peninsula is a primeval forest with beautiful landscapes having the greatest diversity of the ecosystem. There are many interesting places to visit during your stays in the Son Tra peninsula",
      price,
      images: [...randomImages],
      geometry: { type: "Point", coordinates: [city.longitude, city.latitude] },
      lastUpdated: Date.now(),
    });
    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
