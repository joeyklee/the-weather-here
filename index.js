const express = require('express');
const logger = require('morgan');
const path = require('path');
const http = require('http');
const port = process.env.PORT || 3030;
const Datastore = require('nedb');
const pathToData = path.resolve(__dirname, "db/db")
const db = new Datastore({ filename: pathToData});
db.loadDatabase();

// allow us to use "fetch()" on the server
require('es6-promise').polyfill();
require('isomorphic-fetch');

// our 3rd party apis we want to query
const weather = require('weather-js');

const app = express()

// add logging middleware
app.use(logger("dev"))

// Handling JSON data 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// set the path to the public assets
const publicPath = path.resolve(__dirname, 'public')
app.use( express.static(publicPath))

// Show index.html
app.get("/", (req, res) => {
    res.sendFile('index.html')
});


// Show submission page
app.get("/weather/:lat/:lng", (req, res) => {
    let latlng = `${req.params.lat},${req.params.lng}`

    let searchOptions = {
        search: latlng, 
        degreeType: 'C'
    }
    
    weather.find(searchOptions, function(err, result) {
        if(err) console.log(err);
        console.log(JSON.stringify(result, null, 2));
        // we get back an array, so we only send the first value
        res.send(result[0]);
      });
    
});


// send all the checkins to this endpoint
app.get("/checkins", (req, res) => {
    db.find({}).sort({created:-1}).exec( (err, docs) => {
        res.send(docs);
    })
});


// when navigating to this route, give me the map view
app.get("/checkin", (req, res) => {
    res.sendFile('/checkin/index.html')
});


// accept a payload to this checkin post endpoint
app.post("/checkin", (req, res) => {

    // our unix timestamp
    const unixTimeCreated = new Date().getTime();
    
    // add our unix time as a "created" property and add it to our request.body
    // we receive the location data from the client in the req.body
    const newData = Object.assign({"created": unixTimeCreated}, req.body)

    // QUERY THE OPEN AQ PLATFORM FOR AIR QUALITY DATA
    const searchDistance = 10000; // meters == 10km
    let openAQUrl = `https://api.openaq.org/v1/latest?coordinates=${req.body.location.lat},${req.body.location.lon}&nearest=${searchDistance}`

    fetch(openAQUrl)
        .then(result =>{
            return result.json();
        }).then(result => {
            // add the pollution data to our newData
            // console.log(result)
            newData.pollution = result;

            // insert the data into our db
            db.insert(newData, (err, docs) =>{
                if(err){return err;}
                res.send(docs);
            });

        }).catch(err => {
            return err;
        });
});


http.createServer(app).listen(port, ()=>{
    console.log(`see the magic at: http://localhost:${port}`);
})
