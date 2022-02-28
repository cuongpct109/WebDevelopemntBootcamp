const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("../models/campground");
const Review = require("../models/review");
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
  for (let i = 0; i < 50; i++) {
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "621a25afbc2adfe617197164",
      location: `${sample(cities).city}, ${sample(cities).state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus ipsam alias, voluptate molestias adipisci minima, quae ea, delectus aspernatur harum unde molestiae tempora soluta et quod excepturi ut aperiam eum!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646046773/YelpCamp/tcclbcrmhbdepijsbeni.png",
          filename: "YelpCamp/lyhevetw9aiwtmnqv8p8",
        },
        {
          url: "https://res.cloudinary.com/cuongpct109/image/upload/v1646046842/YelpCamp/md6rxfx5ubumrlchjgnk.png",
          filename: "YelpCamp/q9v5piibrzfysjs45wh5",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
