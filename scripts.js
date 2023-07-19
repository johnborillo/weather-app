getWeather('London');
const weatherFormNode = document.querySelector('.weatherForm');
const desiredLocation = document.querySelector('.inputWeather');
let timeoutId;
weatherFormNode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

weatherFormNode.addEventListener('input', (e) => {
    e.preventDefault();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        getWeather(desiredLocation.value);
    }, 500);
});

//using promises (.then)
// function getWeather(location) {
//     const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`;

//     const options = {
//         mode: 'cors',
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': '51cfd8cb66mshefbc902126f28a6p1662c8jsn69f4be6a1f19',
//             'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
//         }
//     }

//     fetch(url, options)
//         .then(function (response) {
//             // console.log(response);
//             return response.json();
//         })
//         .then(function (response) {
//             console.log(response);
//         })

// }

//using async await
async function getWeather(location) {
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
        printInfo(result)
    } catch (error) {
        getWeather('London')
        console.log(error);
    }

}

function printInfo(json) {
    const weatherDisplayNode = document.querySelector('.weatherDisplay');
    weatherDisplayNode.innerHTML = '';
    document.querySelector('.footer').innerHTML = '';

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
    const locationTemp = document.createElement('h1');
    locationTemp.textContent = `${json.current.temp_c}°C`

    //C or T toggle
    const tempToggle = document.createElement('input');
    tempToggle.className = 'tempToggle';
    tempToggle.value = 'Change to farenheit'
    tempToggle.setAttribute('type', 'button');
    let currentUnit = 'C'
    tempToggle.addEventListener('click', (e) => {
        if (currentUnit === 'C') {
            currentUnit = 'F';
            locationTemp.textContent = `${json.current.temp_f}°F`
            tempToggle.value = 'Change to celsius'
        } else {
            currentUnit = 'C';
            locationTemp.textContent = `${json.current.temp_c}°C`
            tempToggle.value = 'Change to farenheit'
        }
    })

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
        `${json.current.humidity}%`,
        '/images/humidity.png'
    );

    // Append the containers to miscWeatherDesc
    miscWeatherDesc.append(windContainer, precipContainer, humidContainer);

    mainWeatherDesc.append(locationConditionImg, locationTemp);

    weatherDisplayNode.append(mainWeatherDesc, miscWeatherDesc);
    document.querySelector('.footer').appendChild(tempToggle);
}

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