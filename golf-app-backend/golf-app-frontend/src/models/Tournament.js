// src/models/Tournament.js
import { TournamentType, TournamentStatus } from './enums';

class Tournament {
    constructor(id, name, type, status, rounds = []) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
        this.rounds = rounds; // Array of Round objects
        this.players = []; // Array of Player objects
    }

    addRound(round) {
        this.rounds.push(round);
    }

    registerPlayer(player) {
        this.players.push(player);
    }

    calculateStandings() {
        // Logic to calculate standings
    }
}

export default Tournament;