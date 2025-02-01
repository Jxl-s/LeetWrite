import { create } from "zustand";

const useGameListStore = create(set => ({
	games: [
		{
			host: "Jia Xuan Li",
			host_picture:
				"https://lh3.googleusercontent.com/a/ACg8ocK3qLw5jsPQVQvsH2q4riPpSmYWbAh-S6VnRrAdYMI9IAayP552=s96-c",
			name: "The best match",
			rarity: "Common",
			cleanliness: "Messy",
			capacity: 4,
			current: 1,
			id: 1,
		},
		{
			host: "Jia Xuan Li",
			host_picture:
				"https://lh3.googleusercontent.com/a/ACg8ocK3qLw5jsPQVQvsH2q4riPpSmYWbAh-S6VnRrAdYMI9IAayP552=s96-c",
			name: "The best match",
			rarity: "Rare",
			cleanliness: "Clean",
			capacity: 4,
			current: 1,
			id: 2,
		},
	],
	setGames: games => set({ games }),
	addGame: game => set(state => ({ games: [...state.games, game] })),
	removeGame: game =>
		set(state => ({
			games: state.games.filter(g => g.id !== game.id),
		})),
	updateGame: game =>
		set(state => ({
			games: state.games.map(g => (g.id === game.id ? game : g)),
		})),
	getGame: id => set(state => state.games.find(g => g.id === id)),
}));

export default useGameListStore;
