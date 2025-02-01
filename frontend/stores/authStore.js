import { create } from "zustand";

const useAuthStore = create(set => ({
	user_id: "",
	name: "",
	photo: "",
	token: "",
	ready: false,

	setUser: (user_id, name, photo, token) =>
		set({ user_id, name, photo, token }),
	setReady: ready => set({ ready }),
}));
export default useAuthStore;
