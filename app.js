import {
  fetchCountriesByContinent,
  fetchCitiesByCountry,
  fetchPrayerTimes,
} from "./api.js";
import {
  formatTime,
  getNextPrayer,
  startCountdown,
  saveSelections,
  loadSelections,
  clearSelections,
} from "./utils.js";

// ===== Global State =====
let selections = { continent: "", country: "", city: "", method: "" };
let prayerTimes = {};
let countdownInterval = null;

const continentSelect = document.getElementById("continentSelect");
const countrySelect = document.getElementById("countrySelect");
const citySelect = document.getElementById("citySelect");
const methodSelect = document.getElementById("methodSelect");

const fajr_Time = document.getElementById("fajrTime");
const dhuhr_Time = document.getElementById("dhuhrTime");
const asr_Time = document.getElementById("asrTime");
const maghrib_Time = document.getElementById("maghribTime");
const isha_Time = document.getElementById("ishaTime");

const timesArr = [fajr_Time, dhuhr_Time, asr_Time, maghrib_Time, isha_Time];
PopulateContinents();
PopulateMethods();
// ===== Initialization =====
async function init() {
  console.log("App Initialized");

  // Load saved selections from localStorage
  const saved = loadSelections();
  if (saved) {
    selections = saved;
    // TODO [Mahmoud]: Populate dropdowns with saved values in the UI

    continentSelect.value = saved.continent;

    const countries = await fetchCountriesByContinent(selections.continent);
    PopulateCountry(countries);
    countrySelect.value = saved.country;

    const cities = await fetchCitiesByCountry(selections.country);
    PopulateCity(cities);
    citySelect.value = saved.city;

    methodSelect.value = saved.method;
  }

  // Set up event listeners
  setupEventListeners();

  // If we already have saved selections, fetch prayer times automatically
  if (saved && saved.city && saved.country && saved.method) {
    handleFetchPrayerTimes();
  }
}

async function PopulateContinents() {
  const continents = ["africa", "asia", "europe", "americas", "oceania"];
  continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent;
    option.textContent = continent;
    continentSelect.appendChild(option);
  });
}

function PopulateCountry(countries) {
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

function PopulateCity(cities) {
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

async function PopulateMethods() {
  const res = await fetch("https://api.aladhan.com/v1/methods");
  const data = await res.json();
  Object.entries(data.data).forEach(([id, method]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = method.name;
    methodSelect.appendChild(option);
  });
}

// ===== Event Listeners =====
function setupEventListeners() {
  document
    .getElementById("continentSelect")
    .addEventListener("change", async (e) => {
      selections.continent = e.target.value;

      // Fetch countries after continent selection
      const countries = await fetchCountriesByContinent(selections.continent);
      PopulateCountry(countries);
    });
  // TODO [Mahmoud]: Populate "countrySelect" dropdown with countries

  document
    .getElementById("countrySelect")
    .addEventListener("change", async (e) => {
      selections.country = e.target.value;

      // Fetch cities after country selection
      const cities = await fetchCitiesByCountry(selections.country);

      // TODO [Mahmoud]: Populate "citySelect" dropdown with cities
      PopulateCity(cities);
    });

  document.getElementById("citySelect").addEventListener("change", (e) => {
    selections.city = e.target.value;
    console.log("City selected:", selections.city);
  });

  document
    .getElementById("methodSelect")
    .addEventListener("change", async (e) => {
      selections.method = e.target.value;
      console.log("Method selected:", selections.method);

      if (selections.city && selections.country && selections.method) {
        await handleFetchPrayerTimes();
      }
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
    prayerTimes = await fetchPrayerTimes(
      selections.city,
      selections.country,
      selections.method
    );

    console.log("Fetched Prayer Times:", prayerTimes);

    // TODO [Mahmoud]: Render prayer times table in the UI
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    timesArr.forEach((cell) => (cell.textContent = "---"));
    prayerOrder.forEach((prayer, index) => {
      const [h, m] = prayerTimes[prayer].split(":").map(Number);
      const dateObj = new Date();
      dateObj.setHours(h, m, 0, 0);
      timesArr[index].textContent = formatTime(dateObj);
    });
    // TODO [Noor]: Start countdown for next prayer
    startNextPrayerCountdown();
  } catch (error) {
    // TODO [Nora]: Show user-friendly error message in UI
    console.error(error);
    const errorEl = document.getElementById("errorMessage");
    errorEl.innerText = "Unable to load prayer times.Please try again later.";
    errorEl.style.display = "block";
    errorEl.style.textAlign = "center";
  }
}

// ===== Next Prayer Countdown =====
function startNextPrayerCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  const { name, time } = getNextPrayer(prayerTimes);
  const [h, m] = time.split(":").map(Number);

  const nextPrayerDate = new Date();
  nextPrayerDate.setHours(h, m, 0, 0);

  const now = new Date();

  if (nextPrayerDate <= now) {
    nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
  }

  // if (countdownInterval) countdownInterval();
  countdownInterval = startCountdown(
    time,
    (remaining) => {
      // TODO [Noor]: Update countdown UI every second
      const el = document.getElementById("countdown");

      if (el) {
        document.getElementById(
          "nextPrayerName"
        ).textContent = ` Next Prayer is : ${name}`;
        el.textContent = `remaining time : ${remaining}`;
        document.getElementById("nextPrayerTime").textContent =
          nextPrayerDate.getDate() === now.getDate() ? "today" : "tomorrow";
      }
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
  selections = { continent: "", country: "", city: "", method: "" };
  prayerTimes = {};
  if (countdownInterval) {
    // clearInterval(countdownInterval);
    countdownInterval();
    countdownInterval = null;
  }
  // TODO [Mahmoud]: Reset UI (dropdowns, table, countdown display)

  continentSelect.selectedIndex = 0;

  countrySelect.length = 1;
  countrySelect.selectedIndex = 0;

  citySelect.length = 1;
  citySelect.selectedIndex = 0;

  methodSelect.selectedIndex = 0;

  ClearTable();

  setTimeout(() => {
    init();
  }, 0);

  console.log("All selections cleared");
}

function ClearTable() {
  document.getElementById("nextPrayerName").textContent = "Next Prayer : ";
  document.getElementById("countdown").textContent = "00:00:00";
  document.getElementById("nextPrayerTime").textContent = "today/tomorrow";

  timesArr.forEach((time) => {
    time.textContent = "---";
  });
}

init();
