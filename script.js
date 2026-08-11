/**
 * Multistream Viewer Counter - Core Logic
 * Real-time viewer count aggregation for Twitch, YouTube & Kick.
 *
 * @author      Xaardaaz
 * @repository  https://github.com/Xaardaaz/obs-multistream-counter-Twitch-Kick-and-Youtube
 * @license     MIT
 */

// ===========================================================
// CONFIGURATION (Replace placeholders with your actual data)
// ===========================================================
const TWITCH_USER = 'YOUR_TWITCH_USERNAME';
const KICK_USER = 'YOUR_KICK_USERNAME';
const YT_CHANNEL_INPUT = '@YOUR_YOUTUBE_HANDLE'; // Can be @handle, channel ID (UC...), or full URL
const YT_API_KEY = 'YOUR_YOUTUBE_DATA_API_KEY'; 
// ===========================================================

let cachedYtChannelId = null;

// 1. Fetch Twitch Viewers
async function fetchTwitchViewers(user) {
  if (!user || user === 'YOUR_TWITCH_USERNAME') return 0;
  try {
    const res = await fetch('https://decapi.me/twitch/viewercount/' + encodeURIComponent(user));
    if (res.ok) {
      const text = (await res.text()).trim();
      if (text && !text.toLowerCase().includes('error') && !text.toLowerCase().includes('offline')) {
        const num = parseInt(text, 10);
        return isNaN(num) ? 0 : num;
      }
    }
  } catch (e) {}
  return 0;
}

// 2. Fetch Kick Viewers
async function fetchKickViewers(user) {
  if (!user || user === 'YOUR_KICK_USERNAME') return 0;
  
  // Try DecAPI first
  try {
    const decRes = await fetch('https://decapi.me/kick/viewers/' + encodeURIComponent(user));
    if (decRes.ok) {
      const text = (await decRes.text()).trim();
      if (text && !text.toLowerCase().includes('error') && !text.toLowerCase().includes('offline')) {
        const num = parseInt(text, 10);
        if (!isNaN(num)) return num;
      }
    }
  } catch (e) {}

  // Fallback to official Kick API
  try {
    const res = await fetch('https://kick.com/api/v1/channels/' + encodeURIComponent(user));
    if (res.ok) {
      const data = await res.json();
      if (data && data.livestream && typeof data.livestream.viewer_count === 'number') {
        return data.livestream.viewer_count;
      }
    }
  } catch (e) {}

  return 0;
}

// Helper: Resolve YouTube Channel ID from handle/URL
async function resolveYtChannelId(apiKey, input) {
  if (input.startsWith('UC') && input.length > 20) return input;
  let handle = input;
  if (input.includes('youtube.com/@')) handle = input.split('@')[1].split('/')[0];
  else if (input.startsWith('@')) handle = input.slice(1);
  
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handle)}&type=channel&maxResults=1&key=${apiKey}`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  if (data.error || !data.items || data.items.length === 0) return null;
  return data.items[0].snippet.channelId;
}

// 3. Fetch YouTube Viewers using Data API v3
async function fetchYouTubeViewers() {
  if (!YT_API_KEY || YT_API_KEY === 'YOUR_YOUTUBE_DATA_API_KEY') return 0;

  try {
    // Step A: Resolve Channel ID (cached for subsequent calls)
    if (!cachedYtChannelId) {
      cachedYtChannelId = await resolveYtChannelId(YT_API_KEY, YT_CHANNEL_INPUT);
    }
    if (!cachedYtChannelId) return 0;

    // Step B: Search for active live stream
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${cachedYtChannelId}&eventType=live&type=video&maxResults=1&key=${YT_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.error || !searchData.items || searchData.items.length === 0) return 0;
    const videoId = searchData.items[0].id.videoId;

    // Step C: Fetch live stream viewer metrics
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${YT_API_KEY}`;
    const videoRes = await fetch(videoUrl);
    const videoData = await videoRes.json();

    if (videoData.error || !videoData.items || videoData.items.length === 0) return 0;
    const viewers = videoData.items[0].liveStreamingDetails?.concurrentViewers;
    
    return parseInt(viewers, 10) || 0;
  } catch (e) {
    console.error('Error fetching YouTube stats:', e);
    return 0;
  }
}

// Main Update Cycle
async function updateCounter() {
  const [twitchRes, kickRes, ytRes] = await Promise.allSettled([
    fetchTwitchViewers(TWITCH_USER),
    fetchKickViewers(KICK_USER),
    fetchYouTubeViewers()
  ]);

  const twitchViewers = twitchRes.status === 'fulfilled' ? twitchRes.value : 0;
  const kickViewers = kickRes.status === 'fulfilled' ? kickRes.value : 0;
  const ytViewers = ytRes.status === 'fulfilled' ? ytRes.value : 0;

  document.getElementById('twitch-count').textContent = twitchViewers;
  document.getElementById('kick-count').textContent = kickViewers;
  document.getElementById('yt-count').textContent = ytViewers;
  document.getElementById('total-count').textContent = twitchViewers + kickViewers + ytViewers;
}

// Initial execution and polling interval (30 seconds)
updateCounter();
setInterval(updateCounter, 30000);
