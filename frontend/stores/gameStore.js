import { create } from "zustand";

const useGameStore = create(set => ({
	id: -1,
	setId: id => set({ id }),
	cleanliness: "Clean",
	setCleanliness: cleanliness => set({ cleanliness }),
	code: "",
	setCode: code => set({ code }),
	rarity: "Common",
	setRarity: rarity => set({ rarity }),
	players: [],
	setPlayers: players => set({ players }),
	language: "Python",
	setLanguage: language => set({ language }),
	duration: 5,
	setDuration: duration => set({ duration }),
	isJudging: false,
	setIsJudging: isJudging => set({ isJudging }),
	gameResults: [],
	setGameResults: gameResults => set({ gameResults }),
}));

export default useGameStore;
