const express = require("express");
const app = express();
const port = 3000;

const controller = require("./lib/controller.js");

app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {
    let movies = controller.getAllMovies();
    res.send(movies);
});

app.get("/movie/:id", (req, res) => {
    let movie = controller.getMovieById(req.params.id);
    res.send(movie);
});

app.post("/movies", (req, res) => {
    controller.saveMovie(req.body.title).then(movie => {
        if (movie) {
            res.status(200).send(movie);
        } else {
            res.status(510).send({
                error: "Cannot add the movie. The movie already exists in the database."
            });
        }
    });
});

app.delete("/movies", (req, res) => {
    controller.deleteMovie(req.body.id);
    res.status(200).send({
        message: "Movie deleted succesfully"
    });
});

app.put("/movies", (req, res) => {
    let movie = controller.updateMovie(req.body.id, req.body.title);
    res.status(200).send(movie);
});

app.listen(port, () => console.log("Listening on port " + port));
