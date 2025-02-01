import Link from "next/link";
import Button from "@/components/Button";
import { CodeBracketIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function SignIn() {
	return (
		<main>
			<nav className="flex justify-between">
				<div>
					<h1 className="text-3xl font-bold">LeetWrite</h1>
				</div>
			</nav>
			<section className="flex gap-8 mt-8 items-center justify-center w-full">
				<h1 className="text-4xl font-bold">Sign In</h1>
			</section>
		</main>
	);
}
