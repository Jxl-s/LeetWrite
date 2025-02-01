"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Play() {
	useEffect(() => {
		redirect("/play/games");
	}, []);

	return <div>hi this is where you play</div>;
}
