"use client";

import Button from "@/components/Button";
import useGameListStore from "../../../../../stores/gameListStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Lobby() {
	const myGameId = useGameListStore(state => state.myGameId);
	const userId = useGameListStore(state => state.userId);
	const games = useGameListStore(state => state.games);
	const setMyGameId = useGameListStore(state => state.setMyGameId);

	useEffect(() => {
		// Check through all the players, if i am in one of them i redirect to the appropriate page
		let foundGame = -1;
		for (const game of games) {
			for (const player of game.players) {
				if (player.id == userId) {
					foundGame = game.id;
					break;
				}
			}
		}

		console.log(foundGame);
		console.log(games);
	}, [games]);

	return (
		<div>
			This is the lobby page for game {myGameId}
			<Button
				variant="danger"
				onClick={async () => {
					const url =
						process.env.NEXT_PUBLIC_API_URL +
						"/leaveGame/" +
						myGameId;

					await fetch(url, {
						headers: {
							authorization: `Bearer ${localStorage.getItem("session-token")}`,
						},
					});
				}}
			>
				Leave Game
			</Button>
		</div>
	);
}
