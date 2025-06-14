const fs = require("fs");
const nlp = require("compromise");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
require("dotenv").config();

const shakesphereRouter = require("express").Router();

// AWS S3 Config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

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
  const words = text.split(/\s+/);
  const translated = words.map((word) => {
    const clean = word.toLowerCase().replace(/[.,!?]/g, "");
    const mapped = wordMap[clean];
    return mapped ? mapped : word;
  }).join(" ");

  const flair = flairEndings[Math.floor(Math.random() * flairEndings.length)];
  return translated + flair;
};

const uploadToS3 = async (content, filename) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `shakespeare/${filename}.txt`,
    Body: content,
    ContentType: "text/plain"
  };

  const data = await s3.upload(params).promise();
  return data.Location; // Public URL
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

    // Upload result to S3
    const fileUrl = await uploadToS3(generatedText, `translation-${uuidv4()}`);

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Text Translated and Uploaded",
      data: {
        translatedText: generatedText,
        fileUrl: fileUrl
      }
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
