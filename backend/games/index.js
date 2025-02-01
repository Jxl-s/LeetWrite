export let io;
export function setIO(server) {
	io = server;
}

export const openGames = [
	{
		host: "Jia Xuan Li",
		host_picture:
			"https://lh3.googleusercontent.com/a/ACg8ocK3qLw5jsPQVQvsH2q4riPpSmYWbAh-S6VnRrAdYMI9IAayP552=s96-c",
		host_id: "123123123",
		name: "The best match",
		rarity: "Rare",
		cleanliness: "Clean",
		capacity: 4,
		id: 2,
		players: [
			{
				name: "Jia Xuan Li",
				picture:
					"https://lh3.googleusercontent.com/a/ACg8ocK3qLw5jsPQVQvsH2q4riPpSmYWbAh-S6VnRrAdYMI9IAayP552=s96-c",
				id: "123123123",
				elo: 1000,
			},
		],
	},
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

setInterval(() => {
	// just add one record (some random data)
}, 1000);
