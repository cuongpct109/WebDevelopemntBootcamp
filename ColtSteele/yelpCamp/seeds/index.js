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
  for (let i = 0; i < 20; i++) {
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
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297794/YelpCamp/g1n6u6cbsuhdpvmsjz6j.jpg",
          filename: "YelpCamp/g1n6u6cbsuhdpvmsjz6j",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297801/YelpCamp/xkdwu1eqnih516jkocst.jpg",
          filename: "YelpCamp/xkdwu1eqnih516jkocst",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297790/YelpCamp/zqjjqvwkqxk4dwp4vy0u.jpg",
          filename: "YelpCamp/zqjjqvwkqxk4dwp4vy0u",
        },

        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646296964/YelpCamp/v8lmfsoa8nsc4oqas4g6.jpg",
          filename: "YelpCamp/v8lmfsoa8nsc4oqas4g6",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646296959/YelpCamp/ozjnos2enzvnfay9q4m4.jpg",
          filename: "YelpCamp/ozjnos2enzvnfay9q4m4",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646296956/YelpCamp/gf3evjjinw0hayxhskk9.jpg",
          filename: "YelpCamp/gf3evjjinw0hayxhskk9",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646192636/YelpCamp/qj4zee6vzsq9ynrnt0km.png",
          filename: "YelpCamp/qj4zee6vzsq9ynrnt0km",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646192746/YelpCamp/ott6rlmcy0ghtcsm6ks2.png",
          filename: "YelpCamp/ott6rlmcy0ghtcsm6ks2",
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
