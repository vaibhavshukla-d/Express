const crypto = require("crypto");

const securitykey = "706b889da35c4992b71f439d3d70f19a";

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

module.exports = encrypt; // Use CommonJS export
