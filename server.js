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

app.get('/my-weather', async (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    try {
        const api_response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}.34&lon=${longitude}.99&appid=${process.env.WEATHER_API_KEY}`);
        const dataObj = await api_response.json();

        res.dataObj;
    } catch (err) {
        console.log(err);
    }
});