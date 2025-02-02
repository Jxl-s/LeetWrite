"use client";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { frequencyColors, messColors } from "@/utils/colors";
import {
	ArrowLeftEndOnRectangleIcon,
	ArrowTrendingUpIcon,
	BoltIcon,
	ClockIcon,
	CodeBracketIcon,
	Cog6ToothIcon,
	DocumentMagnifyingGlassIcon,
	TrashIcon,
	TrophyIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import { Editor } from "@monaco-editor/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function RecentGames() {
	const [top, setTop] = useState([]);
	const [focusGame, setFocusGame] = useState(null);
	const [focusUser, setFocusUser] = useState(null);
	const [focusId, setFocusId] = useState(null);

	useEffect(() => {
		async function fetchTop() {
			const res = await fetch(
				process.env.NEXT_PUBLIC_API_URL + "/recentGames",
			);
			const json = await res.json();
			setTop(json);
		}

		fetchTop();
	}, []);

	return (
		<>
			<div>
				<h1 className="text-2xl lg:text-4xl font-bold flex gap-2 items-center">
					<TrophyIcon className="w-10 h-10" />
					Recent Games
				</h1>
				<h2 className="text-white/50 font-semibold">
					Here are the most recent games played.
				</h2>
				<table className="font-mono border-separate border-spacing-3 w-full max-w-5xl text-left bg-neutral-900 rounded-lg px-3 mt-2">
					<thead>
						<tr>
							<th></th>
							<th>
								<ClockIcon className="w-4 h-4 inline-block me-2" />
								When
							</th>
							<th className="text-center">
								<UserIcon className="w-4 h-4 inline-block me-2" />
								Players
							</th>
							<th className="text-center">
								<BoltIcon className="w-4 h-4 inline-block me-2" />
								Rarity
							</th>
							<th className="text-center">
								<TrashIcon className="w-4 h-4 inline-block me-2" />
								Cleanliness
							</th>
							<th className="text-center">
								<DocumentMagnifyingGlassIcon className="w-4 h-4 inline-block me-2" />
								More Details
							</th>
						</tr>
					</thead>
					<tbody>
						{top.map((game, i) => (
							<tr key={game._id}>
								<td>#{i + 1}</td>
								<td className="text-white/50 text-sm">
									{moment(game.date).fromNow()}
								</td>
								<td className="text-center flex gap-2 justify-center">
									<div className="gap-2 flex">
										{game.players.map(player => (
											<img
												key={player.id}
												src={
													player.picture ??
													"/avatar.jpg"
												}
												className="w-6 h-6 rounded-full inline-block"
											/>
										))}
									</div>
								</td>
								<td
									className={
										"text-center font-bold " +
										frequencyColors[game.rarity]
									}
								>
									{game.rarity}
								</td>
								<td
									className={
										"text-center font-bold " +
										messColors[game.cleanliness]
									}
								>
									{game.cleanliness}
								</td>
								<td>
									<Button
										variant="secondary"
										className="w-full"
										onClick={() => setFocusGame(game)}
									>
										<DocumentMagnifyingGlassIcon className="w-6 h-6 inline-block me-3" />
										View
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Modal
				visible={focusGame}
				onClose={() => {
					setFocusGame(null);
					setFocusUser(null);
					setFocusId(-1);
				}}
				title={"Game Details"}
				icon={() => (
					<DocumentMagnifyingGlassIcon className="w-6 h-6 inline-block" />
				)}
			>
				{!focusUser && (
					<div className="grid grid-cols-2 mt-2 gap-6">
						<div>
							<h1 className="text-lg font-bold flex items-center gap-2">
								<CodeBracketIcon className="w-4 h-4" />
								Code
							</h1>
							<Editor
								language={
									focusGame?.language?.toLowerCase() ??
									"plaintext"
								}
								theme="vs-dark"
								value={focusGame?.code ?? ""}
								className="grow h-[200px] mt-4"
								options={{
									readOnly: true,
									minimap: { enabled: false },
									scrollbar: {
										vertical: "hidden", // Hides vertical scrollbar if not needed
										horizontal: "hidden", // Hides horizontal scrollbar if not needed
									},
									overviewRulerLanes: 0, // Hides the scrollbar preview ruler
									wordWrap: "on",
								}}
							/>
						</div>
						<div>
							<h1 className="text-lg font-bold flex items-center gap-2">
								<UserIcon className="w-4 h-4" />
								Players
							</h1>
							<div className="flex flex-col gap-2 mt-4">
								{focusGame?.players.map((player, i) => (
									<div
										key={player.id}
										className="flex gap-4 items-center justify-between"
									>
										<div className="flex gap-4">
											<img
												src={
													player.picture ??
													"/avatar.jpg"
												}
												className="w-8 h-8 rounded-full"
											/>
											<p className="font-semibold text-white/50">
												{player.name}
											</p>
										</div>
										<Button
											variant="secondary"
											className="w-20 font-bold"
											onClick={() => {
												setFocusUser(player);
												setFocusId(i);
											}}
										>
											View
										</Button>
									</div>
								))}
							</div>
						</div>
						<footer className="text-white/50">
							{moment(focusGame?.date).format(
								"YYYY-MM-DD HH:mm:ss",
							)}
						</footer>
					</div>
				)}
				{focusUser && (
					<div>
						<div className="text-xl font-semibold mt-2">
							<UserIcon className="w-4 h-4 inline-block me-2" />
							Viewing {focusUser.name}'s interpretation
						</div>
						<Editor
							language="markdown"
							theme="vs-dark"
							value={focusUser.description}
							className="grow h-[200px] mt-4"
							options={{
								readOnly: true,
								minimap: { enabled: false },
								scrollbar: {
									vertical: "hidden", // Hides vertical scrollbar if not needed
									horizontal: "hidden", // Hides horizontal scrollbar if not needed
								},
								overviewRulerLanes: 0, // Hides the scrollbar preview ruler
								wordWrap: "on",
							}}
						/>
						<div className="text-xl font-semibold mt-2">
							<Cog6ToothIcon className="w-4 h-4 inline-block me-2" />
							Feedback from AI
						</div>

						<p className="text-white/50">
							"{focusGame.feedback[focusId][3]}"
						</p>

						<Button
							variant="secondary"
							className="mt-4 font-bold w-full"
							onClick={() => setFocusUser(null)}
						>
							<ArrowLeftEndOnRectangleIcon className="w-4 h-4 inline-block me-2" />
							Back
						</Button>
					</div>
				)}
			</Modal>
		</>
	);
}
