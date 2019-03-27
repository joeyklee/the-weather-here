require('dotenv').config();
module.exports = {
    PORT: process.env.PORT || 3030,
    USERNAME: process.env.USERNAME,
    PASSWORD:process.env.PASSWORD,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/the_weather_here'
}