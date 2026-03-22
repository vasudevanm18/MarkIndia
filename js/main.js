// Get user location
function getLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    localStorage.setItem("lat", pos.coords.latitude);
    localStorage.setItem("lng", pos.coords.longitude);
  });
}

// Time ago
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);

  if (mins < 60) return mins + " mins ago";
  return Math.floor(mins / 60) + " hours ago";
}
