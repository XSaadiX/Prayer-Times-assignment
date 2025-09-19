// api.js - Handles all API calls for the Prayer Times App

// TODO: Fetch countries by continent from REST Countries API
export async function fetchCountriesByContinent(continent) {
  // Example endpoint: https://restcountries.com/v3.1/region/{continent}
  // TODO: Return array of country names
}

// TODO: Fetch cities by country from CountriesNow API (with caching)
export async function fetchCitiesByCountry(country) {
  // Example endpoint: https://countriesnow.space/api/v0.1/countries/cities
  // TODO: Implement caching to avoid repeated calls
}

// TODO: Fetch prayer times from Aladhan API
export async function fetchPrayerTimes(city, country, method) {
  // Example endpoint: https://api.aladhan.com/v1/timingsByCity
  // TODO: Return only Fajr, Dhuhr, Asr, Maghrib, Isha
}
