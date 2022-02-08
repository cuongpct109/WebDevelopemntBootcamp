const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

let today = new Date();
let options = {
  weekday: "long",
  day: "numeric",
  month: "short",
};

let day = today.toLocaleDateString("en-US", options);

app.get("/", function (req, res) {
  res.render("list", { kindOfDay: day });
});

app.post("/", function (req, res) {
  let newItem = req.body.newToDo;
  res.render("list", { kindOfDay: day, newItem: newItem });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
