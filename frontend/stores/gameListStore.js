import { create } from "zustand";

const useGameListStore = create(set => ({
	games: [],
	setGames: games => set({ games }),
	myGameId: -1,
	setMyGameId: id => set({ myGameId: id }),
	myGameStarting: false,
	setMyGameStarting: starting => set({ myGameStarting: starting }),
	countdownTime: -1,
	setCountdownTime: time => set({ countdownTime: time }),
}));

export default useGameListStore;
