const weatherFormNode = document.querySelector('.weatherForm');
const desiredLocation = document.querySelector('.inputWeather');
weatherFormNode.addEventListener('submit', (e) => {
    e.preventDefault();
    getWeather(desiredLocation.value)
})

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
        console.log(error);
    }

}

function printInfo(json) {
    const weatherDisplayNode = document.querySelector('.weatherDisplay');
    weatherDisplayNode.innerHTML = '';

    const locationHeading = document.createElement('h1');
    locationHeading.textContent = `${json.location.country}, ${json.location.name}`

    const locationFeelslike = document.createElement('h2');
    locationFeelsLike.textContent = `${json.current.feelslike_c}°C`

    const tempToggle = document.createElement('input');
    tempToggle.setAttribute('type', 'checkbox');
    let currentUnit = 'C'
    tempToggle.addEventListener('click', (e) => {
        if (currentUnit === 'C') {
            currentUnit = 'F';
            location
        } else {
            currentUnit = 'C';
        }
    })

    const locationCondition = document.createElement('h3');
    locationCondition.textContent = `${json.current.condition.text}`

    const locationConditionImg = document.createElement('img');
    locationConditionImg.src = json.current.condition.icon;

    weatherDisplayNode.append(locationHeading, locationCondition, locationFeelsLike, tempToggle, locationConditionImg);
}