"use client";

import Button from "@/components/Button";
import {
	MagnifyingGlassIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import GameListing from "./GameListing";
import useGameListStore from "../../../../stores/gameListStore";

export default function Games() {
	const games = useGameListStore(state => state.games);

	return (
		<div className="grid grid-cols-2 gap-4 h-full">
			<div className="h-full flex flex-col">
				<h1 className="text-4xl font-bold flex gap-2 items-center">
					<MagnifyingGlassIcon className="w-10 h-10" />
					Open Games
				</h1>
				<h2 className="text-white/50 font-semibold">
					Quickly join a game someone else started
				</h2>
				<div className="grow bg-white/10 rounded-lg shadow-md mt-4 p-6 flex flex-col gap-4 overflow-scroll">
					{games.map(g => (
						<GameListing key={g.id} id={g.id} />
					))}
				</div>
			</div>
		</div>
	);
}
