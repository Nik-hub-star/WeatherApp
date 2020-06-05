var WeatherAppController = (function() {
  return {
    async getWeatherByCity(query) {
      try {
        const api = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`;
        const response = await fetch(api);
        let data = await response.json();
        return data;
      } catch (err) {
        return error;
      }
    }
  };
})();

var UIController = (function() {
  var DOMStrings = {
    form: ".header form",
    input: ".header form input",
    msg: ".header form .msg",
    cities: ".main-section .cities"
  };
  return {
    getInput() {
      return {
        form: document.querySelector(DOMStrings.form),
        input: document.querySelector(DOMStrings.input).value,
        msg: document.querySelector(DOMStrings.msg),
        cities: document.querySelector(DOMStrings.cities)
      };
    },
    getDOMStrings() {
      return DOMStrings;
    },
    createHTML(cityData) {
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
        this.getInput().cities.appendChild(li);
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
    },
    createMsg(html) {
      this.getInput().msg.textContent = html;
    }
  };
})();

var Controller = (function(WeatherAppCtrl, UICtrl) {
  // Why function declaration didnt work ?
  var setUpEventListeners = function() {
    // DOM = UICtrl.getInput();
    DOM.form.addEventListener("submit", function(e) {
      e.preventDefault();
      let inputValue = UICtrl.getInput().input;
      if (inputValue.trim() !== "") {
        WeatherAppCtrl.getWeatherByCity(inputValue)
          .then(data => {
            if (data.cod !== "404") {
              UICtrl.createHTML(data);
              DOM.form.reset();
              // DOM.focus();
              UICtrl.createMsg("");
            } else {
              UICtrl.createMsg("Please search for a valid city 😩");
            }
          })
          .catch(err => {
            UICtrl.createMsg("Please search for a valid city 😩");
          });
      } else {
        UICtrl.createMsg("Please input City Name");
      }
    });
  };
  DOM = UICtrl.getInput();

  return {
    init: function() {
      setUpEventListeners();
    }
  };
})(WeatherAppController, UIController);

Controller.init();
