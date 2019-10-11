// Create a Button for now that will activate the app.
const starter = document
  .getElementById("start")
  .addEventListener("click", startDay);

// Temporary button made to grab the users location.  Needed for startDay to work correctly
const locationRequest = document
  .getElementById("location")
  .addEventListener("click", getLocation);

// literal object that holds the coords.
let pos = {
  lat: null,
  long: null
};

// startDay function when called will execute all api calls and generate the new elements to append and display to the user.
async function startDay() {
  let weather = await getWeather(pos);

  let news = await getNews(weather.sys.country);
  console.log(news);

  const articles = news.articles.map(function(article) {
    return article;
  });

  console.log(articles);
  // unhide the main-container
  document
    .querySelector(".main-container")
    .setAttribute("class", "main-container");

  // Left Weather card
  // Holds current temp, location and condition
  let weatherCard1 = document.createElement("h3");
  document.querySelector(".weather1").appendChild(weatherCard1);
  weatherCard1.innerHTML = `${weather.name}, ${tempConversion(
    weather.main.temp
  )}F, ${weather.weather[0].main}`;

  // Humidity, wind speend, highs and lows for the day
  let weatherCard2 = document.createElement("p");
  document.querySelector(".weather2").appendChild(weatherCard2);
  weatherCard2.innerHTML = `Humidity: ${weather.main.humidity}, wind speeds: ${
    weather.wind.speed
  }, Temp Low:${tempConversion(
    weather.main.temp_min
  )}, Temp High:${tempConversion(weather.main.temp_max)}`;

  // Google traffic map
  let traffic = document.getElementById("map");
  traffic.style.width = "600px";
  traffic.style.height = "300px";

  // News articles
  let newsCard = document.createElement("p");

  newsCard.setAttribute("id", "a1");
  document.querySelector(".news1").appendChild(newsCard);

  newsCard.textContent = `${articles[0].title}`;

  let link = document.createElement("a");
  link.setAttribute("href", `${articles[0].url}`);
  link.innerHTML = "Source Here";
  document.querySelector("#a1").appendChild(link);
}

// Kelvin to F calculation function
function tempConversion(temperature) {
  let newTemp = (temperature - 273.15) * (9 / 5) + 32;
  return Math.round(newTemp);
}

// funciton made to grab location of user.  Needed for passing param coords to route handler
//  which calls openweather API.
function getLocation() {
  window.navigator.geolocation.getCurrentPosition(res => {
    pos = {
      lat: res.coords.latitude,
      long: res.coords.longitude
    };
    console.log(pos);
  });
}

// getWeather function is a local function to the main app.js file that will call weather.js to get results.
// passed in literal object created that holds lat & long
function getWeather(position) {
  return fetch(
    `http://127.0.0.1:5000/getweather?lat=${position.lat}&long=${position.long}`
  ).then(response => response.json());
}

// getMusic function is a local function to the main app.js file that will call spotify.js to get results
function getNews(country) {
  return fetch(`http://127.0.0.1:5000/getnews?country=${country}`).then(
    response => response.json()
  );
}

// generate google map
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: { lat: 34.04924594193164, lng: -118.24104309082031 }
  });

  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      user_location = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      map.setCenter(user_location);
    });
  } else {
    /* Browser doesn't support Geolocation */
  }
}
