# obs-multistream-counter-Twitch-Kick-and-Youtube
A lightweight, real-time multistream viewer counter widget for OBS &amp; Streamlabs. Live metrics for Twitch, YouTube, and Kick in one clean overlay!


# 📊 Multistream Viewer Counter

A clean, lightweight, and responsive overlay widget for OBS Studio, Streamlabs, or any streaming software. It combines live viewer counts from **Twitch**, **YouTube**, and **Kick** into a single aggregated counter in real time.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Features

- **Multi-Platform Support:** Tracks viewers from Twitch, YouTube, and Kick simultaneously.
- **Total Aggregation:** Automatically calculates and displays the combined total viewer count.
- **OBS Ready:** Transparent background designed specifically for Browser Sources.
- **Non-Blocking & Fast:** Fetches API data asynchronously (`Promise.allSettled`) to prevent lag or freeze if one service fails.
- **Official YouTube API v3 Integration:** Stable YouTube tracking that avoids scraper blocks.

---

## 🚀 Quick Start

### 1. Clone or Download
Clone this repository or download the source files (`index.html`, `style.css`, `script.js`):

--

## 🛠️ Configure Handles & API Keys

🔑 How to Get a Free YouTube API Key
Go to the Google Cloud Console.

Log in with your Google account and click Create Project (e.g., Multistream-Counter).

In the top search bar, search for YouTube Data API v3 and click Enable.

Go to Credentials (left menu) -> Click Create Credentials -> Select API Key.

Copy your generated key and paste it into the YT_API_KEY variable in script.js.

💡 Free Usage Allowance: Google provides 10,000 free quota units per day. At the default 30-second refresh rate, this script uses ~2,800 units per 24 hours, remaining 100% free forever.

📽️ How to Add to OBS / Streamlabs
Open OBS Studio or Streamlabs OBS.

In your preferred Scene, add a new Source: Browser (Browser Source).

Check the box Local file.

Click Browse and select your edited index.html file.

Set the recommended dimensions:

Width: 500

Height: 100

Click OK and drag/resize the overlay anywhere on your stream canvas!

🛠️ Built With
HTML5 / CSS3 – Minimalist layout with customized platform brand colors.

Vanilla JavaScript – Zero external dependencies or heavy frameworks required.

DecAPI & YouTube Data API v3 – Reliable metrics retrieval.

📄 License
This project is open-source and available under the MIT License.

```bash
git clone [https://github.com/YOUR_USERNAME/multistream-viewer-counter.git](https://github.com/YOUR_USERNAME/multistream-viewer-counter.git)


