import { createCommand, createScene, createStep } from "@waylis/core";
import { isIP } from "node:net";

export const command = createCommand({
  value: "ip_geolocation",
  label: "🌍 IP geolocation",
  description: "Look up the geolocation of any valid IP address.",
});

const apiHost = "https://eu-central-1.geolocated.io";
const apiKey = process.env.GEOLOCATED_API_KEY;

interface ApiResponse {
  version: string;
  addressType: string;
  continentName?: string;
  countryName?: string;
  regionName?: string;
  cityName?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  timeZone?: string;
}

const ip = createStep({
  key: "ip",
  prompt: { type: "text", content: "Please enter some IP address" },
  reply: { bodyType: "text", bodyLimits: { minLength: 7, maxLength: 128 } },
  handler: async (ip) => {
    if (!isIP(ip)) {
      return { type: "text", content: "Invalid IP address, try another one." };
    }
  },
});

export const scene = createScene({
  steps: [ip],
  handler: async (answers) => {
    try {
      const req = await fetch(`${apiHost}/ip/${answers.ip}?api-key=${apiKey}`);
      const info = (await req.json()) as ApiResponse;

      return {
        type: "table",
        content: {
          head: ["Parameter", "Value"],
          body: [
            ["Version", info.version],
            ["Address type", info.addressType],
            ["🌍 Continent", info.continentName || "-"],
            ["🗺️ Country", info.countryName || "-"],
            ["🛣️ Region", info.regionName || "-"],
            ["🏙️ City", info.cityName || "-"],
            ["🧭 District", info.district || "-"],
            ["📍 Coordinates", info.latitude ? `${info.latitude}, ${info.longitude}` : "-"],
            ["⏱️ Timezone", info.timeZone || "-"],
          ],
        },
      };
    } catch (error) {
      console.error(error);
      return { type: "text", content: "Opps... Something went wrong. Try other request or wait a bit." };
    }
  },
});

export const ipGeolocation = { command, scene };
