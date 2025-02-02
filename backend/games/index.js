import OpenAI from "openai";
import { getCodePrompt } from "../utils/prompts.js";

export let io;
export let aiClient;

export function setIO(server) {
	io = server;
}
export function setAI(ai) {
	aiClient = ai;
}

export const openGames = [
	//{
	//	host: "Mr Skibidi",
	//	host_picture:
	//		"https://lh3.googleusercontent.com/a/ACg8ocK3qLw5jsPQVQvsH2q4riPpSmYWbAh-S6VnRrAdYMI9IAayP552=s96-c",
	//	host_id: "123123123",
	//	rarity: "Rare",
	//	cleanliness: "Clean",
	//	capacity: 4,
	//	id: 100,
	//	players: [
	//		{
	//			name: "Mr Skibidi",
	//			picture:
	//				"https://lh3.googleusercontent.com/a/ACg8ocK3qLw5jsPQVQvsH2q4riPpSmYWbAh-S6VnRrAdYMI9IAayP552=s96-c",
	//			id: "123123123",
	//			elo: 1000,
	//		},
	//	],
	//},
];

export function addGame(game) {
	openGames.push(game);
	io?.emit("openGamesUpdated", openGames);
}

export function joinGame(gameId, player) {
	const game = openGames.find(game => game.id == gameId);
	if (!game) return false;

	// check if player already in
	if (game.players.find(p => p.id == player.id)) return false;

	game.players.push(player);
	io?.emit("openGamesUpdated", openGames);
	return true;
}

export function deleteGame(gameId) {
	const index = openGames.findIndex(game => game.id == gameId);
	if (index == -1) return false;

	openGames.splice(index, 1);
	io?.emit("openGamesUpdated", openGames);
	return true;
}

export function createGame({
	host,
	host_id,
	host_picture,
	host_elo,
	language,
	rarity,
	cleanliness,
	capacity,
}) {
	const id = openGames.length + 1;
	addGame({
		host,
		host_id,
		host_picture,
		rarity,
		cleanliness,
		capacity,
		language,
		id,
		players: [
			{
				name: host,
				picture: host_picture,
				id: host_id,
				elo: host_elo,
			},
		],
	});

	console.log(openGames);
}

export function kickPlayer(gameId, kickerId, playerId) {
	const game = openGames.find(game => game.id == gameId);
	if (!game) return false;

	if (game.host_id != kickerId) return false;

	const index = game.players.findIndex(p => p.id == playerId);
	if (index == -1) return false;

	game.players.splice(index, 1);
	io?.emit("openGamesUpdated", openGames);
	return true;
}

export const currentGames = [
	{
		id: 1,
		code: 'def main():\tprint("hello world")',
		rarity: "Common",
		cleanliness: "Messy",
		language: "Python",
		summary: "this prints hello world",
		players: [
			{
				id: "123123123",
				name: "Mr Skibidi",
				words: 1021,
				picture: "",
				status: "Writing",
				description: "",
			},
			{
				id: "123123124",
				name: "Mr Skibidi",
				picture: "",
				words: 1021,
				status: "Writing",
				description: "",
			},
		],
	},
];

function filterGame(data) {
	const copy = { ...data, players: [] };
	delete copy.summary;
	for (const player of data.players) {
		copy.players.push({
			id: player.id,
			name: player.name,
			picture: player.picture,
			words: player.words,
			status: player.status,
		});
	}

	return copy;
}

export async function startGame(gameId, starterPlayerId) {
	const game = openGames.find(game => game.id == gameId);
	if (!game) return false;

	if (game.host_id != starterPlayerId) return false;

	const index = openGames.findIndex(game => game.id == gameId);
	if (index == -1) return false;

	openGames.splice(index, 1);
	currentGames.push(game);

	io?.emit("gameStartWait", gameId);

	// Generate the questions
	const prompt = getCodePrompt(game.rarity, game.cleanliness, game.language);

	const chatCompletion = await aiClient.chat.completions.create({
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
		model: "gpt-4o-mini",
	});

	const msgContent = chatCompletion?.choices?.[0]?.message?.content;
	if (!msgContent) {
		io?.emit("gameStartError", game.id);
		return false;
	}

	const [summary, code] = msgContent.split("====__SEPARATOR__====");
	console.log("summary", summary.trim());
	console.log("code", code.trim());

	let countdown = 3;
	let interval = setInterval(() => {
		io?.emit("gameStartCountdown", game.id, countdown);
		countdown--;
		if (countdown < 0) {
			clearInterval(interval);

			// add the game to the current games
			const newGame = {
				id: currentGames.length + 1,
				code: code.trim(),
				rarity: game.rarity,
				cleanliness: game.cleanliness,
				language: game.language,
				summary: summary.trim(),
				players: game.players.map(player => ({
					id: player.id,
					name: player.name,
					words: 0,
					picture: player.picture,
					status: "Writing",
					description: "",
				})),
			};

			currentGames.push(newGame);
			io.emit("gameStarted", game.id, filterGame(newGame));
		}
	}, 1000);

	// About to start
	console.log(msgContent);
	//io?.emit("openGamesUpdated", openGames);
}
