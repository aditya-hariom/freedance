const express = require('express');
const router = express.Router();
const {
  getCompetitions,
  getCompetitionById,
  registerForCompetition,
  submitEntry
} = require('../controllers/competitionController');

router.get('/', getCompetitions);
router.get('/:id', getCompetitionById);
router.post('/:id/register', registerForCompetition);
router.post('/:id/submit', submitEntry);

module.exports = router;
