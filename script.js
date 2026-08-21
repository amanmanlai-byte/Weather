const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const DEFAULT_LANGUAGE = 'zh-CN';
const LANGUAGE_STORAGE_KEY = 'weather-dashboard-language';
const THEME_STORAGE_KEY = 'weather-dashboard-theme';
const themeColors = { midnight: '#091a38', ocean: '#0b5965', aurora: '#593e8d', sunset: '#7a3652', forest: '#1c5d4e' };

const locales = {
    'zh-CN': { intl: 'zh-CN', api: 'zh' },
    en: { intl: 'en-GB', api: 'en' },
    ja: { intl: 'ja-JP', api: 'ja' },
    ko: { intl: 'ko-KR', api: 'ko' }
};

const translations = {
    'zh-CN': {
        pageTitle: '天气 — 玻璃预报', description: '由 Open-Meteo 驱动的玻璃拟态天气仪表盘。', brandHome: '天气首页', brand: '天气', languageLabel: '选择语言', themeLabel: '选择主题色', themeMidnight: '午夜蓝', themeOcean: '深海青', themeAurora: '极光紫', themeSunset: '落日暖橙', themeForest: '森林绿', searchLabel: '搜索城市', searchPlaceholder: '搜索城市', searchButton: '搜索', citySuggestions: '城市建议', currentConditions: '当前天气', loading: '正在获取天气预报…', loadingCondition: '加载中', weatherDetails: '天气详情', humidity: '湿度', wind: '风速', visibility: '能见度', pressure: '气压', feelsLike: '体感温度', uvIndex: '紫外线指数', atAGlance: '即时预报', hourlyForecast: '逐小时预报', weekAhead: '未来一周', dailyForecast: '7 天预报', localForecast: '当地预报', dataAttribution: '天气数据由 Open-Meteo 提供', now: '现在', today: '今天', rain: '降水', forecast: '预报', location: '地点', low: '低', moderate: '中等', high: '高', veryHigh: '很高', extreme: '极高', localTime: '{timezone} 当地时间', loadingForecast: '正在加载 {city} 的天气预报…', searchingCities: '正在搜索城市…', citySearchUnavailable: '暂时无法搜索城市，请稍后重试。', weatherUnavailable: '天气数据暂时不可用，请稍后重试。', unableToLoad: '暂时无法加载天气，请稍后重试。', enterTwoCharacters: '请输入至少两个字符以搜索城市。', noMatchingCity: '未找到匹配的城市，请补充国家或地区。', chooseCity: '请选择匹配的城市以查看天气预报。', unableToSearch: '暂时无法搜索城市，请稍后重试。', unitKm: ' 公里', unitKmh: ' 公里/小时', unitHpa: ' 百帕', unitMm: ' 毫米'
    },
    en: {
        pageTitle: 'Weather — Glass Forecast', description: 'A glassmorphism weather dashboard powered by Open-Meteo.', brandHome: 'Weather home', brand: 'Weather', languageLabel: 'Select language', themeLabel: 'Select colour theme', themeMidnight: 'Midnight blue', themeOcean: 'Ocean teal', themeAurora: 'Aurora violet', themeSunset: 'Sunset amber', themeForest: 'Forest green', searchLabel: 'Search for a city', searchPlaceholder: 'Search a city', searchButton: 'Search', citySuggestions: 'City suggestions', currentConditions: 'Current conditions', loading: 'Finding your forecast…', loadingCondition: 'Loading', weatherDetails: 'Weather details', humidity: 'Humidity', wind: 'Wind', visibility: 'Visibility', pressure: 'Pressure', feelsLike: 'Feels like', uvIndex: 'UV index', atAGlance: 'At a glance', hourlyForecast: 'Hourly forecast', weekAhead: 'Week ahead', dailyForecast: '7-day forecast', localForecast: 'Local forecast', dataAttribution: 'Weather data by Open-Meteo', now: 'Now', today: 'Today', rain: 'rain', forecast: 'Forecast', location: 'Location', low: 'Low', moderate: 'Moderate', high: 'High', veryHigh: 'Very high', extreme: 'Extreme', localTime: '{timezone} time', loadingForecast: "Loading {city}'s forecast…", searchingCities: 'Searching for cities…', citySearchUnavailable: 'City search is currently unavailable. Please try again.', weatherUnavailable: 'Weather data is temporarily unavailable. Please try again.', unableToLoad: 'Unable to load the weather right now.', enterTwoCharacters: 'Enter at least two characters to search for a city.', noMatchingCity: 'No matching city was found. Try adding a country or region.', chooseCity: 'Choose the matching city to view its forecast.', unableToSearch: 'Unable to search for a city.', unitKm: ' km', unitKmh: ' km/h', unitHpa: ' hPa', unitMm: ' mm'
    },
    ja: {
        pageTitle: '天気 — グラス予報', description: 'Open-Meteo を使用したグラスモーフィズムの天気ダッシュボードです。', brandHome: '天気ホーム', brand: '天気', languageLabel: '言語を選択', themeLabel: 'テーマカラーを選択', themeMidnight: 'ミッドナイトブルー', themeOcean: 'オーシャンティール', themeAurora: 'オーロラバイオレット', themeSunset: 'サンセットアンバー', themeForest: 'フォレストグリーン', searchLabel: '都市を検索', searchPlaceholder: '都市を検索', searchButton: '検索', citySuggestions: '都市の候補', currentConditions: '現在の天気', loading: '天気予報を取得中…', loadingCondition: '読み込み中', weatherDetails: '天気の詳細', humidity: '湿度', wind: '風速', visibility: '視程', pressure: '気圧', feelsLike: '体感温度', uvIndex: 'UV 指数', atAGlance: '現在の予報', hourlyForecast: '時間ごとの予報', weekAhead: '今後一週間', dailyForecast: '7 日間予報', localForecast: '現地の予報', dataAttribution: '天気データ: Open-Meteo', now: '現在', today: '今日', rain: '降水', forecast: '予報', location: '場所', low: '低い', moderate: '中程度', high: '高い', veryHigh: '非常に高い', extreme: '極端に高い', localTime: '{timezone} 現地時刻', loadingForecast: '{city} の天気予報を読み込み中…', searchingCities: '都市を検索中…', citySearchUnavailable: '都市検索は現在利用できません。もう一度お試しください。', weatherUnavailable: '天気データは一時的に利用できません。もう一度お試しください。', unableToLoad: '現在、天気を読み込めません。もう一度お試しください。', enterTwoCharacters: '都市を検索するには 2 文字以上入力してください。', noMatchingCity: '該当する都市が見つかりません。国または地域を追加してください。', chooseCity: '予報を確認する都市を選択してください。', unableToSearch: '現在、都市を検索できません。もう一度お試しください。', unitKm: ' km', unitKmh: ' km/h', unitHpa: ' hPa', unitMm: ' mm'
    },
    ko: {
        pageTitle: '날씨 — 글래스 예보', description: 'Open-Meteo 기반의 글래스모피즘 날씨 대시보드입니다.', brandHome: '날씨 홈', brand: '날씨', languageLabel: '언어 선택', themeLabel: '테마 색상 선택', themeMidnight: '미드나이트 블루', themeOcean: '오션 틸', themeAurora: '오로라 바이올렛', themeSunset: '선셋 앰버', themeForest: '포레스트 그린', searchLabel: '도시 검색', searchPlaceholder: '도시 검색', searchButton: '검색', citySuggestions: '도시 추천', currentConditions: '현재 날씨', loading: '일기예보를 불러오는 중…', loadingCondition: '불러오는 중', weatherDetails: '날씨 정보', humidity: '습도', wind: '풍속', visibility: '가시거리', pressure: '기압', feelsLike: '체감온도', uvIndex: '자외선 지수', atAGlance: '한눈에 보기', hourlyForecast: '시간별 예보', weekAhead: '이번 주', dailyForecast: '7일 예보', localForecast: '현지 예보', dataAttribution: '날씨 데이터: Open-Meteo', now: '지금', today: '오늘', rain: '강수', forecast: '예보', location: '위치', low: '낮음', moderate: '보통', high: '높음', veryHigh: '매우 높음', extreme: '매우 위험', localTime: '{timezone} 현지 시간', loadingForecast: '{city}의 일기예보를 불러오는 중…', searchingCities: '도시를 검색하는 중…', citySearchUnavailable: '현재 도시 검색을 사용할 수 없습니다. 다시 시도해 주세요.', weatherUnavailable: '날씨 데이터를 일시적으로 사용할 수 없습니다. 다시 시도해 주세요.', unableToLoad: '지금은 날씨를 불러올 수 없습니다. 다시 시도해 주세요.', enterTwoCharacters: '도시를 검색하려면 두 글자 이상 입력하세요.', noMatchingCity: '일치하는 도시를 찾지 못했습니다. 국가 또는 지역을 추가해 보세요.', chooseCity: '예보를 볼 도시를 선택하세요.', unableToSearch: '지금은 도시를 검색할 수 없습니다. 다시 시도해 주세요.', unitKm: ' km', unitKmh: ' km/h', unitHpa: ' hPa', unitMm: ' mm'
    }
};

const conditionTranslations = {
    clearSky: ['晴朗', 'Clear sky', '快晴', '맑음'], mainlyClear: ['大致晴朗', 'Mainly clear', 'おおむね晴れ', '대체로 맑음'], partlyCloudy: ['局部多云', 'Partly cloudy', '一部くもり', '구름 조금'], overcast: ['阴天', 'Overcast', 'くもり', '흐림'], foggy: ['有雾', 'Foggy', '霧', '안개'], rimeFog: ['雾凇雾', 'Rime fog', '着氷性の霧', '착빙 안개'], lightDrizzle: ['小毛毛雨', 'Light drizzle', '弱い霧雨', '약한 이슬비'], moderateDrizzle: ['中等毛毛雨', 'Moderate drizzle', '並の霧雨', '보통 이슬비'], denseDrizzle: ['强毛毛雨', 'Dense drizzle', '強い霧雨', '강한 이슬비'], freezingDrizzle: ['冻毛毛雨', 'Freezing drizzle', '着氷性の霧雨', '어는 이슬비'], lightRain: ['小雨', 'Light rain', '弱い雨', '약한 비'], moderateRain: ['中雨', 'Moderate rain', '並の雨', '보통 비'], heavyRain: ['大雨', 'Heavy rain', '強い雨', '강한 비'], freezingRain: ['冻雨', 'Freezing rain', '着氷性の雨', '어는 비'], lightSnow: ['小雪', 'Light snow', '弱い雪', '약한 눈'], moderateSnow: ['中雪', 'Moderate snow', '並の雪', '보통 눈'], heavySnow: ['大雪', 'Heavy snow', '強い雪', '강한 눈'], snowGrains: ['米雪', 'Snow grains', '霧雪', '싸락눈'], rainShowers: ['阵雨', 'Rain showers', 'にわか雨', '소나기'], heavyShowers: ['强阵雨', 'Heavy showers', '激しいにわか雨', '강한 소나기'], snowShowers: ['阵雪', 'Snow showers', 'にわか雪', '소낙눈'], heavySnowShowers: ['强阵雪', 'Heavy snow showers', '強いにわか雪', '강한 소낙눈'], thunderstorm: ['雷暴', 'Thunderstorm', '雷雨', '뇌우'], thunderstormHail: ['伴冰雹的雷暴', 'Thunderstorm with hail', 'ひょうを伴う雷雨', '우박을 동반한 뇌우'], unknown: ['未知天气', 'Unknown conditions', '不明な天気', '알 수 없는 날씨']
};

const localeIndex = { 'zh-CN': 0, en: 1, ja: 2, ko: 3 };
const weatherCodes = {
    0: { key: 'clearSky', icon: 'fa-sun', theme: 'clear' }, 1: { key: 'mainlyClear', icon: 'fa-cloud-sun', theme: 'clear' }, 2: { key: 'partlyCloudy', icon: 'fa-cloud-sun', theme: 'cloud' }, 3: { key: 'overcast', icon: 'fa-cloud', theme: 'cloud' }, 45: { key: 'foggy', icon: 'fa-smog', theme: 'fog' }, 48: { key: 'rimeFog', icon: 'fa-smog', theme: 'fog' }, 51: { key: 'lightDrizzle', icon: 'fa-cloud-rain', theme: 'rain' }, 53: { key: 'moderateDrizzle', icon: 'fa-cloud-rain', theme: 'rain' }, 55: { key: 'denseDrizzle', icon: 'fa-cloud-rain', theme: 'rain' }, 56: { key: 'freezingDrizzle', icon: 'fa-cloud-rain', theme: 'rain' }, 57: { key: 'freezingDrizzle', icon: 'fa-cloud-rain', theme: 'rain' }, 61: { key: 'lightRain', icon: 'fa-cloud-rain', theme: 'rain' }, 63: { key: 'moderateRain', icon: 'fa-cloud-showers-heavy', theme: 'rain' }, 65: { key: 'heavyRain', icon: 'fa-cloud-showers-heavy', theme: 'rain' }, 66: { key: 'freezingRain', icon: 'fa-cloud-rain', theme: 'rain' }, 67: { key: 'freezingRain', icon: 'fa-cloud-rain', theme: 'rain' }, 71: { key: 'lightSnow', icon: 'fa-snowflake', theme: 'snow' }, 73: { key: 'moderateSnow', icon: 'fa-snowflake', theme: 'snow' }, 75: { key: 'heavySnow', icon: 'fa-snowflake', theme: 'snow' }, 77: { key: 'snowGrains', icon: 'fa-snowflake', theme: 'snow' }, 80: { key: 'rainShowers', icon: 'fa-cloud-rain', theme: 'rain' }, 81: { key: 'rainShowers', icon: 'fa-cloud-showers-heavy', theme: 'rain' }, 82: { key: 'heavyShowers', icon: 'fa-cloud-showers-heavy', theme: 'rain' }, 85: { key: 'snowShowers', icon: 'fa-snowflake', theme: 'snow' }, 86: { key: 'heavySnowShowers', icon: 'fa-snowflake', theme: 'snow' }, 95: { key: 'thunderstorm', icon: 'fa-bolt', theme: 'storm' }, 96: { key: 'thunderstormHail', icon: 'fa-bolt', theme: 'storm' }, 99: { key: 'thunderstormHail', icon: 'fa-bolt', theme: 'storm' }
};

const elements = {
    form: document.getElementById('searchForm'), languageSelect: document.getElementById('languageSelect'), themeSelect: document.getElementById('themeSelect'), searchInput: document.getElementById('searchInput'), searchButton: document.getElementById('searchBtn'), searchResults: document.getElementById('searchResults'), loading: document.getElementById('loading'), weatherContent: document.getElementById('weatherContent'), errorMessage: document.getElementById('errorMessage'), statusMessage: document.getElementById('statusMessage'), cityName: document.getElementById('cityName'), dateTime: document.getElementById('dateTime'), temperature: document.getElementById('temperature'), weatherDescription: document.getElementById('weatherDescription'), weatherIcon: document.getElementById('weatherIcon'), humidity: document.getElementById('humidity'), windSpeed: document.getElementById('windSpeed'), visibility: document.getElementById('visibility'), pressure: document.getElementById('pressure'), feelsLike: document.getElementById('feelsLike'), uvIndex: document.getElementById('uvIndex'), hourlyForecast: document.getElementById('hourlyForecast'), dailyForecast: document.getElementById('dailyForecast'), timezoneLabel: document.getElementById('timezoneLabel'), weatherParticles: document.getElementById('weatherParticles')
};

const weatherCache = new Map();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentLanguage = DEFAULT_LANGUAGE;
let currentTheme = 'midnight';
let currentOptions = [];
let activeWeatherTheme = 'clear';
let currentPlace = null;
let currentWeatherData = null;
let searchRequestId = 0;
let weatherRequestId = 0;

function t(key, params = {}) {
    const template = translations[currentLanguage][key] ?? translations.en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '');
}

function getLocale() { return locales[currentLanguage].intl; }
function getWeatherMeta(code) { return weatherCodes[code] || { key: 'unknown', icon: 'fa-cloud', theme: 'cloud' }; }
function getConditionLabel(key) { return conditionTranslations[key]?.[localeIndex[currentLanguage]] || conditionTranslations.unknown[localeIndex[currentLanguage]]; }

function applyStaticTranslations() {
    document.documentElement.lang = locales[currentLanguage].intl;
    document.title = t('pageTitle');
    document.querySelector('meta[name="description"]').setAttribute('content', t('description'));
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => { node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel)); });
    elements.languageSelect.value = currentLanguage;
    elements.themeSelect.value = currentTheme;
    if (elements.loading.classList.contains('hidden')) return;
    elements.loading.querySelector('p').textContent = t('loading');
}

function setLanguage(language) {
    if (!locales[language]) return;
    currentLanguage = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    applyStaticTranslations();
    closeResults();
    clearError();
    clearStatus();
    if (currentPlace && currentWeatherData) renderWeather(currentPlace, currentWeatherData);
}

function setTheme(theme) {
    if (!Object.hasOwn(themeColors, theme)) return;
    currentTheme = theme;
    document.body.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColors[theme]);
    elements.themeSelect.value = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function particleCount(theme) {
    const compactScreen = window.matchMedia('(max-width: 700px)').matches;
    const counts = { clear: compactScreen ? 6 : 10, cloud: compactScreen ? 4 : 7, rain: compactScreen ? 28 : 52, snow: compactScreen ? 22 : 42, fog: compactScreen ? 4 : 7, storm: compactScreen ? 32 : 58 };
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
    for (let index = 0; index < particleCount(theme); index += 1) fragment.append(createParticle(theme, index));
    elements.weatherParticles.append(fragment);
}

function setIcon(iconElement, iconName) { iconElement.className = `fa-solid ${iconName}`; }
function formatNumber(value, maximumFractionDigits = 0) { return Number.isFinite(value) ? new Intl.NumberFormat(getLocale(), { maximumFractionDigits }).format(value) : '—'; }
function formatTemperature(value) { return `${formatNumber(value)}°`; }
function formatUV(value) {
    if (!Number.isFinite(value)) return '—';
    const key = value >= 11 ? 'extreme' : value >= 8 ? 'veryHigh' : value >= 6 ? 'high' : value >= 3 ? 'moderate' : 'low';
    return `${formatNumber(value)} ${t(key)}`;
}
function formatDate(dateTimeString) {
    return new Intl.DateTimeFormat(getLocale(), { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${dateTimeString.slice(0, 10)}T12:00:00Z`));
}
function formatDay(dateString) { return new Intl.DateTimeFormat(getLocale(), { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${dateString}T12:00:00Z`)); }
function formatHour(dateTimeString) {
    const date = new Date(`1970-01-01T${dateTimeString.slice(11)}Z`);
    const options = { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' };
    if (currentLanguage !== 'en') options.hourCycle = 'h23';
    return new Intl.DateTimeFormat(getLocale(), options).format(date);
}
function locationText(place) {
    const region = place.admin1 || place.country;
    return region ? `${place.name}, ${region}` : place.name;
}

function setLoading(isLoading, message = t('loading')) {
    elements.loading.classList.toggle('hidden', !isLoading);
    elements.loading.querySelector('p').textContent = message;
    elements.searchButton.disabled = isLoading;
    elements.searchButton.setAttribute('aria-busy', String(isLoading));
}
function showError(message) { elements.errorMessage.textContent = message; elements.errorMessage.classList.remove('hidden'); }
function clearError() { elements.errorMessage.classList.add('hidden'); elements.errorMessage.textContent = ''; }
function showStatus(message) { elements.statusMessage.textContent = message; elements.statusMessage.classList.remove('hidden'); }
function clearStatus() { elements.statusMessage.classList.add('hidden'); elements.statusMessage.textContent = ''; }
function closeResults() { currentOptions = []; elements.searchResults.replaceChildren(); elements.searchResults.classList.add('hidden'); elements.searchInput.setAttribute('aria-expanded', 'false'); }
function createTextElement(tagName, className, text) { const node = document.createElement(tagName); node.className = className; node.textContent = text; return node; }

function displayCityOptions(options) {
    currentOptions = options;
    elements.searchResults.replaceChildren();
    options.forEach((place, index) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'search-option'; button.setAttribute('role', 'option'); button.setAttribute('id', `city-option-${index}`); button.setAttribute('aria-selected', 'false');
        const icon = document.createElement('i'); icon.className = 'fa-solid fa-location-dot'; icon.setAttribute('aria-hidden', 'true');
        const copy = document.createElement('span');
        const title = document.createElement('strong'); title.textContent = place.name;
        const details = document.createElement('span'); details.textContent = [place.admin1, place.country].filter(Boolean).join(', ') || t('location');
        button.dataset.cityIndex = String(index);
        copy.append(title, details); button.append(icon, copy); elements.searchResults.append(button);
    });
    elements.searchResults.classList.remove('hidden');
    elements.searchInput.setAttribute('aria-expanded', 'true');
}

function handleCitySelection(event) {
    const option = event.target.closest('.search-option');
    if (!option || !elements.searchResults.contains(option)) return;

    const index = Number(option.dataset.cityIndex);
    const place = currentOptions[index];
    if (!place) return;

    event.preventDefault();
    event.stopPropagation();
    loadPlace(place);
}

async function findCities(query) {
    const url = new URL(GEOCODING_API);
    url.search = new URLSearchParams({ name: query, count: '5', language: locales[currentLanguage].api, format: 'json' });
    const response = await fetch(url);
    if (!response.ok) throw new Error(t('citySearchUnavailable'));
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
        latitude: place.latitude, longitude: place.longitude, timezone: 'auto', forecast_days: '7',
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility,pressure_msl,uv_index',
        hourly: 'temperature_2m,weather_code,precipitation_probability',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max'
    });
    const response = await fetch(url);
    if (!response.ok) throw new Error(t('weatherUnavailable'));
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
    elements.weatherDescription.textContent = getConditionLabel(meta.key);
    setIcon(elements.weatherIcon, meta.icon);
    elements.humidity.textContent = `${formatNumber(current.relative_humidity_2m)}%`;
    elements.windSpeed.textContent = `${formatNumber(current.wind_speed_10m)}${t('unitKmh')}`;
    elements.visibility.textContent = Number.isFinite(current.visibility) ? `${formatNumber(current.visibility / 1000, 1)}${t('unitKm')}` : '—';
    elements.pressure.textContent = `${formatNumber(current.pressure_msl)}${t('unitHpa')}`;
    elements.feelsLike.textContent = formatTemperature(current.apparent_temperature);
    elements.uvIndex.textContent = formatUV(current.uv_index);
    elements.timezoneLabel.textContent = t('localTime', { timezone: data.timezone || t('localForecast') });
    setWeatherAtmosphere(meta.theme);
}

function createForecastCard({ time, code, temperature, details, isNow = false }) {
    const meta = getWeatherMeta(code);
    const card = document.createElement('article');
    card.className = `forecast-card${isNow ? ' is-now' : ''}`;
    const timeElement = createTextElement('p', 'forecast-time', time);
    const icon = document.createElement('i'); icon.className = `fa-solid ${meta.icon} forecast-icon`; icon.setAttribute('aria-hidden', 'true');
    card.append(timeElement, icon, createTextElement('strong', 'forecast-temp', temperature), createTextElement('span', 'forecast-details', details));
    return card;
}

function renderHourly(data) {
    const { hourly, current } = data;
    const startIndex = Math.max(hourly.time.findIndex((time) => time >= current.time), 0);
    const fragment = document.createDocumentFragment();
    for (let offset = 0; offset < 7; offset += 1) {
        const index = startIndex + offset;
        if (!hourly.time[index]) break;
        const chance = hourly.precipitation_probability[index];
        fragment.append(createForecastCard({ time: offset === 0 ? t('now') : formatHour(hourly.time[index]), code: hourly.weather_code[index], temperature: formatTemperature(hourly.temperature_2m[index]), details: Number.isFinite(chance) ? `${formatNumber(chance)}% ${t('rain')}` : t('forecast'), isNow: offset === 0 }));
    }
    elements.hourlyForecast.replaceChildren(fragment);
}

function renderDaily(data) {
    const { daily } = data;
    const fragment = document.createDocumentFragment();
    daily.time.slice(0, 7).forEach((date, index) => {
        const rain = daily.precipitation_sum[index];
        fragment.append(createForecastCard({ time: index === 0 ? t('today') : formatDay(date), code: daily.weather_code[index], temperature: `${formatTemperature(daily.temperature_2m_max[index])} / ${formatTemperature(daily.temperature_2m_min[index])}`, details: Number.isFinite(rain) ? `${formatNumber(rain)}${t('unitMm')}` : t('forecast') }));
    });
    elements.dailyForecast.replaceChildren(fragment);
}

function renderWeather(place, data) { renderHero(place, data); renderHourly(data); renderDaily(data); }

async function loadPlace(place) {
    const requestId = ++weatherRequestId;
    closeResults(); clearError(); clearStatus(); setLoading(true, t('loadingForecast', { city: place.name }));

    try {
        const data = await fetchWeather(place);
        if (requestId !== weatherRequestId) return;

        currentPlace = place; currentWeatherData = data;
        renderWeather(place, data);
        elements.weatherContent.classList.remove('hidden');
        elements.searchInput.value = place.name;
    } catch (error) {
        if (requestId === weatherRequestId) showError(error instanceof Error ? error.message : t('unableToLoad'));
    } finally {
        if (requestId === weatherRequestId) setLoading(false);
    }
}

async function handleSearch(event) {
    event.preventDefault();
    const query = elements.searchInput.value.trim();
    const requestId = ++searchRequestId;
    closeResults(); clearError();

    if (query.length < 2) { showError(t('enterTwoCharacters')); return; }
    setLoading(true, t('searchingCities'));

    try {
        const cities = await findCities(query);
        if (requestId !== searchRequestId) return;

        if (cities.length === 0) { showError(t('noMatchingCity')); return; }
        if (cities.length === 1) { await loadPlace(cities[0]); return; }

        setLoading(false);
        showStatus(t('chooseCity'));
        displayCityOptions(cities);
    } catch (error) {
        if (requestId === searchRequestId) showError(error instanceof Error ? error.message : t('unableToSearch'));
    } finally {
        if (requestId === searchRequestId) setLoading(false);
    }
}

function initializePreferences() {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    currentLanguage = locales[savedLanguage] ? savedLanguage : DEFAULT_LANGUAGE;
    currentTheme = Object.hasOwn(themeColors, savedTheme) ? savedTheme : 'midnight';
    document.body.dataset.theme = currentTheme;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColors[currentTheme]);
    applyStaticTranslations();
}

elements.form.addEventListener('submit', handleSearch);
elements.searchResults.addEventListener('click', handleCitySelection);
elements.languageSelect.addEventListener('change', (event) => setLanguage(event.target.value));
elements.themeSelect.addEventListener('change', (event) => setTheme(event.target.value));
elements.searchInput.addEventListener('input', () => {
    searchRequestId += 1;
    clearError();
    clearStatus();
    if (!elements.searchResults.classList.contains('hidden')) closeResults();
});
document.addEventListener('click', (event) => { if (!elements.form.contains(event.target)) closeResults(); });
reducedMotion.addEventListener('change', () => setWeatherAtmosphere(activeWeatherTheme));

const defaultPlace = { name: 'London', admin1: 'England', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 };
function bootWeatherDashboard() { initializePreferences(); loadPlace(defaultPlace); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootWeatherDashboard, { once: true });
else bootWeatherDashboard();
