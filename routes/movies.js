const express = require('express');
const MoviesService = require('../services/movies')
const validationHandler = require('../utils/middleware/validationHandler')
const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schemas/movies')

function moviesApi(app) {
    const router = express.Router();
    app.use('/api/movies', router)

    const moviesService = new MoviesService()

    router.get('/', async function (req, res, next) {
        const { tags } = req.query
        try {
            const movies = await moviesService.getMovies({ tags })
            res.status(200).json({
                data: movies,
                message: 'Movies listed'
            })
        } catch (err) {
            next(err)
        }
    })

    router.get('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        const { movieId } = req.params
        try {
            const movie = await moviesService.getMovie({ movieId })
            res.status(200).json({
                data: movie,
                message: 'Movies retrieved'
            })
        } catch (err) {
            next(err)
        }
    })

    router.post("/", validationHandler(createMovieSchema), async function (req, res, next) {
        const { body: movie } = req
        try {
            const createdMovieId = await moviesService.createMovie({ movie })
            res.status(201).json({
                data: createdMovieId,
                message: 'Movie created'
            })
        } catch (err) {
            next(err)
        }
    })

    router.put("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
        const { movieId } = req.params
        const { body: movie } = req
        try {
            const updatedMovieId = await moviesService.updateMovie({ movieId, movie })
            res.status(200).json({
                data: updatedMovieId,
                message: 'Movie updated'
            })
        } catch (err) {
            next(err)
        }
    })

    router.delete("/:movieId", validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        const { movieId } = req.params
        try {
            const deletedMovieId = await moviesService.deleteMovie({ movieId })
            res.status(200).json({
                data: deletedMovieId,
                message: 'Movie deleted'
            })
        } catch (err) {
            next(err)
        }
    })
}
module.exports = moviesApi