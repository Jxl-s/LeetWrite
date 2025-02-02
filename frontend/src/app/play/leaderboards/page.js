"use client";

import { TrophyIcon } from "@heroicons/react/24/solid";
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
			<h2 className="text-white/50">
				The players with the highest ELO will be displayed here.
			</h2>
			<table className="font-mono border-separate border-spacing-3 w-full text-left">
				<thead>
					<tr>
						<th>Name</th>
						<th>ELO</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	);
}
