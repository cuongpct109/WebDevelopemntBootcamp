if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const dbUrl = process.env.DB_URL;

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
  for (let i = 0; i < 50; i++) {
    const city = sample(cities);
    const price = Math.floor(Math.random() * 20) + 10;
    const campground = await new Campground({
      author: (await User.findOne({ name: "cuong" }))._id,
      location: `${city.city}, ${city.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus ipsam alias, voluptate molestias adipisci minima, quae ea, delectus aspernatur harum unde molestiae tempora soluta et quod excepturi ut aperiam eum!",
      price,
      images: [
        {
          url: "/images/1.jpg",
          filename: "1",
        },
        {
          url: "/images/2.jpg",
          filename: "2",
        },
        {
          url: "/images/3.jpg",
          filename: "3",
        },
        {
          url: "/images/4.jpg",
          filename: "4",
        },
        {
          url: "/images/5.jpg",
          filename: "5",
        },
      ],
      geometry: { type: "Point", coordinates: [city.longitude, city.latitude] },
    });
    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
