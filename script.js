const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

const weatherCodes = {
    0: { label: 'Clear sky', icon: 'fa-sun', theme: 'clear' },
    1: { label: 'Mainly clear', icon: 'fa-cloud-sun', theme: 'clear' },
    2: { label: 'Partly cloudy', icon: 'fa-cloud-sun', theme: 'cloud' },
    3: { label: 'Overcast', icon: 'fa-cloud', theme: 'cloud' },
    45: { label: 'Foggy', icon: 'fa-smog', theme: 'fog' },
    48: { label: 'Rime fog', icon: 'fa-smog', theme: 'fog' },
    51: { label: 'Light drizzle', icon: 'fa-cloud-rain', theme: 'rain' },
    53: { label: 'Moderate drizzle', icon: 'fa-cloud-rain', theme: 'rain' },
    55: { label: 'Dense drizzle', icon: 'fa-cloud-rain', theme: 'rain' },
    56: { label: 'Freezing drizzle', icon: 'fa-cloud-rain', theme: 'rain' },
    57: { label: 'Freezing drizzle', icon: 'fa-cloud-rain', theme: 'rain' },
    61: { label: 'Light rain', icon: 'fa-cloud-rain', theme: 'rain' },
    63: { label: 'Moderate rain', icon: 'fa-cloud-showers-heavy', theme: 'rain' },
    65: { label: 'Heavy rain', icon: 'fa-cloud-showers-heavy', theme: 'rain' },
    66: { label: 'Freezing rain', icon: 'fa-cloud-rain', theme: 'rain' },
    67: { label: 'Freezing rain', icon: 'fa-cloud-rain', theme: 'rain' },
    71: { label: 'Light snow', icon: 'fa-snowflake', theme: 'snow' },
    73: { label: 'Moderate snow', icon: 'fa-snowflake', theme: 'snow' },
    75: { label: 'Heavy snow', icon: 'fa-snowflake', theme: 'snow' },
    77: { label: 'Snow grains', icon: 'fa-snowflake', theme: 'snow' },
    80: { label: 'Rain showers', icon: 'fa-cloud-rain', theme: 'rain' },
    81: { label: 'Rain showers', icon: 'fa-cloud-showers-heavy', theme: 'rain' },
    82: { label: 'Heavy showers', icon: 'fa-cloud-showers-heavy', theme: 'rain' },
    85: { label: 'Snow showers', icon: 'fa-snowflake', theme: 'snow' },
    86: { label: 'Heavy snow showers', icon: 'fa-snowflake', theme: 'snow' },
    95: { label: 'Thunderstorm', icon: 'fa-bolt', theme: 'storm' },
    96: { label: 'Thunderstorm with hail', icon: 'fa-bolt', theme: 'storm' },
    99: { label: 'Thunderstorm with hail', icon: 'fa-bolt', theme: 'storm' }
};

const elements = {
    form: document.getElementById('searchForm'),
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchBtn'),
    searchResults: document.getElementById('searchResults'),
    loading: document.getElementById('loading'),
    weatherContent: document.getElementById('weatherContent'),
    errorMessage: document.getElementById('errorMessage'),
    statusMessage: document.getElementById('statusMessage'),
    cityName: document.getElementById('cityName'),
    dateTime: document.getElementById('dateTime'),
    temperature: document.getElementById('temperature'),
    weatherDescription: document.getElementById('weatherDescription'),
    weatherIcon: document.getElementById('weatherIcon'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    visibility: document.getElementById('visibility'),
    pressure: document.getElementById('pressure'),
    feelsLike: document.getElementById('feelsLike'),
    uvIndex: document.getElementById('uvIndex'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    timezoneLabel: document.getElementById('timezoneLabel'),
    weatherParticles: document.getElementById('weatherParticles')
};

const weatherCache = new Map();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentOptions = [];
let activeWeatherTheme = 'clear';

function getWeatherMeta(code) {
    return weatherCodes[code] || { label: 'Unknown conditions', icon: 'fa-cloud', theme: 'cloud' };
}

function particleCount(theme) {
    const compactScreen = window.matchMedia('(max-width: 700px)').matches;
    const counts = {
        clear: compactScreen ? 6 : 10,
        cloud: compactScreen ? 4 : 7,
        rain: compactScreen ? 28 : 52,
        snow: compactScreen ? 22 : 42,
        fog: compactScreen ? 4 : 7,
        storm: compactScreen ? 32 : 58
    };
    return counts[theme] || counts.cloud;
}

function createParticle(theme, index) {
    const particle = document.createElement('span');
    const random = (min, max) => min + Math.random() * (max - min);
    const style = particle.style;
    let kind = theme;

    if (theme === 'storm' && index === 0) kind = 'lightning';
    if (theme === 'storm' && index > 0) kind = 'rain';

    particle.className = `weather-particle particle--${kind}`;
    style.setProperty('--left', `${random(-8, 105).toFixed(2)}%`);
    style.setProperty('--top', `${random(-4, 96).toFixed(2)}%`);
    style.setProperty('--delay', `${random(-14, 0).toFixed(2)}s`);
    style.setProperty('--duration', `${random(4.5, 12).toFixed(2)}s`);
    style.setProperty('--drift', `${random(-90, 100).toFixed(0)}px`);
    style.setProperty('--scale', random(0.6, 1.35).toFixed(2));
    style.setProperty('--opacity', random(0.28, 0.9).toFixed(2));
    return particle;
}

function setWeatherAtmosphere(theme) {
    activeWeatherTheme = theme;
    document.body.dataset.weather = theme;
    elements.weatherParticles.replaceChildren();

    if (reducedMotion.matches) return;

    const fragment = document.createDocumentFragment();
    const count = particleCount(theme);
    for (let index = 0; index < count; index += 1) {
        fragment.append(createParticle(theme, index));
    }
    elements.weatherParticles.append(fragment);
}

reducedMotion.addEventListener('change', () => setWeatherAtmosphere(activeWeatherTheme));

function setIcon(iconElement, iconName) {
    iconElement.className = `fa-solid ${iconName}`;
}

function formatNumber(value, suffix = '') {
    return Number.isFinite(value) ? `${Math.round(value)}${suffix}` : '—';
}

function formatUV(value) {
    if (!Number.isFinite(value)) return '—';
    let label = 'Low';
    if (value >= 11) label = 'Extreme';
    else if (value >= 8) label = 'Very high';
    else if (value >= 6) label = 'High';
    else if (value >= 3) label = 'Moderate';
    return `${Math.round(value)} ${label}`;
}

function formatDate(dateTimeString) {
    const date = dateTimeString.slice(0, 10);
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
    }).format(new Date(`${date}T12:00:00Z`));
}

function formatDay(dateString) {
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short', timeZone: 'UTC'
    }).format(new Date(`${dateString}T12:00:00Z`));
}

function formatHour(dateTimeString) {
    const [hour, minute] = dateTimeString.slice(11).split(':').map(Number);
    if (hour === 0 && minute === 0) return '12 AM';
    const suffix = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, '0')}` : ''} ${suffix}`;
}

function locationText(place) {
    const region = place.admin1 || place.country;
    return region ? `${place.name}, ${region}` : place.name;
}

function setLoading(isLoading, message = 'Finding your forecast…') {
    elements.loading.classList.toggle('hidden', !isLoading);
    elements.loading.querySelector('p').textContent = message;
    elements.searchButton.disabled = isLoading;
    elements.searchButton.setAttribute('aria-busy', String(isLoading));
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}

function clearError() {
    elements.errorMessage.classList.add('hidden');
    elements.errorMessage.textContent = '';
}

function showStatus(message) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.remove('hidden');
}

function clearStatus() {
    elements.statusMessage.classList.add('hidden');
    elements.statusMessage.textContent = '';
}

function closeResults() {
    currentOptions = [];
    elements.searchResults.replaceChildren();
    elements.searchResults.classList.add('hidden');
    elements.searchInput.setAttribute('aria-expanded', 'false');
}

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
}

function displayCityOptions(options) {
    currentOptions = options;
    elements.searchResults.replaceChildren();

    options.forEach((place, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'search-option';
        button.setAttribute('role', 'option');
        button.setAttribute('id', `city-option-${index}`);
        button.setAttribute('aria-selected', 'false');

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-location-dot';
        icon.setAttribute('aria-hidden', 'true');

        const copy = document.createElement('span');
        const title = document.createElement('strong');
        title.textContent = place.name;
        const details = document.createElement('span');
        details.textContent = [place.admin1, place.country].filter(Boolean).join(', ') || 'Location';
        copy.append(title, details);
        button.append(icon, copy);
        button.addEventListener('click', () => loadPlace(place));
        elements.searchResults.append(button);
    });

    elements.searchResults.classList.remove('hidden');
    elements.searchInput.setAttribute('aria-expanded', 'true');
}

async function findCities(query) {
    const url = new URL(GEOCODING_API);
    url.search = new URLSearchParams({
        name: query,
        count: '5',
        language: 'en',
        format: 'json'
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error('City search is currently unavailable. Please try again.');
    const payload = await response.json();
    return payload.results || [];
}

async function fetchWeather(place) {
    const cacheKey = `${place.latitude},${place.longitude}`;
    const cached = weatherCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.savedAt < 10 * 60 * 1000) return cached.data;

    const url = new URL(WEATHER_API);
    url.search = new URLSearchParams({
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: 'auto',
        forecast_days: '7',
        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'weather_code',
            'wind_speed_10m',
            'visibility',
            'pressure_msl',
            'uv_index'
        ].join(','),
        hourly: [
            'temperature_2m',
            'weather_code',
            'precipitation_probability'
        ].join(','),
        daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_sum',
            'wind_speed_10m_max',
            'uv_index_max'
        ].join(',')
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data is temporarily unavailable. Please try again.');
    const data = await response.json();
    weatherCache.set(cacheKey, { data, savedAt: now });
    return data;
}

function renderHero(place, data) {
    const current = data.current;
    const meta = getWeatherMeta(current.weather_code);

    elements.cityName.textContent = locationText(place);
    elements.dateTime.textContent = formatDate(current.time);
    elements.temperature.textContent = formatNumber(current.temperature_2m);
    elements.weatherDescription.textContent = meta.label;
    setIcon(elements.weatherIcon, meta.icon);
    elements.humidity.textContent = formatNumber(current.relative_humidity_2m, '%');
    elements.windSpeed.textContent = formatNumber(current.wind_speed_10m, ' km/h');
    elements.visibility.textContent = Number.isFinite(current.visibility) ? `${(current.visibility / 1000).toFixed(1)} km` : '—';
    elements.pressure.textContent = formatNumber(current.pressure_msl, ' hPa');
    elements.feelsLike.textContent = formatNumber(current.apparent_temperature, '°');
    elements.uvIndex.textContent = formatUV(current.uv_index);
    elements.timezoneLabel.textContent = `${data.timezone || 'Local'} time`;
    setWeatherAtmosphere(meta.theme);
}

function createForecastCard({ time, code, temperature, details, isNow = false }) {
    const meta = getWeatherMeta(code);
    const card = document.createElement('article');
    card.className = `forecast-card${isNow ? ' is-now' : ''}`;

    const timeElement = createTextElement('p', 'forecast-time', time);
    const icon = document.createElement('i');
    icon.className = `fa-solid ${meta.icon} forecast-icon`;
    icon.setAttribute('aria-hidden', 'true');
    const temperatureElement = createTextElement('strong', 'forecast-temp', temperature);
    const detailsElement = createTextElement('span', 'forecast-details', details);
    card.append(timeElement, icon, temperatureElement, detailsElement);
    return card;
}

function renderHourly(data) {
    const { hourly, current } = data;
    const firstIndex = hourly.time.findIndex((time) => time >= current.time);
    const startIndex = firstIndex >= 0 ? firstIndex : 0;
    const fragment = document.createDocumentFragment();

    for (let offset = 0; offset < 7; offset += 1) {
        const index = startIndex + offset;
        if (!hourly.time[index]) break;
        const chance = hourly.precipitation_probability[index];
        fragment.append(createForecastCard({
            time: offset === 0 ? 'Now' : formatHour(hourly.time[index]),
            code: hourly.weather_code[index],
            temperature: `${formatNumber(hourly.temperature_2m[index])}°`,
            details: Number.isFinite(chance) ? `${Math.round(chance)}% rain` : 'Forecast',
            isNow: offset === 0
        }));
    }

    elements.hourlyForecast.replaceChildren(fragment);
}

function renderDaily(data) {
    const { daily } = data;
    const fragment = document.createDocumentFragment();

    daily.time.slice(0, 7).forEach((date, index) => {
        const rain = daily.precipitation_sum[index];
        fragment.append(createForecastCard({
            time: index === 0 ? 'Today' : formatDay(date),
            code: daily.weather_code[index],
            temperature: `${formatNumber(daily.temperature_2m_max[index])}° / ${formatNumber(daily.temperature_2m_min[index])}°`,
            details: Number.isFinite(rain) ? `${Math.round(rain)} mm` : 'Forecast'
        }));
    });

    elements.dailyForecast.replaceChildren(fragment);
}

async function loadPlace(place) {
    closeResults();
    clearError();
    clearStatus();
    setLoading(true, `Loading ${place.name}'s forecast…`);

    try {
        const data = await fetchWeather(place);
        renderHero(place, data);
        renderHourly(data);
        renderDaily(data);
        elements.weatherContent.classList.remove('hidden');
        elements.searchInput.value = place.name;
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Unable to load the weather right now.');
    } finally {
        setLoading(false);
    }
}

async function handleSearch(event) {
    event.preventDefault();
    const query = elements.searchInput.value.trim();
    closeResults();
    clearError();

    if (query.length < 2) {
        showError('Enter at least two characters to search for a city.');
        return;
    }

    setLoading(true, 'Searching for cities…');
    try {
        const cities = await findCities(query);
        if (cities.length === 0) {
            showError('No matching city was found. Try adding a country or region.');
            return;
        }

        if (cities.length === 1) {
            await loadPlace(cities[0]);
            return;
        }

        setLoading(false);
        showStatus('Choose the matching city to view its forecast.');
        displayCityOptions(cities);
    } catch (error) {
        showError(error instanceof Error ? error.message : 'Unable to search for a city.');
    } finally {
        setLoading(false);
    }
}

elements.form.addEventListener('submit', handleSearch);
elements.searchInput.addEventListener('input', () => {
    clearError();
    clearStatus();
    if (!elements.searchResults.classList.contains('hidden')) closeResults();
});

document.addEventListener('click', (event) => {
    if (!elements.form.contains(event.target)) closeResults();
});

const defaultPlace = {
    name: 'London',
    admin1: 'England',
    country: 'United Kingdom',
    latitude: 51.5085,
    longitude: -0.1257
};

function bootWeatherDashboard() {
    loadPlace(defaultPlace);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootWeatherDashboard, { once: true });
} else {
    bootWeatherDashboard();
}
