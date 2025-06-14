const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const jokeRoute = require('./routes/joke');
const shakespeareRoute = require('./routes/shakesphere');

app.use('/api/joke', jokeRoute);
app.use('/api/shakesphere', shakespeareRoute);

app.get('/', (req, res) => {
  res.send('🎭 Welcome to Initial Route');
});

app.get("/_/health", async (req, res) => {
    return res.status(200).json({
        message: "Health good :)"
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});
