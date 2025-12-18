const axios = require("axios");

module.exports.geocodeLocation = async (location, country) => {
  const query = `${location}, ${country}`;
  const url = "https://nominatim.openstreetmap.org/search";

  try {
    const response = await axios.get(url, {
      params: {
        q: query,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "wanderlust-project"
      }
    });

    if (!response.data.length) {
      return null;
    }

    return {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon)
    };
  } catch (err) {
    console.error("Geocoding Error:", err);
    return null;
  }
};
