let myMap;
let myData;

function preload() {
    myData = loadJSON('/checkins')
}

function setup() {
    noCanvas();
    // console.log(myData);
    let latestLocation = myData[0].location

    // create a leaflet map instance and using the "map" id set in your index.html
    myMap = L.map('map')
            .setView([latestLocation.lat, latestLocation.lon], 10);
    // add your openstreetmap layer to your myMap variable
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
    tiles.addTo(myMap);


    noLoop();
}


function draw() {

    // for each item in myData, create a circle with a popup
    for (let p in myData) {
        let item = myData[p];
        let location = item.location
        let weather = item.weather;
        let pollution = item.pollution;

        // add a circle to the myMap variable
        // let currentCircle = L.circle([location.lat, location.lon], 700, {
        //     color: "red"
        // }).addTo(myMap);
        let currentCircle = L.marker([location.lat, location.lon]).addTo(myMap);

        // add some popup text
        let popUpText = `I'm sitting out here on this ${weather.current.skytext} ${weather.current.day} and it feels like ${weather.current.feelslike}℃ outside.`;
        
        if(pollution.results.length>0){
            popUpText += `\nThe concentration of small carcinogenic particles (pm2.5) I'm breathing in is ${pollution.results[0].measurements[0].value}${pollution.results[0].measurements[0].unit}`
            popUpText += `\nmeasured from ${pollution.results[0].city} at ${pollution.results[0].location}.`
        }
        
        currentCircle.bindPopup(popUpText)
    }
}