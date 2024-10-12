const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load the API key from .env file

const app = express();
const port = 3000;

// Middleware to parse form data (POST data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route to display a simple form with improved design
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <style>
                body {
                    background-color: #f0f8ff;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    text-align: center;
                    background-color: #ffffff;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                form {
                    margin-top: 20px;
                }
                label {
                    font-size: 18px;
                    color: #555;
                }
                input {
                    padding: 10px;
                    font-size: 16px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    margin-top: 10px;
                    width: 80%;
                    margin-bottom: 20px;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
                a {
                    text-decoration: none;
                    color: #007bff;
                    display: block;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Weather App</h1>
                <form action="/weather" method="post">
                    <label for="city">Enter city:</label><br>
                    <input type="text" id="city" name="city" required><br>
                    <button type="submit">Get Weather</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// Route to handle the weather fetching with styling
app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const apiKey = process.env.API_KEY; // Retrieve API key from environment variables

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(weatherUrl);
        const weather = response.data;

        // Extracting required data from the response
        const description = weather.weather[0].description;
        const temperature = weather.main.temp;

        res.send(`
            <html>
            <head>
                <style>
                    body {
                        background-color: #f0f8ff;
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        background-color: #ffffff;
                        border-radius: 15px;
                        padding: 30px;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        font-size: 18px;
                        color: #555;
                    }
                    a {
                        text-decoration: none;
                        color: #007bff;
                        display: block;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Weather in ${city}</h1>
                    <p>${description}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <a href="/">Check another city</a>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        if (error.response) {
            // Log detailed API response error
            console.error("API Response Error:", error.response.data);
            res.send(`
                <html>
                <head>
                    <style>
                        body {
                            background-color: #f0f8ff;
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container {
                            text-align: center;
                            background-color: #ffffff;
                            border-radius: 15px;
                            padding: 30px;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                        }
                        p {
                            font-size: 18px;
                            color: #ff5555;
                        }
                        a {
                            text-decoration: none;
                            color: #007bff;
                            display: block;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <p>API Error: ${error.response.data.message}</p>
                        <a href="/">Go back</a>
                    </div>
                </body>
                </html>
            `);
        } else {
            res.send(`<p>Error fetching weather for ${city}. Please try again.</p><a href="/">Go back</a>`);
        }
    }
});

app.listen(port, () => {
    console.log(`Weather app listening at http://localhost:${port}`);
});



