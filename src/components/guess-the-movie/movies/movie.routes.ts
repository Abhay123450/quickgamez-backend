import express from "express";
const router = express.Router();
import { MovieControllerImpl } from "./MovieControllerImpl.js";
import { MovieRepositoryImpl } from "./MovieRepositoryImpl.js";
import { catchAsycError } from "../../../middlewares/catchAsyncError.js";
import {
    validateAddMovieReq,
    validateAddMoviesReq,
    validateGetMoviesReq,
    validateGetRandomMovieReq,
    validateGetUnplayedMoviesReq
} from "./movie.validate.js";
import { query } from "express-validator";
import { MovieServiceImpl } from "./MovieServiceImpl.js";
import {
    authenticateUser,
    isUserAuthenticated
} from "../../../middlewares/userAuth.middleware.js";

const movieRepository = new MovieRepositoryImpl();
const movieService = new MovieServiceImpl(movieRepository);
const movieController = new MovieControllerImpl(movieService);

router
    .route("/movies/random")
    .get(
        validateGetRandomMovieReq(),
        catchAsycError(movieController.getRandomMovies.bind(movieController))
    );

router
    .route("/movies/unplayed")
    .get(
        isUserAuthenticated,
        validateGetUnplayedMoviesReq(),
        catchAsycError(movieController.getUnplayedMovies.bind(movieController))
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
