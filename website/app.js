/* Global Variables */
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");

const entryHolder = document.getElementById("entryHolder");
const dateDisplayer = document.getElementById("date");
const tempDisplayer = document.getElementById("temp");
const contentDisplayer = document.getElementById("content");

const generate = document.getElementById("generate");

fetch('/recent-weather').then(data => {
    console.log(data);
    const {temp, date, feelings} = data;

    dateDisplayer.innerText = "Date: " + date;
    tempDisplayer.innerText = "Temp: " + temp;
    contentDisplayer.innerText = "Feelings: " + feelings;
});


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


// Listener functions
const generateListener = async (event) => {
    event.preventDefault();

    // client-side simple input validation:
    if (zip.value && zip.value.length > 0 && feelings.value && feelings.value.length > 0) {
        let userData = {
            userZip: zip.value,
            feelings: feelings.value,
            date: newDate
        }

        try {     
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

            const data = await addingEntryResponse.json();
            const {temp, feelings, date} = data;

            userData.temp = temp;
            
            dateDisplayer.innerText = "Date: " + date;
            tempDisplayer.innerText = "Temp: " + temp;
            contentDisplayer.innerText = "Feelings: " + feelings;
        }
        catch (error) {
            console.log(error);
        }
    } else {
        alert("Please fill in both the zip code and feelings entries.");
    }
}


// Listening to generate button for click event
generate.addEventListener('click', generateListener)