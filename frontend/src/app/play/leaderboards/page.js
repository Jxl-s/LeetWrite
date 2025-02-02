"use client";

import {
	ArrowTrendingUpIcon,
	BoltIcon,
	TrophyIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function Leaderboards() {
	const [top, setTop] = useState([]);

	useEffect(() => {
		async function fetchTop() {
			const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/top");
			const json = await res.json();
			setTop(json);
		}

		fetchTop();
	}, []);
	return (
		<div>
			<h1 className="text-2xl lg:text-4xl font-bold flex gap-2 items-center">
				<TrophyIcon className="w-10 h-10" />
				Leaderboards
			</h1>
			<h2 className="text-white/50 font-semibold">
				The top 10 players with the highest ratings will be displayed
				here.
			</h2>
			<table className="font-mono border-separate border-spacing-3 w-full max-w-2xl text-left bg-neutral-900 rounded-lg px-3 mt-2">
				<thead>
					<tr>
						<th></th>
						<th>
							<UserIcon className="w-4 h-4 inline-block me-2" />
							Name
						</th>
						<th className="text-center">
							<ArrowTrendingUpIcon className="w-4 h-4 inline-block me-2" />
							Rating
						</th>
						<th className="text-center">
							<BoltIcon className="w-4 h-4 inline-block me-2" />
							Games
						</th>
						<th className="text-center">
							<TrophyIcon className="w-4 h-4 inline-block me-2" />
							Wins
						</th>
					</tr>
				</thead>
				<tbody>
					{top.map((player, i) => (
						<tr key={player.id}>
							<td className="text-white/50">#{i + 1}</td>
							<td>
								<img
									src={player.photo}
									className="w-8 h-8 rounded-full mr-2 inline-block"
								/>
								{player.name}
							</td>
							<td className="text-center">{player.elo}</td>
							<td className="text-center">{player.matches}</td>
							<td className="text-center">{player.wins}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
