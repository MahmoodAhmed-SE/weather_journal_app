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
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();


// Listener Functions

const getRecentWeatherListener = async (e) => {
    const response = await fetch('/recent-weather');
    try {
        const dataObj = await response.json();

        const { temp, date, feelings } = dataObj;

        dateDisplayer.innerText = "Date: " + date;
        tempDisplayer.innerText = "Temp: " + temp;
        contentDisplayer.innerText = "Feelings: " + feelings;
    } catch (err) {
        console.log("Error: ", err);
    }
}

const generateListener = async (event) => {
    event.preventDefault();

    // client-side simple input validation:
    if (zip.value && zip.value.length > 0 && feelings.value && feelings.value.length > 0) {
        let userData = {
            userZip: zip.value,
            feelings: feelings.value,
            date: newDate
        }

        const addingEntryResponse = await fetch("/add-entry", {
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

        try {
            const data = await addingEntryResponse.json();

            if (data.message == "city not found") {
                throw new Error(data.message);
            }

            const { temp, feelings, date } = data;

            userData.temp = temp;

            dateDisplayer.innerText = "Date: " + date;
            tempDisplayer.innerText = "Temp: " + temp;
            contentDisplayer.innerText = "Feelings: " + feelings;
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
window.addEventListener("DOMContentLoaded", getRecentWeatherListener);

// Listening to generate button for click event
generate.addEventListener('click', generateListener)

