import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
	players: {
		type: [
			{
				id: String,
				name: String,
				picture: String,
				elo: Number,
				eloDelta: Number,
				description: String,
			},
		],
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
	host_id: {
		type: String,
		required: true,
	},
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
