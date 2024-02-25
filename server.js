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
    res.status(200);

    if (projectData.temp) {
        res.send(JSON.stringify(projectData));
    }
}

// Async callback function to save client details on server
const postEntry = async (req, res) => {
    const userZip = req.body.userZip;
    const feelings = req.body.feelings;
    const date = req.body.date;

    // server-side simple input validation:
    if (!userZip || !feelings || !date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Get weather details through open weather map api
        const weatherData = await getWeatherDetails(userZip);

        // save details into [projectData]
        projectData = {
            userZip,
            feelings,
            temp: weatherData.main.temp,
            date
        }

        res.status(200).json(projectData);
    } catch (err) {
        console.log(err);
        if (err.message == "city not found") {
            res.status(404).json({ message: err.message });
        }
        else res.status(500).json({ message: "Internal server error" });
    }

}


// Async callback function to get the weather details of given zip code
const getWeatherDetails = async (userZip) => {
    const apiResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${userZip}&appid=${process.env.WEATHER_API_KEY}&units=imperial`);
    try {
        const dataObj = await apiResponse.json();

        if (dataObj.message == "city not found") {
            throw new Error("city not found");
        }
        else if (!apiResponse.ok) {
            throw new Error(`Failed to fetch weather data: ${apiResponse.status}`);
        }
        return dataObj;
    } catch (error) {
        throw error;
    }
}



// Http requests
app.get('/recent-weather', getRecentWeather);
app.post('/add-entry', postEntry);