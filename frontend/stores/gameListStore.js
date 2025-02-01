import { create } from "zustand";

const useGameListStore = create(set => ({
	games: [],
	setGames: games => set({ games }),
	myGameId: -1,
	setMyGameId: id => set({ myGameId: id }),
}));

export default useGameListStore;
