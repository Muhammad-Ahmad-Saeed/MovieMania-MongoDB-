const express = require('express');
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1/MovieMania").then(() => {
    console.log("Connected to database");
}).catch(err => {
    console.log("Could not connect ");
    console.log(err);
})

app.listen(3000);