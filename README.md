Here is the complete `README.md` content. Copy everything between the triple backticks below, then paste it directly into your GitHub repository’s file editor (creating a new file named `README.md`).

```markdown
# Swivel-Head Pro – Wildfire Situational Awareness

**Live app:** [https://uss-parks.github.io/SitAware/](https://uss-parks.github.io/SitAware/)

Swivel-Head Pro is a web‑based application that provides real‑time wildfire situational awareness for U.S. National Forests and public lands. It delivers detailed weather data, fire risk indices, overnight humidity recovery, and safety recommendations – all by default, with no “Pro” upgrade required. A **Light / Dark theme toggle** lets you choose your preferred viewing experience.

---

## Features

- **Current Conditions** – Temperature, wind, relative humidity, weather description, plus dewpoint, transport wind, mixing height, Haines Index, and fire weather zone (all always visible).  
- **Project Activity Level (PAL)** – Color‑coded badge (A through E) with description and associated restrictions.  
- **7‑Day Fire Potential** – NWCG Predictive Services outlook (moist, dry, very dry, wind, lightning, critical) and PSA information.  
- **Humidity Recovery** – Overnight RH recovery chart with hourly data, critical threshold marker, and adequacy prediction.  
- **Forecast Strip** – Scrollable hourly/daily forecast (time, icon, temperature, humidity).  
- **Safety Precautions** – Actionable recommendations based on current fire risk level.  
- **Interactive Map** – Leaflet + OpenStreetMap; click anywhere to set location.  
- **Multiple Location Inputs** – GPS geolocation, manual coordinates, or dropdown of major National Forests (Six Rivers, Shasta‑Trinity, Mendocino, etc.).  
- **Red Flag Warning Alerts** – Prominent alert bar when critical conditions are detected.  
- **Light / Dark Theme Toggle** – Sun/moon icon in header; preference saved locally.  
- **Daily Notifications** – Optional 7:00 AM summary (weather, fire risk, PAL, safety tip).  
- **Progressive Web App (PWA)** – Installable on mobile devices (offline support).

---

## How It Works

1. **Set your location** – Use “Locate Me” (GPS), click the map, enter coordinates manually, or select a forest from the dropdown.  
2. **Data fetch** – The app retrieves current conditions, forecasts, and fire weather indices from the **National Weather Service API** (`weather.gov`).  
3. **Forest info** – Queries **USFS ArcGIS** endpoints to identify the National Forest (name, region, acreage).  
4. **Fire danger assessment** – Calculates PAL based on weather/fire‑danger guidelines; fetches 7‑day fire potential from **NWCG Predictive Services**.  
5. **Display & alerts** – All granular reports are shown immediately. If a Red Flag Warning is active, an alert bar appears at the top.

---

## Data Sources

All data is sourced from official U.S. government agencies:

- **[weather.gov](https://weather.gov)** – Current weather, forecast, fire weather indices (Haines, transport wind, mixing height, etc.).  
- **[USFS (apps.fs.usda.gov)](https://apps.fs.usda.gov)** – National Forest boundaries, names, region information.  
- **[GACC/NIFC](https://gacc.nifc.gov)** – Geographic Area Coordination Center data for fire potential.  
- **[NWCG (fsapps.nwcg.gov)](https://fsapps.nwcg.gov)** – 7‑day fire potential outlook and related warnings.

**No user data is stored on any server** – only local preference for theme and (optionally) saved location.

---

## Installation & Setup

Swivel-Head Pro is a **static web application** – no server‑side components required.

### Run locally (development / testing)

1. Clone the repository or download all files (`index.html`, `manifest.json`, CSS, JS, assets).  
2. Serve the directory with any static web server, for example:  
   ```bash
   python -m http.server 8000
   ```  
3. Open `http://localhost:8000` in a browser.

### Deploy to GitHub Pages

1. Push the files to your GitHub repository.  
2. Go to **Settings > Pages** and set the source to `main` (or `master`) branch, `/ (root)`.  
3. The app will be available at `https://<your-username>.github.io/<repository-name>/`.

---

## Usage

1. **Open the app** in a modern browser.  
2. **Set your location** via GPS, map click, manual entry, or forest dropdown.  
3. **View all data** – Cards for current conditions, PAL, 7‑day fire potential, humidity recovery, forecast, and safety precautions appear automatically.  
4. **Switch theme** – Click the **🌙 / ☀️** icon in the header.  
5. **Enable notifications** – Click the **🔔** icon and allow browser permissions. You’ll receive a daily summary at 7:00 AM local time.  
6. **Install as PWA** – On Chrome, Edge, or Safari, use “Install” or “Add to Home Screen” for a native‑app experience.

---

## Theme Toggle (Light / Dark)

The header contains a **moon/sun** button that switches the entire interface between light and dark color schemes. Your preference is stored in `localStorage` and persists across sessions. All reports remain fully visible in both themes.

---

## Notifications

If you grant permission, Swivel-Head Pro sends a daily notification at **7:00 AM (local time)** containing:

- Today’s high temperature and wind forecast  
- Project Activity Level and any restrictions  
- Red Flag Warning status (if active)  
- A brief safety recommendation  

Notifications use the browser’s **Push API** and **Service Worker** – no user data is stored on any server.

---

## Contributing

Contributions are welcome! To report bugs or suggest improvements:

1. **Fork** the repository.  
2. Create a **new branch** for your feature/bugfix.  
3. Make your changes (keep code clean and well‑commented).  
4. **Test** thoroughly across multiple browsers/devices.  
5. Open a **Pull Request** describing your changes.

If the repository is not public yet, please contact the project maintainer directly.

---

## License

This project is open source under the terms of the **MIT License**. See the `LICENSE` file in the repository for the full text (if present). If no license file exists, default copyright laws apply.

---

**Swivel-Head Pro** – Stay aware, stay safe.  
[View live app](https://uss-parks.github.io/SitAware/)
```
5. Scroll down, write a commit message (e.g., "Add README"), and click **Commit new file**.

That's it! GitHub will instantly render the formatted README.
