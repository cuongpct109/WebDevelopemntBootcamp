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
      author: "621afa17a3850dcbe425c1e8",
      location: `${sample(cities).city}, ${sample(cities).state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251/900x600`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus ipsam alias, voluptate molestias adipisci minima, quae ea, delectus aspernatur harum unde molestiae tempora soluta et quod excepturi ut aperiam eum!",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
