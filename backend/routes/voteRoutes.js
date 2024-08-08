const express = require("express");
const {
    createVote,
    getVotes,
    submitVote,
} = require("../controllers/voteController");
const router = express.Router();

router.post("/", createVote);
router.get("/", getVotes);
router.post("/:id", submitVote);

module.exports = router;
