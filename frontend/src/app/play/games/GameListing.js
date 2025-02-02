import { LanguageIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import useGameListStore from "../../../../stores/gameListStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Language from "@/components/Language";
import { frequencyColors, messColors } from "@/utils/colors";

export default function GameListing({ id }) {
	const games = useGameListStore(state => state.games);
	const thisGame = games.find(g => g.id === id);
	const cannotJoin =
		thisGame.players.length >= thisGame.capacity || !thisGame.open;

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
			<header className="flex justify-between">
				<h2 className="font-bold flex opacity-50 gap-2 items-center">
					<img
						src={thisGame.host_picture}
						className="rounded-full h-6 w-6"
					/>
					<p>{thisGame.host}</p>
				</h2>
				<h2 className="font-bold opacity-50 flex gap-4">
					{thisGame.players.length} / {thisGame.capacity}
					<Language lang={thisGame.language} className="w-6 h-6" />
				</h2>
			</header>
			<header className="flex justify-between">
				<h2 className="font-bold">
					Difficulty:{" "}
					<span className={frequencyColors[thisGame.rarity]}>
						{thisGame.rarity}
					</span>
				</h2>
				<h2 className="font-bold">
					Cleanliness:{" "}
					<span className={messColors[thisGame.cleanliness]}>
						{thisGame.cleanliness}
					</span>
				</h2>
			</header>
			<Button
				variant="primary"
				className="w-full font-bold mt-1 flex gap-2 items-center justify-center"
				onClick={joinGame}
				disabled={cannotJoin}
			>
				<PaperAirplaneIcon className="w-6 h-6" />
				Join Game
			</Button>
		</div>
	);
}
