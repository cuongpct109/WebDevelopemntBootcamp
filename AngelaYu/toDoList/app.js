const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

// let items = ["Buy Food", "Cook Food", "Eat Food"];

// let workItems = ["first work"];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(
  "mongodb+srv://cuongpct109:Cuong912@cluster0.lulnx.mongodb.net/todolistDB"
);
const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const defaultItems = [
  new Item({
    name: "<-- Hit this to delete an item.",
  }),
  new Item({
    name: "Hit the + button to add a new item.",
  }),
  new Item({
    name: "Welcome to your todolist!",
  }),
];

const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  List.findOne({ name: "Today" }, (err, foundList) => {
    if (foundList) {
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    } else {
      List.insertMany([{ name: "Today", items: defaultItems }], function (err) {
        err ? console.log(err) : console.log("");
      });
      res.redirect("/");
    }
  });
});

app.post("/", function (req, res) {
  let newItem = req.body.newItem;

  let listName = req.body.list;

  List.findOne({ name: listName }, (err, foundList) => {
    let item = new Item({
      name: newItem,
    });
    foundList.items.push(item);
    foundList.save();
    res.redirect(`/${listName}`);
  });
});

app.post("/delete", function (req, res) {
  let listName = req.body.listName;
  let checkedItem = req.body.checkBox;

  List.findOne({ name: listName }, (err, foundList) => {
    foundList.items = foundList.items.filter((i) => i.name !== checkedItem);
    foundList.save();
    res.redirect(`/${listName}`);
  });
});

app.get("/:customListName", function (req, res) {
  let customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!foundList) {
      let list = new List({
        name: customListName,
        items: defaultItems,
      });

      list.save();

      res.redirect(`/${customListName}`);
    } else {
      if (foundList.items.length === 0) {
        foundList.items = defaultItems;
        foundList.save();
        res.redirect(`/${customListName}`);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully!");
});
