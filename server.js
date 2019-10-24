require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const MOVIEDEX = require('./movies-data.json');

const app = express();

 
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next){
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).send('Invalid authorization.');
    }
    next();
});


function handleGetMovie(req, res){
    const { genre, country, avg_vote } = req.query;

    let filteredMovieList = MOVIEDEX;
    //filter by genre
    if(genre){
        console.log('genre is ', genre);
        filteredMovieList.filter(filtered => 
            filtered.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }
    if(country){
        console.log('country is ', country);
        filteredMovieList.filter(filtered => 
            filtered.country.toLowerCase().includes(country.toLowerCase())
        )
    }
    if(avg_vote){
        console.log('average vote is parsed to be ', avg_vote);
        filteredMovieList.filter(filtered => 
            Number(filtered.avg_votes) >= Number(avg_vote)
        )
    }


    if(filteredMovieList.length > 1){
        res.status(200).send(filteredMovieList)
    }else{
        res.status(400).send('Sorry, no matching movies.')
    }
    

    
    //then country

    //then filter by movies with rating > avg_vote
}

app.get('/movies', handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});