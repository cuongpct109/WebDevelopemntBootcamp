const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect(
  "mongodb+srv://cuongpct109:Cuong912@cluster0.lulnx.mongodb.net/yelpcamp?retryWrites=true&w=majority"
);

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
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297787/YelpCamp/s98nymwcwafomq3ahk6m.jpg",
          filename: "YelpCamp/s98nymwcwafomq3ahk6m",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297790/YelpCamp/zqjjqvwkqxk4dwp4vy0u.jpg",
          filename: "YelpCamp/zqjjqvwkqxk4dwp4vy0u",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297794/YelpCamp/g1n6u6cbsuhdpvmsjz6j.jpg",
          filename: "YelpCamp/g1n6u6cbsuhdpvmsjz6j",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297801/YelpCamp/xkdwu1eqnih516jkocst.jpg",
          filename: "YelpCamp/xkdwu1eqnih516jkocst",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646297909/YelpCamp/hy19qjjd6wdic0mom1zl.jpg",
          filename: "YelpCamp/hy19qjjd6wdic0mom1zl",
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
