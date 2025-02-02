import { create } from "zustand";

const useCreateGameStore = create(set => ({
	rarity: "Common",
	setRarity: rarity => set({ rarity }),
	cleanliness: "Clean",
	setCleanliness: cleanliness => set({ cleanliness }),
	limit: 4,
	setLimit: limit => set({ limit }),
	language: "Python",
	setLanguage: language => set({ language }),
}));

export default useCreateGameStore;
