"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../../../stores/authStore";

import Button from "@/components/Button";
import {
	ArrowLeftEndOnRectangleIcon,
	PuzzlePieceIcon,
	TrophyIcon,
} from "@heroicons/react/24/solid";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { startWatcher } from "../../../stores/watcher";
import useGameListStore from "../../../stores/gameListStore";

export default function PlayLayout({ children }) {
	const setUser = useAuthStore(state => state.setUser);
	const setReady = useAuthStore(state => state.setReady);

	const name = useAuthStore(state => state.name);
	const photo = useAuthStore(state => state.photo);

	const pathname = usePathname();

	useEffect(() => {
		const token = localStorage.getItem("session-token");
		if (!token) {
			redirect("/signin");
		}

		const decoded = jwtDecode(token);
		setUser(decoded.user_id, decoded.name, decoded.photo, token);
		setReady(true);

		startWatcher();
	}, []);

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
		if (foundGame != -1 && pathname !== "/play/games/lobby") {
			redirect("/play/games/lobby");
		}

		if (foundGame == -1 && pathname === "/play/games/lobby") {
			redirect("/play/games");
		}
	}, [games]);

	return (
		<div className="flex h-full">
			<div className="w-[260px] h-full bg-neutral-900 flex flex-col pt-5 gap-2">
				<h1 className="text-3xl font-bold text-center">LeetWrite</h1>
				<div className="mt-4" />
				<Link href="/play/games" className="w-full px-5">
					<Button
						variant={
							pathname === "/play/games" ? "primary" : "secondary"
						}
						className="w-full flex gap-4 items-center font-bold h-10"
					>
						<PuzzlePieceIcon className="w-6 h-6" />
						Games
					</Button>
				</Link>
				<Link href="/play/leaderboards" className="w-full px-5">
					<Button
						variant={
							pathname === "/play/leaderboards"
								? "primary"
								: "secondary"
						}
						className="w-full flex gap-4 items-center h-10"
					>
						<TrophyIcon className="w-6 h-6" />
						Leaderboards
					</Button>
				</Link>
				<div className="grow"></div>
				<div className="flex bg-800/50 mx-5 rounded-lg shadow-md p-2 gap-4 items-center">
					{photo && (
						<img src={photo} className="w-12 h-12 rounded-full" />
					)}
					<p className="font-bold">{name}</p>
				</div>
				<Button
					variant="danger"
					className="mx-5 flex gap-4 items-center h-10 mb-5 font-bold"
					onClick={() => {
						localStorage.removeItem("session-token");
						redirect("/signin");
					}}
				>
					<ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
					Sign Out
				</Button>
			</div>
			<div className="p-8 grow">{children}</div>
		</div>
	);
}
