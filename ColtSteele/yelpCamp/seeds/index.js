const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelpcamp");

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
    const campground = await new Campground({
      author: (await User.findOne({ name: "cuong" }))._id,
      location: `${city.city}, ${city.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus ipsam alias, voluptate molestias adipisci minima, quae ea, delectus aspernatur harum unde molestiae tempora soluta et quod excepturi ut aperiam eum!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646146337/YelpCamp/rhdvmdrcd5lzsguha49x.jpg",
          filename: "YelpCamp/rhdvmdrcd5lzsguha49x",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646146339/YelpCamp/eenkuntzvpeyi9frt70u.jpg",
          filename: "YelpCamp/eenkuntzvpeyi9frt70u",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646147255/YelpCamp/ncxfpkc6ssssgpgiqcmg.jpg",
          filename: "YelpCamp/ncxfpkc6ssssgpgiqcmg",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646147264/YelpCamp/t544svset7l3y8m9q48a.jpg",
          filename: "YelpCamp/t544svset7l3y8m9q48a",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646147258/YelpCamp/px4deeae1kvlsesakoyb.jpg",
          filename: "YelpCamp/px4deeae1kvlsesakoyb",
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
