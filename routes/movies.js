const router = require('express').Router();
const { getMovies, deleteMovie, createMovie } = require('../controllers/movies');
const { validateObjId, validateMovie } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validateMovie, createMovie);
router.delete('/:id', validateObjId, deleteMovie);

module.exports = router;
