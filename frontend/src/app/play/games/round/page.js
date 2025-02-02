"use client";

import { useEffect, useState } from "react";
import useGameStore from "../../../../../stores/gameStore";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Editor from "@monaco-editor/react";
import {
	ArrowLeftEndOnRectangleIcon,
	BeakerIcon,
	ChatBubbleBottomCenterIcon,
	CheckBadgeIcon,
	CloudIcon,
	CodeBracketIcon,
	Cog6ToothIcon,
	PaperAirplaneIcon,
	PencilSquareIcon,
	TrophyIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import useAuthStore from "../../../../../stores/authStore";
import Modal from "@/components/Modal";
import { frequencyColors, messColors } from "@/utils/colors";

function cutText(text, length) {
	if (text.length > length) {
		return text.substring(0, length) + "...";
	}
	return text;
}

function getScoreColor(score) {
	if (score >= 7) {
		return "text-green-400";
	}

	if (score >= 4) {
		return "text-yellow-400";
	}

	return "text-red-400";
}

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60); // Get the minutes part
	const remainingSeconds = seconds % 60; // Get the remaining seconds

	// Format the minutes and seconds to always have two digits
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

	return `${formattedMinutes}:${formattedSeconds}`;
}

export default function Round() {
	const cleanliness = useGameStore(state => state.cleanliness);
	const code = useGameStore(state => state.code);
	let language = useGameStore(state => state.language);
	if (language == "C++") {
		language = "cpp";
	}

	const duration = useGameStore(state => state.duration);
	const setDuration = useGameStore(state => state.setDuration);
	const id = useGameStore(state => state.id);
	const players = useGameStore(state => state.players) ?? [];
	const rarity = useGameStore(state => state.rarity);
	const eloDeltas = useGameStore(state => state.deltas);

	const [description, setDescription] = useState("");
	const router = useRouter();

	const userId = useAuthStore(state => state.user_id);
	const isJudging = useGameStore(state => state.isJudging);

	const gameResults = useGameStore(state => state.gameResults);
	const [viewingWho, setViewingWho] = useState(null);

	console.log("GAME RESULTS", gameResults);
	console.log("JUDGE STATE", isJudging);
	const didISubmit = players.find(p => p.id == userId)?.status == "Submitted";
	useEffect(() => {
		if (id == -1) {
			router.push("/play/games");
		}
	}, [id]);

	// decrement counter
	useEffect(() => {
		const interval = setInterval(() => {
			if (duration > 0) {
				setDuration(duration - 1);
			} else {
				// force submit
				submitDescription();
			}
		}, 1000);

		return () => clearInterval(interval); // Cleanup on change
	}, [duration]);
	function dispatchUpdateDescription() {
		const url = process.env.NEXT_PUBLIC_API_URL + "/updateStatus/" + id;
		return fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `bearer ${localStorage.getItem("session-token")}`,
			},
			body: JSON.stringify({
				words: description.split(/\s+/).length,
			}),
		});
	}

	function submitDescription() {
		const url = process.env.NEXT_PUBLIC_API_URL + "/submit/" + id;
		return fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `bearer ${localStorage.getItem("session-token")}`,
			},
			body: JSON.stringify({
				description: description,
			}),
		});
	}

	useEffect(() => {
		const interval = setInterval(() => {
			dispatchUpdateDescription();
		}, 1000);

		return () => clearInterval(interval); // Cleanup on change
	}, [description.split(/\s+/).length]); // Re-run the effect when `description` updates

	return (
		<>
			<div className="h-full flex flex-col">
				<nav className="flex justify-between">
					<h1 className="font-bold text-4xl">LeetWrite</h1>
					<p className="font-mono">May the best writer win!</p>
				</nav>
				<section className="grid grid-cols-2 mt-4 gap-4 grow">
					<div className="flex flex-col gap-4">
						<div className="bg-neutral-800/80 p-6 rounded-lg shadow-md grow flex flex-col">
							<h1 className="text-2xl font-bold">
								<PencilSquareIcon className="w-6 h-6 inline-block me-2" />
								Your description
							</h1>
							<span className="font-semibold text-white/50">
								Write your interpretation of the problem the
								text editor below.
							</span>
							<div className="mt-2"></div>
							<Editor
								defaultLanguage="markdown"
								theme="vs-dark"
								value={description}
								onChange={val => {
									setDescription(val);
								}}
								className={
									"grow w-full border-primary border-2 " +
									(didISubmit ? "opacity-50" : "")
								}
								options={{
									readOnly: didISubmit,
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
						<div className="bg-neutral-800/80 p-4 rounded-lg shadow-md">
							<div className="flex justify-between items-center">
								<h1 className="text-2xl font-bold">
									<PaperAirplaneIcon className="w-4 h-4 inline-block me-2" />
									Submissions
								</h1>
								<span className="text-lg text-red-400 font-bold">
									{formatTime(duration)} remaining
								</span>
							</div>
							<div className="text-white/50 font-semibold">
								0 player(s) have submitted their descriptions
							</div>
							{!didISubmit && (
								<Button
									variant="primary"
									className="w-full font-bold text-lg flex gap-2 items-center justify-center mt-2"
									onClick={submitDescription}
								>
									<PencilSquareIcon className="w-6 h-6" />
									Submit Description
								</Button>
							)}
							{didISubmit && (
								<div className="h-10 font-bold flex items-center justify-center gap-3 text-green-400 mt-2">
									Description submitted!
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-4">
						<div className="bg-neutral-800/80 pt-6 px-6 pb-4 rounded-lg shadow-md grow flex flex-col">
							<h1 className="text-2xl font-bold">
								<CodeBracketIcon className="w-6 h-6 inline-block me-2" />
								Code
							</h1>
							<span className="font-semibold text-white/50">
								Below is the code you must try to describe
								(errors are purposely left in)
							</span>
							<div className="mt-2"></div>
							<Editor
								defaultValue={code}
								language={language.toLowerCase()}
								theme="vs-dark"
								className="grow w-full"
								options={{
									readOnly: true,
									minimap: { enabled: false },
									scrollbar: {
										vertical: "hidden", // Hides vertical scrollbar if not needed
										horizontal: "hidden", // Hides horizontal scrollbar if not needed
									},
									overviewRulerLanes: 0, // Hides the scrollbar preview ruler
								}}
							/>
							<div className="flex items-center justify-between mt-2">
								<span>
									Frequency:{" "}
									<span
										className={
											frequencyColors[rarity] +
											" font-bold"
										}
									>
										{rarity}
									</span>
								</span>
								<span>
									Cleanliness:{" "}
									<span
										className={
											messColors[cleanliness] +
											" font-bold"
										}
									>
										{cleanliness}
									</span>
								</span>
							</div>
						</div>
						<div className="bg-neutral-800/80 p-4 rounded-lg shadow-md">
							<h1 className="text-2xl font-bold">
								<UserIcon className="w-6 h-6 inline-block me-2" />
								Players
							</h1>
							<table className="font-mono border-separate border-spacing-3 w-full text-left">
								<thead>
									<tr>
										<th>Name</th>
										<th>Word Count</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{players.map(p => (
										<tr
											key={p.id}
											className={
												"font-bold " +
												(p.status === "Submitted"
													? "text-green-400"
													: "text-white/50")
											}
										>
											<td className="flex gap-4 items-center">
												<img
													src={p.picture}
													className="w-8 h-8 rounded-full"
												/>
												{cutText(p.name, 14)}
											</td>
											<td>{p.words}</td>
											<td>
												{p.status === "Writing"
													? "Writing..."
													: "Submitted!"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</div>
			<Modal
				visible={isJudging || gameResults.length > 0}
				title="Match Results"
				icon={() => <TrophyIcon className="w-4 h-4" />}
			>
				{gameResults.length === 0 && (
					<div className="flex gap-2 items-center mt-2">
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
						Judging in progress...
					</div>
				)}
				{gameResults.length > 0 && !viewingWho && (
					<>
						<table className="font-mono border-separate border-spacing-3 w-full text-left">
							<thead>
								<tr>
									<th>
										<UserIcon className="w-4 h-4 inline-block me-2" />
										Player
									</th>
									<th className="text-center">
										<CheckBadgeIcon className="w-4 h-4 inline-block me-2" />
										Correctness
									</th>
									<th className="text-center">
										<CloudIcon className="w-4 h-4 inline-block me-2" />
										Creativity
									</th>
									<th className="text-center">
										<ChatBubbleBottomCenterIcon className="w-4 h-4 inline-block me-2" />
										Clarity
									</th>
									<th className="text-center">Submission</th>
								</tr>
							</thead>
							<tbody>
								{gameResults.map(p => (
									<tr
										key={p.id}
										className={
											"font-bold " +
											(p.status === "Submitted"
												? "text-green-400"
												: "text-white/50")
										}
									>
										<td className="items-center">
											<img
												src={p.picture}
												className="w-8 h-8 rounded-full inline-block me-4"
											/>
											{cutText(p.name, 14)}
										</td>
										<td
											className={
												"text-center " +
												getScoreColor(p.correctness)
											}
										>
											{p.correctness} / 10
										</td>
										<td
											className={
												"text-center " +
												getScoreColor(p.creativity)
											}
										>
											{p.creativity} / 10
										</td>
										<td
											className={
												"text-center " +
												getScoreColor(p.clarity)
											}
										>
											{p.clarity} / 10
										</td>
										<td className="text-center">
											<Button
												variant="primary"
												className="w-full font-bold text-lg flex gap-2 items-center justify-center"
												onClick={() => setViewingWho(p)}
											>
												View
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="mt-2">
							<h1 className="text-xl font-bold">
								<BeakerIcon className="w-4 h-4 inline-block me-2" />
								Rating Calculations
							</h1>
							<table className="font-mono border-separate border-spacing-3 w-full text-left">
								<thead>
									<tr>
										<th></th>
										<th>Delta ELO</th>
										<th>New ELO</th>
									</tr>
								</thead>
								<tbody>
									{players.map(p => (
										<tr key={p.id}>
											<td>
												<img
													src={p.picture}
													className={
														"w-8 h-8 rounded-full inline-block me-4"
													}
												/>
												{cutText(p.name, 14)}
											</td>
											<td
												className={
													"w-1/3 " +
													(eloDeltas[p.id][1] >= 0
														? "text-green-400"
														: "text-red-400")
												}
											>
												{eloDeltas[p.id][1] >= 0
													? "+ "
													: "- "}
												{Math.abs(eloDeltas[p.id][1])}
											</td>
											<td className="w-1/3">
												{eloDeltas[p.id][0]}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<Button
							variant="primary"
							className="w-full font-bold text-lg flex gap-2 items-center justify-center mt-4"
							onClick={() => {
								// redirect to the /play/games page, and causes refresh
								window.location.reload();
							}}
						>
							<TrophyIcon className="w-6 h-6" />
							Finish
						</Button>
					</>
				)}
				{viewingWho && (
					<div>
						<div className="text-xl font-semibold mt-2">
							<UserIcon className="w-4 h-4 inline-block me-2" />
							Viewing {viewingWho.name}'s interpretation
						</div>
						<Editor
							language="markdown"
							theme="vs-dark"
							value={viewingWho.description}
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

						<p className="text-white/50">"{viewingWho.feedback}"</p>

						<Button
							variant="secondary"
							className="mt-4 font-bold w-full"
							onClick={() => setViewingWho(null)}
						>
							<ArrowLeftEndOnRectangleIcon className="w-4 h-4 inline-block me-2" />
							Back
						</Button>
					</div>
				)}
			</Modal>
			<div className="text-yellow-400 text-purple-400 text-green-400 text-red-400 hidden"></div>
		</>
	);
}
