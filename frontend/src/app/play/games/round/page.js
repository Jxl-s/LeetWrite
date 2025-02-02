"use client";

import { useEffect } from "react";
import useGameStore from "../../../../../stores/gameStore";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Editor from "@monaco-editor/react";

export default function Round() {
	const cleanliness = useGameStore(state => state.cleanliness);
	const code = useGameStore(state => state.code);
	const id = useGameStore(state => state.id);
	const players = useGameStore(state => state.players);
	const rarity = useGameStore(state => state.rarity);
	const router = useRouter();

	useEffect(() => {
		if (id == -1) {
			router.push("/play/games");
		}
	}, [id]);

	return (
		<div>
			<nav className="flex justify-between">
				<h1 className="font-bold text-4xl">LeetWrite</h1>
				<p className="font-mono">May the best writer win!</p>
			</nav>
			<section className="grid grid-cols-2 mt-4 gap-4">
				<div className="bg-neutral-800/80 p-2 rounded-lg shadow-md w-full h-full">
					<h1 className="p-4 text-2xl font-bold">Your description</h1>
					<div>
						<Editor defaultLanguage="Markdown" />
					</div>
				</div>
				<div className="bg-neutral-800/80 p-2 rounded-lg shadow-md">
					<h1 className="p-4 text-2xl font-bold">Code</h1>
					<div></div>
				</div>
				<div className="bg-neutral-800/80 p-4 rounded-lg shadow-md">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold">Submissions</h1>
						<span className="text-lg text-red-400 font-bold">
							0:20 remaining
						</span>
					</div>
					<div className="text-white/50 font-semibold">
						0 player(s) have submitted their descriptions
					</div>
					<Button
						variant="primary"
						className="w-full font-bold text-lg flex gap-2 items-center justify-center mt-2"
					>
						Submit Description
					</Button>
				</div>
				<div className="bg-neutral-800/80 p-2 rounded-lg shadow-md">
					<h1 className="p-4 text-2xl font-bold">Players</h1>
					<div></div>
				</div>
			</section>
			//<p>Round</p>
			//<p>Cleanliness: {cleanliness}</p>
			//<p>Code: {code}</p>
			//<p>Id: {id}</p>
			//<p>Players: {JSON.stringify(players)}</p>
			//<p>Rarity: {rarity}</p>
		</div>
	);
}
