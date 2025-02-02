import useGameListStore from "./gameListStore";
import io from "socket.io-client";
import useGameStore from "./gameStore";
import useAuthStore from "./authStore";
export async function startWatcher() {
	// Fetching the games
	const url = process.env.NEXT_PUBLIC_API_URL + "/openGames";
	const games = await fetch(url);
	const gamesJson = await games.json();

	useGameListStore.getState().setGames(gamesJson);

	// Fetching ELO
	const eloUrl = process.env.NEXT_PUBLIC_API_URL + "/getElo";
	const elo = await fetch(eloUrl, {
		headers: {
			authorization: `Bearer ${localStorage.getItem("session-token")}`,
		},
	});
	const eloJson = await elo.json();
	useAuthStore.getState().setElo(eloJson.elo);
	//

	// Socket connection
	const socket = io(process.env.NEXT_PUBLIC_API_URL);
	socket.on("openGamesUpdated", games => {
		useGameListStore.getState().setGames(games);
	});

	socket.on("gameStartWait", gameId => {
		const myGame = useGameListStore.getState().myGameId;
		if (myGame == gameId) {
			useGameListStore.getState().setMyGameStarting(true);
		}
	});

	socket.on("gameStartCountdown", (gameId, time) => {
		const myGame = useGameListStore.getState().myGameId;
		if (myGame == gameId) {
			useGameListStore.getState().setCountdownTime(time);
		}
	});

	socket.on("gameStarted", (gameId, newGameData) => {
		const myGame = useGameListStore.getState().myGameId;
		if (myGame == gameId) {
			useGameListStore.getState().setMyGameStarting(false);
			useGameListStore.getState().setCountdownTime(-1);

			useGameStore.getState().setCleanliness(newGameData.cleanliness);
			useGameStore.getState().setRarity(newGameData.rarity);
			useGameStore.getState().setPlayers(newGameData.players);
			useGameStore.getState().setCode(newGameData.code);
			useGameStore.getState().setId(newGameData.id);
			useGameStore.getState().setLanguage(newGameData.language);
		}
	});

	socket.on("gameUpdated", (gameId, newGameData) => {
		const myGame = useGameStore.getState().id;
		if (myGame == gameId) {
			useGameStore.getState().setCleanliness(newGameData.cleanliness);
			useGameStore.getState().setRarity(newGameData.rarity);
			useGameStore.getState().setPlayers(newGameData.players);
			useGameStore.getState().setCode(newGameData.code);
			useGameStore.getState().setId(newGameData.id);
			useGameStore.getState().setLanguage(newGameData.language);
		}
	});

	socket.on("gameAllSubmitted", gameId => {
		const myGame = useGameStore.getState().id;
		if (myGame == gameId) {
			useGameStore.getState().setIsJudging(true);
		}
	});

	socket.on("gameJudgeResults", (gameId, results, descriptions, deltas) => {
		const myGame = useGameStore.getState().id;
		if (myGame == gameId) {
			// map the results to a format
			const realResults = results.map((r, i) => {
				return {
					id: useGameStore.getState().players[i].id,
					picture: useGameStore.getState().players[i].picture,
					name: useGameStore.getState().players[i].name,
					correctness: r[0],
					creativity: r[1],
					clarity: r[2],
					feedback: r[3],
					description: descriptions[i],
				};
			});

			useGameStore.getState().setIsJudging(false);
			useGameStore.getState().setGameResults(realResults);
			useGameStore.getState().setDeltas(deltas);
		}
	});
}
