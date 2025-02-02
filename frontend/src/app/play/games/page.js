"use client";

import Button from "@/components/Button";
import {
	MagnifyingGlassIcon,
	PaperAirplaneIcon,
	PlusCircleIcon,
	SparklesIcon,
	TrashIcon,
	UserIcon,
	UserPlusIcon,
} from "@heroicons/react/24/solid";
import GameListing from "./GameListing";
import useGameListStore from "../../../../stores/gameListStore";
import useAuthStore from "../../../../stores/authStore";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import useCreateGameStore from "../../../../stores/createGameStore";
export default function Games() {
	const games = useGameListStore(state => state.games);

	const playerLimit = useCreateGameStore(state => state.limit);
	const setLimit = useCreateGameStore(state => state.setLimit);
	const countdownTime = useGameListStore(state => state.countdownTime);
	const language = useCreateGameStore(state => state.language);
	const setLanguage = useCreateGameStore(state => state.setLanguage);
	function handleLimitChange(val) {
		setLimit(val);
	}

	const rarity = useCreateGameStore(state => state.rarity);
	const setRarity = useCreateGameStore(state => state.setRarity);
	const cleanliness = useCreateGameStore(state => state.cleanliness);
	const setCleanliness = useCreateGameStore(state => state.setCleanliness);
	const myGameStarting = useGameListStore(state => state.myGameStarting);

	async function handleCreateGame() {
		const url = process.env.NEXT_PUBLIC_API_URL + "/createGame";
		const body = JSON.stringify({
			rarity,
			cleanliness,
			playerLimit,
			language,
		});

		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${localStorage.getItem("session-token")}`,
			},
			body,
		});

		const json = await res.json();
		console.log(json);
	}

	return (
		<div className="grid grid-cols-2 gap-8 h-full">
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
			<div className="h-full flex flex-col col-span-2 lg:col-span-1">
				<h1 className="text-2xl lg:text-4xl font-bold flex gap-2 items-center">
					<PlusCircleIcon className="w-10 h-10" />
					Create Game
				</h1>
				<h2 className="text-white/50 font-semibold">
					Start a fresh new game with your own settings
				</h2>
				<div className="mt-2 grid grid-cols-4 gap-4">
					<div className="col-span-2">
						<span className="font-bold flex gap-2 items-center">
							<SparklesIcon className="w-4 h-4" />
							Problem Rarity
						</span>
						<select
							className="w-full bg-neutral-800 py-2 ps-3 rounded-md shadow-md font-bold text-sm mt-1 h-10"
							value={rarity}
							onChange={e => setRarity(e.target.value)}
						>
							<option value="Common">Common</option>
							<option value="Uncommon">Uncommon</option>
							<option value="Rare">Rare</option>
							<option value="Super Rare">Super Rare</option>
						</select>
					</div>
					<div className="col-span-2">
						<span className="font-bold flex gap-2 items-center">
							<TrashIcon className="w-4 h-4" />
							Code Cleanliness
						</span>
						<select
							className="w-full bg-neutral-800 py-2 ps-3 rounded-md shadow-md font-bold text-sm mt-1 h-10"
							value={cleanliness}
							onChange={e => setCleanliness(e.target.value)}
						>
							<option value="Clean">Clean</option>
							<option value="Messy">Messy</option>
							<option value="Unreadable">Unreadable</option>
						</select>
					</div>

					<div className="col-span-4">
						<span className="font-bold flex gap-2 items-center">
							<UserPlusIcon className="w-4 h-4" />
							Player Limit
						</span>
						<div className="grid grid-cols-4 gap-2 mt-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<div className="col-span-1" key={i}>
									<Button
										variant={
											playerLimit === i + 1
												? "accent"
												: "secondary"
										}
										className="w-full h-10 font-bold flex gap-2 items-center justify-center"
										onClick={() => handleLimitChange(i + 1)}
									>
										<UserIcon className="w-4 h-4" />
										{i + 1}
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className="col-span-4">
						<span className="font-bold flex gap-2 items-center">
							<UserPlusIcon className="w-4 h-4" />
							Programming Language
						</span>
						<select
							className="w-full bg-neutral-800 py-2 ps-3 rounded-md shadow-md font-bold text-sm mt-1 h-10"
							value={language}
							onChange={e => setLanguage(e.target.value)}
						>
							<option value="Python">Python</option>
							<option value="JavaScript">JavaScript</option>
							<option value="Java">Java</option>
							<option value="C++">C++</option>
						</select>
					</div>
					<div className="col-span-4">
						<Button
							variant="primary"
							className="w-full h-10 font-bold flex gap-2 items-center justify-center"
							onClick={handleCreateGame}
						>
							<PaperAirplaneIcon className="w-4 h-4" />
							Create Game
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
