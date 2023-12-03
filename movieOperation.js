const movieModel = require("./models/movieModel");
const createProduct = async (title, Duration, Cast) => {
  console.log("Creating Product");
  let Movies = new movieModel();
  Movies.title = title;
  Movies.Duration = Duration;
  Movies.Cast = Cast;

  await Movies.save();
  return Movies;
};

const getProducts = async () => {
  console.log("Getting Products");
  let Movies = await movieModel.find({});
  return Movies;
};

const deleteProduct = async (id) => {
  console.log("Deleting Product");
  try {
    let movie = await movieModel.findByIdAndDelete(id);

    if (movie) {
      console.log("Deleted movie details:", movie);
      return movie;
    } else {
      console.log("Movie not found or already deleted.");
      return null;
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    return null;
  }
};

const updateProduct = async (id, title, Duration, Cast) => {
  console.log("Updating Product");
  try {
    let movie = await movieModel.findByIdAndUpdate(id, {
      title,
      Duration,
      Cast,
    });

    if (movie) {
      console.log("Updated movie details:", movie);
      return movie;
    } else {
      console.log("Movie not found or already deleted.");
      return null;
    }
  } catch (error) {
    console.error("Error updating movie:", error);
    return null;
  }
};

module.exports.create = createProduct;
module.exports.get = getProducts;
module.exports.delete = deleteProduct;
module.exports.update = updateProduct;
