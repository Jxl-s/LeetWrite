import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
	players: {
		type: Array,
		required: true,
	},
	feedback: {
		type: Array,
		required: true,
	},
	language: {
		type: String,
		required: true,
	},
	submissions: {
		type: Array,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
	cleanliness: {
		type: String,
		required: true,
	},
	rarity: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
