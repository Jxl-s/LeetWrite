"use client";

import Button from "@/components/Button";
import { CodeBracketIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect } from "react";
import { io } from "socket.io-client";
export default function Home() {
	//useEffect(() => {
	//	const socket = io(process.env.NEXT_PUBLIC_API_URL);
	//	socket.io.on("ping", () => {
	//		console.log("PINGED");
	//	});
	//}, []);

	return (
		<main className="py-8 px-12">
			<nav className="flex justify-between">
				<Link href="/">
					<h1 className="text-3xl font-bold">LeetWrite</h1>
				</Link>
				<div>
					<Link href="/signin">
						<Button variant="primary" className="font-bold">
							Get Started
						</Button>
					</Link>
				</div>
			</nav>
			<section className="grid grid-cols-2 gap-8 mt-8 items-center">
				<div>
					<h1 className="text-5xl font-bold flex gap-2 items-center">
						<PencilSquareIcon className="w-10 h-10" />
						LeetWrite
					</h1>
					<h2 className="mt-2 text-white/50 text-lg flex gap-2 items-center">
						Where Coders become Creators
					</h2>
					<Link href="/signin">
						<Button
							variant="primary"
							className="font-bold mt-2 w-full text-xl"
						>
							Get Started
						</Button>
					</Link>
				</div>
				<div>
					<img src="/hero.png" alt="Hero" className="w-full" />
				</div>
			</section>
			<section className="mt-16 flex items-center justify-center flex-col">
				<div className="bg-neutral-800/50 w-full mt-4 p-4 rounded-md shadow-md flex items-center justify-center flex-col">
					<h2 className="text-3xl font-semibold">
						Write the question, not the code!
					</h2>
					<p className="text-white/50 text-lg mt-2">
						Your job becomes to understand code, and to write an
						appropriate problem description!
					</p>
				</div>
				<div className="bg-neutral-800/50 w-full mt-4 p-4 rounded-md shadow-md flex items-center justify-center flex-col">
					<h2 className="text-3xl font-semibold">Multiplayer PvP</h2>
					<p className="text-white/50 text-lg mt-2">
						Queue games with other players, and see who is the best
						at understanding code!
					</p>
				</div>
				<div className="bg-neutral-800/50 w-full mt-4 p-4 rounded-md shadow-md flex items-center justify-center flex-col">
					<h2 className="text-3xl font-semibold">Rating system</h2>
					<p className="text-white/50 text-lg mt-2">
						A ranking system to place different players in their
						appropriate leagues, using ELO.
					</p>
				</div>
			</section>
		</main>
	);
}
