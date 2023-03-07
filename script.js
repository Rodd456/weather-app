const fetchButton = document.getElementById('fetch-button'); // search button
const APIKey = "40bcaaa35107714c20e64a354fa90a20";
let city;
const previousCities = JSON.parse(localStorage.getItem("search")) || [];
const currentCity = document.getElementById("current-city");
const todaysDate = moment().format("MMMM Do, YYYY");
const temp = document.getElementById("tempEl");
const currentHumidity = $("#humidity");
const windSpeed = $("#windSpeed");
const cityList = document.getElementById("history");
const cardDeck = document.querySelector(".card-deck");

// Get current date from Moment
const dateElement = document.getElementById("current-date");
dateElement.innerHTML = `Today is ${todaysDate}`;

// Display weather when search button is clicked
fetchButton.addEventListener("click", function(event) {
  event.preventDefault();
  city = document.getElementById('city').value;
  displayWeather();
  cityCoordinates();
  document.getElementById('city').value = "";
});

// See city history
function historyCallback(event) {
  city = event.target.textContent;
  displayWeather();
  cityCoordinates();
}

cityList.addEventListener("click", historyCallback);

// Create history buttons from previousCities
previousCities.forEach(city => {
  const btn = document.createElement("button");
  btn.textContent = city;
  cityList.appendChild(btn);
});

// Change temp from Kelvin to Fahrenheit
function kelvinConverter(valNum) {
  valNum = parseFloat(valNum);
  temp.innerHTML = `Temperature: ${Math.floor((valNum - 273.15) * 1.8) + 32}&deg;F`;
}

// Function for today's weather display
function displayWeather() { 
  const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

  fetch(requestURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();   
    })
    .then(data => {
      // ONLY save city when one is valid
      if (data.cod == '200' && !previousCities.includes(city)) {
        previousCities.push(city);       
        localStorage.setItem("search", JSON.stringify(previousCities));
        const btn = document.createElement("button");
        btn.textContent = city;
        cityList.appendChild(btn);
      }

      let citySearched = data.name;
      currentCity.innerHTML = citySearched;
      kelvinConverter(data.main.temp);
      $('.humidity').text(`Humidity: ${data.main.humidity}%`);
      $('#windSpeed').text(`Wind Speed: ${Math.floor(data.wind.speed * 2.237)}MPH`);
      $('.weather-icon').html(`<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" />`);
    })
    .catch(error => {
      console.error("Weather API error: ", error);
    });
}

// Function for five day forecast
function cityCoordinates(cityName) {
    if (typeof cityName !== 'string' || !cityName) {
      throw new Error('Invalid city name');
    }
    
    var apiKey = "YOUR_API_KEY";
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data[0]) {
          throw new Error('Invalid response data');
        }
        var coordinates = {
          latitude: data[0].lat,
          longitude: data[0].lon
        };
        return coordinates;
      })
      .catch(error => {
        console.error(error);
        throw error;
      });
  }
