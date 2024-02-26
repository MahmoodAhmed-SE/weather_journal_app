// open weather map api 
const WEATHER_API_KEY = `&appid=${'de42e12e6684894b921f6fd4c1bee467'}&units=imperial`;


/* Global Variables */
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");

const entryHolder = document.getElementById("entryHolder");
const dateDisplayer = document.getElementById("date");
const tempDisplayer = document.getElementById("temp");
const contentDisplayer = document.getElementById("content");

const generate = document.getElementById("generate");


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()


// Async callback function to get the weather details of given zip code
const getWeatherDetails = async (userZip) => {
    const apiResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${userZip}${WEATHER_API_KEY}`);
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

//Function to update user interface 
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        if (allData.message == "empty object") return;

        dateDisplayer.innerText = "Date: " + allData.date;
        tempDisplayer.innerText = "Temp: " + Math.round(allData.temp) + ' degrees';
        contentDisplayer.innerText = "Content: " + allData.content;

    } catch (error) {
        console.log("error", error);
    }
}

// Listener Functions

const generateButtonListener = async (event) => {
    event.preventDefault();

    // client-side simple input validation:
    if (zip.value && zip.value.length > 0 && feelings.value && feelings.value.length > 0) {
        try {
            const weatherDetails = await getWeatherDetails(zip.value);

            const userData = {
                userZip: zip.value,
                content: feelings.value,
                temp: weatherDetails.main.temp,
                date: newDate
            }

            const o = await fetch("/add-entry", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(userData)
            });


            updateUI();
        }
        catch (error) {
            if (error.message == "city not found") {
                alert("No city found with given zip code. Please enter a valid zip code.");
            }
        }

    } else {
        alert("Please fill in both the zip code and feelings entries correctly.");
    }
}

// Listening to window for DOMContentLoaded event
window.addEventListener("DOMContentLoaded", () => updateUI());

// Listening to generate button for click event
generate.addEventListener('click', generateButtonListener)