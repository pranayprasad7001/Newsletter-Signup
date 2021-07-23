require("dotenv").config();
const express = require('express');
const https = require('https');
const request = require('request');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Receving GET Request
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Receving POST Request
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }
  const jsonData = JSON.stringify(data);
  const url = "https://us6.api.mailchimp.com/3.0/lists/1e4fbe7766";
  const option = {
    method: "POST",
    auth: process.env.AUTH
  };
  const request = https.request(url, option, function(response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
   res.redirect("/");
})

app.listen(process.env.PORT||3000, function() {
  console.log("Server is running at port 3000.");
});
