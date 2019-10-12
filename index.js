// JS modules (imports)
const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const keys = require("./config/dev");

const request = require("request");
app.use(cors());
// Look into the Dist project folder to find template files to generate for routes
app.use(express.static(__dirname + "/dist"));

// Using router to access files inside folder dist
router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "index.html"));
});

// route made for the server makes the request to openweather and not the client
// the route is passed url paramreters from the client, lat and long.
// access these with req.query.{name of param}
router.get("/getweather", function(req, res) {
  // let url = `http://api.openweathermap.org/data/2.5/weather?q=austin,us&APPID=${keys.openWeatherAPI}`;
  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.long}&APPID=${keys.openWeatherAPI}`;
  request(url, function(err, response, body) {
    if (err) {
      console.log(err);
    } else {
      console.log("Weather Request to API sent");
      res.send(body);
    }
  });
});

// route made for news article.  Made through backend to secure the api key
router.get("/getnews", function(req, res) {
  let url =
    "https://newsapi.org/v2/top-headlines?" +
    `country=${req.query.country}&` +
    `apiKey=${keys.newsAPI}`;
  request(url, function(err, response, body) {
    if (err) {
      console.log(err);
    } else {
      console.log("News API request sent");
      res.send(body);
    }
  });
});

app.use("/", router);
// when server is running the app will listen to specific port and broadcasted over LAN for access testing
app.listen(process.env.PORT || 5000, "0.0.0.0");
