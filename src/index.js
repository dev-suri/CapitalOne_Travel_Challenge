//sky scanner

/* ensure requirements are met, and give
// express access to the src directory
// which contains all the files needed.*/
var express = require("express");
var app = express();
var path = require("path");
app.use(express.static("src"));

// viewed at http://localhost:8080
// handler for the homepage, renders index.html
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//open on port 8080
app.listen(8080);
