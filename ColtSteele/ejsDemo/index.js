const express = require("express");
const app = express();
const path = require("path");
const redditData = require("./data.json");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

app.get("/", (req, res) => {
  const randNum = Math.floor(Math.random() * 10) + 1;
  res.render("home", { randNum }); 
});

app.get("/rand", (req, res) => {
  const randNum = Math.floor(Math.random() * 10) + 1;
  res.render("home", { randNum: randNum });
});

app.get("/r/:subreddit", (req, res) => {
  let { subreddit } = req.params;

  let data = redditData[subreddit];

  if (data) {
    res.render("subreddit", { ...data });
  } else {
    res.render("notFound", { subreddit });
  }
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
