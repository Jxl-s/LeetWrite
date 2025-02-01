"use client";

import { useEffect } from "react";

export default function Play() {
	useEffect(() => {
		window.location.href = "/play/games";
	}, []);

	return <div>hi this is where you play</div>;
}
