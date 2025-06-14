const oneliner = require("one-liner-joke")
const jokeRoute = require("express").Router()

jokeRoute.get("/random", async (req, res) => {
    const joke = oneliner.getRandomJoke()
    if(joke){
        return res.status(200).json({
            status: 200,
            success: true,
            message: "joke generate",
            data: joke
        })
    }
})

module.exports = jokeRoute