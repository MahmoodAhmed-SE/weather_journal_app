// requiring dotenv to configure .env with the node application so that we keep our api keys private.
require('dotenv').config();

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8080;
const server = app.listen(port, () => console.log(`Server is up and running on port ${port}`));


const getRecentWeather = (req, res) => {
    console.log(projectData);
    if (projectData.temp) {
        res.send(JSON.stringify(projectData));
    }
}

// Async callback function to save client details server-side
const postNewEntry = async (req, res) => {
    const userZip = req.body.userZip;
    const feelings = req.body.feelings;
    const date = req.body.date;

    // server-side simple input validation:
    if (userZip && userZip.length > 0 && feelings && feelings.length > 0 && date && date.length > 0) {
        try {
            const weatherData = await getWeatherDetails(userZip);
            const { temp } = weatherData.main;

            projectData = {
                userZip,
                feelings,
                temp,
                date
            }

            res.send(JSON.stringify(projectData));
        } catch (err) {
            res.status(400);
        }
    } else {
        res.status(400);
    }
}


// Async callback function to get the weather details of given zip code
const getWeatherDetails = async (userZip) => {
    try {
        const api_response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${userZip}&appid=${process.env.WEATHER_API_KEY}&units=imperial`);
        const dataObj = await api_response.json();

        return dataObj;
    } catch (err) {
        throw err;
    }
}

// Http requests
app.get('/recent-weather', getRecentWeather);
app.post('/add-entry', postNewEntry);
