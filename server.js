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

    if (!projectData.temp || !projectData.content || !projectData.userZip || !projectData.date) {
        res.json({message: "empty object"});
        return;
    } 

    res.json(projectData); 
}

// Async callback function to save client details on server
const postEntry = async (req, res) => {
    const { userZip, content, temp, date } = req.body;

    // server-side simple input validation:
    if (!userZip || !content || !temp || !date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    projectData = {
        userZip,
        content,
        date,
        temp
    }

    res.status(200).json({ message: "Entry has been saved." });
}



// Http requests
app.get('/all', getRecentWeather);
app.post('/add-entry', postEntry);