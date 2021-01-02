import "regenerator-runtime/runtime";
var map = L.map("map", {
  center: [25, 10],
  zoom: 2,
  dragging: false,
  doubleClickZoom: false,
}).setView([25, 10], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
L.geoJSON(geojsonFeature).addTo(map);

console.log(geojsonFeature);

const data = geojsonFeature.features[0].properties.CNTRY_NAME;
console.log(data);
const names = [];
for (let i = 0; i < geojsonFeature.features.length; i++) {
  const element = geojsonFeature.features[i].properties.CNTRY_NAME;
  names.push(element);
}
console.log(names);
