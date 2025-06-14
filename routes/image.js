const express = require("express");
const axios = require("axios")
const AWS = require("aws-sdk");
const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

router.post("/image/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const huggingfaceRes = await axios.post("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!huggingfaceRes.ok) {
      const errorText = await huggingfaceRes.text();
      return res.status(500).json({ success: false, message: errorText });
    }

    const imageBuffer = await huggingfaceRes.buffer();
    const key = `generated-images/${Date.now()}.png`;

    const s3Upload = await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: "image/png",
      ACL: "public-read"
    }).promise();

    return res.json({
      success: true,
      url: s3Upload.Location
    });

  } catch (error) {
    console.error("Image Generation Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
