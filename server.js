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
        filteredMovieList = filteredMovieList.filter(filtered => 
            filtered.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }
    if(country){
        filteredMovieList = filteredMovieList.filter(filtered => 
            filtered.country.toLowerCase().includes(country.toLowerCase())
        )
    }
    if(avg_vote){
        filteredMovieList = filteredMovieList.filter(filtered => 
            Number(filtered.avg_vote) >= Number(avg_vote)
        )
    }


    if(filteredMovieList.length){
        res.status(200).json(filteredMovieList)
    }else{
        res.status(400).send('Sorry, no matching movies.')
    }
    

    
    //then country

    //then filter by movies with rating > avg_vote
}

app.get('/movies', handleGetMovie);

app.use((error, req, res, next) => {
    let response
    if(process.env.NODE_ENV === 'production'){
        reponse = {error: {message: 'server error'}}
    }else{
        reponse = { error }
    }
    res.status(500).json(response);
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
});