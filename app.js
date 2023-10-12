const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const city = req.body.cityName;
    console.log(city);
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=de200a21320d7b1dd02450f142f8671a&units=metric";

    https.get(url, (response) => {
        let data = '';

        response.on("data", function (chunk) {
            data += chunk;
        });

        response.on("end", function () {
            try {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const pressure = weatherData.main.pressure;
                const name = weatherData.name;
                const speed = weatherData.wind.speed;
                const descp = weatherData.weather[0].description;
                console.log("Weather data retrieved");
                const renderData = {
                    name: name,
                    temp: temp,
                    speed: speed,
                    humidity: humidity,
                    pressure: pressure,
                    descp: descp
                };
                res.render("weatherDetail", {renderData: renderData});
            } catch (error) {
                console.error("Error parsing weather data: " + error);
                res.send("Error retrieving weather data");
            }
        });
    });

});

app.listen(3000, function (req, res) {
    console.log("App is running on port 3000");
});

// main.humidity
// name
// weather[0].description
// main.pressure