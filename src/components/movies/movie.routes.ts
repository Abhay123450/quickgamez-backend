import express from "express";
const router = express.Router();
import { MovieController } from "./MovieController.js";
import { MovieRepositoryImpl } from "./MovieRepositoryImpl.js";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
import {
    validateAddMovieReq,
    validateAddMoviesReq,
    validateGetMoviesReq,
    validateGetRandomMovieReq
} from "./movie.validate.js";
import { query } from "express-validator";

const movieRepository = new MovieRepositoryImpl();
const movieController = new MovieController(movieRepository);

router
    .route("/movies/random")
    .get(
        validateGetRandomMovieReq(),
        catchAsycError(movieController.getRandomMovie.bind(movieController))
    );

router
    .route("/admin/movies/multiple")
    .post(
        validateAddMoviesReq(),
        catchAsycError(movieController.addMovies.bind(movieController))
    );

router
    .route("/admin/movies")
    .post(
        validateAddMovieReq(),
        catchAsycError(movieController.addMovie.bind(movieController))
    )
    .get(
        validateGetMoviesReq(),
        catchAsycError(movieController.getMovies.bind(movieController))
    )
    .delete();

export const movieRouter = router;
// module.exports = router;
// export default router;
