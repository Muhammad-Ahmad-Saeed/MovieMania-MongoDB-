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

// Create a new movie
app.post("/movies", async (req, res) => {
  try {
    const { title, Duration, Cast } = req.body;
    const newMovie = await create(title, Duration, Cast);
    res.json(newMovie);
  } catch (err) {
    console.log("Error creating movie");
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await get();
    res.json(movies);
  } catch (err) {
    console.log("Error fetching movies");
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a movie
app.put("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, Duration, Cast } = req.body;
    const updatedMovie = await update(id, title, Duration, Cast);
    if (updatedMovie) {
      res.json(updatedMovie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (err) {
    console.log("Error updating movie");
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a movie
app.delete("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await deleteMovie(id);
    if (deletedMovie) {
      res.json(deletedMovie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (err) {
    console.log("Error deleting movie");
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", async (req, res) => {
  try {
    const movies = await get();
    res.send(`
      <html>
        <head>
          <title>MovieMania</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }

            h1 {
              color: #333;
            }

            ul {
              list-style-type: none;
              padding: 0;
            }

            li {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }

            label {
              display: block;
              margin-bottom: 5px;
            }

            input {
              margin-bottom: 10px;
              padding: 5px;
            }

            button {
              padding: 8px 16px;
              background-color: #4caf50;
              color: #fff;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h1>Movies</h1>
          <ul>
            ${movies.map(movie => `
              <li>
                <strong>Title:</strong> ${movie.title}<br>
                <strong>Duration:</strong> ${movie.Duration} mins<br>
                <strong>Cast:</strong> ${movie.Cast.join(', ')}
              </li>`).join('')}
          </ul>

          <h2>Create Movie</h2>
          <form id="createForm">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required><br>
            <label for="duration">Duration:</label>
            <input type="number" id="duration" name="duration" required><br>
            <label for="cast">Cast (comma-separated):</label>
            <input type="text" id="cast" name="cast" required><br>
            <button type="button" onclick="createMovie()">Create Movie</button>
          </form>

          <h2>Update Movie</h2>
          <form id="updateForm">
            <label for="updateId">Movie ID to Update:</label>
            <input type="text" id="updateId" name="updateId" required><br>
            <label for="updateTitle">New Title:</label>
            <input type="text" id="updateTitle" name="updateTitle" required><br>
            <label for="updateDuration">New Duration:</label>
            <input type="number" id="updateDuration" name="updateDuration" required><br>
            <label for="updateCast">New Cast (comma-separated):</label>
            <input type="text" id="updateCast" name="updateCast" required><br>
            <button type="button" onclick="updateMovie()">Update Movie</button>
          </form>

          <h2>Delete Movie</h2>
          <form id="deleteForm">
            <label for="deleteId">Movie ID to Delete:</label>
            <input type="text" id="deleteId" name="deleteId" required><br>
            <button type="button" onclick="deleteMovie()">Delete Movie</button>
          </form>

          <script>
            function createMovie() {
              const title = document.getElementById('title').value;
              const duration = document.getElementById('duration').value;
              const cast = document.getElementById('cast').value.split(',').map(item => item.trim());

              fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, Duration: duration, Cast: cast }),
              })
              .then(response => response.json())
              .then(data => {
                console.log('Movie created:', data);
                alert('Movie created successfully!');
              })
              .catch(error => {
                console.error('Error creating movie:', error);
                alert('Error creating movie. Please check the console for details.');
              });
            }

            function updateMovie() {
              const id = document.getElementById('updateId').value;
              const title = document.getElementById('updateTitle').value;
              const duration = document.getElementById('updateDuration').value;
              const cast = document.getElementById('updateCast').value.split(',').map(item => item.trim());

              fetch(\`http://localhost:3000/movies/\${id}\`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, Duration: duration, Cast: cast }),
              })
              .then(response => response.json())
              .then(data => {
                console.log('Movie updated:', data);
                alert('Movie updated successfully!');
              })
              .catch(error => {
                console.error('Error updating movie:', error);
                alert('Error updating movie. Please check the console for details.');
              });
            }

            function deleteMovie() {
              const id = document.getElementById('deleteId').value;

              fetch(\`http://localhost:3000/movies/\${id}\`, {
                method: 'DELETE',
              })
              .then(response => response.json())
              .then(data => {
                console.log('Movie deleted:', data);
                alert('Movie deleted successfully!');
              })
              .catch(error => {
                console.error('Error deleting movie:', error);
                alert('Error deleting movie. Please check the console for details.');
              });
            }
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.log("Error fetching movies");
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/MovieMania");
    console.log("Connected to database");

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
