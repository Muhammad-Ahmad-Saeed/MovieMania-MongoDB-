const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {
  create,
  get,
  delete: deleteMovie,
  update,
} = require("./movieOperation");

app.use(express.json());

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/MovieMania");

    console.log("Connected to database");

    //let createmovie = await create("The Prestige", 130, ["Christian Bale", "Hugh Jackman"]);
    //console.log(createmovie);

    //get all movies
    //let getmovies = await get();
    //console.log(getmovies);

    //delete a movie
    //await deleteMovie("656ce170ab8c76437034e663");

    //update a movie
    await update("656ce56be6ff9c836ca536db", "Insomnia", 120, ["Al Pacino", "Robin Williams"]);

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log("Could not connect ");
    console.log(err);
  }
};

startServer();
