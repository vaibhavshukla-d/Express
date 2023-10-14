// apiRoute.js
const express = require("express");
const router = express.Router();
import("node-fetch")
  .then((fetch) => {
    // Your code that uses the 'fetch' function goes here
  })
  .catch((error) => {
    console.error("Error importing node-fetch:", error);
  });

router.post("/forward", async (req, res) => {
  const BASE_API_URL = "https://csblrqa.brnetsaas.com:2443/CoreAPI/CLM";

  try {
    const userInput = req.body;

    const response = await fetch(BASE_API_URL, {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

module.exports = router;
