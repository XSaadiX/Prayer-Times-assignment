# Prayer Times Web App 🕌

## Overview
A single-page web app that fetches Islamic prayer times using the **Aladhan API**.

Users can select **Continent → Country → City → Calculation Method** and view the 5 main prayer times in a clean table with a **live countdown timer** for the next prayer.

---

## Features
- 🌍 Dynamic Continent → Country → City selectors
- 🕰️ 5 Main Prayers: Fajr, Dhuhr, Asr, Maghrib, Isha
- ⏳ Live countdown timer for the next prayer
- ⚙️ Calculation method selection
- 💾 LocalStorage to remember selections
- ❌ Reset button to clear everything
- 📱 Responsive, clean UI

---

## APIs Used
1.  **Prayer Times:** [Aladhan API](https://api.aladhan.com/v1)
2.  **Countries:** [REST Countries API](https://restcountries.com/v3.1/region/{continent})
3.  **Cities:** [CountriesNow API](https://countriesnow.space/api/v0.1/countries/cities)

---

## 📁 Files & TODOs

### index.html
- [ ] Add dropdowns for continent, country, city, and calculation method
- [ ] Add table for prayer times
- [ ] Add next prayer banner with countdown timer
- [ ] Add reset button

### style.css
- [ ] Style the layout, table, dropdowns, and banner
- [ ] Make the UI responsive and mobile-friendly

### app.js
- [ ] Fetch countries by continent (REST Countries API)
- [ ] Fetch cities by country (CountriesNow API with caching)
- [ ] Fetch prayer times (Aladhan API)
- [ ] Render prayer table with 5 main prayers
- [ ] Implement next prayer timer (HH:MM:SS)
- [ ] Handle errors gracefully
- [ ] Persist user selection in localStorage
- [ ] Reset button to clear UI & localStorage

---

---

## Setup Instructions
1.  Clone the repo:
    ```bash
    git clone <repo-url>
    ```


---

## Team & Tasks
| Team Member | Task Assignment | Files |
|---|---|---|
| **XSaadiX** | Repo setup, starter code, final integration & reviews | `app.js`, README |
| **XSaadiX** | API integration (Countries, Cities, Prayer Times) | `api.js` |
| **Mahmoud Hamo** | UI rendering: Table, Dropdowns, Next Prayer Banner | `app.js`, `style.css` |
| **Noor Al-Afifi** | Countdown Timer + LocalStorage persistence | `utils.js` |
| **Nora Al-Ashqar** | Error handling, Responsiveness, Polishing & Testing | `app.js`, `style.css` |

---

##  Development Steps
1.  Populate **continents** & fetch **countries/cities** dynamically.
2.  Add **calculation methods** dropdown.
3.  Fetch **prayer times** & show 5 prayers in a table.
4.  Implement **next prayer + countdown timer**.
5.  Add **localStorage** & **reset button**.
6.  Improve **UI, error handling, responsiveness**.

---

## Milestones
- **-** Setup, API calls for countries/cities, dropdowns
 **-**  Prayer times + countdown timer
 **-** LocalStorage + reset + polish
 **-** Testing, debugging, final review