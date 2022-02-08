const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };

  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { kindOfDay: day, items: items });
});

app.post("/", function (req, res) {
  let newItem = req.body.newToDo;
  console.log(newItem);
  items.push(newItem);

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
