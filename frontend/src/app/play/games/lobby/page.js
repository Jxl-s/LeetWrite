"use client";

import Button from "@/components/Button";
import useGameListStore from "../../../../../stores/gameListStore";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "../../../../../stores/authStore";
import { FaHammer } from "react-icons/fa6";
import {
	ArrowLeftEndOnRectangleIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import useGameStore from "../../../../../stores/gameStore";

export default function Lobby() {
	const myGameId = useGameListStore(state => state.myGameId);
	const userId = useAuthStore(state => state.user_id);
	const games = useGameListStore(state => state.games);
	const myGame = games.find(g => g.id == myGameId) ?? [];
	const myGameStarting = useGameListStore(state => state.myGameStarting);
	const countdownTime = useGameListStore(state => state.countdownTime);
	const goingGameID = useGameStore(state => state.id);
	const router = useRouter();

	useEffect(() => {
		if (goingGameID != -1) {
			router.push("/play/games/round");
		}
	}, [goingGameID]);

	return (
		<div>
			<h1 className="text-4xl font-bold">Lobby #{myGameId}</h1>
			<p className="text-white/50">
				These are the players you will be competing against.
			</p>
			<div
				className={
					"w-full bg-neutral-900 mt-2 rounded-lg shadow-md p-6 flex flex-col gap-4" +
					(myGameStarting ? " opacity-50" : "")
				}
			>
				{(myGame.players ?? []).map(p => (
					<div className="flex gap-4 items-center" key={p.id}>
						<img
							src={p.picture}
							className="rounded-full h-12 w-12"
						/>
						<span className="font-bold">{p.name}</span>
						<span className="font-bold">({p.elo})</span>
						{p.id == userId && (
							<span className="font-bold text-green-400">
								You
							</span>
						)}
						{p.id == myGame.host_id && (
							<span className="font-bold text-red-400">Host</span>
						)}
						{myGame.host_id == userId && p.id != userId && (
							<Button
								variant="danger"
								className={
									"font-bold flex gap-2 items-center " +
									(myGameStarting ? "opacity-50" : "")
								}
								disabled={myGameStarting}
								onClick={async () => {
									const url =
										process.env.NEXT_PUBLIC_API_URL +
										"/kickPlayer/" +
										myGameId +
										"/" +
										p.id;

									await fetch(url, {
										headers: {
											authorization: `Bearer ${localStorage.getItem("session-token")}`,
										},
									});
								}}
							>
								<FaHammer className="w-4 h-4" />
								Kick
							</Button>
						)}
					</div>
				))}
			</div>
			{!myGameStarting && (
				<div className="flex gap-2">
					{myGame.host_id == userId && (
						<Button
							variant="primary"
							className="font-bold flex gap-2 items-center mt-4"
							onClick={async () => {
								const url =
									process.env.NEXT_PUBLIC_API_URL +
									"/startGame/" +
									myGameId;

								await fetch(url, {
									headers: {
										authorization: `Bearer ${localStorage.getItem("session-token")}`,
									},
								});
							}}
						>
							<PaperAirplaneIcon className="w-6 h-6" />
							Start Game
						</Button>
					)}
					<Button
						variant="danger"
						className="font-bold flex gap-2 items-center mt-4"
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
						<ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
						Leave Game
					</Button>
				</div>
			)}
			{myGameStarting && (
				<div className="mt-2 flex gap-2 items-center">
					<div role="status">
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
					{countdownTime >= 0 ? (
						<>
							<p className="font-bold text-white/50">
								The game starts in {countdownTime} seconds ...
							</p>
						</>
					) : (
						<>
							<p className="font-bold text-white/50">
								The game will be starting soon ...
							</p>
						</>
					)}
				</div>
			)}
		</div>
	);
}
