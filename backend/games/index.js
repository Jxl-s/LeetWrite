import OpenAI from "openai";
import { getCodePrompt, getJudgePrompt } from "../utils/prompts.js";
import Game from "../schemas/game.js";
import User from "../schemas/user.js";

function calculateELO(currentELOs, kFactor = 32) {
	const n = currentELOs.length;
	const newELOs = [...currentELOs]; // Create a copy to modify

	for (let i = 0; i < n; i++) {
		let totalChange = 0;
		for (let j = 0; j < n; j++) {
			if (i === j) continue; // Skip self-comparison

			// Actual score: 1 if i is ranked higher than j, 0 otherwise
			const actualScore = i < j ? 1 : 0;

			// Expected score calculation
			const ratingDiff = currentELOs[j] - currentELOs[i];
			const expectedScore = 1 / (1 + Math.pow(10, ratingDiff / 400));

			totalChange += actualScore - expectedScore;
		}
		newELOs[i] = Math.round(newELOs[i] + kFactor * totalChange);
	}

	return newELOs;
}

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
	if (!game.open) return false;

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
		open: true,
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

	io?.emit("gameStartWait", gameId);
	game.open = false;
	io?.emit("openGamesUpdated", openGames);

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
					elo: player.elo,
					words: 0,
					picture: player.picture,
					status: "Writing",
					description: "",
				})),
			};

			currentGames.push(newGame);
			io.emit("gameStarted", game.id, filterGame(newGame));

			const index = openGames.findIndex(game => game.id == gameId);
			openGames.splice(index, 1);
		}
	}, 1000);

	// About to start
	console.log(msgContent);
	//io?.emit("openGamesUpdated", openGames);
}

const lastUpdate = Date.now();
export function updateStatus(gameId, playerId, wordCount) {
	const game = currentGames.find(game => game.id == gameId);
	if (!game) return false;

	const player = game.players.find(player => player.id == playerId);
	if (!player) return false;

	player.words = wordCount;

	if (Date.now() - lastUpdate < 1000) return;
	io?.emit("gameUpdated", gameId, filterGame(game));
}

export async function submitDescription(gameId, playerId, description) {
	const game = currentGames.find(game => game.id == gameId);
	if (!game) return false;

	const player = game.players.find(player => player.id == playerId);
	if (!player) return false;
	if (player.status === "Submitted") return false;

	player.description = description;
	player.status = "Submitted";

	io?.emit("gameUpdated", gameId, filterGame(game));

	// Check if all players submitted now
	const allSubmitted = game.players.every(
		player => player.status === "Submitted",
	);

	if (!allSubmitted) return true;
	io?.emit("gameAllSubmitted", gameId);

	// Start judging
	const prompt = getJudgePrompt(
		game.code,
		game.summary,
		game.players.map(player => player.description),
	);

	console.log(prompt);
	const chatCompletion = await aiClient.chat.completions.create({
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
		model: "gpt-4o-mini",
	});

	const msgContent =
		chatCompletion?.choices?.[0]?.message?.content + "\n==PLAYER_END==";
	if (!msgContent) {
		io?.emit("gameJudgeError", gameId);
		return false;
	}

	try {
		console.log(msgContent);
		const content = [];
		let current = [];
		for (const line of msgContent.split("\n")) {
			if (line.length == 0) continue;
			if (line.startsWith("==PLAYER")) {
				if (current.length > 0) {
					current[0] = parseFloat(current[0]);
					current[1] = parseFloat(current[1]);
					current[2] = parseFloat(current[2]);

					content.push(current);
					current = [];
				}
			} else {
				current.push(line);
			}
		}

		console.log(content);

		const playerOrder = game.players.map((player, i) => [player, i]);
		// sort by score
		playerOrder.sort((a, b) => {
			const aScore =
				content[a[1]][0] + content[a[1]][1] + content[a[1]][2];
			const bScore =
				content[b[1]][0] + content[b[1]][1] + content[b[1]][2];

			return bScore - aScore;
		});

		const previousElos = playerOrder.map(p => p[0].elo);
		const newElos = calculateELO(playerOrder.map(p => p[0].elo));
		const deltaElos = newElos.map((elo, i) => elo - previousElos[i]);
		const idToDelta = {};
		for (let i = 0; i < playerOrder.length; i++) {
			idToDelta[playerOrder[i][0].id] = [newElos[i], deltaElos[i]];
		}

		console.log(idToDelta);
		// update for each user
		for (let i = 0; i < playerOrder.length; i++) {
			const player = playerOrder[i][0];
			player.elo = newElos[i];
			player.eloDelta = deltaElos[i];

			const userObj = await User.findOne({ id: player.id });
			userObj.elo = player.elo;
			userObj.matches += 1;
			if (player.eloDelta > 0) {
				userObj.wins += 1;
			}

			await userObj.save();
		}

		io?.emit(
			"gameJudgeResults",
			gameId,
			content,
			game.players.map(p => p.description),
			idToDelta,
		);
	} catch (e) {
		console.log("Error parsing JSON", e);
		io?.emit("gameJudgeError", gameId);
		return false;
	}
}
