import useGameListStore from "./gameListStore";
import io from "socket.io-client";
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
}
