//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const fruit = req.body.fruitName;
  const url = "https://www.fruityvice.com/api/fruit/" + fruit;

  https.get(url, (response) => {
    if (response.statusCode === 200) { //error handling
      response.on("data", function(data) {
      const fruitData = JSON.parse(data);
      const nutritions = fruitData.nutritions;

      res.render("fruit", {
        myFruit: nutritions,
        title: fruitData.name});
    });
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("server is running on port 3000");
});
