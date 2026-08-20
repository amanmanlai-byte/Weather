// Weather Dashboard - Main Script
// Uses Open-Meteo API (free, no API key required)

const API_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const mainWeather = document.getElementById('mainWeather');
const hourlySection = document.getElementById('hourlySection');
const dailySection = document.getElementById('dailySection');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// WMO Weather Code Interpretation
const weatherCodes = {
    0: { desc: 'Clear sky', icon: 'fas fa-sun' },
    1: { desc: 'Mainly clear', icon: 'fas fa-cloud-sun' },
    2: { desc: 'Partly cloudy', icon: 'fas fa-cloud' },
    3: { desc: 'Overcast', icon: 'fas fa-cloud' },
    45: { desc: 'Foggy', icon: 'fas fa-smog' },
    48: { desc: 'Depositing rime fog', icon: 'fas fa-smog' },
    51: { desc: 'Light drizzle', icon: 'fas fa-cloud-rain' },
    53: { desc: 'Moderate drizzle', icon: 'fas fa-cloud-rain' },
    55: { desc: 'Dense drizzle', icon: 'fas fa-cloud-rain' },
    61: { desc: 'Slight rain', icon: 'fas fa-cloud-rain' },
    63: { desc: 'Moderate rain', icon: 'fas fa-cloud-rain' },
    65: { desc: 'Heavy rain', icon: 'fas fa-cloud-showers-heavy' },
    71: { desc: 'Slight snow', icon: 'fas fa-snowflake' },
    73: { desc: 'Moderate snow', icon: 'fas fa-snowflake' },
    75: { desc: 'Heavy snow', icon: 'fas fa-snowflake' },
    77: { desc: 'Snow grains', icon: 'fas fa-snowflake' },
    80: { desc: 'Slight rain showers', icon: 'fas fa-cloud-rain' },
    81: { desc: 'Moderate rain showers', icon: 'fas fa-cloud-showers-heavy' },
    82: { desc: 'Violent rain showers', icon: 'fas fa-cloud-showers-heavy' },
    85: { desc: 'Slight snow showers', icon: 'fas fa-snowflake' },
    86: { desc: 'Heavy snow showers', icon: 'fas fa-snowflake' },
    95: { desc: 'Thunderstorm', icon: 'fas fa-bolt' },
    96: { desc: 'Thunderstorm with hail', icon: 'fas fa-bolt' },
    99: { desc: 'Thunderstorm with hail', icon: 'fas fa-bolt' }
};

// Search for city coordinates
async function searchCity(cityName) {
    try {
        const response = await fetch(
            `${GEOCODING_API}/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }

        return data.results[0];
    } catch (error) {
        throw new Error(`Failed to find city: ${error.message}`);
    }
}

// Fetch weather data
async function fetchWeather(latitude, longitude) {
    try {
        const response = await fetch(
            `${API_BASE}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility,pressure_msl,uv_index&hourly=temperature_2m,weather_code,relative_humidity_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Weather fetch failed: ${error.message}`);
    }
}

// Handle search
async function handleSearch() {
    const city = searchInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    await loadWeather(city);
}

// Main weather loading function
async function loadWeather(cityName) {
    try {
        showLoading(true);
        hideError();
        hideAllWeather();

        // Get city coordinates
        const cityData = await searchCity(cityName);
        const { latitude, longitude, name, country, admin1 } = cityData;

        // Fetch weather data
        const weatherData = await fetchWeather(latitude, longitude);

        // Display results
        displayCurrentWeather(weatherData, name, country, admin1);
        displayHourlyForecast(weatherData);
        displayDailyForecast(weatherData);

        showLoading(false);
        mainWeather.classList.remove('hidden');
        hourlySection.classList.remove('hidden');
        dailySection.classList.remove('hidden');
    } catch (error) {
        showLoading(false);
        showError(error.message);
    }
}

// Display current weather
function displayCurrentWeather(data, cityName, country, admin1) {
    const current = data.current;
    const timezone = data.timezone;

    // Update location
    document.getElementById('cityName').textContent = `${cityName}, ${admin1 || country}`;
    
    // Update date/time
    const now = new Date();
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update temperature
    document.getElementById('temperature').textContent = Math.round(current.temperature_2m);

    // Update weather icon and description
    const weatherInfo = weatherCodes[current.weather_code] || { desc: 'Unknown', icon: 'fas fa-question' };
    document.getElementById('weatherIcon').className = weatherInfo.icon;
    document.getElementById('weatherDescription').textContent = weatherInfo.desc;

    // Update details
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} mb`;
    document.getElementById('feelsLike').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById('uvIndex').textContent = getUVIndex(current.uv_index);
}

// Get UV Index description
function getUVIndex(index) {
    if (index < 2) return `${index} (Low)`;
    if (index < 5) return `${index} (Moderate)`;
    if (index < 7) return `${index} (High)`;
    if (index < 10) return `${index} (Very High)`;
    return `${index} (Extreme)`;
}

// Display hourly forecast
function displayHourlyForecast(data) {
    const hourly = data.hourly;
    const times = hourly.time;
    const temps = hourly.temperature_2m;
    const codes = hourly.weather_code;
    const humidity = hourly.relative_humidity_2m;
    const precipitation = hourly.precipitation_probability;

    const forecastContainer = document.getElementById('hourlyForecast');
    forecastContainer.innerHTML = '';

    // Show next 24 hours
    for (let i = 0; i < 24; i++) {
        const time = new Date(times[i]);
        const hour = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const weatherInfo = weatherCodes[codes[i]] || { desc: 'Unknown', icon: 'fas fa-question' };

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-time">${hour}</div>
            <i class="forecast-icon ${weatherInfo.icon}"></i>
            <div class="forecast-temp">${Math.round(temps[i])}°C</div>
            <div class="forecast-desc">${weatherInfo.desc}</div>
            <div class="forecast-details">
                💧 ${humidity[i]}% | ☔ ${precipitation[i]}%
            </div>
        `;
        forecastContainer.appendChild(card);
    }
}

// Display daily forecast
function displayDailyForecast(data) {
    const daily = data.daily;
    const dates = daily.time;
    const tempMax = daily.temperature_2m_max;
    const tempMin = daily.temperature_2m_min;
    const codes = daily.weather_code;
    const windSpeed = daily.wind_speed_10m_max;
    const precipitation = daily.precipitation_sum;

    const forecastContainer = document.getElementById('dailyForecast');
    forecastContainer.innerHTML = '';

    // Show 7 days
    for (let i = 0; i < Math.min(7, dates.length); i++) {
        const date = new Date(dates[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const weatherInfo = weatherCodes[codes[i]] || { desc: 'Unknown', icon: 'fas fa-question' };

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-time">${dayName}</div>
            <i class="forecast-icon ${weatherInfo.icon}"></i>
            <div class="forecast-temp">${Math.round(tempMax[i])}° / ${Math.round(tempMin[i])}°</div>
            <div class="forecast-desc">${weatherInfo.desc}</div>
            <div class="forecast-details">
                💨 ${Math.round(windSpeed[i])} km/h | 💧 ${Math.round(precipitation[i])} mm
            </div>
        `;
        forecastContainer.appendChild(card);
    }
}

// Utility functions
function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = `❌ ${message}`;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function hideAllWeather() {
    mainWeather.classList.add('hidden');
    hourlySection.classList.add('hidden');
    dailySection.classList.add('hidden');
}

// Load default city on page load
window.addEventListener('load', () => {
    loadWeather('London');
});