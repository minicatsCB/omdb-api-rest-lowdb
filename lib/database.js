const _ = require("lodash");
const lodashId = require('lodash-id');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('database/db.json');
const db = low(adapter);

db._.mixin(lodashId);
db._.id = 'key';

let database = {
    collection: db.defaults({ movies: [] }).get('movies'),
    getAllMovies: function() {
        return db.get("movies").value() || [];
    },
    saveMovie: function(movie) {
        let movieExists = database.checkMovieExists(movie.Title);
        if (movieExists) {
            console.log("Cannot add the movie. The movie already exists in the database.");
        } else {
            let data = {
                "title": "",
                "poster": "",
                "actors": "",
                "awards": "",
                "country": "",
                "director": "",
                "genre": "",
                "language": "",
                "plot": "",
                "rated": "",
                "released": "",
                "runtime": "",
                "imdbRating": ""
            };

            // Convert movie attributes names to camelCase. Note: it is not recursive.
            let normalizedData = _.mapKeys(movie, (value, key) => _.camelCase(key));
            for (prop in data) {
                data[prop] = normalizedData[prop];
            }

            const newMovie = database.collection
                .insert({value: data})
                .write();

            return newMovie;
        }
    },
    checkMovieExists: function(title) {
        const foundMovie = database.collection
            .map("value")
            .find({title: title})
            .value();

        return !!foundMovie;
    },
    getMovieById: function(movieKey) {
        const foundMovie = database.collection
            .getById(movieKey)
            .value();

        return foundMovie;
    },
    deleteMovie: function(movieKey) {
        const foundMovie = database.collection
            .removeById(movieKey)
            .write();
    },
    updateMovie: function(movieKey, changedData) {
        const updatedMovie = database.collection
            .getById(movieKey)
            .get("value")
            .assign({title: changedData})
            .write();

        return updatedMovie;
    }
};

module.exports = database;
