const oneliner = require("one-liner-joke");
const jokeRoute = require("express").Router();
const AWS = require("aws-sdk");
require("dotenv").config();

// ✅ Configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

jokeRoute.get("/random", async (req, res) => {
    try {
        const joke = oneliner.getRandomJoke();
        const jokeText = joke.body;

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `jokes/joke-${Date.now()}.txt`, // e.g., jokes/joke-1718349271918.txt
            Body: jokeText,
            ContentType: "text/plain",
        };

        // ✅ Upload to S3
        await s3.upload(params).promise();

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Joke generated and uploaded to S3",
            data: joke,
        });
    } catch (error) {
        console.error("Joke Upload Error:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
        });
    }
});

module.exports = jokeRoute;
