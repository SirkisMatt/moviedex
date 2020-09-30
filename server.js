require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies.json')



const app = express()
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

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
//params genre, country or avg_vote

// genre, users are searching for 
// whether the Movie's genre includes a specified string. The 
// search should be case insensitive.

// country, users are searching for whether the Movie's 
// country includes a specified string. The search should be 
// case insensitive.

// average vote, users are searching for Movies with an avg_vote that 
// is greater than or equal to the supplied number.

function handleGetMovie(req, res) {
    let response = MOVIES;

    const { search = "", genre, country, avg_vote } = req.query;

   
    //filter movies by genre, if genre query param is present
    if (genre) {
        response = response.filter(movie =>
            //case sensitive searching
            movie.genre.toLowerCase().includes(genre.toLowerCase())
            )
    }
    //filter movies by country, if country includes a specified string
    if (country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(country.toLowerCase())
        )
    }

    //filter movies by avg_vote, if avg_vote  is greater than or equal to the supplied number
    let getNum = Number(avg_vote)
    
    if (avg_vote) {
        if (!getNum) {
            return res
                .status(400)
                .send("A number is required")
        } 
    }

    if (getNum) {
        response = response.filter(movie => 
            movie.avg_vote >= getNum     
        )
    }

    res.json(response)
}

app.get('/movie', handleGetMovie) 

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = {error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})