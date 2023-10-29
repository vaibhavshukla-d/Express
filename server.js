const express = require("express");

const app = express();
const port = 4000;
const crypto = require("crypto");
const securitykey = "706b889da35c4992b71f439d3d70f19a";
const cors = require("cors");

app.use(express.json());
app.use(cors());

function encrypt(text) {
  var key = securitykey;
  if (text === "") {
    return text;
  }
  try {
    const hash = crypto
      .createHash("sha256")
      .update(key, "utf16le")
      .digest("hex");
    const keyBytes = new Uint8Array(
      hash.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    ).slice(0, 32);

    const iv = Buffer.alloc(16); // Initialization Vector
    const cipher = crypto.createCipheriv("aes-256-cbc", keyBytes, iv);

    let encryptedText = cipher.update(text, "utf16le", "base64");
    encryptedText += cipher.final("base64");

    return encryptedText;
  } catch (error) {
    console.error(error);
    return text;
  }
}

app.post("/api", async (req, resp) => {
  const BASE_API_URL = "https://csblrqa.brnetsaas.com:2443/CoreAPI/CLM";
  console.log("req.body", req.body);

  try {
    const userInput = req.body;

    if (userInput.Method === "AuthenticateLogin") {
      // Encrypt the password
      userInput.Password = encrypt(userInput.Password);
      console.log(userInput);
    }

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
