const router = require('express').Router();
const store = require('../db/store');

//notes get route
router.get('/notes', (req, res) => {
  store
    .getAllNotes()
    .then((notes) => {
      return res.json(notes);
    })
    .catch((err) => res.status(500).json(err));
});

//notes post route
router.post('/notes', (req, res) => {
  store
    .addANote(req.body)
    .then((note) => res.json(note))
    .catch((err) => res.status(500).json(err));
});

//notes delete route
router.delete('/notes/:id', (req, res) => {
  store
    .removeANote(req.params.id)
    .then(() => res.json({ ok: true }))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
