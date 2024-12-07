// src/models/Round.js
class Round {
    constructor(id, course, players) {
        this.id = id;
        this.course = course;
        this.players = players; // Array of Player objects
        this.scores = {}; // { playerId: [scores] }
    }

    recordScore(playerId, hole, score) {
        if (!this.scores[playerId]) {
            this.scores[playerId] = [];
        }
        this.scores[playerId][hole - 1] = score;
    }
}

export default Round;