import { async } from "regenerator-runtime/runtime";
import "regenerator-runtime/runtime";
const getCountryISO2 = require("country-iso-3-to-2");
var map = L.map("map", {
  center: [25, 10],
  zoom: 2,
  minZoom: 2,
  maxZoom: 5,
  dragging: true,
  doubleClickZoom: false,
}).setView([25, 10], 2);
var crg = require("country-reverse-geocoding").country_reverse_geocoding();

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.geoJSON(geojsonFeature, {
  style: function () {
    return {
      color: "black",
      opacity: 1,
      weight: 1,
      fillOpacity: 1,
    };
  },
}).addTo(map);
const state = {
  data: [],
  infected: [],
};

var filtertedgeo = geojsonFeature.features.filter((el) => el.geometry !== null);

const path = Array.from(document.querySelectorAll("path"));

for (let i = 0; i < path.length; i++) {
  const element = path[i];
  const element2 = filtertedgeo[i].properties.ADMIN;
  const elementISO2 = filtertedgeo[i].properties.ISO_A2;
  element.setAttribute("id", element2);
  element.setAttribute("data-code", elementISO2);
}
const getData = async function () {
  try {
    const data2 = await fetch("https://corona-api.com/countries");

    const yea = await data2.json();
    yea.data.forEach((el) => {
      state.data.push(el);
    });
  } catch (error) {
    console.log(error);
  }
};
getData();
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const deadNum = document.querySelector(".data__card--dead-number");
const recoveredNum = document.querySelector(".data__card--recovered-number");
const criticalNum = document.querySelector(".data__card--critical-number");
const confirmedNum = document.querySelector(".data__card--confirmed-number");
const countriesTable = document.querySelector(".countries__table");
setTimeout(() => {
  for (let i = 0; i < state.data.length; i++) {
    const element = state.data[i];
    state.infected.push(element.name);
  }
  //get the world data of the infected, active and so on and display it ot the screen
  let sumDeaths = 0;
  let sumCritical = 0;
  let sumRecovered = 0;
  let sumConfirmed = 0;
  for (let i = 0; i < state.data.length; i++) {
    const element = state.data[i];

    sumRecovered += element.latest_data.recovered;
    sumDeaths += element.latest_data.deaths;
    sumConfirmed += element.latest_data.confirmed;
    sumCritical += element.latest_data.critical;
  }

  deadNum.textContent = numberWithCommas(sumDeaths);
  recoveredNum.textContent = numberWithCommas(sumRecovered);
  criticalNum.textContent = numberWithCommas(sumCritical);
  confirmedNum.textContent = numberWithCommas(sumConfirmed);

  // path.forEach((el) => (el.style.fill = "black"));
  //add countrie codes to the path

  // var country = crg.get_country(e.latlng.lat, e.latlng.lng);
  // console.log(country.name);
  for (let i = 0; i < path.length; i++) {
    const element = path[i];
    const foundCountry = state.data.find(
      (el) => el.code === element.getAttribute("data-code")
    );
    if (foundCountry === undefined) {
      continue;
    }
    element.setAttribute(
      "data-deathRate",
      foundCountry.latest_data.calculated.death_rate
    );
  }

  //give the path fill color based on the death rate
  for (let i = 0; i < path.length; i++) {
    const element = path[i];
    let colorDeathRate = Number(element.getAttribute("data-deathRate"));
    if (
      (colorDeathRate >= 0 && colorDeathRate < 0.5) ||
      colorDeathRate == null
    ) {
      element.style.fill = "#fcefba";
    } else if (colorDeathRate >= 0.5 && colorDeathRate < 1) {
      element.style.fill = "#fbe19c";
    } else if (colorDeathRate >= 1 && colorDeathRate < 1.5) {
      element.style.fill = "#fbc67f";
    } else if (colorDeathRate >= 1.5 && colorDeathRate < 2) {
      element.style.fill = "#fbac74";
    } else if (colorDeathRate >= 2 && colorDeathRate < 2.5) {
      element.style.fill = "#fa8067";
    } else if (colorDeathRate >= 2.5 && colorDeathRate < 3) {
      element.style.fill = "#e85c5e";
    } else if (colorDeathRate >= 3 && colorDeathRate < 3.5) {
      element.style.fill = "#ce4a65";
    } else if (colorDeathRate >= 3.5 && colorDeathRate < 4) {
      element.style.fill = "#a34a65";
    } else if (colorDeathRate >= 4) {
      element.style.fill = "#641b31";
    }
  }

  function countriesTableFunc() {
    let html = state.data.map((el) => {
      return `<div class="countries__card countries__card--input">
  <div class="country__name"><span class="country__span country__span-name">${
    el.name
  }</span></div>
  <div class="country__deathRate"><span class="country__span country__span-deathRate">${
    Number(el.latest_data.calculated.death_rate).toFixed(3) || 0
  }</span></div>
  <div class="country__infected"><span class="country__span country__span-infected">${
    el.latest_data.confirmed
  }</span></div>
  <div class="country__dead"><span class="country__span country__span-dead">${
    el.latest_data.deaths
  }</span></div>
  <div class="country__critical"><span class="country__span country__span-critical">${
    el.latest_data.critical
  }</span></div>
  <div class="country__confirmed"><span class="country__span country__span-recovered">${
    el.latest_data.recovered
  }</span></div>
</div>`;
    });

    const yea = html.join("");
    countriesTable.insertAdjacentHTML("beforeend", yea);
  }
  countriesTableFunc();
  // element.insertAdjacentHTML(position, text);
}, 140);
//data from corona tracek

//click event ==> when clicked please show the infected
const whereFrom = document.querySelector(".data__whereFrom");
map.addEventListener("click", function (e) {
  var country = crg.get_country(e.latlng.lat, e.latlng.lng);
  const countryCode = getCountryISO2(country.code);
  const countryFoundInArray = state.data.find((el) => el.code === countryCode);
  console.log(countryFoundInArray);
  whereFrom.textContent = countryFoundInArray.name;
  deadNum.textContent = numberWithCommas(
    countryFoundInArray.latest_data.deaths
  );
  recoveredNum.textContent = numberWithCommas(
    countryFoundInArray.latest_data.recovered
  );
  criticalNum.textContent = numberWithCommas(
    countryFoundInArray.latest_data.critical
  );
  confirmedNum.textContent = numberWithCommas(
    countryFoundInArray.latest_data.confirmed
  );
});

//table loading

const filterName = document.querySelector(".country__name--filter")
  .parentElement;

filterName.addEventListener("click", function (e) {
  console.log();
});
