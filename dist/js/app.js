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

  const articles = news.articles.map(function(article) {
    return article;
  });
  console.log(articles);
  // unhide the main-container
  document
    .querySelector(".main-container")
    .setAttribute("class", "main-container");
  document
    .querySelector(".main-container-right")
    .setAttribute("class", "main-container");

  // Holds current temp, location and condition..Humidity, wind speend, highs and lows for the day
  weatherUI(weather);
  // Google traffic map
  mapUI();
  // News articles

  for (i = 0; i < 3; i++) {
    newsUI(articles);
  }
}

// News articles display
function newsUI(array) {
  let parentContainer = document.getElementById("news-container-1");

  let cardSize = document.createElement("div");
  cardSize.setAttribute("class", "col s2");

  let card = document.createElement("div");
  card.setAttribute("class", "card hoverable");

  let imgDiv = document.createElement("div");
  imgDiv.setAttribute(
    "class",
    "card-image waves-effect waves-block waves-light"
  );

  let image = document.createElement("img");
  image.setAttribute("class", "activator");
  image.setAttribute("src", `${array[i].urlToImage}`);
  // append
  imgDiv.appendChild(image);

  contentDiv = document.createElement("div");
  contentDiv.setAttribute("class", "card-content");

  let titleSpan = document.createElement("span");
  titleSpan.setAttribute(
    "class",
    "card-title activator grey-text text-darken-4"
  );
  titleSpan.innerHTML = array[i].title;
  titleSpan.style.fontSize = "15px";
  titleSpan.style.lineHeight = "25px";

  let icon = document.createElement("i");
  icon.setAttribute("class", "material-icons right");
  icon.innerHTML = "more_vert";
  // append
  titleSpan.appendChild(icon);

  let linkDiv = document.createElement("div");
  linkDiv.setAttribute("class", "card-action light-blue darken-4");
  let link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", `${array[i].url}`);
  link.setAttribute("class", "lime-text text-accent-1");
  link.innerHTML = "Source";
  // append
  linkDiv.appendChild(link);

  // append
  contentDiv.appendChild(titleSpan);
  // contentDiv.appendChild();

  revealDiv = document.createElement("div");
  revealDiv.setAttribute("class", "card-reveal");

  revealSpan = document.createElement("span");
  revealSpan.setAttribute("class", "card-title grey-text text-darken-4");
  revealSpan.innerHTML = array[i].title;

  revealSpan.style.fontSize = "18px";

  revealIcon = document.createElement("i");
  revealIcon.setAttribute("class", "material-icons right");
  revealIcon.innerHTML = "close";

  revealPara = document.createElement("p");
  revealPara.innerHTML = array[i].description;

  revealDiv.appendChild(revealSpan);
  revealSpan.appendChild(revealIcon);
  revealDiv.appendChild(revealPara);

  card.appendChild(imgDiv);
  card.appendChild(contentDiv);
  card.appendChild(linkDiv);
  card.appendChild(revealDiv);
  cardSize.appendChild(card);
  parentContainer.appendChild(cardSize);
}

// Map display
function mapUI() {
  let traffic = document.getElementById("map");
  traffic.style.width = "600px";
  traffic.style.height = "300px";
}

// Generating Weather Cards Function
function weatherUI(array) {
  let weatherCard1 = document.createElement("h4");
  document.querySelector(".weather1").appendChild(weatherCard1);
  weatherCard1.innerHTML = `${array.name}, ${tempConversion(
    array.main.temp
  )}F, ${array.weather[0].main}`;

  let weatherCard2 = document.createElement("p");
  document.querySelector(".weather1").appendChild(weatherCard2);
  weatherCard2.innerHTML = `Humidity: ${array.main.humidity}, wind speeds: ${
    array.wind.speed
  }, Temp Low:${tempConversion(
    array.main.temp_min
  )}, Temp High:${tempConversion(array.main.temp_max)}`;
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
