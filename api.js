// api.js - Handles all API calls for the Prayer Times App

export async function fetchCountriesByContinent(continent) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/region/${continent}`
    );
    if (!res.ok) throw new Error("Failed to fetch countries");

    const data = await res.json();
    return data.map((c) => c.name.common);
  } catch (error) {
    console.error(error);
    return [];
  }
}

const cityCache = new Map();
export async function fetchCitiesByCountry(country) {
  if (cityCache.has(country)) {
    return cityCache.get(country);
  }
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        method: "POST",
        body: JSON.stringify({ country }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch cities");
    const data = await res.json();
    const cities = data.data || [];
    cityCache.set(country, cities);
    return cities;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchPrayerTimes(city, country, method) {
  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
      city
    )}&country=${encodeURIComponent(country)}&method=${method}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch prayer times");
    const data = await res.json();
    const times = data.data.timings;
    return {
      Fajr: times.Fajr,
      Dhuhr: times.Dhuhr,
      Asr: times.Asr,
      Maghrib: times.Maghrib,
      Isha: times.Isha,
    };
  } catch (error) {
    console.error(error);
    return {};
  }
}
