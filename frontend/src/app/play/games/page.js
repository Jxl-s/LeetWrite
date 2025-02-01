"use client";

import Button from "@/components/Button";
import {
	MagnifyingGlassIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import GameListing from "./GameListing";
import useGameListStore from "../../../../stores/gameListStore";
import useAuthStore from "../../../../stores/authStore";
import { useEffect } from "react";
import { redirect } from "next/navigation";
export default function Games() {
	const games = useGameListStore(state => state.games);
	const userId = useAuthStore(state => state.user_id);
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

		setMyGameId(foundGame);
		if (foundGame != -1) {
			redirect("/play/games/lobby");
		}

		//if (useGameListStore.getState().myGameId != -1) {
		//	redirect("/play/games/lobby");
		//} else {
		//	useGameListStore.getState().setMyGameId(-1);
		//}
	}, [games]);

	return (
		<div className="grid grid-cols-2 gap-4 h-full">
			<div className="h-full flex flex-col col-span-2 lg:col-span-1">
				<h1 className="text-2xl lg:text-4xl font-bold flex gap-2 items-center">
					<MagnifyingGlassIcon className="w-10 h-10" />
					Open Games
				</h1>
				<h2 className="text-white/50 font-semibold">
					Quickly join a game someone else started
				</h2>
				<div className="grow bg-white/10 rounded-lg shadow-md mt-2">
					<div className="p-4 flex flex-col gap-4">
						{games.map(g => (
							<GameListing key={g.id} id={g.id} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
