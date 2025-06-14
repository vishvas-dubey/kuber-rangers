const fs = require("fs");
const nlp = require("compromise");
const path = require("path");
const shakesphereRouter = require("express").Router();

let wordMap = {};
try {
  wordMap = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/shakespeare-map.json"), "utf-8")
  );
} catch (err) {
  console.error("Failed to load shakespeare-map.json", err);
}

const flairEndings = [
  ", good sir.",
  ", fair maiden.",
  ", by mine honour.",
  ", I prithee.",
  ", dost thou not agree?",
  ", thou know’st it well.",
  ", if fate alloweth."
];

const translateToShakesphere = (text) => {
  const words = text.split(/\s+/); // split by space
  const translated = words.map((word) => {
    const clean = word.toLowerCase().replace(/[.,!?]/g, ""); // remove punctuation
    const mapped = wordMap[clean];
    return mapped ? mapped : word;
  }).join(" ");

  const flair = flairEndings[Math.floor(Math.random() * flairEndings.length)];
  return translated + flair;
};


shakesphereRouter.post("/generate", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Missing Text input!",
        data: null
      });
    }

    const generatedText = translateToShakesphere(text);

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Text Translated",
      data: generatedText
    });
  } catch (error) {
    console.error("Translation Error:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null
    });
  }
});

module.exports = shakesphereRouter;
