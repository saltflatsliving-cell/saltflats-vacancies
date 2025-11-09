import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // allows your B12 site to fetch this API

// Feed URL (only vacant units)
const RM_API_URL = "https://myfeed.rentmanager.com/?token=vEEw8Za8t%2b0%2bfaAqqFS5Ly%2b5VZUYiTaZpHvKaDPDPC4XgjhSbZWoFCE%2bg544TOIamv1BnmZqbws%3d";

app.get("/vacancies", async (req, res) => {
  try {
    const response = await fetch(RM_API_URL);
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
