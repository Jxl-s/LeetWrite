import useGameListStore from "./gameListStore";
import io from "socket.io-client";
import useGameStore from "./gameStore";
export async function startWatcher() {
	// Fetching the games
	const url = process.env.NEXT_PUBLIC_API_URL + "/openGames";
	const games = await fetch(url);
	const gamesJson = await games.json();

	useGameListStore.getState().setGames(gamesJson);

	// Fetching ...
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
}
