const form = document.querySelector(".header form");
const input = document.querySelector(".header form input");
const msg = document.querySelector(".header form .msg");
const cities = document.querySelector(".main-section .cities");

form.addEventListener("submit", function(event) {
  event.preventDefault();
  let inputValue = input.value;
  if (inputValue.trim() !== "") {
    const citiesList = cities.querySelectorAll(".city");
    const citiesArray = Array.from(citiesList);
    console.log(this);
    getWeatherByCity(input.value);

    form.reset();
    input.focus();
    msg.textContent = "";
  } else {
    msg.textContent = "Please input City Name";
  }
});

function getWeatherByCity(query) {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`;
  fetch(api)
    .then(res => res.json())
    .then(data => displayCity(data))
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });
}
function displayCity(cityData) {
  const { main, name, sys, weather } = cityData;
  const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;
  const li = document.querySelector(".city");
  if (!li) {
    const li = document.createElement("li");
    li.classList.add("city");

    const html = `
  <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
      weather[0]["description"]
    }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
    li.innerHTML = html;
    cities.appendChild(li);
  } else {
    const html = `
    <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <figure>
            <img class="city-icon" src="${icon}" alt="${
      weather[0]["description"]
    }">
            <figcaption>${weather[0]["description"]}</figcaption>
          </figure>
        `;
    li.innerHTML = html;
  }
}
