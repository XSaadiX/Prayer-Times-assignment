import { fetchCountriesByContinent, fetchCitiesByCountry, fetchPrayerTimes } from './api.js';
import { formatTime, getNextPrayer, startCountdown, saveSelections, loadSelections, clearSelections } from './utils.js';

// ===== Global State =====
let selections = { continent: '', country: '', city: '', method: '' };
let prayerTimes = {};
let countdownInterval = null;

// ===== Initialization =====
function init() {
  console.log("App Initialized");

  // Load saved selections from localStorage
  const saved = loadSelections();
  if (saved) {
    selections = saved;
    // TODO [Mahmoud]: Populate dropdowns with saved values in the UI
  }

  // Set up event listeners
  setupEventListeners();

  // If we already have saved selections, fetch prayer times automatically
  if (saved && saved.city && saved.country && saved.method) {
    handleFetchPrayerTimes();
  }
}

// ===== Event Listeners =====
function setupEventListeners() {
  document.getElementById("continentSelect").addEventListener("change", async (e) => {
    selections.continent = e.target.value;

    // Fetch countries after continent selection
    const countries = await fetchCountriesByContinent(selections.continent);

    // TODO [Mahmoud]: Populate "countrySelect" dropdown with countries
  });

  document.getElementById("countrySelect").addEventListener("change", async (e) => {
    selections.country = e.target.value;

    // Fetch cities after country selection
    const cities = await fetchCitiesByCountry(selections.country);

    // TODO [Mahmoud]: Populate "citySelect" dropdown with cities
  });

  document.getElementById("citySelect").addEventListener("change", (e) => {
    selections.city = e.target.value;
    console.log("City selected:", selections.city);
  });

  document.getElementById("methodSelect").addEventListener("change", (e) => {
    selections.method = e.target.value;
    console.log("Method selected:", selections.method);
  });

  document.getElementById("resetBtn").addEventListener("click", handleReset);
}

// ===== Prayer Times Fetch =====
async function handleFetchPrayerTimes() {
  if (!selections.city || !selections.country || !selections.method) {
    alert("Please select all options!");
    return;
  }

  saveSelections(selections); // Persist selections in localStorage

  try {
    prayerTimes = await fetchPrayerTimes(selections.city, selections.country, selections.method);

    // TODO [Mahmoud]: Render prayer times table in the UI
    // TODO [Noor]: Start countdown for next prayer
    startNextPrayerCountdown();

  } catch (error) {
    // TODO [Nora]: Show user-friendly error message in UI
    console.error(error);
    const errorEl=document.getElementById("errorMessage");
    errorEl.innerText="Unable to load prayer times.Please try again later.";
    errorEl.style.display="block";
    errorEl.style.textAlign="center";
  }
}

// ===== Next Prayer Countdown =====
function startNextPrayerCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  const { name, time } = getNextPrayer(prayerTimes);
  console.log(`Next prayer: ${name} at ${time}`);

  countdownInterval = startCountdown(
    time,
    (remaining) => {
      // TODO [Noor]: Update countdown UI every second
    },
    () => {
      // When countdown ends → refresh prayer times
      handleFetchPrayerTimes();
    }
  );
}

// ===== Reset All Data =====
function handleReset() {
  clearSelections();
  selections = { continent: '', country: '', city: '', method: '' };
  prayerTimes = {};
  if (countdownInterval) clearInterval(countdownInterval);

  // TODO [Mahmoud]: Reset UI (dropdowns, table, countdown display)
  console.log("All selections cleared");
}

init();
