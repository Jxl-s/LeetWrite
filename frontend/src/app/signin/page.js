"use client";

import Link from "next/link";
import Button from "@/components/Button";
import { FaGoogle } from "react-icons/fa6";
import { CodeBracketIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function SignIn() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	if (token) {
		localStorage.setItem("session-token", token);
		window.location.href = "/play";
	}

	return (
		<main className="py-8 px-12">
			<nav className="flex justify-between">
				<Link href="/">
					<h1 className="text-3xl font-bold">LeetWrite</h1>
				</Link>
			</nav>
			<section className="flex mt-8 items-center justify-center w-full flex-col">
				<h1 className="text-4xl font-bold">Sign In</h1>
				<div className="w-full max-w-xl bg-neutral-800/50 p-4 rounded-md shadow-lg mt-4">
					<Link
						href={process.env.NEXT_PUBLIC_API_URL + "/auth/google"}
					>
						<Button className="w-full font-bold text-lg bg-white text-black flex gap-2 items-center justify-center">
							<FaGoogle className="w-6 h-6" />
							Sign In with Google
						</Button>
					</Link>
					<p className="text-white/50 text-center mt-4">
						Please use Google to sign in, as it is the fastest
						option
					</p>
				</div>
			</section>
		</main>
	);
}
