// utils.js - Utility functions for Prayer Times App

// TODO: Format time to HH:MM:SS
export function formatTime(dateObj) {
  // Example: convert Date object to HH:MM:SS string
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// TODO: Calculate next prayer time
export function getNextPrayer(prayerTimes) {
  // prayerTimes = { Fajr: "05:00", Dhuhr: "12:30", ... }
  // TODO: Return next prayer name + time

  const now = new Date();
  const prayers = Object.entries(prayerTimes).map(([name, time]) => {
    // Convert to Date objects for comparison']
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return { name, time, date };
  });
  for (const prayer of prayers) {
    if (prayer.date > now) {
      // Next prayer found
      return { name: prayer.name, time: prayer.time };
    }
  }
  return { name: "Fajr", time: prayerTimes.Fajr }; //Next day Fajr
}

// TODO: Countdown logic for next prayer
export function startCountdown(nextPrayerTime, onTick, onComplete) {
  // Call onTick(remainingTime) every second
  // Call onComplete() when countdown ends
  const [h, m] = nextPrayerTime.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= new Date()) {
    target.setDate(target.getDate() + 1); // Next day
  }
  const intervalId = setInterval(() => {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(intervalId);
      onTick("00:00:00");
      if (onComplete) onComplete();
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    const formatted = `${hours}:${minutes}:${seconds}`;
    if (onTick) onTick(formatted);
  }, 1000);

  return () => clearInterval(intervalId);
}

// TODO: Save & load last selections from localStorage
const STORAGE_KEY = "praySelection";

export function saveSelections(selections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
}
export function loadSelections() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}
export function clearSelections() {
  localStorage.removeItem(STORAGE_KEY);
}
