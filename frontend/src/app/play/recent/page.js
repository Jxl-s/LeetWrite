"use client";

import Button from "@/components/Button";
import { frequencyColors, messColors } from "@/utils/colors";
import {
	ArrowTrendingUpIcon,
	BoltIcon,
	ClockIcon,
	DocumentMagnifyingGlassIcon,
	TrashIcon,
	TrophyIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import moment from "moment";
import { useEffect, useState } from "react";

export default function RecentGames() {
	const [top, setTop] = useState([]);

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
												player.picture ?? "/avatar.jpg"
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
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
