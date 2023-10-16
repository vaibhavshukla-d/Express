const express = require("express");

const app = express();
const port = 4000;

app.use(express.json());

app.post("/api", async (req, resp) => {
  const BASE_API_URL = "https://csblrqa.brnetsaas.com:2443/CoreAPI/CLM";
  console.log("req.body", req.body);

  try {
    const userInput = req.body;

    const response = await fetch(BASE_API_URL, {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        Authorization:
          "CLMAuth 1319e401ed835e68c58992edc1cec98d18a2d4c55498aaf9a52116ae168f4011:1697282448:79d75114d25c4bfeb59bb7477c32067c",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    console.log("data", data);

    return resp.json(data);
  } catch (error) {
    console.error(error);
    return resp
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
