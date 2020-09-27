require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./movies.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))

//Validate API_TOKEN before we move to the next station
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    
    //move to the next middleware
    next()
})

function handleGetMovie(req, res) {
    let response = MOVIES.movie

    res.json(response)
}

app.get('/movie', handleGetMovie) 

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})