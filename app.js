const express = require('express');
const morgan = require('morgan');
const { sort } = require('./apps-data');

const app = express();

app.use(morgan('common'));

const apps = require('./apps-data')

app.get('/apps', (req, res) => {
    const {sort, genres} = req.query
    const requiredSortValues = ['rating', 'app']
    let results = apps
    genreUppercase = genres.charAt(0).toUpperCase() + genres.slice(1)
    if(genreUppercase) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genreUppercase)) {
            return res.status(400).send('Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade or Card.')
        }
        else {
            results = results.filter(result => result.Genres.indexOf(genreUppercase) !== -1)
        }
    }

    if(sort) {
        if(!requiredSortValues.includes(sort)) {
            return res
            .status(400)
            .send('Sort must be either rating or app')
        }
        else {
            sortUppercase = sort.charAt(0).toUpperCase() + sort.slice(1)
            results.sort((a, b) => {
                return (a[sortUppercase] < b[sortUppercase]) ? 1 : ((b[sortUppercase] < a[sortUppercase]) ? -1 : 0);
            });
        }
    }
    res
        .json(results)
});

app.listen(5001, () => {
    console.log('Server started on Port 5001')
});