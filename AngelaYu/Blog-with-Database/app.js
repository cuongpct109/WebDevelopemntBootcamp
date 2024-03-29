const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const path = require("path");
const { stringify } = require("querystring");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// Views folder and EJS setup:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body:
app.use(express.json());

// Public folder setup:
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/postDB");

const postSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts,
      });
    }
  });
});

app.post("/compose", function (req, res) {
  let post = new Post({
    title: _.trim(_.capitalize(req.body.postTitle)),
    content: req.body.postBody,
  });

  post.save((err) => {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(`errors at /compose post request: ${err}`);
    }
  });
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = req.params.postName;

  Post.findOne({ title: req.params.postName }, (err, post) => {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    } else {
      console.log(`errors at /posts/:postName: ${err}`);
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("*", (req, res) => {
  res.send(`<h2>404! Page is not found.</h2>`);
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
