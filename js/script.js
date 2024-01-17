const ip_address = document.querySelector('#ip_address');
const city = document.querySelector('#city');
const region = document.querySelector('#region');
const timezone = document.querySelector('#utc');
const isp = document.querySelector('#isp');
const searchInput = document.querySelector("#ip_search");
const form = document.querySelector("#form");
const error = document.querySelector("#error");
const errorMessage = document.querySelector("#error-message");
import API_KEY from './apiKey.js';

//api key
// const api_key = API_KEY;

//get api data on initial load
const fetchApi = () => {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=192.212.174.101`)
    .then(response => {
        if(!response.ok){
            error.classList.add("error-visible");
            errorMessage.textContent = "Network error! Please try again later";
            return;
        }
        return response.json();
    })
    .then(data=>{
        ip_address.textContent = data.ip;
        city.textContent = data.location.city + ', ';
        region.textContent = data.location.region;
        timezone.textContent = 'UTC ' + data.location.timezone
        isp.textContent = data.isp;
        updateMap(data);
    })
    .catch(error => {
        console.error("error")
    })
}

fetchApi();

//search ip address
const searchIpAddress = () => {
    const ipAddressFormat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
    const inputValue = searchInput.value;

    if(ipAddressFormat.test(inputValue) && inputValue !== "" ){
        
    }else{
        error.classList.add("error-visible");
        errorMessage.textContent = "Invalid IPv4 format";
        setTimeout(()=> {
            error.classList.remove("error-visible")
        }, 5000)
        return;
    }

    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${inputValue}`)
    .then(response => {
        if(!response.ok){
            error.classList.add("error-visible");
            errorMessage.textContent = "Error! Try again later";
            return;
        }
        return response.json();
    })
    .then(data =>{
        ip_address.textContent = data.ip;
        city.textContent = data.location.city + ', ';
        region.textContent = data.location.region;
        timezone.textContent = 'UTC ' + data.location.timezone
        isp.textContent = data.isp;
        updateMap(data);
    })
}

// update map
let map;

const updateMap = (data) => {
    // create map using map in leaflets
    let latLng = [data.location.lat, data.location.lng];
    map.flyTo(latLng, 15, { animate: true });

    //custom icon
    let icon = L.icon({
            iconUrl: '../images/icon-location.svg',
            iconSize: [40, 50],
            iconAnchor :[16, 32],
            popupAnchor: [0, -32]
        })

    let marker = L.marker(latLng, {icon: icon}).addTo(map);
    marker.bindPopup(`<b>${data.location.city},</b><b>${data.location.country}</b><br>${data.location.region}`).openPopup();
}

document.addEventListener("DOMContentLoaded", () => {
    map = L.map("map").setView([34.04915, -118.09462], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
})

const handleSubmit = (event) => {
    event.preventDefault();
    searchIpAddress()
    searchInput.value = ""
    
}

form.addEventListener('submit', handleSubmit)