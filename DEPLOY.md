# Swivel-Head Pro -- GitHub Pages Deployment Guide

This walks you through getting Swivel-Head Pro live on the internet so your Yurok OES team (or anyone you share the link with) can open it on their phone, tap "Add to Home Screen," and use it like a native app. No app store, no developer account, no fees.

---

## What You Need

- A GitHub account (free): https://github.com/signup
- Git installed on your computer
- Your three Swivel-Head Pro files: `index.html`, `manifest.json`, `sw.js`

If you don't have Git installed, download it from https://git-scm.com/downloads and run the installer with default settings. On Mac, open Terminal and type `git` -- it will prompt you to install Xcode Command Line Tools, which includes Git.


---

## Step 1: GitHub Repository

Already created at: https://github.com/USS-Parks/SitAware


---

## Step 2: Push Your Files

Open a terminal (Command Prompt on Windows, Terminal on Mac) and run these commands one at a time.

```bash
# Navigate to the Swivel-Head Pro folder
cd C:\Users\17076\Documents\Claude\ForestWatch

# Initialize a git repository
git init

# Add all three files
git add index.html manifest.json sw.js

# Create the first commit
git commit -m "Swivel-Head Pro PWA v1.0"

# Point it at your GitHub repo
git remote add origin https://github.com/USS-Parks/SitAware.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If GitHub asks for credentials, it will open a browser window for authentication. Follow the prompts.

After pushing, refresh the GitHub repo page. You should see your three files listed.


---

## Step 3: Enable GitHub Pages

1. On your repo page, click **Settings** (gear icon, top menu bar)
2. In the left sidebar, click **Pages**
3. Under "Source," select **Deploy from a branch**
4. Under "Branch," select **main** and leave the folder as **/ (root)**
5. Click **Save**

GitHub starts building. It takes 1-3 minutes the first time.


---

## Step 4: Get Your Live URL

After a minute or two, refresh the Settings > Pages page. You'll see a green banner:

> Your site is live at `https://uss-parks.github.io/SitAware/`

That's it. That URL is your app. Open it in Chrome on your phone right now and verify:
- The map loads
- GPS locate works (tap the locate button)
- Weather data populates after location is set
- The header, cards, and PAL badge all render correctly


---

## Step 5: Install as a Phone App

### Android (Chrome)
1. Open the URL in Chrome
2. Tap the three-dot menu (top right)
3. Tap **"Add to Home Screen"** or **"Install app"**
4. Tap **Install**
5. Swivel-Head Pro appears on your home screen with the fire icon

### iPhone (Safari)
1. Open the URL in **Safari** (not Chrome -- iOS only supports PWA install from Safari)
2. Tap the **Share** button (square with arrow, bottom center)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**
5. Swivel-Head Pro appears on your home screen

Once installed, it opens in standalone mode -- no browser chrome, no URL bar. Looks and feels like a native app.


---

## Step 6: Share with Your Team

Send your OES staff this message (or something like it):

> **Swivel-Head Pro is live.** Open this link on your phone and add it to your home screen:
> 
> https://uss-parks.github.io/SitAware/
> 
> **Android:** Open in Chrome > three-dot menu > "Add to Home Screen"
> **iPhone:** Open in Safari > Share button > "Add to Home Screen"
> 
> It gives you real-time fire weather, PAL levels, humidity recovery, and red flag warnings for whichever National Forest you're in. GPS auto-detects your forest, or you can pick one manually.

That's the entire distribution process. No MDM, no app store review, no sideloading. Anyone with the link can install it in 10 seconds.


---

## Updating the App

When you want to push changes (new features, bug fixes):

```bash
cd C:\Users\17076\Documents\Claude\ForestWatch

# Stage your changed files
git add index.html manifest.json sw.js

# Commit with a description of what changed
git commit -m "Added drought index to pro mode"

# Push to GitHub
git push
```

GitHub Pages rebuilds automatically. The new version goes live in 1-2 minutes. Users who have it installed will get the updated version next time they open the app (the service worker handles the cache refresh).


---

## Custom Domain (Optional)

If the Tribe wants this on a branded URL like `forestwatch.yurok-nsn.gov`:

1. In your repo, create a file called `CNAME` containing just the domain name:
   ```
   forestwatch.yurok-nsn.gov
   ```
2. In your DNS provider (whoever manages yurok-nsn.gov), add a CNAME record:
   - Name: `forestwatch`
   - Value: `uss-parks.github.io`
3. In GitHub repo Settings > Pages, enter the custom domain and check "Enforce HTTPS"
4. Wait for DNS propagation (can take up to 24 hours, usually much faster)

HTTPS is required for GPS and service worker to function. GitHub Pages provides it automatically for both github.io URLs and verified custom domains.


---

## Quick Local Testing

Before pushing changes to GitHub, you can test locally:

```bash
cd C:\Users\17076\Documents\Claude\ForestWatch

# Start a local web server (Python 3)
python3 -m http.server 8080

# Or on Windows if python3 doesn't work:
python -m http.server 8080
```

Open `http://localhost:8080` in your browser. Everything works locally: GPS, API calls, map, service worker. This is the fastest way to verify changes before pushing.


---

## Troubleshooting

**"Your connection is not private" error:** GitHub Pages HTTPS certificate can take a few minutes to provision on first deploy. Wait 5-10 minutes and try again.

**GPS not working:** Make sure you're accessing via HTTPS (the github.io URL), not HTTP. GPS requires a secure context. Also check that your browser has location permissions enabled for the site.

**Map not loading:** Check your internet connection. The map tiles come from OpenStreetMap via Leaflet CDN. If you're offline, the service worker serves the cached app shell but can't cache map tiles on first load.

**Weather data not populating:** weather.gov occasionally has outages. The app retries twice with exponential backoff. If it still fails, try again in a few minutes. You can also check https://api.weather.gov/ directly to see if the service is up.

**Changes not showing after push:** Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R). The service worker uses a network-first strategy, but aggressive browser caching can interfere. On mobile, close and reopen the app.
