import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import useGameListStore from "../../../../stores/gameListStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function GameListing({ id }) {
	const games = useGameListStore(state => state.games);
	const thisGame = games.find(g => g.id === id);

	async function joinGame() {
		const url = process.env.NEXT_PUBLIC_API_URL + "/joinGame/" + id;
		await fetch(url, {
			headers: {
				authorization: `Bearer ${localStorage.getItem("session-token")}`,
			},
		});
	}

	return (
		<div className="flex flex-col gap-1">
			<header className="flex gap-2 opacity-50 mb-1">
				<img
					src={thisGame.host_picture}
					className="rounded-full h-6 w-6"
				/>
				<p>{thisGame.host}</p>
			</header>
			<header className="flex justify-between">
				<h2 className="font-bold">{thisGame.name}</h2>
				<h2 className="font-bold opacity-50">
					{thisGame.players.length} / {thisGame.capacity}
				</h2>
			</header>
			<header className="flex justify-between">
				<h2 className="font-bold">
					Rarity:{" "}
					<span className="text-green-400">{thisGame.rarity}</span>
				</h2>
				<h2 className="font-bold">
					Cleanliness:{" "}
					<span className="text-red-400">{thisGame.cleanliness}</span>
				</h2>
			</header>
			<Button
				variant="primary"
				className="w-full font-bold mt-1 flex gap-2 items-center justify-center"
				onClick={joinGame}
			>
				<PaperAirplaneIcon className="w-6 h-6" />
				Join Game
			</Button>
		</div>
	);
}
