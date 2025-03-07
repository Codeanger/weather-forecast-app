const apiKey = "388a4d10295c9cb7f32dc8395bc9edff";

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
            () => fetchWeather("Delhi")
        );
    } else {
        fetchWeather("Delhi");
    }
};

function fetchWeather() {
    let city = document.getElementById("cityInput").value || "Delhi";
    fetchWeatherByCity(city);
}

function fetchWeatherByCoords(lat, lon) {
    fetchWeatherData(`lat=${lat}&lon=${lon}`);
}

function fetchWeatherByCity(city) {
    fetchWeatherData(`q=${city}`);
}

function fetchWeatherData(query) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(data);
        display7DayForecast(data);
    })
    .catch(error => console.error("Error fetching weather:", error));
}

function displayCurrentWeather(data) {
    document.getElementById("cityName").innerText = data.city.name;
    document.getElementById("temperature").innerText = `${data.list[0].main.temp}°C`;
    document.getElementById("humidity").innerText = `${data.list[0].main.humidity}%`;
    document.getElementById("windSpeed").innerText = `${data.list[0].wind.speed} m/s`;
    document.getElementById("pressure").innerText = `${data.list[0].main.pressure} hPa`;
    document.getElementById("condition").innerText = data.list[0].weather[0].description;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
}

function display7DayForecast(data) {
    let forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";
    let dailyForecast = {};

    data.list.forEach((entry) => {
        let date = new Date(entry.dt * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                temp: entry.main.temp,
                humidity: entry.main.humidity,
                icon: entry.weather[0].icon,
                description: entry.weather[0].description
            };
        }
    });

    Object.keys(dailyForecast).slice(0, 7).forEach((date) => {
        let day = dailyForecast[date];
        let forecastItem = `
            <div class="forecast-item">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
                <p>${day.temp}°C</p>
                <p>💧 ${day.humidity}%</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastItem;
    });
}

function updateDateTime() {
    let now = new Date();
    let formattedDateTime = now.toLocaleString("en-US", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit", 
        hour12: true 
    }); 
    document.getElementById("date-time").textContent = formattedDateTime;
}

// Call function on page load
updateDateTime();

// Update every second
setInterval(updateDateTime, 1000);

document.querySelectorAll(".forecast-item img").forEach(img => {
    img.style.width = "40px"; // Adjust size for all forecast icons
});
