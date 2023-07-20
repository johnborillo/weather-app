const weatherFormNode = document.querySelector('.weatherForm');
const desiredLocation = document.querySelector('.inputWeather');
let locationTemp;
let containerTemp;
let timeoutId;
weatherFormNode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

//Hanldes making the underline for input bigger or smaller
// Get the input element
const inputElement = document.getElementById('input');

// Function to update the width of the input element
function updateInputWidth() {
    const textLength = inputElement.value.length;
    const minWidth = 90; // Minimum width for the input element
    const maxWidth = 200; // Maximum width for the input element (adjust as per your requirement)
    const width = Math.min(maxWidth, Math.max(minWidth, textLength * 13)); // Adjust the multiplier (10) as per your requirement

    inputElement.style.width = width + 'px';
}

// Attach an event listener to the input element
inputElement.addEventListener('input', updateInputWidth);

// Call the function initially to set the initial width based on the default value (London)
updateInputWidth();

weatherFormNode.addEventListener('input', (e) => {
    e.preventDefault();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
        // getRealtimeWeather(desiredLocation.value);
        // getForecast(desiredLocation.value);
        const location = desiredLocation.value;
        if (location) {
            await printInfo(location);
            await printForecast(location);
        } else {
            await printInfo('london');
            await printForecast('london');
        }
    }, 500);
});

//using async await
async function getRealtimeWeather(location) {
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`;

    const options = {
        mode: 'cors',
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '51cfd8cb66mshefbc902126f28a6p1662c8jsn69f4be6a1f19',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    }

    try {
        console.clear();
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function printInfo(location) {
    const json = await getRealtimeWeather(location);
    console.log(json);

    const weatherDisplayNode = document.querySelector('.weatherDisplay');
    weatherDisplayNode.innerHTML = '';

    //main weather desc
    const mainWeatherDesc = document.createElement('div');
    mainWeatherDesc.className = 'mainWeatherDesc';

    //misc weather desc
    const miscWeatherDesc = document.createElement('div');
    miscWeatherDesc.className = 'miscWeatherDesc';

    //condition
    const locationCondition = document.querySelector('.condition');
    let condition = `${json.current.condition.text}`.toLowerCase();
    if (condition === 'overcast') {
        condition = 'very cloudy.';
        locationCondition.textContent = condition;
    } else if (condition === 'patchy rain possible') {
        condition = 'partially rainy.';
        locationCondition.textContent = condition;
    } else {
        locationCondition.textContent = `${condition}.`;
    }

    const locationConditionImg = document.createElement('img');
    locationConditionImg.className = 'conditionImg';
    locationConditionImg.src = json.current.condition.icon;

    //temp value
    locationTemp = document.createElement('h1');
    locationTemp.className = 'currentLocationTemp';
    locationTemp.textContent = `${json.current.temp_c}°C`

    // Wind speed
    const windContainer = createWeatherContainer(
        'windContainer',
        `${json.current.wind_mph} mph`,
        '/images/wind.png'
    );

    // Precipitation
    const precipContainer = createWeatherContainer(
        'precipContainer',
        `${json.current.precip_mm} mm`,
        '/images/precip.png'
    );

    // Humidity
    const humidContainer = createWeatherContainer(
        'humidContainer',
        `${json.current.humidity}% humidity`,
        '/images/humidity.png'
    );

    // Append the containers to miscWeatherDesc
    miscWeatherDesc.append(windContainer, precipContainer, humidContainer);

    mainWeatherDesc.append(locationConditionImg, locationTemp);

    weatherDisplayNode.append(mainWeatherDesc, miscWeatherDesc);
}

//function for creating the misc weather info
function createWeatherContainer(className, text, imagePath) {
    const container = document.createElement('div');
    container.className = className;

    const heading = document.createElement('h4');
    heading.textContent = text;

    const image = document.createElement('img');
    image.className = `${className}Img`;
    image.src = imagePath;

    container.append(image, heading);

    return container;
}

async function getForecast(location) {
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'X-RapidAPI-Key': '51cfd8cb66mshefbc902126f28a6p1662c8jsn69f4be6a1f19',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        return result;
    } catch (e) {
        printForecast('london');
        console.log(e);
    }

};

async function printForecast(location) {
    const json = await getForecast(location);

    const forecastDisplayNode = document.querySelector('.forecastDisplay');
    forecastDisplayNode.innerHTML = '';

    const forecastArray = [
        'day0Forecast',
        'day1Forecast',
        'day2Forecast'
    ]

    for (let i = 0; i < forecastArray.length; i++) {
        const forecastItem = createForecastContainer(
            forecastArray[i],
            `${json.forecast.forecastday[i].day.condition.icon}`,
            `${json.forecast.forecastday[i].date}`,
            `${json.forecast.forecastday[i].day.maxtemp_c}`,
            `${json.forecast.forecastday[i].day.mintemp_c}`
        );
        forecastDisplayNode.appendChild(forecastItem);
    }
}

function createForecastContainer(className, img, date, maxTemp, minTemp) {
    const container = document.createElement('div');
    container.className = className;
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";

    const containerImg = document.createElement('img');
    containerImg.src = img;
    containerImg.style.marginBottom = '-10px';

    const containerDate = document.createElement('p');
    containerDate.className = `${className}Date`;
    containerDate.textContent = date;

    containerTemp = document.createElement('p');
    containerTemp.className = `${className}Temp`;
    containerTemp.textContent = `${maxTemp}°C / ${minTemp}°C`;

    container.append(containerImg, containerDate, containerTemp);
    return container;
}

//C or T toggle
async function tempControl() {
    document.querySelector('.footer').innerHTML = '';

    let realtimeJson;
    let forecastJson;

    const location = desiredLocation.value;
    if (location) {
        realtimeJson = await getRealtimeWeather(location);
        forecastJsonJson = await getForecast(location);
    } else {
        realtimeJson = await getRealtimeWeather('london');
        forecastJson = await getForecast('london');
    }

    const toggleDiv = document.createElement('div');
    toggleDiv.className = 'toggleDiv';

    const tempToggle = document.createElement('input');
    tempToggle.className = 'button type1';
    tempToggle.value = 'Change to farenheit';
    tempToggle.setAttribute('type', 'button');
    let currentUnit = 'C'
    tempToggle.addEventListener('click', (e) => {
        if (currentUnit === 'C') {
            currentUnit = 'F';
            locationTemp.textContent = `${realtimeJson.current.temp_f}°F`
            for (let i = 0; i <= 2; i++) {
                const element = document.querySelector(`.day${i}ForecastTemp`);
                element.textContent = `${forecastJson.forecast.forecastday[i].day.maxtemp_f}°F / ${forecastJson.forecast.forecastday[i].day.mintemp_f}°F`
            }
            tempToggle.value = 'Change to celsius';
        } else {
            currentUnit = 'C';
            locationTemp.textContent = `${realtimeJson.current.temp_c}°C`
            containerTemp.textContent = `${forecastJson.current.temp_f}°C`
            for (let i = 0; i <= 2; i++) {
                const element = document.querySelector(`.day${i}ForecastTemp`);
                element.textContent = `${forecastJson.forecast.forecastday[i].day.maxtemp_c}°C / ${forecastJson.forecast.forecastday[i].day.mintemp_c}°C`
            }
            tempToggle.value = 'Change to farenheit';
        }
    })
    toggleDiv.appendChild(tempToggle);

    document.querySelector('.footer').appendChild(toggleDiv);
}

printInfo('london');
printForecast('london');
tempControl();