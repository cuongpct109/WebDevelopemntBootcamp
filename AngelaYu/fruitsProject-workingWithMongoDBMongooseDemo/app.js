const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitDB");

const fruitSchema = mongoose.Schema({
  name: { type: String, required: [1, "Why no name?"] },
  rating: { type: Number, min: 1, max: 10 },
  review: String,
});

const personSchema = mongoose.Schema({
  name: String,
  age: Number,
  favFruit: fruitSchema,
});

const Fruit = mongoose.model("Fruit", fruitSchema);
const Person = mongoose.model("Person", personSchema);
const Mango = new Fruit({
  name: "Mango",
  rating: 10,
  review: "Pretty solid as a fruit.",
});
Mango.save();
const Cuong = new Person({
  name: "Cuong",
  age: 27,
  favFruit: Mango,
});
Cuong.save();

// fruit.save();

// Fruit.updateOne(
//   { _id: "620dccccf57993f1e25a9866" },
//   { name: "Peach" },
//   (err, fruits) => {
//     mongoose.connection.close();
//   }
// );
