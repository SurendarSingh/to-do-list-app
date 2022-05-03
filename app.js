const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to Todolist!"
});
const item2 = new Item({
  name: "Use + to add Task"
});
const item3 = new Item({
  name: "<-- Checkmark to delete the Task"
});
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if(!foundItems.length) {
      Item.insertMany(defaultItems, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("Default items added");
        }
        res.redirect("/");
      });
    } else {
      res.render("list", {listTitle: "Today", newItemsList: foundItems});
    }
  });
});

app.post("/", function(req, res) {
  const newItem = new Item({
    name: req.body.newItem
  });
  newItem.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const itemId = req.body.checkbox;
  Item.findByIdAndRemove(itemId, function(err) {
    if(!err) {
      res.redirect("/");
    }
  });
});

app.get("/about", function(req,res) {
  res.render("about");
});

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});