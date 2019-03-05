let submitButton;
let locationData;
let weatherData;

function setup(){
    noCanvas();

    // get the current position and get the weather
    getCurrentPosition(doThisOnLocation)

    // when the button is pressed, submit the data
    submitButton = select("#checkinButton");
    submitButton.mousePressed(handleSubmit);    

    noLoop();
}

/**
 * Handle the submission on button press 
 * @param {*} e - handle submit is an eventHandler therefore we include the 'e' in case we need to access the event properties
 */
function handleSubmit(e){
    let output = {
        location: {},
        weather: weatherData,
    }
    
    output.location.lat = locationData.latitude
    output.location.lon = locationData.longitude
    

    /**
     * MAKE a POST request
     */
    // set the POST request options
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(output)
    }

    // Send the POST request - when completed reroute to the /checkin page
    fetch(`/checkin`, options).then(result => {
        return result.json()
    }).then(result => {
        console.log(result);
        window.location.href = '/checkin';
    }).catch(err => {
        return err;
    })

}

/**
 * When we get the location data, we will:
 * 1. Set the location variable to be sent when we submit our data
 * 2. Get the current weather for those coordinates
 * 3. Update any text that is on the page
 * @param {*} position 
 */
function doThisOnLocation(position){
    locationData = position
    
    console.log(position.latitude, position.longitude)
    
    // the nfc function is a p5 function to round floating type numbers to a set number of decimal places
    select("#lat").html( nfc(position.latitude, 4) )
    select("#lon").html( nfc(position.longitude, 4))

    // make a GET request to our weather-js api
    fetch(`/weather/${position.latitude}/${position.longitude}`).then(result => {
        return result.json();
    }).then(result => {

        weatherData = result;

        select("#skytext").html( result.current.skytext )
        select("#feelslike").html( result.current.feelslike )
    }).catch(err =>{
        return err;
    });
}
