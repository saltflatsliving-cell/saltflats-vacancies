import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // allows your B12 site to fetch this API

// Rent Manager API credentials from Render environment variables
const RM_USERNAME = process.env.RM_USERNAME;
const RM_PASSWORD = process.env.RM_PASSWORD;

// Basic Auth header
const RM_AUTH = "Basic " + Buffer.from(`${RM_USERNAME}:${RM_PASSWORD}`).toString("base64");

// Feed URL (only vacant units)
const RM_API_URL = "https://api.rentmanager.com/v3/feeds/regent-default-1/units?$filter=Status eq 'Vacant'";

app.get("/vacancies", async (req, res) => {
  try {
    const response = await fetch(RM_API_URL, {
      headers: { Authorization: RM_AUTH }
    });
    const data = await response.json();

    // Only send the fields we want
    const cleaned = data.map(unit => ({
      name: unit.Name,
      rent: unit.Rent,
      sqft: unit.SquareFeet,
      status: unit.Status
    }));

    res.json(cleaned);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch data from Rent Manager" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Vacancy API running on port ${PORT}`));